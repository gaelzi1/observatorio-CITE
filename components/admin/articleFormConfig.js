// =============================================================================
// articleFormConfig.js — Configuración del formulario de recursos
// -----------------------------------------------------------------------------
// Sólo datos, sin JSX. Separar la configuración de la vista permite cambiar
// opciones o campos sin tocar el componente del formulario.
// =============================================================================

import { APA_FIELDS } from "@/lib/articleFields";

// Opciones del selector "Tipo de recurso": value = lo que se guarda en la BD,
// label = lo que ve el usuario.
export const TYPE_OPTIONS = [
  { value: "article", label: "Artículo general" },
  { value: "journal_article", label: "Artículo de revista científica" },
  { value: "book", label: "Libro" },
  { value: "thesis", label: "Tesis académica" },
  { value: "report", label: "Informe técnico / Reporte" },
  { value: "conference_paper", label: "Ponencia / Congreso" },
  { value: "educational_resource", label: "Recurso educativo / Guía" },
  { value: "other", label: "Otro recurso" },
];

// Mismo dato en forma de "diccionario" para buscar rápido una etiqueta:
// TYPE_LABELS["book"] → "Libro"
export const TYPE_LABELS = Object.fromEntries(TYPE_OPTIONS.map((t) => [t.value, t.label]));

// Campos de citación APA que se muestran según el tipo de recurso.
// span: columnas que ocupa en una rejilla de 4.
export const APA_FIELDS_BY_TYPE = {
  journal_article: [
    { name: "journalName", label: "Nombre de la revista", placeholder: "Ej. Revista Iberoamericana de Educación", span: 4 },
    { name: "volume", label: "Volumen", placeholder: "Ej. 14" },
    { name: "issue", label: "Número", placeholder: "Ej. 2" },
    { name: "pages", label: "Páginas", placeholder: "Ej. 45-60", span: 2 },
  ],
  book: [
    { name: "publisher", label: "Editorial", placeholder: "Ej. Editorial Universitaria", span: 3 },
    { name: "edition", label: "Edición (opcional)", placeholder: "Ej. 2" },
  ],
  thesis: [
    { name: "degree", label: "Grado académico", placeholder: "Ej. Tesis de maestría", span: 2 },
    { name: "institution", label: "Institución", placeholder: "Ej. Universidad Autónoma de Querétaro", span: 2 },
  ],
  report: [
    { name: "institution", label: "Institución emisora", placeholder: "Ej. Observatorio de Competencias Digitales", span: 2 },
    { name: "reportNumber", label: "N.º de reporte (opcional)", placeholder: "Ej. OCD-2025-04", span: 2 },
  ],
  conference_paper: [
    { name: "conferenceName", label: "Congreso o evento", placeholder: "Ej. Congreso Internacional de Software Educativo", span: 2 },
    { name: "location", label: "Lugar (ciudad, país)", placeholder: "Ej. Querétaro, México", span: 2 },
  ],
  educational_resource: [
    { name: "materialType", label: "Tipo de material", placeholder: "Ej. Guía docente", span: 2 },
    { name: "institution", label: "Institución / plataforma", placeholder: "Ej. Centro de Desarrollo Tecnológico", span: 2 },
  ],
};

// Valores iniciales del formulario. Todos son "" (no undefined) porque un
// input controlado necesita siempre un valor de texto.
// La última línea agrega todos los campos APA vacíos: { journalName: "", ... }.
export const EMPTY_FORM = {
  title: "",
  author: "",
  category: "",
  typeOfComponent: "",
  imageUrl: "",
  description: "",
  content: "",
  dateOfPublication: "",
  ...Object.fromEntries(APA_FIELDS.map((f) => [f, ""])),
};

// Convierte un artículo de la API al formato del formulario
export function articleToForm(article) {
  const form = { ...EMPTY_FORM };
  for (const key of Object.keys(EMPTY_FORM)) {
    if (typeof article[key] === "string") form[key] = article[key];
  }
  form.author = Array.isArray(article.author)
    ? article.author.join("; ") // Punto y coma: las comas son parte de "Apellido, N."
    : article.author || "";
  // La API manda fechas ISO ("2025-03-10T00:00:00.000Z"); el input date
  // necesita sólo "2025-03-10".
  form.dateOfPublication = article.dateOfPublication
    ? new Date(article.dateOfPublication).toISOString().split("T")[0]
    : "";
  return form;
}
