// =============================================================================
// models/Admin.js — Modelo de Mongoose para los administradores
// -----------------------------------------------------------------------------
// Un "Schema" describe la forma que tienen los documentos de una colección en
// MongoDB (qué campos hay, de qué tipo y qué reglas cumplen). Un "Model" es el
// objeto con el que consultamos/creamos documentos: Admin.findOne(), etc.
// =============================================================================

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // [true, "mensaje"] → obligatorio, con mensaje de error personalizado.
      required: [true, "El correo es obligatorio"],
      unique: true,     // No puede haber dos admins con el mismo correo.
      lowercase: true,  // Se guarda siempre en minúsculas.
    },
    password: {
      // Aquí se guarda el HASH de la contraseña (bcrypt), nunca el texto plano.
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    role: {
      type: String,
      default: "ADMIN",
    },
  },
  // timestamps: true agrega automáticamente createdAt y updatedAt.
  { timestamps: true }
);

// `mongoose.models.Admin || ...` evita el error "Cannot overwrite model" que
// ocurre cuando Next recarga este archivo y el modelo ya estaba registrado.
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
