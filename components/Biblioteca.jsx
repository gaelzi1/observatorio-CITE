"use client";

import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";

const LIMIT = 6;

const SORT_OPTIONS = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "title_asc", label: "Título A-Z" },
  { value: "title_desc", label: "Título Z-A" },
];

export default function Biblioteca() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [categories, setCategories] = useState([]);

  const [documentos, setDocumentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga la lista de categorías disponibles una sola vez, a partir
  // de los artículos existentes. Si tienes un endpoint dedicado
  // (p. ej. /api/categories) puedes reemplazar este bloque por ese fetch.
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`/api/articles?limit=1000`);
        if (!res.ok) return;

        const data = await res.json();
        const unique = Array.from(
          new Set((data.data || []).map((a) => a.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));

        setCategories(unique);
      } catch (err) {
        console.error("No se pudieron cargar las categorías", err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: LIMIT,
          sort,
        });

        if (search) {
          params.set("q", search);
        }

        if (category) {
          params.set("category", category);
        }

        const res = await fetch(`/api/articles?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Error de red");
        }

        const data = await res.json();

        setDocumentos(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            "No se pudo cargar la biblioteca. Verifica la conexión a MongoDB."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadArticles();

    return () => controller.abort();
  }, [search, category, sort, currentPage]);

  function handleSearch() {
    setCurrentPage(1);
    setSearch(query.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleSortChange(value) {
    setSort(value);
    setCurrentPage(1);
  }

  function clearFilters() {
    setQuery("");
    setSearch("");
    setCategory("");
    setSort("recent");
    setCurrentPage(1);
  }

  const hasActiveFilters = search || category || sort !== "recent";

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-cite-teal-dark">
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

        {/* BARRA DE FILTROS */}
        <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="filtro-categoria" className="text-xs font-medium text-neutral-500">
              Categoría
            </label>
            <select
              id="filtro-categoria"
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

          <div className="flex items-center gap-2">
            <label htmlFor="filtro-orden" className="text-xs font-medium text-neutral-500">
              Ordenar por
            </label>
            <select
              id="filtro-orden"
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
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {loading && (
          <p className="py-8 text-sm text-neutral-500">
            Cargando artículos...
          </p>
        )}

        {!loading && error && (
          <p className="py-8 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && documentos.length === 0 && (
          <p className="py-8 text-sm text-neutral-500">
            No se encontraron artículos para tu búsqueda.
          </p>
        )}

        {!loading && !error && documentos.length > 0 && (
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {documentos.map((article) => (
             <DocumentCard
            key={article._id}
            id={article._id}
            titulo={article.title}
            autor={article.autor}
            descripcion={article.description}
            categoria={article.category}
            imageUrl={article.imageUrl}
          />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded border px-3 py-2 ${
                    currentPage === page
                      ? "bg-cite-teal-dark text-white"
                      : ""
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}