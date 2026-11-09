// =============================================================================
// app/api/login/route.js  →  POST /api/login
// -----------------------------------------------------------------------------
// Recibe { email, password }. Si son correctos, crea un JWT y lo guarda en una
// cookie "httpOnly" (el JavaScript del navegador no puede leerla, lo que la
// protege de ataques XSS). Ver lib/auth.js para cómo se valida después.
// =============================================================================

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
// bcrypt compara la contraseña escrita con el hash guardado en la BD.
import bcrypt from "bcryptjs";
// SignJWT crea (firma) el token de sesión.
import { SignJWT } from "jose";

// Límite de intentos fallidos por IP para frenar ataques de fuerza bruta.
// Se guarda en memoria: en Vercel cada instancia lleva su propia cuenta, así que es
// una protección básica; para algo más estricto usar un almacén compartido (Redis, BD).
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const failedAttempts = new Map(); // ip -> { count, firstAttempt }

// Detrás de un proxy (como Vercel) la IP real viene en la cabecera
// x-forwarded-for ("ip_cliente, ip_proxy1, ..."); tomamos la primera.
function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

// true si la IP superó el máximo de intentos dentro de la ventana de 15 min.
// Si la ventana ya pasó, borra el registro y la desbloquea.
function isBlocked(ip) {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAttempt > BLOCK_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

// Suma un intento fallido (o empieza una cuenta nueva si la anterior caducó).
function registerFailedAttempt(ip) {
  const entry = failedAttempts.get(ip);
  if (!entry || Date.now() - entry.firstAttempt > BLOCK_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAttempt: Date.now() });
  } else {
    entry.count++;
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (isBlocked(ip)) {
    // 429 = "Demasiadas peticiones".
    return NextResponse.json(
      { message: "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos." },
      { status: 429 }
    );
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("Falta la variable JWT_SECRET en .env.local o en Vercel");
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }

  try {
    const { email, password } = await request.json();

    // Solo texto: evita que manden objetos como { "$ne": null } a la consulta de MongoDB
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ message: "Correo y contraseña son obligatorios" }, { status: 400 });
    }

    //  LÓGICA DE BASE DE DATOS
    await dbConnect();
    const adminUser = await Admin.findOne({ email: email.trim().toLowerCase() });
    // Mismo mensaje si no existe el correo o si la contraseña es incorrecta:
    // así un atacante no puede averiguar qué correos están registrados.
    if (!adminUser|| !(await bcrypt.compare(password, adminUser.password))){
      registerFailedAttempt(ip);
      return NextResponse.json(
        { message: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

   // Creamos el JWT: guarda id, correo y rol, firmado con JWT_SECRET.
   // Nadie puede modificarlo sin invalidar la firma.
   const secret = new TextEncoder().encode(jwtSecret);

   const token = await new SignJWT({
    id:adminUser._id,
    email:adminUser.email,
    role: adminUser.role
   })
   .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Expira en 1 día
      .sign(secret);

    // Guardamos el token en una cookie:
    //   httpOnly → el JavaScript del navegador no puede leerla.
    //   secure   → en producción sólo viaja por HTTPS.
    //   sameSite → no se envía desde otros sitios (protege contra CSRF).
    //   path "/" → se envía en todas las rutas del sitio.
    cookies().set("sesion_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    });


    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("error en el inicio de sesion", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
