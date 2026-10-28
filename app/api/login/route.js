import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// Límite de intentos fallidos por IP para frenar ataques de fuerza bruta.
// Se guarda en memoria: en Vercel cada instancia lleva su propia cuenta, así que es
// una protección básica; para algo más estricto usar un almacén compartido (Redis, BD).
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const failedAttempts = new Map(); // ip -> { count, firstAttempt }

function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

function isBlocked(ip) {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAttempt > BLOCK_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

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
    if (!adminUser|| !(await bcrypt.compare(password, adminUser.password))){
      registerFailedAttempt(ip);
      return NextResponse.json(
        { message: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

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
