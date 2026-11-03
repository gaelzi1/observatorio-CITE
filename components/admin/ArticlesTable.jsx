"use client";

import Link from "next/link";
import { ExternalLink, FileText, Pencil, Trash2 } from "lucide-react";
import { TYPE_LABELS } from "./articleFormConfig";

function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : "—";
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b last:border-0">
      <td className="px-4 py-4" colSpan={5}>
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
      </td>
    </tr>
  ));
}

export default function ArticlesTable({ articles, loading, hasFilters, onEdit, onDelete }) {
  if (!loading && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-surface px-6 py-16 text-center">
        <FileText className="h-10 w-10 text-cite-turquesa" aria-hidden="true" />
        <p className="mt-3 font-semibold text-primary">
          {hasFilters ? "Ningún recurso coincide con los filtros" : "Aún no hay recursos"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters ? "Prueba con otra búsqueda o limpia los filtros." : "Usa el formulario de arriba para crear el primero."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-base text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Recurso</th>
              <th className="hidden px-4 py-3 font-semibold lg:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Categoría</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Fecha</th>
              <th className="px-4 py-3 text-right font-semibold">
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
                return (
                  <tr key={article._id} className="border-b transition last:border-0 hover:bg-base/60">
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 font-medium text-gray-900">{article.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">{authors}</p>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 lg:table-cell">
                      {TYPE_LABELS[article.typeOfComponent] || "Otro recurso"}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="inline-block rounded-md bg-base px-2 py-0.5 text-xs text-secondary">{article.category}</span>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 sm:table-cell">
                      {formatDate(article.dateOfPublication)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {article.slug && (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            title="Ver en el sitio"
                            className="rounded-lg p-2 text-muted transition hover:bg-base hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Ver en el sitio</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(article)}
                          title="Editar"
                          className="rounded-lg p-2 text-muted transition hover:bg-base hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(article)}
                          title="Eliminar"
                          className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
}
