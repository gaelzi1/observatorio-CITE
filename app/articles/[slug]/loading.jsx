import ArticleDetailSkeleton from "@/components/ArticleDetailSkeleton"
import Banner from "@/components/Banner";
export default async function loading (){
    return(
        <><Banner />
        <div className="space-y-6"><ArticleDetailSkeleton /></div>
        </>
    )
}