"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleDetailSkeleton from "./ArticleDetailSkeleton";
import { generateAPA } from "@/lib/citations";
import ArticleAPA from "./ArticleAPA";

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
        <ArticleDetailSkeleton />
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

  const citation = generateAPA(article);
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

  // Respaldo: si article.author no existe, intenta leer article.autor
  const articleAuthor = article.author || article.autor;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* VOLVER AL INICIO */}
      <div className="mb-8 flex justify-center md:mb-10 md:justify-start">
        <Link
          href="/recursos-informativos"
          className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          Volver a recursos
        </Link>
      </div>

      {/* TÍTULO DEL ARTÍCULO */}
      <h1 className="mx-auto max-w-4xl text-center text-3xl font-extrabold tracking-tight text-cite-teal-dark sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {article.title}
      </h1>

      {/* HEADER DEL ARTÍCULO (Categoría y Descripción) */}
      <header className="mb-10 mt-6 flex flex-col items-center text-center">
        {article.category && (
          <span className="mb-6 inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {article.category}
          </span>
        )}

        {article.description && (
          <p className="max-w-4xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {article.description}
          </p>
        )}

        {/* META INFO Y COMPARTIR (Fila unificada) */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-y border-neutral-100 py-5 sm:flex-row">
          {/* Author y Fecha */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-neutral-600">
            
            {/* Author */}
            {articleAuthor && (
              <span className="font-medium text-neutral-900">
                {articleAuthor}
              </span>
            )}

            {/* Bullet after author (only if other elements exist) */}
            {articleAuthor && (dateLabel || readingMinutes) && (
              <span className="hidden text-neutral-300 sm:inline">•</span>
            )}

            {/* Date Label and Reading Minutes */}
            <div className="flex items-center gap-2">
              {dateLabel && <time>{dateLabel}</time>}

              {dateLabel && readingMinutes && (
                <span className="text-neutral-300">•</span>
              )}

              {readingMinutes && <span>{readingMinutes} min de lectura</span>}
            </div>

            {/* Publication Date (Moved the bullet INSIDE the condition) */}
            {article.dateOfPublication && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-300">•</span>
                <time dateTime={article.dateOfPublication}>
                  {new Date(article.dateOfPublication).toLocaleDateString()}
                  <span className="sr-only">Fecha de publicación</span>
                </time>
              </div>
            )}
          </div>

          {/* Botones de compartir horizontales */}
          <div className="relative flex items-center gap-2">
            <span className="mr-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
              Compartir
            </span>
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${link.bg}`}
              >
                {link.icon}
              </a>
            ))}

            {/* COPIAR ENLACE */}
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copiar enlace"
              title="Copiar enlace"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
            >
              🔗
            </button>

            {/* Mensaje de copiado flotante */}
            <span
              role="status"
              aria-live="polite"
              className={`absolute -top-8 right-0 rounded bg-neutral-800 px-2 py-1 text-xs text-white transition-opacity duration-200 ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              Copiado 💾
            </span>
          </div>
        </div>
      </header>

      {/* IMAGEN PRINCIPAL */}
      {article.imageUrl && (
        <figure className="mb-12 overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 shadow-sm">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </figure>
      )}

      {/* CUERPO DEL ARTÍCULO */}
      <article className="prose prose-neutral mx-auto max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-neutral-700">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-6">
            {paragraph}
          </p>
        ))}
      </article>

      {/* SECCIÓN CITAR ARTÍCULO (APA) */}
      {ArticleAPA && (
        <ArticleAPA
          citation={citation}
          copied={copied}
          setCopied={setCopied}
        />
      )}
    </main>
  );
}