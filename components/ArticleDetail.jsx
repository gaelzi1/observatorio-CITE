"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleDetailSkeleton from "./ArticleDetailSkeleton";
import { generateAPA } from "@/lib/citations";
import ArticleAPA from "./ArticleAPA";
import ArticleHeader from "./ArticleHeader";

export default function ArticleDetail({ id }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Artículo no encontrado");

        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el artículo.");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadArticle();
  }, [id]);

  if (loading) return <div className="space-y-6"><ArticleDetailSkeleton /></div>;

  if (error) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-lg font-medium text-neutral-800">{error}</p>
        <Link href="/recursos-informativos" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cite-teal-dark px-4 py-2 text-sm font-medium text-white">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!article) return null;

  // Lógica de formateo de datos
  const citation = generateAPA(article);
  const articleAuthor = article.author || article.autor;
  const dateLabel = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const bodyText = article.content?.trim() !== "" ? article.content : article.description;
  const paragraphs = bodyText.split(/\n\s*\n/);
  const readingMinutes = Math.max(1, Math.round(bodyText.trim().split(/\s+/).length / 200));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* NAVEGACIÓN */}
      <div className="mb-8 flex justify-center md:mb-10 md:justify-start">
        <Link href="/recursos-informativos" className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900">
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Volver a recursos
        </Link>
      </div>

      {/* TÍTULO */}
      <h1 className="mx-auto max-w-4xl text-center text-3xl font-extrabold tracking-tight text-cite-teal-dark sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {article.title}
      </h1>
      
      {/* CABECERA (Ahora en su propio componente) */}
      <ArticleHeader
        article={article}
        articleAuthor={articleAuthor}
        dateLabel={dateLabel}
        readingMinutes={readingMinutes}
      />

      {/* IMAGEN PRINCIPAL */}
      {article.imageUrl && (
        <figure className="mb-12 overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 shadow-sm">
          <img src={article.imageUrl} alt={article.title} className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-105" />
        </figure>
      )}

      {/* CUERPO DEL ARTÍCULO */}
      <article className="prose prose-neutral mx-auto max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-neutral-700">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-6">{paragraph}</p>
        ))}
      </article>


      {ArticleAPA && <ArticleAPA citation={citation} copied={copied} setCopied={setCopied} />}
    </main>
  );
}