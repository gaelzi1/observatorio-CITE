const ArticleSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full animate-pulse mb-8">
      {/* Contenedor de la imagen */}
      <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-md shrink-0"></div>

      {/* Contenedor del contenido */}
      <div className="flex flex-col w-full space-y-3 py-1">
        {/* Título (2 líneas simuladas) */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Categoría */}
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        
        {/* Autor (Icono + Texto) */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Extracto / Descripción */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Link de acción */}
        <div className="h-4 bg-gray-200 rounded w-24 mt-2"></div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;