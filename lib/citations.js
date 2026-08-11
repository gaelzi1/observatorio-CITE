// Función auxiliar para capitalizar nombres propios
function toTitleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Formatea autores al estándar APA 7 (Apellido, Inicial.)
 * Maneja cadenas separadas por coma/punto y coma o arrays de autores.
 */
export function formatAuthors(authorsInput) {
  if (!authorsInput || (Array.isArray(authorsInput) && authorsInput.length === 0)) {
    return "Autor desconocido";
  }

  let list = [];
  if (Array.isArray(authorsInput)) {
    list = authorsInput;
  } else if (typeof authorsInput === "string") {
    // Si viene separado por punto y coma o coma
    list = authorsInput.includes(";")
      ? authorsInput.split(";")
      : [authorsInput];
  }

  const formatted = list
    .map((author) => {
      const raw = author.trim().replace(/^&\s*/, "");
      if (!raw) return "";

      // Si ya viene con coma (ej. "Brito Contreras, Marco Gael" o "Soto-Ramírez, E.")
      if (raw.includes(",")) {
        const [last, first] = raw.split(",").map((s) => s.trim());
        if (!first) return last;

        const initials = first
          .split(/\s+/)
          .map((n) => (n.endsWith(".") ? n : `${n[0].toUpperCase()}.`))
          .join(" ");

        return `${last}, ${initials}`;
      }

      // Si viene en orden directo (ej. "Marco Gael Brito Contreras")
      const parts = raw.split(/\s+/);
      if (parts.length === 1) return toTitleCase(raw);

      // Asumimos los dos últimos como apellidos compuestos/hispanos si hay 3+ partes
      const splitIdx = parts.length >= 3 ? parts.length - 2 : parts.length - 1;
      const names = parts.slice(0, splitIdx);
      const lastNames = parts.slice(splitIdx).map(toTitleCase).join(" ");
      const initials = names.map((n) => `${n[0].toUpperCase()}.`).join(" ");

      return `${lastNames}, ${initials}`;
    })
    .filter(Boolean);

  if (formatted.length === 0) return "Autor desconocido";
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`;

  return `${formatted.slice(0, -1).join(", ")}, & ${formatted[formatted.length - 1]}`;
}

/**
 * Genera la referencia bibliográfica en formato APA 7
 * @param {Object} article - Objeto del recurso
 * @param {Object} options - { asHtml: boolean } para renderizar etiquetas <i> para cursivas
 */
export function generateAPA(article, options = { asHtml: false }) {
  if (!article) return "";

  // 1. Manejo del autor (lee tanto `author` como `autor`)
  const authors = formatAuthors(article.author || article.autor);

  // 2. Manejo del año
  const dateToUse = article.dateOfPublication || article.createdAt;
  let year = "s. f.";
  if (dateToUse) {
    const parsedYear = new Date(dateToUse).getFullYear();
    if (!isNaN(parsedYear)) year = parsedYear.toString();
  }

  // 3. Formateo de título (Sentence case)
  let title = (article.title || "").trim();
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (!title.endsWith(".")) title += ".";
  }

  // Helper para aplicar cursivas según el formato deseado
  const italic = (text) => {
    if (!text) return "";
    return options.asHtml ? `<i>${text}</i>` : `*${text}*`;
  };

  const type = article.typeOfComponent || "article";
  const link = article.doiOrUrl ? ` ${article.doiOrUrl}` : "";
  let citationBody = "";

  // 4. Construcción según el tipo de recurso
  switch (type) {
    case "journal_article": {
      // Apellido, A. (Año). Título del artículo. Nombre de Revista, vol(num), pp. DOI/URL
      const journal = italic(article.journalName || "Revista Científica");
      const vol = article.volume ? `${italic(article.volume)}` : "";
      const issue = article.issue ? `(${article.issue})` : "";
      const volIssue = vol ? `, ${vol}${issue}` : "";
      const pages = article.pages ? `, ${article.pages}` : "";

      citationBody = `${authors} (${year}). ${title} ${journal}${volIssue}${pages}.${link}`;
      break;
    }

    case "book": {
      // Apellido, A. (Año). Título del libro (ed.). Editorial. DOI/URL
      const bookTitle = italic(title.replace(/\.$/, ""));
      const edition = article.edition ? ` (${article.edition})` : "";
      const publisher = article.publisher ? ` ${article.publisher}.` : " Observatorio CITE.";

      citationBody = `${authors} (${year}). ${bookTitle}${edition}.${publisher}${link}`;
      break;
    }

    case "thesis": {
      // Apellido, A. (Año). Título de la tesis [Tesis de Grado, Institución]. Repositorio. URL
      const thesisTitle = italic(title.replace(/\.$/, ""));
      const degree = article.degree || "Tesis de Licenciatura";
      const inst = article.institution || "Universidad Autónoma de Querétaro";

      citationBody = `${authors} (${year}). ${thesisTitle} [${degree}, ${inst}].${link}`;
      break;
    }

    case "report": {
      // Entidad. (Año). Título del informe (Informe N.º X). Institución. URL
      const reportTitle = italic(title.replace(/\.$/, ""));
      const repNum = article.reportNumber ? ` (${article.reportNumber})` : "";
      const inst = article.institution ? ` ${article.institution}.` : " Observatorio CITE.";

      citationBody = `${authors} (${year}). ${reportTitle}${repNum}.${inst}${link}`;
      break;
    }

    case "conference_paper": {
      // Apellido, A. (Año). Título de la ponencia [Ponencia]. Nombre del Congreso, Ciudad. URL
      const paperTitle = italic(title.replace(/\.$/, ""));
      const conf = article.conferenceName ? ` ${article.conferenceName}` : " Congreso Académico";
      const loc = article.location ? `, ${article.location}` : "";

      citationBody = `${authors} (${year}). ${paperTitle} [Ponencia].${conf}${loc}.${link}`;
      break;
    }

    case "educational_resource": {
      // Autor. (Año). Título del recurso [Material didáctico]. Institución. URL
      const resTitle = italic(title.replace(/\.$/, ""));
      const matType = article.materialType || "Recurso educativo";
      const inst = article.institution ? ` ${article.institution}.` : " Observatorio CITE.";

      citationBody = `${authors} (${year}). ${resTitle} [${matType}].${inst}${link}`;
      break;
    }

    case "article":
    case "other":
    default: {
      // Apellido, A. (Año). Título del recurso. Observatorio CITE. URL
      const defaultTitle = italic(title.replace(/\.$/, ""));
      citationBody = `${authors} (${year}). ${defaultTitle}. Observatorio CITE.${link}`;
      break;
    }
  }

  return citationBody.replace(/\s+/g, " ").trim();
}