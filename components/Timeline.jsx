"use client";

import { useRef, useState, useEffect } from "react";



// =============================================================================
// Timeline — Línea de tiempo institucional con progreso al hacer scroll
// -----------------------------------------------------------------------------
// 1. Pide los eventos a /api/timeline.
// 2. Al hacer scroll, una línea de color crece y va "encendiendo" cada punto
//    (nodo) cuando la punta de la línea pasa por su centro.
// Client Component: necesita fetch en el navegador, eventos de scroll y
// medir posiciones reales de los elementos en pantalla.
// =============================================================================
export default function InstitutionalTimeline() {
  // Referencia al contenedor para medir su posición y altura.
  const timelineRef = useRef(null);
  const [timelineData, setTimelineData] = useState([]);
  // Un arreglo de referencias: una por cada nodo (punto) de la línea.
  const nodeRefs = useRef([]);
  // La línea de progreso se mueve escribiendo su estilo directamente (sin
  // estado de React) para no volver a pintar toda la lista en cada cuadro.
  const lineRef = useRef(null);
  const [filledCount, setFilledCount] = useState(0); // puntos que la línea ya alcanzó

  useEffect(() => {
    async function fetchTimelineData() {
      try {
        const res = await fetch("/api/timeline");
        if (!res.ok) throw new Error("Error al cargar la línea de tiempo");
        const data = await res.json();
        setTimelineData(data.data || []);
      } catch (error) {
        console.error("Error al cargar la línea de tiempo:", error);
      }
    }
    fetchTimelineData();
  }, []);

  // La línea avanza con el scroll y cada punto se marca justo cuando la punta
  // de la línea llega a su centro. Se engancha cuando ya hay datos: antes el
  // contenedor mide 0px.
  //
  // Cómo se calcula (sin cambios bruscos de velocidad):
  //   - start: scroll en el que el inicio de la línea toca la mitad de la pantalla.
  //   - end:   scroll en el que el final la toca, o el final de la página si
  //            antes se acaba el scroll.
  //   - progreso = (scroll - start) / (end - start), siempre lineal.
  // Así la punta va pegada a la mitad de la pantalla y, si la página es corta,
  // la línea avanza un poco más rápido pero PAREJO de principio a fin.
  // Además, la punta "persigue" su objetivo con una suavización para que los
  // saltos de la rueda del mouse no se vean a tirones.
  useEffect(() => {
    if (timelineData.length === 0) return;
    const container = timelineRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SMOOTHING_MS = 90; // menor = sigue al scroll más pegado

    let frame = 0;
    let lastTime = 0;
    let shown = null; // px que mide la línea ahora mismo (null = primer cálculo)
    let lastCount = -1;
    let nodeCenters = []; // centro de cada punto, en px desde el inicio de la línea

    // Las posiciones de los puntos no dependen del scroll: sólo se miden al
    // inicio y cuando cambia el tamaño del contenedor.
    const measureNodes = () => {
      const boxTop = container.getBoundingClientRect().top;
      nodeCenters = nodeRefs.current
        .filter(Boolean)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return rect.top + rect.height / 2 - boxTop;
        });
    };

    // Altura que DEBERÍA tener la línea según el scroll actual.
    const getTarget = () => {
      const { top, height } = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const lineTop = top + scrollY; // posición absoluta en la página

      const start = lineTop - vh / 2;
      const end = Math.min(lineTop + height - vh / 2, maxScroll);
      const progress = end > start ? (scrollY - start) / (end - start) : 1;
      return { target: Math.max(0, Math.min(1, progress)) * height, height };
    };

    const tick = (time) => {
      frame = 0;
      const { target, height } = getTarget();

      if (shown === null || reduceMotion) {
        shown = target;
      } else {
        // Suavizado basado en el tiempo (igual en pantallas de 60 o 120 Hz).
        const dt = lastTime ? Math.min(64, time - lastTime) : 16;
        shown += (target - shown) * (1 - Math.exp(-dt / SMOOTHING_MS));
        if (Math.abs(target - shown) < 0.5) shown = target;
      }
      lastTime = time;

      // scaleY es más barato para el navegador que cambiar `height`.
      line.style.transform = `translateX(-50%) scaleY(${height ? shown / height : 0})`;

      // Sólo avisamos a React cuando cambia la cantidad de puntos encendidos.
      const count = nodeCenters.filter((center) => shown >= center).length;
      if (count !== lastCount) {
        lastCount = count;
        setFilledCount(count);
      }

      // Seguimos animando hasta alcanzar el objetivo.
      if (shown !== target) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };

    // Un cálculo por cuadro como máximo
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // ResizeObserver detecta cambios de tamaño del contenedor (ventana,
    // fuentes que terminan de cargar, textos que cambian de línea...).
    const resizeObserver = new ResizeObserver(() => {
      measureNodes();
      schedule();
    });
    resizeObserver.observe(container);

    measureNodes();
    tick(performance.now()); // cálculo inicial sin esperar a que el usuario haga scroll
    // passive: true le dice al navegador que no llamaremos preventDefault,
    // lo que permite un scroll más fluido.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [timelineData]);

  return (
    <section className="overflow-hidden py-12 md:py-8">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        
        {/* HEADER */}
        <div className="mb-16 text-center md:mb-20">
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-medium tracking-tight text-primary md:text-4xl">
            Evolución del Observatorio
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm text-secondary md:text-base opacity-80">
            Un recorrido por los principales acontecimientos que han marcado el desarrollo y consolidación de nuestra institución.
          </p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative mx-auto max-w-4xl" ref={timelineRef}>
          
          {/* LÍNEA GRIS DE FONDO */}
          <div className="absolute bottom-0 left-[24px] top-0 w-px -translate-x-1/2 bg-gray-200 md:left-1/2" />
          
          {/* LÍNEA DE PROGRESO */}
          {/* Mide lo mismo que la gris y se "encoge" con scaleY desde arriba
              (origin-top). El translateX va en el style porque el efecto
              sobrescribe `transform` completo. */}
          <div
            ref={lineRef}
            className="absolute bottom-0 left-[24px] top-0 w-px origin-top bg-primary will-change-transform md:left-1/2"
            style={{ transform: "translateX(-50%) scaleY(0)" }}
          />

          {timelineData.map((item, index) => {
            // En escritorio los eventos alternan lado: pares a la izquierda, impares a la derecha.
            const isEven = index % 2 === 0;
            const isFilled = index < filledCount;
            const isLast = index === timelineData.length - 1;

            return (
              <div 
                key={`${item.year}-${index}`} 
                className={`relative flex w-full items-center ${isLast ? '' : 'mb-10 md:mb-16'}`}
              >
                
                {/* NODO CENTRAL */}
                {/* "Callback ref": React llama a esta función con el elemento
                    del DOM y lo guardamos en la posición `index` del arreglo. */}
                <div
                  ref={(el) => (nodeRefs.current[index] = el)}
                  className={`absolute left-[24px] z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center border bg-surface transition-colors duration-200 md:left-1/2 ${
                    isFilled ? "border-primary" : "border-focus"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 bg-accent transition-all duration-200 ease-out ${
                      isFilled ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </div>

                {/* CAJA DE CONTENIDO */}
                <div 
                  className={`w-full rounded-xl pl-[56px] md:w-1/2 md:pl-0 ${
                    isEven ? "md:pr-14" : "md:ml-auto md:pl-14"
                  }`}
                >
                  <article className="group relative rounded-sm border border-gray-200 bg-surface p-6 shadow-sm transition-colors duration-300 hover:border-focus">
                    
                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-success">
                        {item.category}
                      </span>
                      <span className="text-sm font-light text-muted md:hidden">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-primary md:text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-secondary">
                      {item.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
                      {item.keywords.map((keyword) => (
                        <span key={keyword} className="text-[11px] uppercase tracking-wider text-muted">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>

                {/* AÑO FLOTANTE */}
                <div 
                  className={`absolute top-1/2 hidden -translate-y-1/2 md:block ${
                    isEven ? "left-[calc(50%+3.5rem)]" : "right-[calc(50%+3.5rem)]"
                  }`}
                >
                  <span className="text-4xl font-light transition-colors duration-500 group-hover:text-muted">
                    {item.year}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}