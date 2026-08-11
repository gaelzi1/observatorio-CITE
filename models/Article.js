import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
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
      type: Boolean,
      default: false,
    },
    typeOfComponent: {
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

    // ==========================================
    // CAMPOS PARA CITACIÓN (APA 7)
    // ==========================================
    
    // Revistas científicas
    journalName: {
      type: String,
      default: "",
    },
    volume: {
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
    timestamps: true,
  }
);

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);