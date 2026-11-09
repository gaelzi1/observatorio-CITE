// =============================================================================
// lib/articles.js — Funciones de ayuda para trabajar con artículos (SERVIDOR)
// -----------------------------------------------------------------------------
// La carpeta /lib guarda lógica reutilizable que no es un componente visual.
// Este archivo usa Mongoose (base de datos), así que SÓLO debe importarse desde
// código que corre en el servidor: rutas de API, Server Components, scripts.
// =============================================================================

// `cache` de React memoriza el resultado de una función durante UN mismo
// render en el servidor (no es una caché permanente entre visitas).
import { cache } from "react";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article";
import { createSlug } from "@/utils/slugify";

// Re-exportación: permite hacer `import { parseAuthors } from "@/lib/articles"`
// aunque la función realmente viva en utils/authors.js.
export { parseAuthors } from "@/utils/authors";

import { APA_FIELDS } from "@/lib/articleFields";

export { APA_FIELDS };

// Toma del body solo los campos APA, como texto limpio ("" si no vienen)
// Ejemplo: { volume: " 3 ", hack: "x" } → { journalName: "", volume: "3", ... }
// Filtrar así evita que alguien guarde en la BD campos que no esperamos.
export function pickApaFields(body) {
  // Object.fromEntries convierte un arreglo de pares [clave, valor] en objeto.
  return Object.fromEntries(
    APA_FIELDS.map((field) => [field, typeof body[field] === "string" ? body[field].trim() : ""])
  );
}

// Genera un slug que no exista en la BD agregando -2, -3... si hace falta
// Un "slug" es la versión de un título apta para URL:
// "Mi Artículo" → "mi-articulo" → /articles/mi-articulo
// `excludeId` se usa al EDITAR: el propio artículo no debe contar como repetido.
export async function createUniqueSlug(title, excludeId) {
  const base = createSlug(title) || "articulo";
  let slug = base;
  let n = 2;

  // Mientras ya exista un artículo con ese slug, probamos con base-2, base-3...
  // `...(cond ? {...} : {})` agrega la condición de _id sólo si hay excludeId.
  // `$ne` significa "not equal" (distinto de) en las consultas de MongoDB.
  while (await Article.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Artículo publicado por slug. cache() evita consultar dos veces la BD
// cuando generateMetadata y la página lo piden en el mismo render.
export const getPublishedArticleBySlug = cache(async (slug) => {
  // Siempre hay que asegurar la conexión antes de consultar.
  await dbConnect();
  // `published: { $ne: false }` incluye artículos publicados y también los
  // antiguos que no tienen el campo. `.lean()` devuelve un objeto JS simple
  // en lugar de un documento de Mongoose (más ligero y rápido).
  const article = await Article.findOne({ slug, published: { $ne: false } }).lean();
  // JSON.parse(JSON.stringify(...)) convierte tipos especiales (ObjectId, Date)
  // en texto. Es necesario porque los datos que un Server Component pasa a un
  // Client Component deben ser "serializables" (convertibles a JSON).
  return article ? JSON.parse(JSON.stringify(article)) : null;
});
