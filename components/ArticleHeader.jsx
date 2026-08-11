import ShareButtons from "./ShareButtons";

// 1. DICCIONARIO DE TRADUCCIÓN
// Convierte los valores en inglés de la base de datos a español para la interfaz
const TYPE_LABELS = {
  article: "Artículo",
  book: "Libro",
  thesis: "Tesis",
  report: "Informe",
  journal_article: "Artículo de revista",
  educational_resource: "Recurso educativo",
  conference_paper: "Ponencia de conferencia",
  other: "Otro",
};

export default function ArticleHeader({
  article,
  articleAuthor,
  dateLabel,
  readingMinutes,
}) {
  // Obtenemos la etiqueta en español (si no existe en el diccionario, usa el valor original)
  const typeLabel = TYPE_LABELS[article.typeOfComponent] || article.typeOfComponent;

  return (
    <header className="mb-10 mt-6 flex flex-col items-center text-center">
      
      {/* 2. CONTENEDOR DE ETIQUETAS (Categoría + Tipo) */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {article.category && (
          <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {article.category}
          </span>
        )}
        
        {/* Renderizado condicional seguro y nuevo diseño para el tipo de componente */}
        {article.typeOfComponent && (
          <span className="inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 shadow-sm">
            {typeLabel}
          </span>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      {article.description && (
        <p className="max-w-4xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          {article.description}
        </p>
      )}

      {/* META INFO Y COMPARTIR */}
      <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-y border-neutral-100 py-5 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-neutral-600">
          
          {articleAuthor && (
            <span className="font-medium text-neutral-900">
              {articleAuthor}
            </span>
          )}

          {articleAuthor && (dateLabel || readingMinutes) && (
            <span className="hidden text-neutral-300 sm:inline">•</span>
          )}

          <div className="flex items-center gap-2">
            {dateLabel && <time>{dateLabel}</time>}
            
            {dateLabel && readingMinutes && (
              <span className="text-neutral-300">•</span>
            )}
            
            {readingMinutes && <span>{readingMinutes} min de lectura</span>}
          </div>
        </div>

        {/* COMPONENTES DE COMPARTIR */}
        <ShareButtons title={article.title} />
      </div>
    </header>
  );
}