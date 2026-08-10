export default function AdminTable({
  articles,
  loading,
  startEdit,
  deleteArticle,
}) {
  return (
    <section className="mt-10 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-600">
            <th className="px-2 py-3">Título</th>
            <th className="px-2 py-3">Autor</th>
            <th className="px-2 py-3">Categoría</th>
            <th className="px-2 py-3">Publicado</th>
            <th className="px-2 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-slate-500">
                Cargando...
              </td>
            </tr>
          ) : articles.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-slate-500">
                No hay artículos todavía.
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr key={article._id} className="border-b border-slate-200">
                <td className="px-2 py-3">{article.title}</td>
                <td className="px-2 py-3">{article.author || article.autor}</td>
                <td className="px-2 py-3">{article.category}</td>
                <td className="px-2 py-3">
                  {article.dateOfPublication
                    ? new Date(article.dateOfPublication).toLocaleDateString()
                    : "N/A"}
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
  );
}