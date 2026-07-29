export default function ArticleDetailSkeleton() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-6 py-10">

      {/* Botón volver */}
      <div className="mb-8 h-5 w-32 rounded bg-neutral-200" />

      {/* Hero */}
      <div className="grid gap-10 md:grid-cols-2 md:items-center">

        {/* Información */}
        <div>
          <div className="h-7 w-28 rounded-full bg-neutral-200" />

          <div className="mt-5 space-y-3">
            <div className="h-10 w-full rounded bg-neutral-200" />
            <div className="h-10 w-3/4 rounded bg-neutral-200" />
          </div>

          <div className="mt-6 space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-11/12 rounded bg-neutral-200" />
            <div className="h-4 w-4/5 rounded bg-neutral-200" />
          </div>

          <div className="mt-6 h-4 w-48 rounded bg-neutral-200" />
        </div>

        {/* Imagen */}
        <div className="min-h-[300px] rounded-lg bg-neutral-200" />
      </div>

      {/* Contenido */}
      <div className="mt-14 grid gap-10 md:grid-cols-[180px_1fr]">

        {/* Sidebar */}
        <aside>
          <div className="hidden h-32 rounded-lg bg-neutral-200 md:block" />

          <div className="mt-6 h-4 w-24 rounded bg-neutral-200" />

          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-9 w-9 rounded-full bg-neutral-200"
              />
            ))}
          </div>
        </aside>

        {/* Texto */}
        <article className="space-y-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-full rounded bg-neutral-200" />
              <div className="h-4 w-11/12 rounded bg-neutral-200" />
              <div className="h-4 w-4/5 rounded bg-neutral-200" />
            </div>
          ))}
        </article>

      </div>

    </main>
  );
}