"use client";

import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import LibraryFilters from "./LibraryFilters";
import LibraryPagination from "./LibraryPagination";

const LIMIT = 6;

export default function Library() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [categories, setCategories] = useState([]);
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [year, setYear] = useState("");

  const [documentos, setDocumentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");

  // Cargar Categorías (y Autores si tienes el endpoint)
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

  // Cargar Artículos
  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ page: currentPage, limit: LIMIT, sort });

        if (search) params.set("q", search);
        if (category) params.set("category", category); // <-- Error de sintaxis corregido aquí
        if (author) params.set("author", author);
        if (year) params.set("year", year);

        const res = await fetch(`/api/articles?${params.toString()}`, {
          signal: controller.signal,
        });
        if (typeFilter) params.set("typeOfComponent", typeFilter);

        if (!res.ok) throw new Error("Error de red");

        const data = await res.json();
        setDocumentos(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("No se pudo cargar la biblioteca. Verifica la conexión a MongoDB.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
    return () => controller.abort();
  }, [search, category, author, sort, year, currentPage]);

  // Manejadores
  const handleSearch = () => { setCurrentPage(1); setSearch(query.trim()); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const handleCategoryChange = (val) => { setCategory(val); setCurrentPage(1); };
  const handleAuthorChange = (val) => { setAuthor(val); setCurrentPage(1); };
  const handleSortChange = (val) => { setSort(val); setCurrentPage(1); };
  const handleYearChange = (val) => { setYear(val); setCurrentPage(1); };
  
  const clearFilters = () => {
    setQuery(""); setSearch(""); setCategory(""); setAuthor(""); setYear(""); setSort("recent"); setCurrentPage(1);
  };

  const hasActiveFilters = search || category || author || year || sort !== "recent";

  const CONTENT_TYPES = [
    { id: "", label: "Todos los recursos" },
    { id: "article", label: "Artículos" },
    { id: "book", label: "Libros" },
    { id: "thesis", label: "Tesis" },
    { id: "report", label: "Informes" },
    { id: "other", label: "Otros" },
  ];


  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      
      {/* =========================================
          CABECERA SUPERIOR (TÍTULO Y BUSCADOR)
          ========================================= */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-black/5 pb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-cite-teal-dark">
          Biblioteca
        </h2>
        
        <div className="flex w-full max-w-sm items-stretch overflow-hidden rounded border border-black/10 sm:w-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu búsqueda"
            className="w-full px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="whitespace-nowrap bg-cite-teal-dark px-4 py-2 text-sm text-white transition-colors hover:bg-cite-teal"
          >
            Búsqueda
          </button>
        </div>
      </div>

      {/* =========================================
          CONTENEDOR PRINCIPAL DE DOS COLUMNAS
          ========================================= */}
      <div className="flex flex-col gap-10 md:flex-row">
        
        {/* COLUMNA IZQUIERDA: BARRA LATERAL (Sidebar) */}
      {/* Agregamos self-start y movemos el sticky al contenedor principal */}
       <aside className="self-start w-full shrink-0 md:sticky md:top-32 md:w-56 lg:w-64">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Indicadores
            </h3>
            
            <nav className="flex flex-col gap-1">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setTypeFilter(type.id);
                    setCurrentPage(1);
                  }}
                  className={`text-left px-4 py-3 text-sm rounded transition-colors ${
                    typeFilter === type.id
                      ? "bg-cite-teal-dark text-white font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* COLUMNA DERECHA: FILTROS Y RESULTADOS */}
        <div className=" flex-1 min-w-0">
          
          {/* COMPONENTE DE FILTROS SUPERIORES */}
          <div className="mb-8 border-b border-black/5 pb-6">
            <LibraryFilters
              author={author}
              authors={authors}
              handleAuthorChange={handleAuthorChange}
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

          {/* ESTADO DE LA LISTA */}
          <div className="flex w-full flex-col items-center gap-4">
            {loading && <p className="py-8 text-sm text-neutral-500">Cargando artículos...</p>}
            {!loading && error && <p className="py-8 text-sm text-red-600">{error}</p>}
            {!loading && !error && documentos.length === 0 && (
              <p className="py-8 text-sm text-neutral-500">No se encontraron artículos para tu búsqueda.</p>
            )}

            {/* LISTA DE ARTÍCULOS */}
            {!loading && !error && documentos.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                {documentos.map((article) => (
                  <DocumentCard
                    key={article._id}
                    id={article._id}
                    title={article.title}
                    author={article.author || article.autor}
                    description={article.description}
                    category={article.category}
                    imageUrl={article.imageUrl}
                    typeOfComponent={article.typeOfComponent}
                  />
                ))}
              </div>
            )}

            {/* COMPONENTE DE PAGINACIÓN */}
            {!loading && (
              <div className="mt-8 w-full">
                <LibraryPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  setCurrentPage={setCurrentPage} 
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}