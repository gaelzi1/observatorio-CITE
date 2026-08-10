"use client";

import { useEffect, useState } from "react";
import AdminForm from "@/components/AdminForm";
import AdminTable from "@/components/AdminTable";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    author: "",
    imageUrl: "",
    description: "",
    content: "",
    dateOfPublication: "",
    typeOfComponent: "",
  });

  async function loadArticles() {
    try {
      setLoading(true);
      const res = await fetch("/api/articles?limit=1000");
      if (!res.ok) throw new Error("Error al cargar artículos");
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editingId ? `/api/articles/${editingId}` : "/api/articles";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar el artículo");

      resetForm();
      loadArticles();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  function startEdit(article) {
    setEditingId(article._id);
    setForm({
      title: article.title || "",
      category: article.category || "",
      author: article.author || article.autor || "",
      imageUrl: article.imageUrl || "",
      description: article.description || "",
      content: article.content || "",
      typeOfComponent: article.typeOfComponent|| "",
      dateOfPublication: article.dateOfPublication
        ? new Date(article.dateOfPublication).toISOString().split("T")[0]
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteArticle(id) {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este artículo?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar");
      
      loadArticles();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  function resetForm() {
    setEditingId("");
    setForm({
      title: "",
      author: "",
      category: "",
      imageUrl: "",
      description: "",
      content: "",
      dateOfPublication: "",
      typeOfComponent: "",
    });
  }

  return (
    <main className="min-h-screen bg-white px-6 py-6">
      <div className="mx-auto max-w-6xl">
        {/* VOLVER Y TÍTULO */}
        <a href="/" className="text-sm text-cite-teal-dark hover:underline">
          ← Volver al listado público
        </a>
        <h1 className="mt-7 text-2xl font-bold text-black">
          Administrar artículos de la Biblioteca
        </h1>

        {/* FORMULARIO */}
        <AdminForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingId={editingId}
          resetForm={resetForm}
        />

        {/* TABLA */}
        <AdminTable
          articles={articles}
          loading={loading}
          startEdit={startEdit}
          deleteArticle={deleteArticle}
        />
      </div>
    </main>
  );
}