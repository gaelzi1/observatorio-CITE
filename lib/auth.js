import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "sesion_token";

export async function getAdminSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret)
    );

    if (payload.role !== "ADMIN") {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error al validar la sesión:", error);
    return null;
  }
}
