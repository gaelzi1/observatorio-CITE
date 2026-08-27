const ACTION_LABELS = {
  article: "Leer artículo",
  book: "Ver libro",
  thesis: "Ver tesis",
  report: "Ver informe",
  journal_article: "Leer revista científica",
  educational_resource: "Ver recurso educativo",
  conference_paper: "Ver ponencia",
  other: "Ver recurso",
}; 

export default function DocumentCard({
  id,
  title,
  description,
  slug,
  category,
  imageUrl,
  dateOfPublication,
  author,
  typeOfComponent,
}) {
  const buttonText = ACTION_LABELS[typeOfComponent] || "Ver recurso";
  
  // 1. Creamos el formateador de la fecha
  const formattedDate = dateOfPublication
 
    ? new Date(dateOfPublication).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  
  
  return (
    <article className="flex flex-row gap-4 h-full border-b border-gray-200 py-6">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded">
        <a href={`/articles/${slug}`} className="block h-full w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-inverse">
            {category ? category.charAt(0).toUpperCase() : "N/A"}
          </div>
        )}
        </a>
      </div>

      <div>
        <a href={`/articles/${slug}`} className="underline-offset-1 hover:underline">
          <h3 className="text-sm font-semibold text-primary">
            {title}
          </h3>
        </a>
        
        {/* Agrupé la categoría y la fecha para que se vean bien juntas */}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
          <span className="uppercase tracking-[0.2em]">{category}</span>
          {formattedDate && (
            <>
            
              <span>•</span>
              <time dateTime={dateOfPublication}>{formattedDate}</time>
            </>
          )}
        </div> 

        <p className="mt-2 flex items-center gap-2 text-sm text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0zm-9 9a6 6 0 1112 0H6z"
            />
          </svg>

          <span className="font-medium text-primary">Autor:</span>
          <span>{author || "Desconocido"}</span>
        </p>
        
        <p className="mt-2 text-sm leading-relaxed text-secondary">
          {description}
        </p>
        
        <a 
          href={`/articles/${slug}`} 
          className="mt-4 inline-block text-primary transition-opacity hover:opacity-80 font-medium text-sm"
        >
          {buttonText}
        </a>
      </div>
    </article>
  );
}