"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleDetailSkeleton from "./ArticleDetailSkeleton";


export default function ArticleDetail({ id }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);

        if (!res.ok) {
          throw new Error("Artículo no encontrado");
        }

        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el artículo.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  if (loading) {
  return (
    <div className="space-y-6">
      
        <ArticleDetailSkeleton  />
   
    </div>
  );
}
  if (error) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-lg font-medium text-neutral-800">{error}</p>
        <p className="text-sm text-neutral-500">
          Verifica el enlace o vuelve a intentarlo más tarde.
        </p>
        <Link
          href="/recursos-informativos"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cite-teal-dark px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const dateLabel = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const bodyText =
    article.content && article.content.trim() !== ""
      ? article.content
      : article.description;

  const paragraphs = bodyText.split(/\n\s*\n/);

  const wordCount = bodyText.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("No se pudo copiar el enlace", error);
    }
  }

  const shareUrl = encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  );

  const shareTitle = encodeURIComponent(article.title);

  const shareLinks = [
    {
      label: "Compartir en Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      bg: "bg-[#1877F2]",
      icon: "f",
    },
    {
      label: "Compartir en LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      bg: "bg-[#0A66C2]",
      icon: "in",
    },
    {
      label: "Compartir en X",
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      bg: "bg-black",
      icon: "𝕏",
    },
  ];

  return (
   
    <main className="mx-auto max-w-6xl px-6 py-10 animate-in fade-in duration-500">
      {/* VOLVER AL INICIO */}
     
      <Link
        href="/recursos-informativos"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-cite-teal-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2 rounded"
      >
        <span aria-hidden="true">←</span>
        Volver al inicio
      </Link>

      {/* HEADER DEL ARTÍCULO */}
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        {/* INFORMACIÓN */}
        <div>
          {article.category && (
            <span className="inline-block rounded-full bg-cite-teal-dark px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
              {article.category}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-cite-teal-dark md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            {article.description}
          </p>

          {(dateLabel || readingMinutes) && (
            <div className="mt-5 flex items-center gap-3 text-sm text-neutral-500">
              {dateLabel && <span>{dateLabel}</span>}
              {dateLabel && <span className="text-neutral-300">•</span>}
              <span>{readingMinutes} min de lectura</span>
            </div>
          )}
        </div>

        {/* IMAGEN PRINCIPAL */}
        <div className="group overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full min-h-[300px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex min-h-[300px] items-center justify-center bg-neutral-100 text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="mt-14 grid gap-10 md:grid-cols-[180px_1fr]">
        {/* SIDEBAR */}
        <aside className="md:sticky md:top-24 md:h-fit">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="hidden h-32 w-full rounded-lg object-cover shadow-sm ring-1 ring-black/5 md:block"
            />
          )}

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-cite-teal-dark">
            Compartir
          </p>

          <div className="mt-3 flex gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm text-white shadow-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2 ${link.bg}`}
              >
                {link.icon}
              </a>
            ))}

            {/* COPIAR */}
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copiar enlace"
              title="Copiar enlace"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-cite-teal-dark hover:text-cite-teal-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cite-teal-dark focus-visible:ring-offset-2"
            >
              🔗
            </button>
          </div>

          <span
            role="status"
            aria-live="polite"
            className={`mt-2 block text-xs text-green-600 transition-opacity duration-300 ${
              copied ? "opacity-100" : "opacity-0"
            }`}
          >
            Enlace copiado
          </span>
        </aside>

        {/* ARTÍCULO */}
        <article className="prose max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mb-6 text-base leading-8 text-neutral-700"
            >
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </main>
  );
}