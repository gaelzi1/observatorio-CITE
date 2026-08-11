"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

// Devuelve cuántas tarjetas se ven a la vez según el viewport:
// 1 en celular, 2 en tablet, 3 en escritorio.
function useCardsPerView() {
  const getValue = () => {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  };

  const [cardsPerView, setCardsPerView] = useState(getValue);

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const update = () => setCardsPerView(getValue());
    update();
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  return cardsPerView;
}

export default function ArticleCarousel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const cardsPerView = useCardsPerView();

  // Índice dentro de la pista extendida (incluye clones al inicio/final).
  const [trackIndex, setTrackIndex] = useState(cardsPerView);
  const [withTransition, setWithTransition] = useState(true);
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;

  // Cargar artículos
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Error al cargar artículos");

        const data = await res.json();
        const publishedArticles = (data.data || [])
          .filter((article) => article.published)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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

  const isCarousel = articles.length > 3;

  // Pista con clones al inicio y al final para poder "loopear" sin corte visible.
  const track = useMemo(() => {
    if (!isCarousel) return articles;
    const head = articles.slice(-cardsPerView);
    const tail = articles.slice(0, cardsPerView);
    return [...head, ...articles, ...tail];
  }, [articles, cardsPerView, isCarousel]);

  const firstRealIndex = cardsPerView;
  const lastRealIndex = cardsPerView + articles.length - 1;

  // Reubicar el punto de partida cada vez que cambia el layout (datos o breakpoint),
  // sin animar el salto.
  useEffect(() => {
    if (!isCarousel) return;
    setWithTransition(false);
    setTrackIndex(firstRealIndex);
  }, [isCarousel, cardsPerView, articles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reactivar la transición un frame después de cualquier reposicionamiento instantáneo.
  useEffect(() => {
    if (withTransition) return;
    const id = requestAnimationFrame(() => setWithTransition(true));
    return () => cancelAnimationFrame(id);
  }, [withTransition, trackIndex]);

  const step = useCallback(
    (direction) => {
      if (!isCarousel) return;
      setWithTransition(true);
      setTrackIndex((i) => i + direction);
    },
    [isCarousel]
  );

  const nextArticle = useCallback(() => step(1), [step]);
  const previousArticle = useCallback(() => step(-1), [step]);

  // Autoplay
  useEffect(() => {
    if (!isCarousel || isPaused) return;
    const interval = setInterval(nextArticle, 5000);
    return () => clearInterval(interval);
  }, [isCarousel, isPaused, nextArticle]);

  // Al cruzar la zona de clones, saltar de forma invisible al índice real equivalente.
  function handleTransitionEnd() {
    if (!isCarousel) return;
    const i = trackIndexRef.current;
    if (i < firstRealIndex) {
      setWithTransition(false);
      setTrackIndex(i + articles.length);
    } else if (i > lastRealIndex) {
      setWithTransition(false);
      setTrackIndex(i - articles.length);
    }
  }

  const goToArticle = (targetRealIndex) => {
    if (!isCarousel) return;
    setWithTransition(true);
    setTrackIndex(firstRealIndex + targetRealIndex);
  };

  // Swipe táctil para navegar en móvil
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  function handleTouchStart(e) {
    if (!isCarousel) return;
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(e) {
    if (!isCarousel || touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    if (!isCarousel || touchStartX.current === null) return;
    const SWIPE_THRESHOLD = 40;
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      previousArticle();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      nextArticle();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  }

  const activeDot = isCarousel
    ? (((trackIndex - firstRealIndex) % articles.length) + articles.length) % articles.length
    : 0;

  function renderCard(article, key) {
    if (!article) return null;

    // Adaptamos el texto superior para que se vea como: "ARTÍCULO | INNOVACIÓN"
    const tipo = article.typeOfComponent === "book" ? "LIBRO"
               : article.typeOfComponent === "thesis" ? "TESIS"
               : article.typeOfComponent === "report" ? "INFORME"
               : article.typeOfComponent === "article" ? "ARTÍCULO" : "RECURSO";
    
    const categoria = article.category ? article.category.toUpperCase() : "GENERAL";

    return (
      <a
        href={`/articles/${article._id}`}
        key={key}
        className="group relative flex h-[320px] w-full flex-col overflow-hidden border border-gray-200 transition-shadow duration-300 hover:shadow-lg sm:h-[360px]"
      >
        {/* 1. IMAGEN DE FONDO (Ocupa todo el contenedor) */}
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cite-teal-dark text-6xl font-bold text-white">
            {categoria.charAt(0)}
          </div>
        )}

        {/* 2. GRADIENTE BLANCO (Difuminado desde abajo hacia arriba) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/90 to-transparent transition-opacity duration-300 group-hover:via-white" />

        {/* 3. CONTENIDO (Texto superpuesto sobre el gradiente) */}
        <div className="relative z-10 mt-auto flex flex-col p-5 sm:p-6">
          
          {/* Etiqueta superior (Ej: OBSERVATORIO | TENDENCIAS) */}
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-gray-800">
            {tipo} <span className="mx-1 text-gray-400">|</span> {categoria}
          </p>

          {/* Título principal */}
          <h3 className="line-clamp-3 text-lg font-medium leading-snug text-black sm:text-xl">
            {article.title}
          </h3>

        </div>
      </a>
    );
  }

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

  // Si hay 3 o menos: grid estático, sin carrusel
  if (!isCarousel) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3">
          {articles.map((article) => renderCard(article, article._id))}
        </div>
      </section>
    );
  }

  const slideWidth = `${100 / cardsPerView}%`;

  return (
    <section className="w-full overflow-hidden bg-gray-100 px-3 py-12 sm:px-4 sm:py-16 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 sm:gap-8">
        <h2 className="px-2 text-center text-xl font-bold text-cite-teal-dark sm:text-2xl lg:text-3xl">
          Artículos Recientes
        </h2>

        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Pista deslizante: cada tarjeta avanza su propio ancho, sin saltos de bloque */}
          <div
            className="overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={cx(
                "flex -mx-1 sm:-mx-2 md:-mx-3",
                withTransition && "transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              )}
              style={{ transform: `translateX(-${trackIndex * (100 / cardsPerView)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {track.map((article, i) => (
                <div
                  key={`${article._id}-${i}`}
                  className="flex-shrink-0 px-1 sm:px-2 md:px-3"
                  style={{ width: slideWidth }}
                >
                  {renderCard(article, article._id)}
                </div>
              ))}
            </div>
          </div>

          {/* Flecha anterior */}
          <button
            type="button"
            onClick={previousArticle}
            aria-label="Artículo anterior"
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-cite-teal-dark shadow-sm backdrop-blur transition hover:border-cite-teal-dark hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cite-teal-dark sm:flex sm:p-2.5 md:-translate-x-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M12 5l-5 5 5 5"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Flecha siguiente */}
          <button
            type="button"
            onClick={nextArticle}
            aria-label="Siguiente artículo"
            className="absolute right-0 top-1/2 z-10 hidden translate-x-2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-cite-teal-dark shadow-sm backdrop-blur transition hover:border-cite-teal-dark hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cite-teal-dark sm:flex sm:p-2.5 md:translate-x-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M8 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="mt-6 flex justify-center gap-2 sm:mt-8">
            {articles.map((article, i) => (
              <button
                key={article._id}
                type="button"
                aria-label={`Ir al artículo ${i + 1}`}
                onClick={() => goToArticle(i)}
                className={cx(
                  "h-2 rounded-full transition-all",
                  i === activeDot ? "w-6 bg-cite-teal-dark" : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}