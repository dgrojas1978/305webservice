import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

/**
 * Autenticación del panel de enlaces. Un solo operador, así que basta una
 * contraseña en variable de entorno y una cookie firmada.
 *
 * `/admin/links` crea redirecciones bajo nuestro dominio. Sin protección,
 * cualquiera podría publicar phishing con la marca de 305 y hacer que Google
 * marque el dominio entero. Por eso el panel NO existe si falta ADMIN_PASSWORD.
 */
const COOKIE = "305_admin";
const MAX_AGE = 60 * 60 * 12; // 12 h

function secret(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length >= 12 ? p : null;
}

/** El panel está deshabilitado mientras no haya una contraseña suficientemente larga. */
export function adminEnabled(): boolean {
  return secret() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Comparación en tiempo constante: evita filtrar la contraseña por el tiempo de respuesta. */
export function passwordMatches(input: string): boolean {
  const key = secret();
  if (!key) return false;
  return safeEqual(sign(input, key), sign(key, key));
}

export function issueCookie(): string {
  const key = secret()!;
  const exp = Date.now() + MAX_AGE * 1000;
  const nonce = randomBytes(9).toString("base64url");
  const payload = `${exp}.${nonce}`;
  const value = `${payload}.${sign(payload, key)}`;
  // Secure + HttpOnly + SameSite=Lax: la cookie no viaja a terceros ni es
  // legible desde JavaScript.
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function isAuthed(cookieHeader: string | null): boolean {
  const key = secret();
  if (!key || !cookieHeader) return false;
  const raw = cookieHeader.split(";").map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return false;

  const i = raw.lastIndexOf(".");
  if (i < 0) return false;
  const payload = raw.slice(0, i), mac = raw.slice(i + 1);
  if (!safeEqual(mac, sign(payload, key))) return false;

  const exp = Number(payload.split(".")[0]);
  return Number.isFinite(exp) && exp > Date.now();
}
