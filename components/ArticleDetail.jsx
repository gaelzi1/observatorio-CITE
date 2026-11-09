import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { getPublishedArticleBySlug } from "@/lib/articles";
import { generateAPA } from "@/lib/citations";
import ArticleAPA from "./ArticleAPA";
import ArticleHeader from "./ArticleHeader";

// =============================================================================
// ArticleDetail — Contenido completo de un artículo
// -----------------------------------------------------------------------------
// Es un SERVER COMPONENT ASÍNCRONO (`async function`, sin "use client"):
// puede hacer `await` y consultar la base de datos directamente, sin fetch ni
// useEffect. El navegador recibe el HTML ya listo, lo que es más rápido y
// mejor para SEO. Sólo las partes interactivas (copiar cita, compartir) son
// Client Components.
// =============================================================================
export default async function ArticleDetail({slug}) {
  if (!slug) return null;
  
  try {
    // Los borradores (published: false) no se muestran al público
    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
      return (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-center">
          <AlertTriangle className="h-9 w-9 text-accent" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-lg font-medium text-primary">Artículo no encontrado</p>
          <Link 
            href="/recursos-informativos" 
           
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-inverse transition-opacity hover:opacity-90"
          >
            Volver al inicio
          </Link>
        </div>
      );
    }

    // Calculamos todo en el servidor y lo pasamos ya listo a los hijos.
    const citation = generateAPA(article);
    // `article.autor` es un respaldo para artículos antiguos con el campo en español.
    const articleAuthor = article.author || article.autor;

    // Fecha de publicación del recurso; si no tiene, la de alta en el sitio.
    // timeZone UTC: la fecha se guarda a medianoche UTC y en México se mostraría un día antes.
    const displayDate = article.dateOfPublication || article.createdAt;
    const dateLabel = displayDate
      ? new Date(displayDate).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
      : "";

    // Si no hay contenido, usamos la descripción como cuerpo.
    const bodyText = (article.content?.trim() ? article.content : article.description) || "";
    // Separa el texto en párrafos donde haya una línea en blanco.
    const paragraphs = bodyText ? bodyText.split(/\n\s*\n/) : [];
    // Tiempo de lectura estimado: palabras / 200 por minuto (mínimo 1).
    const readingMinutes = Math.max(1, Math.round(bodyText.trim().split(/\s+/).length / 200));

  return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        
        
        <div className="mb-8 flex justify-center md:mb-10 md:justify-start">
          {/* Unificado: text-muted y hover:text-primary */}
          <Link href="/recursos-informativos" className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            Volver a recursos
          </Link>
        </div>

        {/* TÍTULO */}
        {/* Unificado: text-primary en lugar de text-cite-teal-dark */}
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl lg:leading-[1.15]">
          {article.title}
        </h1>
        
        {/* CABECERA */}
        <ArticleHeader
          article={article}
          articleAuthor={articleAuthor}
          dateLabel={dateLabel}
          readingMinutes={readingMinutes}
        />

        {/* IMAGEN PRINCIPAL */}
        {article.imageUrl && (
        
          <figure className="mb-12 overflow-hidden rounded-2xl border border-gray-200/60 bg-base shadow-sm">
            <img src={article.imageUrl} alt={article.title} className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-105" />
          </figure>
        )}

        {/* CUERPO DEL ARTÍCULO */}
        {/* Unificado: prose-p:text-secondary en lugar de prose-p:text-neutral-700 */}
        <article className="prose prose-neutral mx-auto max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-secondary">
          {/* Usar el índice como `key` está bien aquí porque la lista no se
              reordena ni cambia en pantalla. En listas que cambian, usa un id. */}
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </article>

        {/* CITACIÓN */}
        {ArticleAPA && <ArticleAPA citation={citation} />}
      </main>
    );
  } catch (error) {
    console.error("Error al cargar el artículo desde BD:", error);
    return <div className="py-20 text-center text-secondary">Error al conectar con la base de datos.</div>;
  }
}