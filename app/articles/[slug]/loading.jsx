// =============================================================================
// app/articles/[slug]/loading.jsx — Pantalla de CARGA
// -----------------------------------------------------------------------------
// Next.js muestra automáticamente este componente mientras page.jsx de esta
// carpeta se está preparando en el servidor. Un "skeleton" es una silueta gris
// del contenido que da la sensación de que la página carga más rápido.
// =============================================================================

import ArticleDetailSkeleton from "@/components/ArticleDetailSkeleton"
import Banner from "@/components/Banner";
export default async function loading (){
    return(
        // <> </> es un "Fragment": agrupa varios elementos sin añadir un
        // <div> extra al HTML (un componente sólo puede devolver un elemento raíz).
        <><Banner />
        <div className="space-y-6"><ArticleDetailSkeleton /></div>
        </>
    )
}
