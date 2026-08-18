import ArticleDetail from "@/components/ArticleDetail";
import Header from "@/components/Header";
import ArticleDetailSkeleton from "@/components/ArticleDetailSkeleton"



export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const {slug} = await params.slug;
  return(
  <><Header />
  <ArticleDetail slug={slug} />
  </>
); 
}
