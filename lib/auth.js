// =============================================================================
// lib/auth.js — Verifica si quien hace la petición es un administrador
// -----------------------------------------------------------------------------
// Flujo general de autenticación del proyecto:
//   1. El admin envía correo y contraseña a /api/login.
//   2. Si son correctos, el servidor crea un JWT (un "token" firmado) y lo
//      guarda en una cookie llamada "sesion_token".
//   3. En cada petición posterior el navegador envía esa cookie
//      automáticamente, y esta función comprueba que el token sea válido.
// =============================================================================

// `cookies()` es una función de Next.js que sólo funciona en el servidor
// (Server Components, rutas de API, Server Actions) y lee las cookies recibidas.
import { cookies } from "next/headers";
// `jose` es una librería para crear y verificar JWT.
import { jwtVerify } from "jose";

const SESSION_COOKIE = "sesion_token";

// Devuelve los datos del admin (el "payload" del token) o null si no hay
// sesión válida. Quien la llama decide qué hacer con null (p. ej. redirigir).
export async function getAdminSession() {
  // `?.` (encadenamiento opcional): si la cookie no existe, da undefined en vez
  // de lanzar un error al intentar leer `.value`.
  const token = cookies().get(SESSION_COOKIE)?.value;
  // Las variables de entorno se definen en .env.local (o en Vercel) y nunca
  // deben subirse al repositorio. JWT_SECRET es la "llave" para firmar tokens.
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    return null;
  }

  try {
    // jwtVerify comprueba la firma y la fecha de expiración. Si el token fue
    // alterado o ya caducó, lanza un error y caemos en el `catch`.
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret)
    );

    // Aunque el token sea válido, exigimos que el rol sea ADMIN.
    if (payload.role !== "ADMIN") {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error al validar la sesión:", error);
    return null;
  }
}
