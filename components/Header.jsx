"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Informes y estadísticas", href: "/informes-estadisticas" },
  { label: "linea del tiempo", href: "/linea-tiempo" },
  { label: "Recursos informativos", href: "/recursos-informativos" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo_cite_letras.svg"
            alt="Logo"
            width={130}
            height={100}
            priority
          />
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-6 text-sm text-cite-teal-dark">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group relative py-1 transition-colors hover:text-cite-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2 rounded"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-cite-coral transition-transform duration-200 ease-out group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-cite-teal-dark transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2 md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* NAV MÓVIL */}
      <nav
        id="mobile-nav"
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 border-t border-black/5 px-6 py-3 text-sm text-cite-teal-dark">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 transition-colors hover:bg-neutral-50 hover:text-cite-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
