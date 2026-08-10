const ACTION_LABELS = {
  article: "Ver artículo",
  book: "Ver libro",
  thesis: "Ver tesis",
  report: "Ver informe",
  other: "Ver recurso", // Valor por defecto si es "otro"
};

export default function DocumentCard({
  id,
  title,
  description,
  category,
  imageUrl,
  author,
  typeOfComponent,
}) {
  const buttonText = ACTION_LABELS[typeOfComponent] || "Ver recurso";
  return (
    <article className="flex gap-4 border-b border-black/5 py-6">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cite-teal-dark text-white">
            {category ? category.charAt(0).toUpperCase() : "N/A"}
          </div>
        )}
        
      </div>

      <div>
        <h3 className="text-sm font-semibold text-cite-teal-dark">
          {title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cite-teal-dark/80">
          {category}
        </p> 
       <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-[#457695]"
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

  <span className="font-medium text-gray-800">Autor:</span>
  <span>{author || "Desconocido"}</span>
</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {description}
        </p>
       <a 
          href={`/articles/${id}`} 
          className="mt-4 inline-block text-cite-teal-dark hover:text-cite-teal-light"
        >
          {buttonText}
        </a>
      </div>
    </article>
  );
}