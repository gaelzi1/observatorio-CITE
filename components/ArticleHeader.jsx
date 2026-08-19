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
        
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {article.category}
          </span>
        )}
        
        {/* Renderizado condicional seguro y nuevo diseño para el tipo de componente */}
        {article.typeOfComponent && (
         
          <span className="inline-block rounded-full border border-gray-200 bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted shadow-sm">
            {typeLabel}
          </span>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      {article.description && (
       
        <p className="max-w-4xl text-base leading-relaxed text-secondary sm:text-lg">
          {article.description}
        </p>
      )}

      {/* META INFO Y COMPARTIR */}
      {/* Unificado: border-gray-200 en lugar de border-neutral-100 */}
      <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-y border-gray-200 py-5 sm:flex-row">
        
        {/* Unificado: text-secondary en lugar de text-neutral-600 */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-secondary">
          
          {articleAuthor && (
          
            <span className="font-medium text-primary">
              {articleAuthor}
            </span>
          )}

          {articleAuthor && (dateLabel || readingMinutes) && (
           
            <span className="hidden text-gray-300 sm:inline">•</span>
          )}

          <div className="flex items-center gap-2">
            {dateLabel && <time>{dateLabel}</time>}
            
            {dateLabel && readingMinutes && (
      
              <span className="text-gray-300">•</span>
            )}
            
            {readingMinutes && <span>{readingMinutes} min de lectura</span>}
          </div>
        </div>

       
        <ShareButtons title={article.title} />
      </div>
    </header>
  );
}