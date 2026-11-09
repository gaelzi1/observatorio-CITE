"use client";

import Link from "next/link";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { TYPE_LABELS } from "./articleFormConfig";

// Fecha legible en español de México, p. ej. "5 nov 2026".
// timeZone "UTC" evita que la fecha se recorra un día por la zona horaria.
function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : "—";
}

// 6 filas grises animadas mientras cargan los datos.
// Array.from({ length: 6 }) crea un arreglo de 6 posiciones para poder hacer .map().
// `_` es una convención para "este parámetro no lo uso".
function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="border-b last:border-0">
      <td className="px-4 py-3" colSpan={5}>
        <div className="h-4 w-full animate-pulse rounded bg-base" />
      </td>
    </tr>
  ));
}

const iconBtn = "rounded p-1.5 text-muted transition hover:bg-base hover:text-primary";

// Tabla de recursos del panel. Es un componente "de presentación": no pide
// datos ni guarda estado; sólo muestra lo que recibe y avisa al padre de las
// acciones mediante las funciones onEdit, onDelete y onCreate.
export default function ArticlesTable({ articles, loading, hasFilters, activeId, onEdit, onDelete, onCreate }) {
  // "Retorno temprano": si no hay nada que mostrar, devolvemos el estado vacío
  // y el resto de la función ya no se ejecuta.
  if (!loading && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <FileText className="h-10 w-10 text-cite-turquesa" aria-hidden="true" />
        <p className="mt-3 font-semibold text-primary">
          {hasFilters ? "Ningún recurso coincide con los filtros" : "Aún no hay recursos"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters ? "Prueba con otra búsqueda o limpia los filtros." : "Crea el primero para que aparezca en la biblioteca."}
        </p>
        {!hasFilters && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-4 inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-sm font-semibold text-inverse transition hover:bg-cite-teal"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo recurso
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-base text-[11px] uppercase tracking-[0.2em] text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Recurso</th>
            <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">Tipo</th>
            <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Categoría</th>
            <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Fecha</th>
            <th className="px-4 py-2.5 text-right font-semibold">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows />
          ) : (
            articles.map((article) => {
              const authors = Array.isArray(article.author) ? article.author.join(", ") : article.author;
              const active = article._id === activeId;
              return (
                <tr
                  key={article._id}
                  onClick={() => onEdit(article)}
                  className={`group cursor-pointer border-b transition last:border-0 ${
                    active ? "bg-cite-turquesa/10" : "hover:bg-base/70"
                  }`}
                >
                  <td className="max-w-md px-4 py-2">
                    <p className="truncate font-medium text-primary" title={article.title}>
                      {article.title}
                    </p>
                    <p className="truncate text-xs text-muted">{authors}</p>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-2 text-secondary lg:table-cell">
                    {TYPE_LABELS[article.typeOfComponent] || "Otro recurso"}
                  </td>
                  <td className="hidden px-4 py-2 md:table-cell">
                    <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-muted">
                      {article.category}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-2 text-secondary sm:table-cell">
                    {formatDate(article.dateOfPublication)}
                  </td>
                  {/* stopPropagation: evita que el clic en los botones también
                      "suba" a la fila (<tr onClick>) y abra el editor. */}
                  <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-0.5">
                      {article.slug && (
                        <Link href={`/articles/${article.slug}`} target="_blank" title="Ver en el sitio" className={iconBtn}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Ver en el sitio</span>
                        </Link>
                      )}
                      <button type="button" onClick={() => onEdit(article)} title="Editar" className={iconBtn}>
                        <Pencil className="h-4 w-4" />
                        {/* sr-only: texto invisible que sí leen los lectores de pantalla. */}
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(article)}
                        title="Eliminar"
                        className="rounded p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
