function formatAuthors(authors) {
  if (!authors) return "Autor desconocido";

  // Si viene como arreglo, convertirlo en texto
  if (Array.isArray(authors)) {
    authors = authors.join(",");
  }

  return authors
    .split(",")
    .map((author) => {
      const parts = author.trim().split(/\s+/);

      if (parts.length < 2) return author.trim();

      const lastNames = parts.slice(-2).join(" ");
      const names = parts.slice(0, -2);

      const initials = names
        .map((n) => `${n[0].toUpperCase()}.`)
        .join(" ");

      return `${lastNames}, ${initials}`;
    })
    .join(" & ");
}
export function generateAPA(article) {
  const year = new Date(article.createdAt).getFullYear();

  const authors = formatAuthors(article.autor);

  return `${authors} (${year}). ${article.title}. Observatorio CITE.`;
}