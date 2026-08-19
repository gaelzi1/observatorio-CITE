"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useCardsPerView } from "@/hooks/useCardsPerView";
import CarouselCard from "./CarouselCard";

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

export default function ArticleCarousel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const cardsPerView = useCardsPerView();
  const [trackIndex, setTrackIndex] = useState(cardsPerView);
  const [withTransition, setWithTransition] = useState(true);
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;

  // Carga de artículos
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Error al cargar artículos");

        const data = await res.json();
        const rawArticles = data.data || [];

        const publishedArticles = rawArticles
          .filter((article) => article.published !== false)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);

        setArticles(publishedArticles);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const isCarousel = articles.length > cardsPerView;

  const track = useMemo(() => {
    if (!isCarousel) return articles;
    const head = articles.slice(-cardsPerView);
    const tail = articles.slice(0, cardsPerView);
    return [...head, ...articles, ...tail];
  }, [articles, cardsPerView, isCarousel]);

  const firstRealIndex = cardsPerView;
  const lastRealIndex = cardsPerView + articles.length - 1;

  useEffect(() => {
    if (!isCarousel) return;
    setWithTransition(false);
    setTrackIndex(firstRealIndex);
  }, [isCarousel, cardsPerView, articles.length]);

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

  // Swipe táctil
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

  if (loading) {
    return (
    
      <div className="py-16 text-center text-muted">
        <p className="animate-pulse">Cargando recursos...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
    
      <div className="py-16 text-center text-muted">
        <p>No hay recursos publicados en este momento.</p>
      </div>
    );
  }

  if (!isCarousel) {
    return (
     
      <section className="w-full bg-base py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4">
          {/* Unificado: text-primary en lugar de text-cite-teal-dark */}
          <h2 className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
            Artículos Recientes
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <CarouselCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const slideWidth = `${100 / cardsPerView}%`;

  return (

    <section className="w-full overflow-hidden bg-base px-3 py-12 sm:px-4 sm:py-16 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 sm:gap-8">
        
        {/* Unificado: text-primary en lugar de text-cite-teal-dark */}
        <h2 className="px-2 text-center text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
          Artículos Recientes
        </h2>

        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Pista deslizante */}
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
                  <CarouselCard article={article} />
                </div>
              ))}
            </div>
          </div>

          {/* Flecha Anterior */}
          <button
            type="button"
            onClick={previousArticle}
            aria-label="Artículo anterior"
           
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-2 -translate-y-1/2 rounded-full border border-gray-200 bg-surface/90 p-2 text-primary shadow-sm backdrop-blur transition hover:border-focus hover:bg-surface sm:flex sm:p-2.5 md:-translate-x-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Flecha Siguiente */}
          <button
            type="button"
            onClick={nextArticle}
            aria-label="Siguiente artículo"
      
            className="absolute right-0 top-1/2 z-10 hidden translate-x-2 -translate-y-1/2 rounded-full border border-gray-200 bg-surface/90 p-2 text-primary shadow-sm backdrop-blur transition hover:border-focus hover:bg-surface sm:flex sm:p-2.5 md:translate-x-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Indicadores / Dots */}
          <div className="mt-6 flex justify-center gap-2 sm:mt-8">
            {articles.map((article, i) => (
              <button
                key={article.slug}
                type="button"
                aria-label={`Ir al artículo ${i + 1}`}
                onClick={() => goToArticle(i)}
                className={cx(
                  "h-2 rounded-full transition-all",
                
                  i === activeDot ? "w-6 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}