// =============================================================================
// app/login/page.jsx — Página /login
// -----------------------------------------------------------------------------
// Server Component: revisa la sesión en el servidor y, si no hay, muestra el
// formulario. El formulario (LoginForm) es un Client Component porque necesita
// estado e interacción (lo que escribe el usuario, botón de enviar...).
// Patrón típico de Next: la página es de servidor y las piezas interactivas
// son componentes de cliente pequeños.
// =============================================================================

// <Link> navega entre páginas sin recargar todo el sitio (más rápido que <a>).
import Link from "next/link";
// lucide-react es una librería de íconos; cada ícono es un componente.
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Iniciar sesión | Observatorio CITE",
  robots: { index: false, follow: false },
};

// Sin caché: la página depende de la cookie de cada visitante.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Si ya hay sesión válida, no tiene sentido mostrar el formulario
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-20">
      <Link
        href="/"
        className="group absolute left-4 top-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary sm:left-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
        Volver al sitio
      </Link>
      <LoginForm />
    </main>
  );
}
