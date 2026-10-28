import { cache } from "react";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article";
import { createSlug } from "@/utils/slugify";

export { parseAuthors } from "@/utils/authors";

// Campos de citación APA. Única lista que usan POST, PUT y el formulario de admin.
export const APA_FIELDS = [
  "journalName",
  "volume",
  "issue",
  "pages",
  "publisher",
  "edition",
  "degree",
  "institution",
  "reportNumber",
  "conferenceName",
  "location",
  "materialType",
  "doiOrUrl",
];

// Toma del body solo los campos APA, como texto limpio ("" si no vienen)
export function pickApaFields(body) {
  return Object.fromEntries(
    APA_FIELDS.map((field) => [field, typeof body[field] === "string" ? body[field].trim() : ""])
  );
}

// Genera un slug que no exista en la BD agregando -2, -3... si hace falta
export async function createUniqueSlug(title, excludeId) {
  const base = createSlug(title) || "articulo";
  let slug = base;
  let n = 2;

  while (await Article.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Artículo publicado por slug. cache() evita consultar dos veces la BD
// cuando generateMetadata y la página lo piden en el mismo render.
export const getPublishedArticleBySlug = cache(async (slug) => {
  await dbConnect();
  const article = await Article.findOne({ slug, published: { $ne: false } }).lean();
  return article ? JSON.parse(JSON.stringify(article)) : null;
});
