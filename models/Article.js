// =============================================================================
// models/Article.js — Modelo de Mongoose para los artículos / recursos
// -----------------------------------------------------------------------------
// Define qué datos tiene cada recurso del observatorio. Mongoose valida estas
// reglas antes de guardar (p. ej. si falta un campo `required`, lanza error).
// =============================================================================

import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      // [String] = arreglo de textos, porque un recurso puede tener varios autores.
      type: [String],
      required: true,
    },
    description: {
      // Resumen corto que se muestra en tarjetas y listados.
      type: String,
      required: true,
    },
    content: {
      // Texto completo del artículo.
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    published: {
      // Si es false, el artículo es un borrador y no aparece en el sitio público.
      type: Boolean,
      default: false,
    },
    typeOfComponent: {
      // `enum` limita los valores posibles. Este campo decide qué formato APA
      // se usa en lib/citations.js.
      type: String,
      enum: [
        "article",
        "book",
        "thesis",
        "report",
        "journal_article",
        "educational_resource",
        "conference_paper",
        "other",
      ],
      default: "other",
    },
    dateOfPublication: {
      type: Date,
      required: true,
    },
    slug: {
      // Identificador legible usado en la URL: /articles/<slug>
      type: String,
      required: true,
      unique: true, // Cada artículo necesita una URL distinta
    },


    // ==========================================
    // CAMPOS PARA CITACIÓN (APA 7)
    // ==========================================
    // Todos son opcionales (default: ""). Cuáles se usan depende del tipo de
    // recurso. La lista de nombres también está en lib/articleFields.js.

    // Revistas científicas
    journalName: {
      type: String,
      default: "",
    },
    volume: {
      type: String,
      default: "",
    },
    issue: {
      type: String,
      default: "",
    },
    pages: {
      type: String,
      default: "",
    },

    // Libros
    publisher: {
      type: String,
      default: "",
    },
    edition: {
      type: String,
      default: "",
    },

    // Tesis
    degree: {
      type: String,
      default: "",
    },

    // Compartido: Tesis, Informes, Recursos educativos
    institution: {
      type: String,
      default: "",
    },

    // Informes / Reportes
    reportNumber: {
      type: String,
      default: "",
    },

    // Congresos / Ponencias
    conferenceName: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },

    // Recursos educativos
    materialType: {
      type: String,
      default: "",
    },

    // Enlace o identificador persistente (DOI / URL fuente)
    doiOrUrl: {
      type: String,
      default: "",
    },
  },
  {
    // Agrega createdAt y updatedAt automáticamente.
    timestamps: true,
  }
);

// Reutiliza el modelo si ya existe (evita errores con la recarga en caliente).
export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);
