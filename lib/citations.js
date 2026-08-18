// Función auxiliar para capitalizar nombres propios
function toTitleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Detecta si un autor es una institución para no aplicar la regla de "Apellido, Inicial."
 * Ej: "Obsevatorio competenciad digitales", "Universidad Autónoma de Querétaro"
 */
function isCorporateAuthor(name) {
  const corporateKeywords = [
    "observatorio", "universidad", "instituto", "centro", "ministerio", 
    "secretaría", "organización", "comisión", "asociación", "grupo", "fondo"
  ];
  const lowerName = name.toLowerCase();
  return corporateKeywords.some(keyword => lowerName.includes(keyword));
}

/**
 * Formatea autores al estándar APA 7 (Apellido, Inicial.)
 * Maneja cadenas separadas por coma/punto y coma, arrays, y autores corporativos.
 */
export function formatAuthors(authorsInput) {
  if (!authorsInput || (Array.isArray(authorsInput) && authorsInput.length === 0)) {
    return "Autor desconocido";
  }

  let list = Array.isArray(authorsInput) 
    ? authorsInput 
    : authorsInput.split(/;|,(?!\s*(?:[A-Z]\.|[A-Z][a-z]+$))/); // Divide por ';' o ',' inteligentemente

  const formatted = list
    .map((author) => {
      const raw = author.trim().replace(/^&\s*/, "");
      if (!raw) return "";

      // 1. Manejo de Autores Corporativos (Evita que se conviertan en "CITE, O.")
      if (isCorporateAuthor(raw)) return raw;

      // 2. Si ya viene con coma (ej. "Brito Contreras, M. G.")
      if (raw.includes(",")) {
        const [last, first] = raw.split(",").map((s) => s.trim());
        if (!first) return last;

        const initials = first
          .split(/\s+/)
          .map((n) => (n.endsWith(".") ? n : `${n[0].toUpperCase()}.`))
          .join(" ");

        return `${last}, ${initials}`;
      }

      // 3. Si viene en orden directo (ej. "Marco Gael Brito Contreras")
      const parts = raw.split(/\s+/);
      if (parts.length === 1) return toTitleCase(raw);

      // Asumimos los dos últimos como apellidos (patrón hispano común)
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
  
  // APA 7 usa coma antes del ampersand para 3 o más autores
  return `${formatted.slice(0, -1).join(", ")}, & ${formatted[formatted.length - 1]}`;
}

/**
 * Genera la referencia bibliográfica en formato APA 7
 * @param {Object} article - Objeto del recurso
 * @param {Object} options - { asHtml: boolean }
 */
export function generateAPA(article, options = { asHtml: false }) {
  if (!article) return "";

  const authors = formatAuthors(article.author || article.autor);
  const dateToUse = article.dateOfPublication || article.createdAt;
  
  let year = "s. f.";
  if (dateToUse) {
    const parsedYear = new Date(dateToUse).getFullYear();
    if (!isNaN(parsedYear)) year = parsedYear.toString();
  }

  let title = (article.title || "").trim();
  if (title) {
    // Convierte solo la primera letra a mayúscula sin forzar el resto a minúscula (protege siglas)
    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (!title.endsWith(".")) title += ".";
  }

  const italic = (text) => (options.asHtml ? `<i>${text}</i>` : `*${text}*`);
  
  const type = article.typeOfComponent || "article";
  const link = article.doiOrUrl ? ` ${article.doiOrUrl}` : "";
  let citationBody = "";

  switch (type) {
    case "journal_article": {
      const journal = italic(article.journalName || "Revista Científica");
      const vol = article.volume ? italic(article.volume) : "";
      const issue = article.issue ? `(${article.issue})` : "";
      const volIssue = vol ? `, ${vol}${issue}` : "";
      const pages = article.pages ? `, ${article.pages}` : "";

      citationBody = `${authors} (${year}). ${title} ${journal}${volIssue}${pages}.${link}`;
      break;
    }

    case "book": {
      const bookTitle = italic(title.replace(/\.$/, ""));
      const edition = article.edition ? ` (${article.edition})` : "";
      // APA 7: Se omite la editorial si es exactamente el mismo nombre que el autor
      const publisherName = article.publisher || "Obsevatorio competenciad digitales";
      const publisherStr = publisherName.toLowerCase() === authors.toLowerCase() ? "" : ` ${publisherName}.`;

      citationBody = `${authors} (${year}). ${bookTitle}${edition}.${publisherStr}${link}`;
      break;
    }

    case "thesis": {
      const thesisTitle = italic(title.replace(/\.$/, ""));
      // APA prefiere minúsculas para el grado académico
      const degree = article.degree ; 
      const inst = article.institution  ;
      const repo = article.repository ? ` ${article.repository}.` : "";

      citationBody = `${authors} (${year}). ${thesisTitle} [${degree}, ${inst}].${repo}${link}`;
      break;
    }

    case "report": {
      const reportTitle = italic(title.replace(/\.$/, ""));
      const repNum = article.reportNumber ? ` (${article.reportNumber})` : "";
      const inst = article.institution ? ` ${article.institution}.` : " Obsevatorio competenciad digitales.";

      citationBody = `${authors} (${year}). ${reportTitle}${repNum}.${inst}${link}`;
      break;
    }

    case "conference_paper": {
      const paperTitle = italic(title.replace(/\.$/, ""));
      const conf = article.conferenceName ? ` ${article.conferenceName}` : " Congreso Académico";
      const loc = article.location ? `, ${article.location}` : "";

      citationBody = `${authors} (${year}). ${paperTitle} [Ponencia].${conf}${loc}.${link}`;
      break;
    }

    case "educational_resource": {
      const resTitle = italic(title.replace(/\.$/, ""));
      const matType = article.materialType || "Recurso educativo";
      const inst = article.institution ? ` ${article.institution}.` : " Obsevatorio competenciad digitales.";

      citationBody = `${authors} (${year}). ${resTitle} [${matType}].${inst}${link}`;
      break;
    }

    case "article":
    case "other":
    default: {
      const defaultTitle = italic(title.replace(/\.$/, ""));
      citationBody = `${authors} (${year}). ${defaultTitle}. Obsevatorio competenciad digitales.${link}`;
      break;
    }
  }

  // Limpieza final estricta de puntuación y espacios
  return citationBody
    .replace(/\s+/g, " ")       // Elimina espacios dobles
    .replace(/\s\./g, ".")      // Corrige espacios antes de un punto
    .replace(/\.\./g, ".")      // Corrige puntos dobles accidentales
    .trim();
}