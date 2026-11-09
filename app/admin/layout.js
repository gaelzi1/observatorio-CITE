// =============================================================================
// app/admin/layout.js — Layout PROTEGIDO de todo el panel /admin
// -----------------------------------------------------------------------------
// Como este layout envuelve a todas las páginas bajo /admin, revisar la sesión
// aquí protege a todas ellas de una vez. Es un Server Component asíncrono
// (`async`): puede hacer `await` directamente, cosa que un componente de
// cliente no puede.
// =============================================================================

// redirect() detiene el render y manda al usuario a otra URL.
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Panel administrativo | Observatorio CITE",
  // Pide a Google y otros buscadores que no indexen el panel.
  robots: { index: false, follow: false },
};

// "force-dynamic": genera la página en CADA visita (sin caché). Es necesario
// porque depende de la cookie de sesión de quien la visita.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  // Si no hay sesión válida, a la página de login.
  const adminSession = await getAdminSession();
  if (!adminSession) redirect("/login");

  return (
    <div className="min-h-screen bg-surface">
      {/* Pasamos el correo como prop para mostrarlo en la cabecera. */}
      <AdminHeader email={adminSession.email} />
      {children}
    </div>
  );
}
