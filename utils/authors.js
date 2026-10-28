/**
 * Convierte el texto de autores en un arreglo.
 * Separador recomendado: punto y coma ("Pérez, J.; López, M.").
 * También acepta comas sin romper el formato "Apellido, N." ("Pérez, J., López, M.").
 * Archivo sin dependencias para poder usarlo tanto en el servidor como en el navegador.
 */
export function parseAuthors(input) {
  if (Array.isArray(input)) return input.map((a) => String(a).trim()).filter(Boolean);
  if (typeof input !== "string") return [];

  const parts = input.includes(";")
    ? input.split(";")
    : input.split(/,(?!\s*(?:\p{Lu}\.|\p{Lu}\p{Ll}+$))/u); // no corta antes de una inicial ("López, M.")

  return parts.map((a) => a.trim()).filter(Boolean);
}
