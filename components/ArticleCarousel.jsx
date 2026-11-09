// =============================================================================
// ArticleCarousel — Carrusel infinito de artículos recientes
// -----------------------------------------------------------------------------
// Client Component: pide los datos desde el navegador (fetch dentro de
// useEffect), avanza solo cada 5 s, responde a flechas, puntos y swipe táctil.
//
// TRUCO DEL CARRUSEL INFINITO ("clones"):
// Si hay artículos [A B C D E] y se ven 3 a la vez, la "pista" (track) es:
//      [C D E] + [A B C D E] + [A B C]
//       clones     reales      clones
// Al pasar de E hacia adelante se ve el clon de A con animación; cuando la
// animación termina, saltamos SIN animación a la A real. El usuario no nota el
// salto y parece que el carrusel no tiene fin.
// =============================================================================

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCardsPerView } from "@/hooks/useCardsPerView";
import CarouselCard from "./CarouselCard";
import CarouselCardSkeleton from "./CarouselCardSkeleton";

// Une clases CSS ignorando las falsas: cx("a", false && "b", "c") → "a c".
// `...args` (parámetro rest) recoge todos los argumentos en un arreglo.
function cx(...args) {
  return args.filter(Boolean).join(" ");
}

export default function ArticleCarousel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Tarjetas visibles a la vez (1, 2 o 3 según el ancho de pantalla).
  const cardsPerView = useCardsPerView();
  // Posición actual dentro de la pista (incluyendo clones). Empieza en el
  // primer artículo real, que está justo después de los clones iniciales.
  const [trackIndex, setTrackIndex] = useState(cardsPerView);
  // Si es false, el movimiento es instantáneo (para el salto invisible).
  const [withTransition, setWithTransition] = useState(true);
  // useRef guarda un valor que NO provoca re-render al cambiar. Aquí copiamos
  // trackIndex para leer siempre el valor más reciente dentro de los eventos.
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;

  // Carga de artículos
  // Patrón típico para pedir datos en un Client Component: useEffect con []
  // (se ejecuta una vez al montar). La función async se declara DENTRO porque
  // el callback de useEffect no puede ser async directamente.
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Error al cargar artículos");

        const data = await res.json();
        const rawArticles = data.data || [];

        // Publicados, del más nuevo al más viejo, máximo 8.
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

  // Sólo hay carrusel si hay más artículos de los que caben; si no, se muestra una rejilla.
  const isCarousel = articles.length > cardsPerView;

  // Pista con clones al inicio y al final (ver explicación arriba).
  // slice(-n) toma los últimos n elementos; slice(0, n) los primeros n.
  const track = useMemo(() => {
    if (!isCarousel) return articles;
    const head = articles.slice(-cardsPerView);
    const tail = articles.slice(0, cardsPerView);
    return [...head, ...articles, ...tail];
  }, [articles, cardsPerView, isCarousel]);

  const firstRealIndex = cardsPerView;
  const lastRealIndex = cardsPerView + articles.length - 1;

  // Si cambia el tamaño de pantalla o la cantidad de artículos, volvemos al
  // primer artículo real sin animación (la pista cambió de forma).
  useEffect(() => {
    if (!isCarousel) return;
    setWithTransition(false);
    setTrackIndex(firstRealIndex);
  }, [isCarousel, cardsPerView, articles.length]);

  // Después de un salto sin animación, reactivamos la transición en el
  // siguiente cuadro (requestAnimationFrame) para que el navegador alcance a
  // pintar primero la posición nueva.
  useEffect(() => {
    if (withTransition) return;
    const id = requestAnimationFrame(() => setWithTransition(true));
    return () => cancelAnimationFrame(id);
  }, [withTransition, trackIndex]);

  // Avanza (+1) o retrocede (-1) una tarjeta con animación.
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
  // setInterval llama a nextArticle cada 5 s; clearInterval lo detiene al
  // pausar (hover/touch) o al desmontar el componente.
  useEffect(() => {
    if (!isCarousel || isPaused) return;
    const interval = setInterval(nextArticle, 5000);
    return () => clearInterval(interval);
  }, [isCarousel, isPaused, nextArticle]);

  // Se ejecuta al terminar la animación CSS. Si quedamos sobre un clon,
  // saltamos sin animación a la tarjeta real equivalente (el "truco" infinito).
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
  // Usamos useRef (no useState) porque estos valores cambian con cada
  // movimiento del dedo y no necesitan volver a pintar el componente.
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

  // Qué punto (dot) resaltar. El doble % con + length es un "módulo positivo":
  // en JS, -1 % 5 da -1, y así lo convertimos en 4.
  const activeDot = isCarousel
    ? (((trackIndex - firstRealIndex) % articles.length) + articles.length) % articles.length
    : 0;

  const slideWidth = `${100 / (cardsPerView || 1)}%`;

  // ÚNICO CONTENEDOR PARA TODOS LOS ESTADOS
  return (
    <section className="w-full overflow-hidden bg-base px-3 py-12 sm:px-4 sm:py-16 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 sm:gap-8">
        
        <h2 className="px-2 text-center text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
          Artículos Recientes
        </h2>

        {/* 1. ESTADO DE CARGA */}
       {/* 1. ESTADO DE CARGA */}
        {/* Ternarios encadenados: cargando ? ... : vacío ? ... : rejilla ? ... : carrusel */}
        {loading ? (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1er Skeleton: Siempre visible (Móvil, Tablet, PC) */}
            <div className="block w-full">
              <CarouselCardSkeleton />
            </div>
            
            {/* 2do Skeleton: Oculto en móvil, visible en Tablet y PC */}
            <div className="hidden w-full sm:block">
              <CarouselCardSkeleton />
            </div>
            
            {/* 3er Skeleton: Oculto en móvil y tablet, visible solo en PC */}
            <div className="hidden w-full lg:block">
              <CarouselCardSkeleton />
            </div>
          </div>
        )
        
        
        /* 2. ESTADO VACÍO */
        : articles.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p>No hay recursos publicados en este momento.</p>
          </div>
        ) 
        
        /* 3. MODO GRID (Pocos artículos, no alcanza para carrusel) */
        : !isCarousel ? (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <CarouselCard key={article._id} article={article} />
            ))}
          </div>
        ) 
        
        /* 4. MODO CARRUSEL (Muchos artículos) */
        : (
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
                // style recibe un objeto JS (por eso las dobles llaves). Mover
                // la pista con translateX es lo que produce el deslizamiento.
                style={{ transform: `translateX(-${trackIndex * (100 / cardsPerView)}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {track.map((article, i) => (
                  <div
                    // Los clones repiten _id, así que añadimos el índice para que la key sea única.
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
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>

            {/* Flecha Siguiente */}  
            <button
              type="button"
              onClick={nextArticle}
              aria-label="Siguiente artículo"
              className="absolute right-0 top-1/2 z-10 hidden translate-x-2 -translate-y-1/2 rounded-full border border-gray-200 bg-surface/90 p-2 text-primary shadow-sm backdrop-blur transition hover:border-focus hover:bg-surface sm:flex sm:p-2.5 md:translate-x-4"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
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
        )}

      </div>
    </section>
  );
}