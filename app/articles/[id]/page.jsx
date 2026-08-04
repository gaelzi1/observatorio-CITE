import ArticleDetail from "@/components/ArticleDetail";

export default async function ArticlePage({ params }) {
  const { id } = await params;

  return <ArticleDetail id={id} />;
  
  
}