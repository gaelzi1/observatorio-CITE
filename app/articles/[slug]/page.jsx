// =============================================================================
// app/articles/[slug]/page.jsx — Página de detalle de un artículo
// -----------------------------------------------------------------------------
// [slug] es un segmento dinámico: /articles/mi-articulo llega aquí con
// params.slug === "mi-articulo". En la misma carpeta están loading.jsx
// (mientras carga) y error.jsx (si algo falla).
// =============================================================================

import ArticleDetail from "@/components/ArticleDetail";
import Banner from "@/components/Banner";
import { getPublishedArticleBySlug } from "@/lib/articles";

// 1. Agregamos esta línea para obligar a Next.js a renderizar esto en tiempo real
export const dynamic = 'force-dynamic';

// Título y descripción propios de cada artículo (pestaña del navegador, Google y redes sociales)
// `generateMetadata` es la versión dinámica de `export const metadata`: Next la
// llama en el servidor antes de renderizar la página.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  // .catch(() => null): si falla la BD, no rompemos la página por el <title>.
  const article = await getPublishedArticleBySlug(slug).catch(() => null);

  if (!article) {
    return { title: "Artículo no encontrado | Observatorio CITE" };
  }

  return {
    title: `${article.title} | Observatorio CITE`,
    description: article.description,
    // openGraph define la vista previa al compartir el enlace en redes sociales.
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      // Sólo agrega `images` si el artículo tiene imagen.
      ...(article.imageUrl ? { images: [article.imageUrl] } : {}),
    },
  };
}

export default async function ArticlePage({ params }) {
  // 2. Esperamos los parámetros correctamente
  const { slug } = await params;

  return (
    <>
      <Banner />
      {/* ArticleDetail es un Server Component asíncrono que lee el artículo
          directamente de la BD (sin pasar por la API). */}
      <ArticleDetail slug={slug} />
    </>
  );
}
