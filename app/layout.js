// =============================================================================
// app/layout.js — LAYOUT RAÍZ de la aplicación
// -----------------------------------------------------------------------------
// En el "App Router" de Next.js, cada carpeta dentro de /app es una ruta, y el
// archivo `layout.js` define la "envoltura" que comparten todas las páginas de
// esa carpeta y sus subcarpetas. Este es el layout de la raíz, así que envuelve
// TODO el sitio. Es obligatorio y es el único lugar donde van <html> y <body>.
//
// Por defecto es un Server Component: se ejecuta en el servidor y el navegador
// sólo recibe el HTML resultante (no se envía su JavaScript al cliente).
// =============================================================================

// Los estilos globales (Tailwind + CSS propio) se importan una sola vez aquí
// para que apliquen a todas las páginas.
import "./globals.css";
// "@/..." es un alias configurado en jsconfig.json que apunta a la raíz del
// proyecto. Evita rutas relativas largas como "../../components/Signature".
import Signature from "@/components/Signature";

// `metadata` es una exportación especial de Next.js: con ella se generan
// automáticamente las etiquetas <title> y <meta name="description"> del <head>.
// Las páginas hijas pueden sobrescribir estos valores con su propio `metadata`.
export const metadata = {
  title: "Observatorio CITE",
  description: "Centro de Investigación en Tecnología Educativa",
};
// `revalidate` activa ISR (Incremental Static Regeneration): Next genera el
// HTML una vez, lo guarda en caché y lo vuelve a generar como máximo cada N
// segundos. Así el sitio es rápido y aun así muestra datos actualizados.
export const revalidate = 3600; // Revalidar cada hora (3600 segundos)

// El layout recibe `children`: es la página (o layout anidado) que corresponde
// a la URL actual. Next se encarga de pasarlo automáticamente.
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Signature />
        {/* Aquí se "inyecta" la página que se esté visitando. */}
        {children}
      </body>

    </html>
  );
}
