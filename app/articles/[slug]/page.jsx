import ArticleDetail from "@/components/ArticleDetail";
import Header from "@/components/Header";
import ArticleDetailSkeleton from "@/components/ArticleDetailSkeleton";

// 1. Agregamos esta línea para obligar a Next.js a renderizar esto en tiempo real
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }) {
  // 2. Esperamos los parámetros correctamente
  const { slug } = await params;

  return (
    <>
      <Header />
      <ArticleDetail slug={slug} />
    </>
  ); 
}
