// =============================================================================
// models/Timeline.js — Modelo de Mongoose para los eventos de la línea de tiempo
// -----------------------------------------------------------------------------
// Cada documento es un hito que se muestra en la página /linea-tiempo.
// =============================================================================

import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    // Forma corta: { type, required } en una sola línea.
    year: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Arreglo de textos (etiquetas del evento).
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

// Reutiliza el modelo si ya fue registrado (recarga en caliente de Next).
export default mongoose.models.Timeline || mongoose.model("Timeline", TimelineSchema);
