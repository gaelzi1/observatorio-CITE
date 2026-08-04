export default function ArticleDetailSkeleton() {
  return (
    // Contenedor principal con padding adaptativo (móvil, tablet, desktop)
    <main className="mx-auto max-w-5xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      
     {/* VOLVER AL INICIO: Centrado en móvil, a la izquierda en MD */}
<div className="mb-10 flex justify-center md:justify-start">
  <div className="h-5 w-32 rounded bg-neutral-200" />
</div>

{/* TÍTULO (h1): Centrado con flex y alturas responsivas (text-3xl -> sm:text-4xl -> lg:text-5xl) */}
<div className="flex w-full flex-col items-center justify-center space-y-3 sm:space-y-4">
  <div className="h-8 w-full max-w-3xl rounded bg-neutral-200 sm:h-10 lg:h-12" />
  <div className="h-8 w-4/5 max-w-2xl rounded bg-neutral-200 sm:h-10 lg:h-12" />
</div>

{/* HEADER DEL ARTÍCULO (Centrado) */}
<header className="mb-10 flex flex-col items-center text-center">
  
  {/* Categoría (Respetando el m-5 que le pusiste) */}
  <div className="m-5 h-6 w-24 rounded-full bg-neutral-200" />

  {/* Descripción: Ancho máximo controlado (max-w-2xl) y altura responsiva */}
  <div className="mt-6 w-full max-w-2xl space-y-2">
    <div className="h-4 w-full rounded bg-neutral-200 sm:h-5" />
    <div className="mx-auto h-4 w-5/6 rounded bg-neutral-200 sm:h-5" />
  </div>
  


        {/* Título: Altura variable según la pantalla para emular text-3xl a lg:text-5xl */}
        <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
          <div className="h-8 w-full rounded bg-neutral-200 sm:h-10 lg:h-12" />
          <div className="mx-auto h-8 w-4/5 rounded bg-neutral-200 sm:h-10 lg:h-12" />
        </div>

        {/* Descripción: Ocultamos la segunda línea en móviles muy pequeños si queremos, o ajustamos altura */}
        <div className="mt-6 w-full max-w-2xl space-y-2">
          <div className="h-4 w-full rounded bg-neutral-200 sm:h-5" />
          <div className="mx-auto h-4 w-5/6 rounded bg-neutral-200 sm:h-5" />
        </div>

        {/* META INFO Y COMPARTIR: Apilado en móvil (flex-col), fila en SM (sm:flex-row) */}
        <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-y border-neutral-100 py-5 sm:flex-row">
          
          {/* Autor y Fecha: Centrado y permitiendo salto de línea (flex-wrap) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="h-5 w-24 rounded bg-neutral-200 sm:w-28" />
            {/* Punto separador: oculto en móvil, visible en SM */}
            <div className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
            <div className="h-5 w-28 rounded bg-neutral-200 sm:w-32" />
          </div>

          {/* Botones de compartir */}
          <div className="flex items-center gap-2">
            <div className="mr-2 hidden h-4 w-16 rounded bg-neutral-200 sm:block" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-8 shrink-0 rounded-full bg-neutral-200"
              />
            ))}
          </div>
        </div>
      </header>

      {/* IMAGEN PRINCIPAL: Mantiene la proporción en cualquier pantalla */}
      <div className="mb-12 aspect-[16/9] w-full rounded-2xl bg-neutral-200" />

      {/* CUERPO DEL ARTÍCULO: Párrafos responsivos usando anchos relativos (%) */}
      <article className="mx-auto max-w-none space-y-6 sm:space-y-8">
        {Array.from({ length: 4 }).map((_, blockIndex) => (
          <div key={blockIndex} className="space-y-2 sm:space-y-3">
            <div className="h-4 w-full rounded bg-neutral-200 sm:h-5" />
            <div className="h-4 w-full rounded bg-neutral-200 sm:h-5" />
            <div className="h-4 w-11/12 rounded bg-neutral-200 sm:h-5" />
            <div className="h-4 w-4/5 rounded bg-neutral-200 sm:h-5" />
          </div>
        ))}
      </article>

    </main>
  );
}