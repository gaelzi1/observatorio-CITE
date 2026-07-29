"use client";

import { useEffect, useState, useCallback, useRef } from "react";

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

export default function ArticleCarousel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(null);
  const [slideActive, setSlideActive] = useState(false);

  const rafRef = useRef(null);

  // Cargar artículos
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");

        if (!res.ok) {
          throw new Error("Error al cargar artículos");
        }

        const data = await res.json();

        // Solo artículos publicados
        const publishedArticles = (data.data || [])
          .filter((article) => article.published)
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 6);

        setArticles(publishedArticles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  // Obtener los 3 artículos visibles
  function getGroup(i) {
    if (articles.length <= 3) {
      return articles;
    }

    return [0, 1, 2].map(
      (offset) => articles[(i + offset) % articles.length]
    );
  }

  // Cambiar de grupo
  const goTo = useCallback(
    (targetIndex, direction) => {
      if (anim || articles.length <= 3) return;

      setAnim({
        direction,
        targetIndex,
      });
    },
    [anim, articles.length]
  );

  // Siguiente
  const nextArticle = useCallback(() => {
    goTo((index + 1) % articles.length, 1);
  }, [goTo, index, articles.length]);

  // Anterior
  const previousArticle = useCallback(() => {
    goTo(
      index === 0 ? articles.length - 1 : index - 1,
      -1
    );
  }, [goTo, index, articles.length]);

  // Activar animación
  useEffect(() => {
    if (!anim) return;

    setSlideActive(false);

    rafRef.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlideActive(true);
      });
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [anim]);

  // Cuando termina la transición
  function handleTransitionEnd() {
    if (!anim) return;

    setIndex(anim.targetIndex);
    setAnim(null);
    setSlideActive(false);
  }

  // Autoplay cada 5 segundos
  useEffect(() => {
    if (articles.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      nextArticle();
    }, 5000);

    return () => clearInterval(interval);
  }, [
    articles.length,
    isPaused,
    nextArticle,
  ]);

  // Loading
  if (loading) {
    return (
      <p className="animate-pulse py-10 text-center text-neutral-500">
        Cargando artículos...
      </p>
    );
  }

  // Sin artículos
  if (articles.length === 0) {
    return (
      <p className="py-10 text-center text-neutral-500">
        No hay artículos publicados.
      </p>
    );
  }

  // Si hay 3 o menos
  if (articles.length <= 3) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {articles.map((article, index) =>
            renderCard(article, index, 0)
          )}
        </div>
      </section>
    );
  }

  const groupA = getGroup(index);

  const groupB = anim
    ? getGroup(anim.targetIndex)
    : null;

  const groupsOrder =
    anim && anim.direction === -1
      ? [groupB, groupA]
      : [groupA, groupB].filter(Boolean);

  let translate = "0%";

  if (anim) {
    if (anim.direction === 1) {
      translate = slideActive ? "-50%" : "0%";
    } else {
      translate = slideActive ? "0%" : "-50%";
    }
  }

  function renderCard(article, cardIndex, groupIndex) {
    if (!article) return null;

    const cardKey = `${article._id}-g${groupIndex}-${cardIndex}`;

    return (
      <article
        key={cardKey}
        className={cx(
          "flex min-h-[390px] flex-col",
          "bg-[#457695] p-5 text-white shadow-md",
          "transition-shadow duration-300",
          "hover:-translate-y-1 hover:shadow-2xl",
          cardIndex === 0
            ? "md:scale-105 md:shadow-xl"
            : "md:scale-100 md:opacity-90"
        )}
      >
        {/* IMAGEN */}
        <div className="h-36 overflow-hidden rounded-md">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-300 text-neutral-600">
              Sin imagen
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-1 flex-col items-center text-center">
          <h3 className="mt-6 line-clamp-2 text-sm font-bold">
            {article.title}
          </h3>

          <p className="mt-3 line-clamp-5 text-xs leading-relaxed text-white/90">
            {article.description}
          </p>

          {/* AQUÍ ESTABA EL ERROR */}
          <a
            href={`/articles/${article._id}`}
            className="mt-auto pt-5 text-xs underline underline-offset-4 transition-colors duration-200 hover:text-white/70"
          >
            Ver artículo
          </a>
        </div>
      </article>
    );
  }

  function renderDot(_, dotIndex) {
    const isActive = dotIndex === index;

    return (
      <button
        key={dotIndex}
        onClick={() => {
          if (dotIndex === index) return;

          goTo(
            dotIndex,
            dotIndex > index ? 1 : -1
          );
        }}
        aria-label={`Ir al artículo ${dotIndex + 1}`}
        className={cx(
          "h-2 rounded-full transition-all duration-300 ease-out",
          isActive
            ? "w-6 bg-cite-teal-dark"
            : "w-2 bg-neutral-300 hover:bg-neutral-400"
        )}
      />
    );
  }

  return (
    <section
      className="w-full py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6">

        {/* ANTERIOR */}
        <button
          onClick={previousArticle}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-400 text-2xl text-neutral-600 transition-all duration-200 hover:scale-110 hover:border-cite-teal-dark hover:bg-neutral-100 hover:text-cite-teal-dark active:scale-95"
          aria-label="Artículo anterior"
        >
          ←
        </button>

        {/* CARRUSEL */}
        <div className="w-full max-w-5xl overflow-hidden">
          <div
            onTransitionEnd={handleTransitionEnd}
            className={cx(
              "flex",
              anim &&
                "transition-transform duration-500 ease-in-out"
            )}
            style={{
              width: anim ? "200%" : "100%",
              transform: `translateX(${translate})`,
            }}
          >
            {groupsOrder.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="grid shrink-0 grid-cols-1 gap-8 md:grid-cols-3"
                style={{
                  width: anim ? "50%" : "100%",
                }}
              >
                {group.map((article, i) =>
                  renderCard(article, i, groupIdx)
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIGUIENTE */}
        <button
          onClick={nextArticle}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-400 text-2xl text-neutral-600 transition-all duration-200 hover:scale-110 hover:border-cite-teal-dark hover:bg-neutral-100 hover:text-cite-teal-dark active:scale-95"
          aria-label="Artículo siguiente"
        >
          →
        </button>
      </div>

      {/* INDICADORES */}
      {articles.length > 3 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {articles.map(renderDot)}
        </div>
      )}
    </section>
  );
}