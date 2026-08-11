import { useEffect, useState } from "react";

export default function LibraryFilters({
  author,
  authors,
  handleAuthorChange,
  category,
  categories,
  handleCategoryChange,
  sort,
  handleSortChange,
  year,
  handleYearChange,
  hasActiveFilters,
  clearFilters,
}) {
  const [authorInput, setAuthorInput] = useState(author || "");

  useEffect(() => {
    setAuthorInput(author || "");
  }, [author]);

  const handleAuthorSearch = () => {
    handleAuthorChange(authorInput.trim());
  };
  const [localAuthor, setLocalAuthor] = useState(author || "");

  const SORT_OPTIONS = [
    { value: "recent", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "title_asc", label: "Título A-Z" },
    { value: "title_desc", label: "Título Z-A" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
      {/* AUTOR */}
   <div className="flex items-center gap-2">
  {/* INPUT TEMPORAL */}
  <input
    type="text"
    value={localAuthor}
    onChange={(e) => setLocalAuthor(e.target.value)} // Solo guarda el texto
    onKeyDown={(e) => {
      // Opcional: También buscar si presionan la tecla Enter
      if (e.key === "Enter") {
        handleAuthorChange(localAuthor.trim());
      }
    }}
    placeholder="Buscar autor..."
    className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
  />

  {/* TU BOTÓN DE BÚSQUEDA */}
  <button
    type="button"
    // AQUÍ SE DISPARA LA BÚSQUEDA REAL
    onClick={() => handleAuthorChange(localAuthor.trim())} 
    aria-label="Buscar autor"
    className="inline-flex shrink-0 items-center gap-1 rounded border border-cite-teal-dark bg-cite-teal-dark px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cite-teal-dark/90"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  </button>
</div>

      {/* CATEGORÍA */}
      <div className="flex items-center gap-2">
        <label htmlFor="category-filter" className="text-xs font-medium text-neutral-500">
          Categoría
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors focus:border-cite-teal-dark"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ORDENAR POR */}
      <div className="flex items-center gap-2">
        <label htmlFor="order-filter" className="text-xs font-medium text-neutral-500">
          Ordenar por
        </label>
        <select
          id="order-filter"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors focus:border-cite-teal-dark"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* AÑO */}
      <div className="flex items-center gap-2">
        <label htmlFor="year-filter" className="text-xs font-medium text-neutral-500">
          Año
        </label>
        <select
          id="year-filter"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className="rounded border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors focus:border-cite-teal-dark"
        >
          <option value="">Todos</option>
          {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* LIMPIAR FILTROS */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="ml-auto text-xs font-medium text-neutral-500 underline-offset-2 transition-colors hover:text-cite-coral hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}