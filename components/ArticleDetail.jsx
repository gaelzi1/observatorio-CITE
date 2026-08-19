import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article";
import { generateAPA } from "@/lib/citations";
import ArticleAPA from "./ArticleAPA";
import ArticleHeader from "./ArticleHeader";

export default async function ArticleDetail({slug}) {
  if (!slug) return null;
  
  try {
    await dbConnect();
    let article = await Article.findOne({ slug }).lean();

    if (!article) {
      return (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-center">
          <span className="text-3xl">⚠️</span>
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

    article = JSON.parse(JSON.stringify(article));

    const citation = generateAPA(article);
    const articleAuthor = article.author || article.autor;
    const dateLabel = article.createdAt
      ? new Date(article.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
      : "";

    const bodyText = article.content?.trim() !== "" ? article.content : article.description;
    const paragraphs = bodyText ? bodyText.split(/\n\s*\n/) : [];
    const readingMinutes = Math.max(1, Math.round(bodyText.trim().split(/\s+/).length / 200));

  return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        
        
        <div className="mb-8 flex justify-center md:mb-10 md:justify-start">
          {/* Unificado: text-muted y hover:text-primary */}
          <Link href="/recursos-informativos" className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary">
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
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