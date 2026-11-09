// =============================================================================
// Library — Biblioteca pública con buscador, filtros y paginación
// -----------------------------------------------------------------------------
// Este componente es el "padre" que guarda TODO el estado (búsqueda, filtros,
// página, resultados). Sus hijos (LibraryFilters, LibraryPagination,
// DocumentCard) sólo reciben valores y funciones por props.
//
// Flujo: el usuario cambia un filtro → se actualiza el estado → el useEffect
// detecta el cambio → pide los datos a /api/articles → se pintan resultados.
// =============================================================================

"use client";

import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
  import LibraryFilters from "./LibraryFilters";
import LibraryPagination from "./LibraryPagination";

// Resultados por página.
const LIMIT = 6;

// Opciones del filtro "Tipo de recurso". id "" significa "sin filtro".
const CONTENT_TYPES = [
  { id: "", label: "Todos los recursos" },
  { id: "article", label: "Artículos" },
  { id: "book", label: "Libros" },
  { id: "thesis", label: "Tesis" },
  { id: "report", label: "Informes" },
  { id: "journal_article", label: "Revistas Científicas" },
  { id: "educational_resource", label: "Recursos Educativos" },
  { id: "conference_paper", label: "Ponencias" },
  { id: "other", label: "Otros" },
];

export default function Library() {
  // Dos estados para la búsqueda:
  //   query  → lo que se va escribiendo en el input (cambia con cada tecla).
  //   search → lo que realmente se busca (sólo cambia al pulsar Buscar/Enter).
  // Así no se hace una petición a la API por cada letra escrita.
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");

  const [categories, setCategories] = useState([]);
  const [author, setAuthor] = useState("");
  // (Nota: `authors` nunca se llena con setAuthors; se pasa a LibraryFilters
  // pero allí no se usa. Se puede eliminar o implementar más adelante.)
  const [authors, setAuthors] = useState([]);
  const [year, setYear] = useState("");

  const [documentos, setDocumentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");

  // Efecto 1: carga las categorías UNA vez al montar (dependencias []).
  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch(`/api/categories`);
        if (!res.ok) throw new Error("Error cargando categorías");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("No se pudieron cargar los filtros", err);
      }
    }
    loadFilters();
  }, []);

  // Efecto 2: carga los artículos cada vez que cambia algún filtro o la
  // página (ver el arreglo de dependencias al final del efecto).
  useEffect(() => {
    // AbortController permite CANCELAR una petición en curso. Si el usuario
    // cambia de filtro rápido, la limpieza del efecto aborta la petición
    // anterior para que una respuesta vieja no pise a la nueva.
    const controller = new AbortController();

    async function loadArticles() {
      setLoading(true);
      setError(null);

      try {
        // URLSearchParams arma el texto "?page=1&limit=6&sort=recent..." de
        // forma segura (escapa espacios y caracteres especiales).
        const params = new URLSearchParams({ page: currentPage, limit: LIMIT, sort });

        if (search) params.set("q", search);
        if (category) params.set("category", category);
        if (author) params.set("author", author);
        if (year) params.set("year", year);
        if (typeFilter) {
          params.set("typeOfComponent", typeFilter);
        }

        const res = await fetch(`/api/articles?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Error de red");

        const data = await res.json();
        setDocumentos(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        // Una petición cancelada a propósito no es un error real.
        if (err.name !== "AbortError") {
          setError("No se pudo cargar la biblioteca. Verifica la conexión a MongoDB.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
    return () => controller.abort();
  }, [search, category, author, sort, year, typeFilter, currentPage]);

  // Manejadores: cada cambio de filtro regresa a la página 1, porque la
  // página actual podría no existir con los nuevos resultados.
  const handleSearch = () => { setCurrentPage(1); setSearch(query.trim()); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const handleCategoryChange = (val) => { setCategory(val); setCurrentPage(1); };
  const handleAuthorChange = (val) => { setAuthor(val); setCurrentPage(1); };
  const handleSortChange = (val) => { setSort(val); setCurrentPage(1); };
  const handleYearChange = (val) => { setYear(val); setCurrentPage(1); };
  const handleTypeChange = (val) => { setTypeFilter(val); setCurrentPage(1); };

  const clearFilters = () => {
    setQuery(""); setSearch(""); setCategory(""); setAuthor(""); setYear(""); setSort("recent"); setTypeFilter(""); setCurrentPage(1);
  };

  const hasActiveFilters = search || category || author || year || typeFilter || sort !== "recent";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-6 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:mb-8 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wide text-primary sm:text-2xl">
          Biblioteca
        </h2>

        <div className="flex w-full overflow-hidden rounded-md   bg-surface shadow-sm md:max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu búsqueda"
            className="
              min-w-0
              flex-1
              px-3
              py-2.5
              text-sm
              outline-none
              placeholder:text-muted
              sm:px-4
              bg-transparent
            "
          />

          <button
            type="button"
            onClick={handleSearch}
            className="
              shrink-0
              bg-primary
              px-3
              py-2.5
              text-sm
              font-medium
              text-inverse
              transition-opacity
              hover:opacity-90
              sm:px-5
            "
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="mb-6 w-full sm:mb-8">
        {/* Pasamos a los filtros los valores actuales y las funciones para
            cambiarlos. El hijo no modifica el estado directamente: llama a
            estas funciones y el padre decide. */}
        <LibraryFilters
          author={author}
          authors={authors}
          handleAuthorChange={handleAuthorChange}
          typeFilter={typeFilter}
          resourceTypes={CONTENT_TYPES}
          handleTypeChange={handleTypeChange}
          category={category}
          categories={categories}
          handleCategoryChange={handleCategoryChange}
          sort={sort}
          handleSortChange={handleSortChange}
          year={year}
          handleYearChange={handleYearChange}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
      </div>

      <div className="w-full">
        {/* Cuatro estados posibles, cada uno con su condición:
            cargando · error · sin resultados · con resultados. */}
        {loading && (
          <div className="flex w-full items-center justify-center py-12">
            <p className="text-sm text-muted">
              Cargando artículos...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex w-full items-center justify-center py-12">
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && documentos.length === 0 && (
          <div className="flex w-full items-center justify-center py-12">
            <p className="text-center text-sm text-muted">
              No se encontraron artículos para tu búsqueda.
            </p>
          </div>
        )}

        {!loading && !error && documentos.length > 0 && (
        
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-2 lg:gap-8 xl:gap-10">
            {documentos.map((article) => (
              <div
                key={article._id}
                className="min-w-0 h-full   "
              >
                <DocumentCard
                  id={article._id}
                  slug={article.slug}
                  title={article.title}
                  author={article.author || article.autor}
                  description={article.description}
                  category={article.category}
                  dateOfPublication={article.dateOfPublication}
                  imageUrl={article.imageUrl}
                  typeOfComponent={article.typeOfComponent}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex w-full justify-center sm:mt-10 lg:mt-12">
            <div className="max-w-full overflow-x-auto px-1">
              <LibraryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}