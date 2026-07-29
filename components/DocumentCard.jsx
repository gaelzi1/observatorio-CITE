export default function DocumentCard({
  id,
  titulo,
  descripcion,
  categoria,
  imageUrl,
  autor,
}) {
  return (
    <article className="flex gap-4 border-b border-black/5 py-6">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cite-teal-dark text-white">
            {categoria ? categoria.charAt(0).toUpperCase() : "N/A"}
          </div>
        )}
        
      </div>

      <div>
        <h3 className="text-sm font-semibold text-cite-teal-dark">
          {titulo}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cite-teal-dark/80">
          {categoria}
        </p> 
        <p className="mt-2 text-sm leading-relaxed text-">
          {autor ? `Autor: ${autor}` : "Autor desconocido"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {descripcion}
        </p>
        <a href={`/articles/${id}`} className="mt-4 inline-block text-cite-teal-dark hover:text-cite-teal-light">
          Ver artículo
        </a>
      </div>
    </article>
  );
}