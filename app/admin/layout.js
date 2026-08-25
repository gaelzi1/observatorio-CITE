
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

// Verifica que diga "export default function"
export default async function AdminLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("sesion_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    // Si la validación falla (token falso o expirado), entrará al catch
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (error) {
    // El token es inválido, lo expulsamos
    redirect("/login");
  }

  
  return (
    <section className="bg-white">
      {children}
    </section>
  );
}