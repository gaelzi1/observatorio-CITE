import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// POST /api/logout — cierra la sesión del admin borrando la cookie del token.
// Sin la cookie, getAdminSession() devuelve null y el panel redirige a /login.
export async function POST() {
  try {
    // Le decimos a Next.js que elimine la cookie por completo
    cookies().delete("sesion_token");

    return NextResponse.json({ success: true, message: "Sesión cerrada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al cerrar sesión" }, { status: 500 });
  }
}