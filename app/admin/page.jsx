// =============================================================================
// app/admin/page.jsx — PANEL DE ADMINISTRACIÓN (/admin)
// -----------------------------------------------------------------------------
// Aquí el admin lista, busca, crea, edita y elimina recursos. La sesión ya se
// validó en app/admin/layout.js, así que esta página asume que hay sesión.
//
// Es un Client Component ("use client") porque es muy interactiva: guarda
// estado (useState), escucha el teclado, abre ventanas modales, etc.
//
// Idea clave de React: la interfaz es una FUNCIÓN DEL ESTADO. Nunca
// modificamos el HTML a mano; cambiamos el estado con setAlgo(...) y React
// vuelve a ejecutar este componente ("re-render") y actualiza la pantalla.
// =============================================================================

"use client";

// Hooks de React que usa este archivo:
//   useState    → guarda un valor que, al cambiar, vuelve a pintar el componente.
//   useEffect   → ejecuta código "secundario" (timers, listeners, fetch) tras pintar.
//   useMemo     → memoriza un cálculo y sólo lo repite si cambian sus dependencias.
//   useCallback → memoriza una FUNCIÓN para que no se cree una nueva en cada render.
//   useRef      → guarda una referencia a un elemento del DOM (aquí, el buscador).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// useRouter permite navegar desde código (router.replace("/login")).
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Plus, Search, X } from "lucide-react";
import ArticleForm from "@/components/admin/ArticleForm";
import ArticlesTable from "@/components/admin/ArticlesTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/admin/Modal";
import { EMPTY_FORM, TYPE_OPTIONS, articleToForm } from "@/components/admin/articleFormConfig";

// Crea un formulario vacío con la fecha de hoy en formato "AAAA-MM-DD" (el que
// usa <input type="date">). Es una función para que la fecha sea la del
// momento en que se abre el formulario, no la del momento en que cargó el archivo.
const newForm = () => ({ ...EMPTY_FORM, dateOfPublication: new Date().toISOString().split("T")[0] });

// Clases de Tailwind compartidas por los <select>; se definen fuera del
// componente porque no cambian nunca.
const selectClass =
  "rounded border bg-surface px-3 py-2 text-sm text-secondary outline-none transition focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30";

export default function AdminPage() {
  const router = useRouter();
  // searchRef.current será el <input> de búsqueda (se conecta con ref={searchRef}).
  const searchRef = useRef(null);
  // useState devuelve [valorActual, funciónParaCambiarlo].
  const [articles, setArticles] = useState([]); // todos los recursos
  const [loading, setLoading] = useState(true); // true mientras llegan de la API

  // Filtros
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Formulario (en ventana centrada)
  const [formOpen, setFormOpen] = useState(false);        // ¿está abierta la ventana?
  const [form, setForm] = useState(newForm);               // valores actuales de los campos
  const [initialForm, setInitialForm] = useState("");      // copia (en texto) al abrir, para detectar cambios
  const [editingId, setEditingId] = useState("");          // "" = creando; con id = editando
  const [saving, setSaving] = useState(false);             // true mientras se guarda
  const [confirmDiscard, setConfirmDiscard] = useState(false); // muestra "¿descartar cambios?"

  // Eliminar
  const [toDelete, setToDelete] = useState(null);  // recurso que se quiere borrar (o null)
  const [deleting, setDeleting] = useState(false);

  // Notificación flotante ("toast"): { message, type, id } o null.
  const [toast, setToast] = useState(null);

  // Muestra una notificación. `id: Date.now()` hace que cada aviso sea único
  // (se usa como `key` abajo para que React lo trate como uno nuevo).
  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // Cada vez que aparece un toast, lo ocultamos a los 4 segundos.
  // La limpieza (clearTimeout) cancela el temporizador si llega otro toast antes.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Llamada a la API que, si la sesión expiró, regresa al login
  // Es un "envoltorio" de fetch: centraliza el manejo de errores para no
  // repetirlo en cada petición. Si la respuesta no es OK, lanza un Error con
  // el mensaje del servidor, que luego atrapamos con try/catch.
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

  // Pide todos los recursos a la API y los guarda en el estado.
  // `finally` se ejecuta siempre, haya error o no.
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

  // Carga inicial al abrir la página. Como loadArticles está memorizada con
  // useCallback, este efecto no se repite en cada render.
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Lista de categorías únicas a partir de los artículos.
  // `new Set(...)` elimina duplicados y `[...set]` lo vuelve a convertir en arreglo.
  // "Datos derivados": no se guardan en useState, se CALCULAN a partir de otro estado.
  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [articles]
  );

  // Artículos que cumplen los filtros. El filtrado se hace aquí en el
  // navegador (no en la API) porque el panel ya tiene todos los recursos.
  // Sólo se recalcula si cambia alguno de los valores del arreglo final.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (typeFilter && (a.typeOfComponent || "other") !== typeFilter) return false;
      if (categoryFilter && a.category !== categoryFilter) return false;
      if (!q) return true;
      const authors = Array.isArray(a.author) ? a.author.join(" ") : a.author || "";
      return [a.title, a.category, authors].some((v) => v?.toLowerCase().includes(q));
    });
  }, [articles, query, typeFilter, categoryFilter]);

  const hasFilters = Boolean(query || typeFilter || categoryFilter);
  // "Dirty" = el formulario tiene cambios sin guardar. Comparamos el formulario
  // actual con la copia que guardamos al abrirlo (ambos como texto JSON).
  const isDirty = formOpen && JSON.stringify(form) !== initialForm;

  // Abre la ventana con unos valores iniciales (vacíos o los de un artículo).
  function openForm(nextForm, id = "") {
    setEditingId(id);
    setForm(nextForm);
    setInitialForm(JSON.stringify(nextForm));
    setFormOpen(true);
  }

  const openCreate = () => openForm(newForm());
  const startEdit = (article) => openForm(articleToForm(article), article._id);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setConfirmDiscard(false);
    setEditingId("");
  }, []);

  // Cerrar la ventana avisando si hay cambios sin guardar
  const requestClose = useCallback(() => {
    if (saving) return;
    if (isDirty) setConfirmDiscard(true);
    else closeForm();
  }, [saving, isDirty, closeForm]);

  // Atajos: Esc cierra la ventana, "/" enfoca la búsqueda
  // Escuchamos el teclado en todo el documento. Las dependencias del final
  // hacen que el listener se vuelva a registrar con los valores actualizados.
  useEffect(() => {
    const onKey = (e) => {
      if (confirmDiscard || toDelete) return; // los diálogos manejan su propio Esc
      if (e.key === "Escape" && formOpen) {
        requestClose();
      } else if (e.key === "/" && !formOpen && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formOpen, confirmDiscard, toDelete, requestClose]);

  // Avisar al recargar o cerrar la pestaña con cambios pendientes
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Se ejecuta al enviar el formulario (crear o editar).
  async function handleSubmit(e) {
    // Evita que el navegador recargue la página (comportamiento por defecto de <form>).
    e.preventDefault();
    setSaving(true);
    try {
      // Mismo formulario para crear (POST) y editar (PUT), según haya editingId.
      await api(editingId ? `/api/articles/${editingId}` : "/api/articles", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      notify(editingId ? "Cambios guardados" : "Recurso creado");
      closeForm();
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
      // Actualización "funcional": recibimos el estado anterior (prev) y
      // devolvemos uno NUEVO sin el artículo borrado. En React nunca se
      // modifica el estado directamente (nada de articles.splice(...)).
      setArticles((prev) => prev.filter((a) => a._id !== toDelete._id));
      if (toDelete._id === editingId) closeForm();
      notify("Recurso eliminado");
      setToDelete(null);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  // Memorizadas porque ConfirmDialog las usa como dependencia de su useEffect.
  const closeConfirm = useCallback(() => setToDelete(null), []);
  const cancelDiscard = useCallback(() => setConfirmDiscard(false), []);

  function clearFilters() {
    setQuery("");
    setTypeFilter("");
    setCategoryFilter("");
  }

  // A partir de aquí, el JSX: describe CÓMO se ve la página según el estado.
  // Lo que va entre { } dentro del JSX es JavaScript normal.
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">Biblioteca</h1>
          <p className="text-sm text-muted">
            {loading ? "Cargando recursos..." : `${articles.length} recurso${articles.length === 1 ? "" : "s"} en la biblioteca`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-sm font-semibold text-inverse transition hover:bg-cite-teal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo recurso
        </button>
      </div>

      {/* Lista con filtros */}
      <section className="mt-5 overflow-hidden rounded-md border bg-surface">
        <div className="flex flex-col gap-2 border-b p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            {/* "Input controlado": su valor viene del estado (value={query}) y
                cada tecla actualiza el estado con onChange. Así React siempre
                sabe qué hay escrito. */}
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor o categoría...   ( / )"
              aria-label="Buscar recursos"
              className="w-full rounded border bg-surface py-2 pl-10 pr-3 text-sm outline-none transition focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filtrar por tipo" className={selectClass}>
              <option value="">Todos los tipos</option>
              {/* .map() convierte cada dato en un elemento JSX. React necesita
                  una `key` única en cada elemento de una lista para saber
                  cuál cambió, se agregó o se eliminó. */}
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filtrar por categoría"
              className={selectClass}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {/* Render condicional: `cond && <JSX/>` sólo pinta si cond es true. */}
            {hasFilters && (
              <>
                <span className="px-1 text-xs text-muted">
                  {filtered.length} de {articles.length}
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded px-2 py-2 text-sm text-secondary transition hover:bg-base hover:text-primary"
                >
                  <X className="h-4 w-4" aria-hidden="true" /> Limpiar
                </button>
              </>
            )}
          </div>
        </div>

        {/* La tabla no guarda estado propio: recibe los datos por props y nos
            avisa de las acciones con funciones (onEdit, onDelete...). A esto
            se le llama "levantar el estado": el padre es quien decide. */}
        <ArticlesTable
          articles={filtered}
          loading={loading}
          hasFilters={hasFilters}
          activeId={formOpen ? editingId : ""}
          onEdit={startEdit}
          onDelete={setToDelete}
          onCreate={openCreate}
        />
      </section>

      {/* Formulario en ventana centrada */}
      {/* Todo lo que va entre <Modal> y </Modal> le llega como `children`. */}
      <Modal
        open={formOpen}
        title={editingId ? "Editar recurso" : "Nuevo recurso"}
        subtitle={editingId ? form.title || undefined : "Completa los datos y guarda para publicarlo."}
        onClose={requestClose}
      >
        <ArticleForm
          form={form}
          setForm={setForm}
          editing={Boolean(editingId)}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={requestClose}
          categories={categories}
        />
      </Modal>

      {/* Un mismo componente de diálogo reutilizado para dos confirmaciones distintas. */}
      <ConfirmDialog
        open={confirmDiscard}
        title="¿Descartar los cambios?"
        message="Tienes cambios sin guardar en este recurso. Si cierras la ventana se perderán."
        confirmLabel="Descartar"
        onConfirm={closeForm}
        onCancel={cancelDiscard}
      />

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
        // Al cambiar la `key`, React desmonta el aviso anterior y monta uno
        // nuevo (útil para reiniciar animaciones).
        <div
          key={toast.id}
          role="status"
          className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "border-accent/40 bg-surface text-red-700" : "border-cite-turquesa/40 bg-base text-success"
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
