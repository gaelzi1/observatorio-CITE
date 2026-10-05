import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Falta la variable MONGODB_URI en .env.local o en Vercel");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 2. Agregamos las opciones para limitar conexiones simultáneas
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    // 3. Pasamos las opciones como segundo parámetro
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;