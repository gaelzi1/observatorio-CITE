// =============================================================================
// LibraryFilters — Controles de filtrado de la biblioteca
// -----------------------------------------------------------------------------
// No tiene "use client" pero usa hooks. Funciona porque sólo lo importa
// Library.jsx, que sí es de cliente: todo lo que importa un Client Component
// también se ejecuta en el cliente. (Agregar "use client" aquí lo haría más
// explícito y evitaría errores si algún día lo importa un Server Component.)
//
// Casi todo el estado vive en el padre (Library). Este componente recibe los
// valores actuales y las funciones handleXxxChange para avisar de cambios.
// =============================================================================

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

// "Chip" (etiqueta) de un filtro activo con una X para quitarlo.
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar filtro ${label}`}
        className="text-primary/60 transition-colors hover:text-accent"
      >
        <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </span>
  );
}

export default function LibraryFilters({
  author,
  authors,
  handleAuthorChange,
  typeFilter,
  resourceTypes,
  handleTypeChange,
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
  // Estado LOCAL para el input de autor: guarda lo que se va escribiendo y sólo
  // se manda al padre al pulsar Enter o el botón (igual que el buscador).
  const [localAuthor, setLocalAuthor] = useState(author || "");

  // Si el padre cambia `author` (p. ej. al "Limpiar filtros"), sincronizamos
  // el input local para que también se vacíe.
  useEffect(() => {
    setLocalAuthor(author || "");
  }, [author]);

  // (Esta lista no cambia; podría declararse fuera del componente para no
  // recrearla en cada render, aunque el efecto en rendimiento es mínimo.)
  const SORT_OPTIONS = [
    { value: "recent", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "title_asc", label: "Título A-Z" },
    { value: "title_desc", label: "Título Z-A" },
  ];

  // Etiquetas legibles para los chips. `.find()` devuelve el primer elemento
  // que cumple la condición; `?.` evita error si no encuentra nada.
  const currentTypeLabel =
    resourceTypes?.find((t) => t.id === typeFilter)?.label || typeFilter;
  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sort)?.label || sort;

  return (
    <div className="flex w-full flex-col gap-5 pt-2">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end lg:gap-3">

        <div className="flex min-w-0 flex-col gap-1 sm:col-span-2 lg:w-auto">
          <label
            htmlFor="author-filter"
            className="text-xs font-medium text-muted"
          >
            Autor
          </label>

          <div className="flex w-full items-stretch gap-2 lg:w-auto">
            <input
              id="author-filter"
              type="text"
              value={localAuthor}
              onChange={(e) => setLocalAuthor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAuthorChange(localAuthor.trim());
                }
              }}
              placeholder="Buscar por autor..."
              className="
                min-w-0
                flex-1
                rounded
                border
                border-gray-200
                bg-surface
                px-3
                py-2
                text-sm
                text-secondary
                outline-none
                transition-colors
                focus:border-focus
                sm:py-1.5
                lg:w-40
                lg:flex-none
              "
            />

            <button
              type="button"
              onClick={() => handleAuthorChange(localAuthor.trim())}
              aria-label="Buscar autor"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-1
                rounded
                border
                border-primary
                bg-primary
                px-3
                py-2
                text-xs
                font-medium
                text-inverse
                transition-opacity
                hover:opacity-90
                sm:py-1.5
              "
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="type-filter"
            className="text-xs font-medium text-muted"
          >
            Tipo de recurso
          </label>

          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-200
              bg-surface
              px-3
              py-2
              text-sm
              text-secondary
              outline-none
              transition-colors
              focus:border-focus
              sm:py-1.5
              lg:w-auto
            "
          >
            {resourceTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="category-filter"
            className="text-xs font-medium text-muted"
          >
            Categoría
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-200
              bg-surface
              px-3
              py-2
              text-sm
              text-secondary
              outline-none
              transition-colors
              focus:border-focus
              sm:py-1.5
              lg:w-auto
            "
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="year-filter"
            className="text-xs font-medium text-muted"
          >
            Año
          </label>

          <select
            id="year-filter"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-200
              bg-surface
              px-3
              py-2
              text-sm
              text-secondary
              outline-none
              transition-colors
              focus:border-focus
              sm:py-1.5
              lg:w-auto
            "
          >
            <option value="">Todos</option>
            {/* Genera los últimos 15 años: [2026, 2025, 2024, ...]. */}
            {Array.from(
              { length: 15 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden h-9 w-px self-end bg-gray-200 lg:block" />

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="order-filter"
            className="text-xs font-medium text-muted"
          >
            Ordenar por
          </label>

          <select
            id="order-filter"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="
              w-full
              rounded
              border
              border-gray-200
              bg-surface
              px-3
              py-2
              text-sm
              text-secondary
              outline-none
              transition-colors
              focus:border-focus
              sm:py-1.5
              lg:w-auto
            "
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end sm:col-span-2 lg:ml-auto">
            <button
              type="button"
              onClick={clearFilters}
              className="
                text-xs
                font-medium
                text-muted
                underline-offset-2
                transition-colors
                hover:text-accent
                hover:underline
              "
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Resumen de filtros aplicados; cada chip quita su filtro al pulsar la X. */}
      {hasActiveFilters && (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="shrink-0 text-xs font-medium text-muted">
            Filtros aplicados:
          </span>

          <div className="flex flex-wrap gap-2">
            {author && (
              <Chip
                label={`Autor: ${author}`}
                onRemove={() => handleAuthorChange("")}
              />
            )}

            {typeFilter && (
              <Chip
                label={`Recurso: ${currentTypeLabel}`}
                onRemove={() => handleTypeChange("")}
              />
            )}

            {category && (
              <Chip
                label={`Categoría: ${category}`}
                onRemove={() => handleCategoryChange("")}
              />
            )}

            {year && (
              <Chip
                label={`Año: ${year}`}
                onRemove={() => handleYearChange("")}
              />
            )}

            {sort !== "recent" && (
              <Chip
                label={`Orden: ${currentSortLabel}`}
                onRemove={() => handleSortChange("recent")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}