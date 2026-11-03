import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Iniciar sesión | Observatorio CITE",
  robots: { index: false, follow: false },
};

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
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
        Volver al sitio
      </Link>
      <LoginForm />
    </main>
  );
}
