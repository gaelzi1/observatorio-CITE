// =============================================================================
// lib/mongodb.js — Conexión reutilizable a MongoDB con Mongoose
// -----------------------------------------------------------------------------
// Problema: en Next.js las rutas de API pueden ejecutarse muchas veces (y en
// desarrollo el código se recarga con cada cambio). Si en cada petición
// abriéramos una conexión nueva, la base de datos se llenaría de conexiones.
//
// Solución: guardamos la conexión en `global` (un objeto que sobrevive entre
// recargas del módulo) y la reutilizamos. Es un patrón muy común en Next.js.
// =============================================================================

import mongoose from "mongoose";

// `cached` guarda dos cosas:
//   - conn:    la conexión ya lista.
//   - promise: la conexión "en proceso", para que si llegan dos peticiones al
//              mismo tiempo ambas esperen la misma y no abran dos.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

// Llama a `await dbConnect()` al inicio de cualquier código que use modelos.
async function dbConnect() {

  // La cadena de conexión viene de las variables de entorno (.env.local).
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Falta la variable MONGODB_URI en .env.local o en Vercel");
  }

  // 1. Si ya estamos conectados, devolvemos la conexión existente.
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 2. Agregamos las opciones para limitar conexiones simultáneas
    // bufferCommands: false → si no hay conexión, las consultas fallan de
    // inmediato en lugar de quedarse esperando en silencio.
    // maxPoolSize: 10 → máximo de conexiones abiertas a la vez.
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    // 3. Pasamos las opciones como segundo parámetro
    // Ojo: aquí NO usamos await; guardamos la promesa para compartirla.
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // 4. Esperamos a que la conexión termine y la guardamos para la próxima vez.
  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;
