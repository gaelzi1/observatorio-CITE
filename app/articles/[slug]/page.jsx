import ArticleDetail from "@/components/ArticleDetail";
import Header from "@/components/Header";
export default async function ArticlePage({ params }) {
  const { id } = await params;

  return(
  <><Header />
  <ArticleDetail id={id} />
  </>
);
  
  
}