// =============================================================================
// app/page.js — PÁGINA DE INICIO (ruta "/")
// -----------------------------------------------------------------------------
// Un archivo `page.js` / `page.jsx` dentro de /app convierte esa carpeta en una
// URL visitable. Este está en la raíz de /app, por eso corresponde a "/".
// Es un Server Component (no tiene "use client"), así que se renderiza en el
// servidor. Los componentes que importa pueden ser de servidor o de cliente.
// =============================================================================

import Banner from "@/components/Banner";
import ArticleCarousel from "@/components/ArticleCarousel";
import Hero from "@/components/Hero";
import Library from "@/components/Library";
// Regenera la página en el servidor como máximo una vez por hora (ver layout.js).
export const revalidate = 3600; // Revalidar cada hora (3600 segundos)

// Next.js usa la exportación por defecto (`export default`) como la página.
export default function Page() {
    return (
        <main >

            {/* Barra de navegación superior */}
            <Banner />
            {/* Las "props" (title, subtitle...) son como parámetros de una
                función: así un mismo componente se reutiliza con otros textos. */}
            <Hero
              title="Bienvenido a nuestro sitio"
              subtitle="Descubre el poder de la información"
              description="Somos una organización dedicada a proporcionar información precisa y actualizada en diversas áreas de conocimiento."
              backgroundColor="#0F172A"
            />

            {/* Carrusel con los artículos más recientes */}
            <ArticleCarousel />
            {/* Biblioteca con buscador, filtros y paginación */}
            <Library/>


        </main>
    );
}
