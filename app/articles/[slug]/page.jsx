import ArticleDetail from "@/components/ArticleDetail";
import Banner from "@/components/Banner";
import { getPublishedArticleBySlug } from "@/lib/articles";

// 1. Agregamos esta línea para obligar a Next.js a renderizar esto en tiempo real
export const dynamic = 'force-dynamic';

// Título y descripción propios de cada artículo (pestaña del navegador, Google y redes sociales)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug).catch(() => null);

  if (!article) {
    return { title: "Artículo no encontrado | Observatorio CITE" };
  }

  return {
    title: `${article.title} | Observatorio CITE`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
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
      <ArticleDetail slug={slug} />
    </>
  );
}
