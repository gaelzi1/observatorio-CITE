import ArticleDetailSkeleton from "@/components/ArticleDetailSkeleton"
import Header from "@/components/Header";
export default async function loading (){
    return(
        <><Header />
        <div className="space-y-6"><ArticleDetailSkeleton /></div>
        </>
    )
}