"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Search, X } from "lucide-react";
import ArticleForm from "@/components/admin/ArticleForm";
import ArticlesTable from "@/components/admin/ArticlesTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { EMPTY_FORM, TYPE_OPTIONS, articleToForm } from "@/components/admin/articleFormConfig";

const newForm = () => ({ ...EMPTY_FORM, dateOfPublication: new Date().toISOString().split("T")[0] });

const selectClass =
  "rounded-lg border bg-surface px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30";

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Formulario
  const [form, setForm] = useState(newForm);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  // Eliminar / cambiar estado
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Llamada a la API que, si la sesión expiró, regresa al login
  const api = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options,
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
      });
      if (res.status === 401) {
        router.replace("/login");
        router.refresh();
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Ocurrió un error");
      return data;
    },
    [router]
  );

  const loadArticles = useCallback(async () => {
    try {
      const json = await api("/api/articles?limit=1000");
      setArticles(json.data || []);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [api, notify]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [articles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (typeFilter && (a.typeOfComponent || "other") !== typeFilter) return false;
      if (!q) return true;
      const authors = Array.isArray(a.author) ? a.author.join(" ") : a.author || "";
      return [a.title, a.category, authors].some((v) => v?.toLowerCase().includes(q));
    });
  }, [articles, query, typeFilter]);

  const hasFilters = Boolean(query || typeFilter);

  function resetForm() {
    setEditingId("");
    setForm(newForm());
  }

  function startEdit(article) {
    setEditingId(article._id);
    setForm(articleToForm(article));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(editingId ? `/api/articles/${editingId}` : "/api/articles", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });

      resetForm();
      notify(editingId ? "Cambios guardados" : "Recurso creado");
      loadArticles();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/articles/${toDelete._id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a._id !== toDelete._id));
      if (toDelete._id === editingId) resetForm();
      notify("Recurso eliminado");
      setToDelete(null);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  const closeConfirm = useCallback(() => setToDelete(null), []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Biblioteca</h1>
        <p className="mt-1 text-muted">Administra los recursos informativos del observatorio.</p>
      </div>

      {/* Formulario */}
      <div className="mt-8">
        <ArticleForm
          form={form}
          setForm={setForm}
          editing={Boolean(editingId)}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          categories={categories}
        />
      </div>

      {/* Filtros */}
      <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor o categoría..."
            aria-label="Buscar recursos"
            className="w-full rounded-lg border bg-surface py-2 pl-10 pr-3 text-sm outline-none transition focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30"
          />
        </div>
        <div className="flex gap-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filtrar por tipo" className={selectClass}>
            <option value="">Todos los tipos</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTypeFilter("");
              }}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-secondary transition hover:bg-surface hover:text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {!loading && hasFilters && (
        <p className="mt-3 text-sm text-muted">
          {filtered.length} de {articles.length} recursos
        </p>
      )}

      {/* Tabla */}
      <div className="mt-4">
        <ArticlesTable
          articles={filtered}
          loading={loading}
          hasFilters={hasFilters}
          onEdit={startEdit}
          onDelete={setToDelete}
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="¿Eliminar este recurso?"
        message={toDelete ? `"${toDelete.title}" se eliminará de forma permanente.` : ""}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={closeConfirm}
      />

      {/* Notificación */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Cerrar notificación" className="ml-2 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </main>
  );
}
