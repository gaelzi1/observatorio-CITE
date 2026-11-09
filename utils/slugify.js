// Convierte un título en un "slug": texto apto para usarse en una URL.
// Ejemplo: "¿Qué es la Educación Digital?" → "que-es-la-educacion-digital"
// Para garantizar que no se repita en la BD, ver createUniqueSlug en lib/articles.js.
export function createSlug(title) {
  if (!title) return "";

  // Cada .replace() aplica una expresión regular (regex) y va transformando
  // el texto paso a paso; a esto se le llama "encadenar" métodos.
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD") // Separa las letras de los acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/[^a-z0-9 -]/g, "") // Elimina caracteres especiales (mantiene letras, números y guiones)
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-"); // Evita guiones dobles (ej: mi---titulo -> mi-titulo)

  return baseSlug;
}
