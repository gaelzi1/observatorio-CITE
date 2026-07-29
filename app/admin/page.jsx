"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    autor: "",
    imageUrl: "",
    description: "",
    content: "",
    published: false,
  });

  // =========================
  // CARGAR ARTÍCULOS
  // =========================

  async function loadArticles() {
    try {
      setLoading(true);

      const res = await fetch("/api/articles?limit=1000");

      if (!res.ok) {
        throw new Error("Error al cargar artículos");
      }

      const json = await res.json();

      setArticles(json.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  // =========================
  // CAMBIAR CAMPOS
  // =========================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =========================
  // CREAR / EDITAR
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    const url = editingId
      ? `/api/articles/${editingId}`
      : "/api/articles";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al guardar el artículo");
      }

      resetForm();
      loadArticles();

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  // =========================
  // EDITAR
  // =========================

  function startEdit(article) {
    setEditingId(article._id);

    setForm({
      title: article.title || "",
      category: article.category || "",
      autor: article.autor || "",
      imageUrl: article.imageUrl || "",
      description: article.description || "",
      content: article.content || "",
      published: article.published || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // ELIMINAR
  // =========================

  async function deleteArticle(id) {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este artículo?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar");
      }

      loadArticles();

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  function resetForm() {
    setEditingId("");

    setForm({
      title: "",
      autor: "",
      category: "",
      imageUrl: "",
      description: "",
      content: "",
      published: false,
    });
  }

  return (
  <main className="min-h-screen bg-white px-6 py-6">

    <div className="mx-auto max-w-6xl">

      {/* VOLVER */}
      <a
        href="/"
        className="text-sm text-cite-teal-dark hover:underline"
      >
        ← Volver al listado público
      </a>

      {/* TÍTULO */}
      <h1 className="mt-7 text-2xl font-bold text-black">
        Administrar artículos de la Biblioteca
      </h1>

      {/* FORMULARIO */}
      <section className="mt-6 rounded-lg bg-neutral-50 p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TÍTULO */}
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">
              Título
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">
              Autor
            </label>
            <input
              type="text"
              name="autor"
              value={form.autor}
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>
          {/* CATEGORÍA + IMAGEN */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm text-cite-teal-dark">
                Categoría
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ej. Orientación de las Investigaciones"
                required
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-cite-teal-dark">
                URL de imagen (opcional)
              </label>

              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
              />
            </div>

          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">
              Descripción corta (aparece en el listado)
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full resize-y rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>

          {/* CONTENIDO */}
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">
              Contenido completo (aparece en la página del artículo)
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={7}
              className="w-full resize-y rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              className="rounded bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              {editingId
                ? "Guardar cambios"
                : "Crear artículo"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-slate-300 px-5 py-2.5 text-sm hover:bg-white"
              >
                Cancelar
              </button>
            )}

          </div>

        </form>

      </section>

      {/* TABLA */}
      <section className="mt-10 overflow-x-auto">

        <table className="w-full border-collapse text-sm">

          <thead>
            <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-600">

              <th className="px-2 py-3">
                Título
              </th>
              <th className="px-2 py-3">
                Autor
              </th>
              <th className="px-2 py-3">
                Categoría
              </th>

              <th className="px-2 py-3">
                Publicado
              </th>

              <th className="px-2 py-3">
                Acciones
              </th>


            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="4"
                  className="py-8 text-center text-slate-500"
                >
                  Cargando...
                </td>
              </tr>

            ) : articles.length === 0 ? (

              <tr>
                <td
                  colSpan="4"
                  className="py-8 text-center text-slate-500"
                >
                  No hay artículos todavía.
                </td>
              </tr>

            ) : (

              articles.map((article) => (

                <tr
                  key={article._id}
                  className="border-b border-slate-200"
                >

                  <td className="px-2 py-3">
                    {article.title}
                  </td>
                  <td className="px-2 py-3">
                    {article.autor}
                  </td>
                  <td className="px-2 py-3">
                    {article.category}
                  </td>

                  <td className="px-2 py-3">
                    {article.published ? "Sí" : "No"}
                  </td>

                  <td className="px-2 py-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => startEdit(article)}
                        className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => deleteArticle(article._id)}
                        className="rounded border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </section>

    </div>

  </main>
);
  
}