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
        <label htmlFor="author-filter" className="text-xs font-medium text-neutral-500">
          Autor
        </label>
        <input
          id="author-filter"
          type="text"
          list="authors-datalist"
          value={author}
          onChange={(e) => handleAuthorChange(e.target.value)}
          placeholder="Buscar autor..."
          className="w-48 shrink-0 rounded border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors focus:border-cite-teal-dark"
        />
        <datalist id="authors-datalist">
          {authors.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
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