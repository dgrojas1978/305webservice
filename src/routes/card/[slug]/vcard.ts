import type { APIEvent } from "@solidjs/start/server";
import { CARD_PROFILES } from "~/data/card";

/**
 * vCard 3.0 del perfil — generado desde los datos del perfil para que siempre
 * refleje el contacto vigente. UTF-8 + CRLF, line folding y escaping RFC 2426;
 * solo datos verificados; sin IDs internos ni campos privados.
 *
 * Imagen (RFC 6350 §6.2.4/6.6.3): PHOTO para personas. Para organizaciones se
 * envía el logo como PHOTO **y** como LOGO, porque varias apps de contactos
 * ignoran LOGO — así la identidad visual se ve igual en todas.
 */

/** Escapa coma, punto y coma, backslash y saltos según RFC 2426. */
function esc(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Line folding: máximo 75 octetos por línea; las continuaciones empiezan con
 * un espacio. Se pliega por octetos UTF-8 para no partir un carácter.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // no cortar en mitad de un carácter multibyte
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // las continuaciones gastan un octeto en el espacio inicial
  }
  return parts.join("\r\n ");
}

/** Máximo de imagen embebida: por encima, las apps de contactos fallan. */
const MAX_IMAGE_BYTES = 200 * 1024;
const imageCache = new Map<string, { b64: string; type: string } | null>();

async function loadImage(url: string, base: string): Promise<{ b64: string; type: string } | null> {
  if (imageCache.has(url)) return imageCache.get(url)!;
  try {
    const res = await fetch(new URL(url, base));
    if (!res.ok) throw new Error(`status ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_IMAGE_BYTES) {
      console.warn("[305WS] vCard image too large, skipping embed:", url, buf.length);
      imageCache.set(url, null);
      return null;
    }
    const ct = res.headers.get("content-type") || "";
    // SVG nunca: no es soportado por las apps de contactos.
    const type = ct.includes("png") ? "PNG" : ct.includes("jpeg") || ct.includes("jpg") ? "JPEG" : "";
    if (!type) {
      console.warn("[305WS] vCard image type not supported:", ct);
      imageCache.set(url, null);
      return null;
    }
    const out = { b64: buf.toString("base64"), type };
    imageCache.set(url, out);
    return out;
  } catch (err) {
    console.warn("[305WS] vCard image fetch failed:", (err as Error).message);
    imageCache.set(url, null);
    return null;
  }
}

export async function GET({ params, request }: APIEvent) {
  const profile = CARD_PROFILES[params.slug];
  if (!profile) return new Response("Not found", { status: 404 });

  const co = profile.company;
  const media = profile.vcardMedia;
  const isPerson = profile.kind === "person" && !!profile.person;
  const fn = isPerson ? profile.person!.name : co.name;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    isPerson ? `N:${esc(profile.person!.name)};;;;` : `N:;${esc(co.name)};;;`,
    `FN:${esc(fn)}`,
    `ORG:${esc(co.name)}`,
    ...(isPerson ? [`TITLE:${esc(profile.person!.role.en)}`] : []),
    // Teléfono y correo solo si el tenant los publica; no se inventan.
    ...(co.phoneTel ? [`TEL;TYPE=WORK,VOICE:${co.phoneTel}`] : []),
    ...(co.email ? [`EMAIL;TYPE=INTERNET:${co.email}`] : []),
    `URL:${co.website}`,
  ];

  // Dirección: solo si el negocio publica una dirección exacta. Un negocio de
  // zona de servicio no imprime dirección; se indica la localidad de base.
  const loc = profile.location;
  const physical = loc?.showExactAddress ? loc.locations?.find((l) => l.address) : undefined;
  if (physical?.address) {
    lines.push(`ADR;TYPE=WORK:;;${esc(physical.address)};;;;`);
  } else if (profile.client) {
    // Tenant de cliente: su localidad declarada (CN = South Florida), no Miami.
    lines.push(`ADR;TYPE=WORK:;;;${esc(co.location.en)};;;United States`);
  } else {
    lines.push("ADR;TYPE=WORK:;;;Miami;FL;;United States");
  }

  lines.push(`NOTE:${esc(co.descriptor.en)}`);
  // La tarjeta digital vive en 305, no en el sitio del cliente: para un tenant
  // se usa su URL canónica compartible (short link), no company.website.
  const digitalCardUrl = profile.client?.shareUrl ?? `${co.website}${profile.nfc.canonicalPath}`;
  lines.push(`URL;TYPE=Digital Card:${digitalCardUrl}`);
  // Instagram cuando es el canal directo del tenant (p. ej. CN Brandings).
  if (profile.client?.instagram) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${profile.client.instagram}`);
  }

  // Imagen embebida (base64). Organización → PHOTO + LOGO.
  if (media?.embedImage) {
    const src = isPerson ? media.photoUrl : (media.logoUrl ?? media.photoUrl);
    if (src) {
      const img = await loadImage(src, request.url);
      if (img) {
        lines.push(`PHOTO;ENCODING=b;TYPE=${img.type}:${img.b64}`);
        if (!isPerson) lines.push(`LOGO;ENCODING=b;TYPE=${img.type}:${img.b64}`);
      }
    }
  }

  lines.push("END:VCARD");

  const body = lines.map(fold).join("\r\n") + "\r\n";
  const filename = `${co.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.vcf`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
