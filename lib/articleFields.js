// Campos de citación APA. Única lista que usan POST, PUT y el formulario de admin.
// Vive aparte de lib/articles.js para poder importarla desde componentes de cliente.
// (lib/articles.js importa Mongoose, que sólo funciona en el servidor; si un
// componente "use client" lo importara, Next intentaría mandarlo al navegador
// y fallaría. Por eso esta lista "pura" está en su propio archivo.)
//
// Tener la lista en un solo lugar evita errores: si se agrega un campo nuevo,
// basta con añadirlo aquí (y en models/Article.js) y todo lo demás lo usa.
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
