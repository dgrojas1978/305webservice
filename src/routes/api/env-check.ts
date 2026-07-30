/**
 * Diagnóstico temporal de configuración.
 *
 * Devuelve SOLO booleanos: nunca valores, nunca longitudes, nunca fragmentos.
 * Sirve para distinguir "la variable no llega al runtime" de "la variable llega
 * pero no cumple el mínimo", sin exponer absolutamente nada.
 *
 * Eliminar en cuanto se cierre el diagnóstico.
 */
export function GET() {
  const admin = process.env.ADMIN_PASSWORD;
  const mongo = process.env.MONGODB_URI;
  return new Response(
    JSON.stringify({
      adminPresent: typeof admin === "string" && admin.length > 0,
      adminMeetsMinimum: typeof admin === "string" && admin.length >= 12,
      mongoPresent: typeof mongo === "string" && mongo.length > 0,
      mongoDbName: process.env.MONGODB_DB ? "definida" : "por defecto",
    }),
    { headers: { "content-type": "application/json", "cache-control": "no-store" } },
  );
}
