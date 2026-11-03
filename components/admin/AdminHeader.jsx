"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, LogOut } from "lucide-react";

export default function AdminHeader({ email }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <header className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="leading-tight">
          <p className="font-semibold text-primary">Observatorio CITE</p>
          <p className="text-xs text-muted">Panel administrativo</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {email && <span className="hidden text-sm text-muted md:inline">{email}</span>}
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-secondary transition hover:bg-base hover:text-primary sm:inline-flex"
          >
            Ver sitio
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
