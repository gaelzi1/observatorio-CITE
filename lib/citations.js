// Función de apoyo para poner solo la primera letra en mayúscula (Title Case)
function toTitleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatAuthors(authors) {
  if (!authors) return "Autor desconocido";

  if (Array.isArray(authors)) {
    authors = authors.join(",");
  }

  return authors
    .split(",")
    .map((author) => {
      const parts = author.trim().split(/\s+/);

      if (parts.length < 2) return toTitleCase(author.trim());

      const lastNames = parts
        .slice(-2)
        .map(toTitleCase)
        .join(" ");
        
      const names = parts.slice(0, -2);

      const initials = names
        .map((n) => `${n[0].toUpperCase()}.`)
        .join(" ");

      return `${lastNames}, ${initials}`;
    })
    .join(", & "); 
}

export function generateAPA(article) {
  const dateToUse = article.dateOfPublication || article.createdAt;
  
  let year = new Date(dateToUse).getFullYear();
  if (isNaN(year)) {
    year = "s.f."; 
  }

  const authors = formatAuthors(article.autor);
  let formattedTitle = article.title || "";
  if (formattedTitle) {
    formattedTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1).toLowerCase();
  }

  // (Opcional) Si tu base de datos tiene una propiedad para la URL o el slug, puedes agregarla aquí
  // const url = article.slug ? ` https://www.tudominio.com/articulos/${article.slug}` : "";

  return `${authors} (${year}). ${formattedTitle}. Observatorio CITE.`;
}