"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, LogOut, UserRound } from "lucide-react";

const GRIS = "#D6D6D6"; // mismo gris de la franja del banner público

// Cabecera del panel de administración.
// Props: `email` → correo del admin (lo pasa app/admin/layout.js desde el servidor).
// Las props se reciben "desestructuradas": ({ email }) equivale a (props) + props.email.
export default function AdminHeader({ email }) {
  const router = useRouter();
  // Para mostrar un spinner y desactivar el botón mientras se cierra sesión.
  const [loggingOut, setLoggingOut] = useState(false);

  // Pide al servidor borrar la cookie y luego manda al login.
  // router.refresh() vuelve a pedir los Server Components para que el layout
  // note que ya no hay sesión.
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="w-full">
      {/* Franja gris con el logo, igual que en el sitio */}
      <div style={{ backgroundColor: GRIS }}>
        <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/admin" aria-label="Inicio del panel">
            {/* <Image> de Next optimiza la imagen (tamaño, formato, carga
                diferida). width/height evitan saltos de diseño al cargar y
                `priority` la carga primero porque se ve de inmediato. */}
            <Image
              src="/logos/cite.png"
              alt="Universidad Autónoma de Querétaro – Centro de Investigación en Tecnología Educativa"
              width={792}
              height={90}
              priority
              className="h-[48px] w-auto max-w-full"
            />
          </Link>
        </div>
      </div>

      {/* Barra turquesa */}
      <nav className="bg-cite-turquesa text-white" aria-label="Panel administrativo">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <span className="text-[15px] uppercase tracking-tight">Panel administrativo</span>

          <div className="flex items-center gap-1 text-sm">
            {email && (
              <span className="mr-2 hidden items-center gap-1.5 text-white/90 md:inline-flex">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {email}
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              className="hidden h-11 items-center gap-1.5 px-3 uppercase tracking-tight transition-colors hover:bg-white/15 sm:inline-flex"
            >
              Ver sitio
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex h-11 items-center gap-1.5 px-3 uppercase tracking-tight transition-colors hover:bg-white hover:text-slate-600 disabled:opacity-60"
            >
              {/* Operador ternario: condición ? siEsVerdad : siEsFalso */}
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
