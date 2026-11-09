// =============================================================================
// Banner — Cabecera del sitio público (logo + menú de navegación)
// -----------------------------------------------------------------------------
// Client Component porque reacciona al usuario: abre/cierra el menú móvil,
// los submenús, escucha clics fuera y la tecla Escape.
// =============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// usePathname devuelve la ruta actual (p. ej. "/quienes-somos"); sirve para
// resaltar en el menú la página en la que estamos.
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

/* ---------------------------------------------------------------
   Menú del banner. Para agregar o cambiar opciones edite solo esta lista.
   - Sin "sub": el elemento es un enlace directo.
   - Con "sub": el elemento despliega un submenú.
---------------------------------------------------------------- */
const MENU = [
  { t: "Inicio", href: "/" },
  { t: "Quiénes somos", href: "/quienes-somos" },
  { t: "Informes y estadísticas", href: "/informes-estadisticas" },
  { t: "Línea del tiempo", href: "/linea-tiempo" },
  { t: "Recursos informativos", href: "/recursos-informativos" },
];

const GRIS = "#D6D6D6";

/* Detecta si la pantalla es de escritorio (menú con hover) o móvil (acordeón).
   Empieza en false para que el render del servidor y el del cliente coincidan. */
/* Es un hook personalizado declarado en el mismo archivo (empieza con "use"). */
function useEscritorio(query = "(min-width: 1280px)") {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const fn = () => setOk(m.matches);
    fn(); // valor real en cuanto el componente aparece en el navegador
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, [query]);
  return ok;
}

/* Flecha que gira 180° cuando el submenú está abierto. */
function Chevron({ abierto }) {
  return <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true" />;
}

export default function Banner() {
  const [abierto, setAbierto] = useState(null); // índice del submenú abierto
  const [movil, setMovil] = useState(false); // menú hamburguesa abierto
  const escritorio = useEscritorio();
  const ruta = usePathname();
  // `ref` apunta al <header> para saber si un clic ocurrió dentro o fuera de él.
  const ref = useRef(null);

  // Cerrar con clic fuera o con Escape
  useEffect(() => {
    // .contains() dice si el elemento clicado está dentro del <header>.
    const fuera = (e) => { if (!ref.current?.contains(e.target)) setAbierto(null); };
    const esc = (e) => { if (e.key === "Escape") setAbierto(null); };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  // En escritorio el clic siempre abre; en móvil alterna (abre/cierra).
  const alClic = (i) =>setAbierto(escritorio ? i : abierto === i ? null : i);

  return (
    <header ref={ref} className="w-full">
      {/* Franja gris con el logo */}
      <div style={{ backgroundColor: GRIS }}>
        <div className="flex w-full items-center px-2 py-2 xl:px-[40px] xl:py-5">
          <Link href="/">
            <Image
              src="/logos/cite.png"
              alt="Universidad Autónoma de Querétaro – Centro de Investigación en Tecnología Educativa"
              width={792}
              height={90}
              priority
              className="h-[70px] w-full max-w-[600px]"
            />
          </Link>
        </div>
      </div>

      {/* Barra turquesa */}
      <nav className="bg-cite-turquesa" aria-label="Principal">   <div className="w-full px-6 xl:px-[50px]">
          {/* Botón hamburguesa (solo en pantallas menores a xl) */}
          {/* aria-expanded informa a lectores de pantalla si el menú está abierto. */}
          <button
            onClick={() => setMovil(!movil)}
            aria-expanded={movil}
            className="flex h-12 w-full items-center justify-between text-sm font-medium uppercase text-white xl:hidden"
          >
            Menú
            {movil ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>

          {/* Clases dinámicas con template string: en móvil se muestra sólo si
              `movil` es true; en xl (escritorio) siempre se muestra en fila. */}
          <ul className={`${movil ? "flex" : "hidden"} flex-col xl:flex xl:flex-row xl:flex-wrap`}>
            {MENU.map((item, i) => {
              const esAbierto = abierto === i;
              const alinearDerecha = i === MENU.length - 1; // evita que el último panel se salga de la pantalla
              // La página actual se marca en blanco, como "Inicio" en la referencia
              const activo = item.href && (item.href === "/" ? ruta === "/" : ruta?.startsWith(item.href));
              const estilo = `flex w-full items-center gap-2 px-[18px] py-2.5 text-left text-[15px] uppercase tracking-tight transition-colors xl:h-[70px] xl:w-auto xl:py-0 ${
                esAbierto || activo ? "bg-white text-slate-600" : "text-white hover:bg-white/15"
              }`;

              return (
                <li
                  key={item.t}
                  className="relative"
                  onMouseEnter={() => escritorio && item.sub && setAbierto(i)}
                  onMouseLeave={() => escritorio && setAbierto(null)}
                >
                  {item.sub ? (
                    <button className={estilo} aria-haspopup="true" aria-expanded={esAbierto} onClick={() => alClic(i)}>
                      {item.t}
                      <Chevron abierto={esAbierto} />
                    </button>
                  ) : (
                    <Link href={item.href} className={estilo} aria-current={activo ? "page" : undefined} onClick={() => setMovil(false)}>{item.t}</Link>
                  )}

                  {item.sub && esAbierto && (
                    <ul
                      className={`bg-white xl:absolute xl:top-full xl:z-50 xl:min-w-[280px] xl:shadow-lg ${
                        alinearDerecha ? "xl:right-0" : "xl:left-0"
                      }`}
                    >
                      {item.sub.map((s) => (
                        <li key={s.t}>
                          <Link
                            href={s.href}
                            onClick={() => { setAbierto(null); setMovil(false); }}
                            className="block px-5 py-3 text-sm text-slate-700 transition-colors hover:bg-cite-turquesa hover:text-white"
                          >
                            {s.t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
