export default function CarouselCardSkeleton() {
  return (
    <div className="relative flex h-[320px] w-full animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 sm:h-[360px]">
      {/* 1. IMAGEN DE FONDO (Skeleton) */}
      <div className="absolute inset-0 h-full w-full bg-gray-200" />

      {/* 2. GRADIENTE DE LECTURA (Se mantiene igual para conservar el diseño) */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/90 to-transparent" />

      {/* 3. METADATOS Y TÍTULO (Skeleton) */}
      <div className="relative z-10 mt-auto flex flex-col p-5 sm:p-6">
        {/* Skeleton para Tipo | Categoría */}
        <div className="mb-4 h-3 w-5/12 rounded bg-gray-300" />

        {/* Skeleton para el Título (simulando 3 líneas del line-clamp) */}
        <div className="flex flex-col gap-2.5">
          <div className="h-5 w-full rounded bg-gray-300" />
          <div className="h-5 w-11/12 rounded bg-gray-300" />
          <div className="h-5 w-4/5 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}