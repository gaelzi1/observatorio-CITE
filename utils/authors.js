/**
 * Convierte el texto de autores en un arreglo.
 * Separador recomendado: punto y coma ("Pérez, J.; López, M.").
 * También acepta comas sin romper el formato "Apellido, N." ("Pérez, J., López, M.").
 * Archivo sin dependencias para poder usarlo tanto en el servidor como en el navegador.
 *
 * Ejemplos:
 *   parseAuthors("Ana Ruiz; Luis Pérez")  → ["Ana Ruiz", "Luis Pérez"]
 *   parseAuthors("Pérez, J., López, M.")  → ["Pérez, J.", "López, M."]
 *   parseAuthors(["Ana", " Luis "])       → ["Ana", "Luis"]
 */
export function parseAuthors(input) {
  // Si ya es un arreglo, sólo limpiamos espacios y quitamos elementos vacíos.
  // `.filter(Boolean)` elimina valores "falsy" como "" (cadena vacía).
  if (Array.isArray(input)) return input.map((a) => String(a).trim()).filter(Boolean);
  if (typeof input !== "string") return [];

  // Si hay ";" se usa como separador. Si no, se divide por comas, excepto las
  // comas que van seguidas de una inicial ("M.") o de un solo nombre al final,
  // porque esas forman parte de "Apellido, Nombre".
  // El flag `u` habilita \p{Lu} (letra mayúscula) y \p{Ll} (minúscula) en
  // cualquier idioma, incluidas letras con acento.
  const parts = input.includes(";")
    ? input.split(";")
    : input.split(/,(?!\s*(?:\p{Lu}\.|\p{Lu}\p{Ll}+$))/u); // no corta antes de una inicial ("López, M.")

  return parts.map((a) => a.trim()).filter(Boolean);
}
