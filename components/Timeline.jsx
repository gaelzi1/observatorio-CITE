"use client";

import { useRef, useState, useEffect } from "react";

const timelineData = [
  {
    year: "2020",
    category: "Fundación",
    title: "Inicio del proyecto del Observatorio CITE",
    description: "Se establecen las bases para la creación de un espacio dedicado al análisis y seguimiento de las competencias digitales.",
    keywords: ["Competencias", "Investigación"],
  },
  {
    year: "2021",
    category: "Investigación",
    title: "Primeros estudios sobre competencias",
    description: "Se desarrollan investigaciones para identificar las principales necesidades digitales dentro del ámbito educativo.",
    keywords: ["Brecha digital", "Educación"],
  },
  {
    year: "2022",
    category: "Colaboración",
    title: "Nuevas líneas de investigación",
    description: "El observatorio amplía sus áreas de trabajo mediante nuevas líneas de análisis y colaboración institucional.",
    keywords: ["Colaboración", "Tecnología"],
  },
  {
    year: "2023",
    category: "Desarrollo",
    title: "Consolidación de la plataforma digital",
    description: "Se fortalece la presencia digital del observatorio mediante nuevas herramientas para consulta de información.",
    keywords: ["Plataforma", "Datos"],
  },
  {
    year: "2024",
    category: "Expansión",
    title: "Ampliación del repositorio",
    description: "Se incorporan nuevos contenidos, publicaciones y recursos relacionados con las competencias digitales.",
    keywords: ["Publicaciones", "Recursos"],
  },
  {
    year: "2025",
    category: "Actualización",
    title: "Nueva etapa del Observatorio",
    description: "Se inicia una nueva etapa enfocada en mejorar la accesibilidad y organización de la información para el usuario.",
    keywords: ["UX", "Accesibilidad"],
  },
  {
    year: "2026",
    category: "Innovación",
    title: "Herramientas para el análisis",
    description: "Se incorporan nuevas herramientas digitales interactivas para facilitar el análisis y visualización de información.",
    keywords: ["Innovación", "Datos"],
  },
];

export default function InstitutionalTimeline() {
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const { top, height } = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startFilling = windowHeight / 2;
      const scrolled = startFilling - top;
      
      let progress = (scrolled / height) * 100;

      const maxScroll = document.documentElement.scrollHeight - windowHeight;
      const isAtBottom = Math.ceil(window.scrollY) >= maxScroll - 50; 
      
      if (isAtBottom) {
        progress = 100;
      }

      setScrollProgress(Math.max(0, Math.min(100, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 50);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div 
            className="absolute left-[24px] top-0 w-px -translate-x-1/2 bg-primary transition-all duration-300 ease-out md:left-1/2"
            style={{ height: `${scrollProgress}%` }}
          />

          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;
            const isFilled = scrollProgress > (index / timelineData.length) * 100;
            const isLast = index === timelineData.length - 1;

            return (
              <div 
                key={`${item.year}-${index}`} 
                className={`relative flex w-full items-center ${isLast ? '' : 'mb-10 md:mb-16'}`}
              >
                
                {/* NODO CENTRAL */}
                <div className="absolute left-[24px] z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center border border-focus bg-surface md:left-1/2">
                  <div className={`h-1.5 w-1.5 bg-accent transition-opacity duration-300 ${isFilled ? 'opacity-100' : 'opacity-0'}`} />
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