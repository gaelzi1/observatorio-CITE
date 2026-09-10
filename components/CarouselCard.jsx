const TYPE_LABELS = {
  article: "ARTÍCULO",
  journal_article: "REVISTA CIENTÍFICA",
  book: "LIBRO",
  thesis: "TESIS",
  report: "INFORME",
  conference_paper: "PONENCIA",
  educational_resource: "RECURSO EDUCATIVO",
  other: "RECURSO",
};

export default function CarouselCard({ article }) {
  if (!article) return null;

  const tipo = TYPE_LABELS[article.typeOfComponent] || "RECURSO";
  const categoria = article.category ? article.category.toUpperCase() : "GENERAL";

  return (
    <a
      href={`/articles/${article.slug}`}
      className="group relative flex h-[320px] w-full flex-col overflow-hidden rounded-xl border border-gray-200 transition-shadow duration-300 hover:shadow-lg sm:h-[360px]"
    >
      {/* 1. IMAGEN DE FONDO */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
       
        <div className="absolute inset-0 flex items-center justify-center bg-primary text-6xl font-bold text-inverse">
          {categoria.charAt(0)}
        </div>
      )}

      {/* 2. GRADIENTE DE LECTURA */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/90 to-transparent transition-opacity duration-300 group-hover:via-white" />

      {/* 3. METADATOS Y TÍTULO */}
      <div className="relative z-10 mt-auto flex flex-col p-5 sm:p-6">
        {/* Unificado: text-muted en lugar de text-gray-800 para los metadatos */}
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted">
          {tipo} <span className="mx-1 text-gray-400">|</span> {categoria}
        </p>

        {/* Unificado: text-primary en lugar de text-black para darle peso al título con el color de la marca */}
        <h3 className="line-clamp-3 text-lg font-medium leading-snug text-primary sm:text-xl">
          {article.title}
        </h3>
      </div>
    </a>
  );
}