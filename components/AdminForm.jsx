export default function AdminForm({
  form,
  handleChange,
  handleSubmit,
  editingId,
  resetForm,
}) {
  return (
    <section className="mt-6 rounded-lg bg-neutral-50 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TÍTULO */}
        <div>
          <label className="mb-1 block text-sm text-cite-teal-dark">Título</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
          />
        </div>

        {/* AUTOR */}
        <div>
          <label className="mb-1 block text-sm text-cite-teal-dark">Autor</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
          />
        </div>

        {/* CATEGORÍA, TIPO E IMAGEN */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">Categoría</label>
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
            <label className="mb-1 block text-sm text-cite-teal-dark">Tipo de texto</label>
            <select
              name="typeOfComponent"
              value={form.typeOfComponent}
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            >
              <option value="" disabled>Selecciona un tipo...</option>
              <option value="article">Artículo</option>
              <option value="book">Libro</option>
              <option value="thesis">Tesis</option>
              <option value="report">Informe</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-cite-teal-dark">URL de imagen (opcional)</label>
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
          <label className="mb-1 flex justify-between block text-sm text-cite-teal-dark">
            <span>Descripción corta (aparece en el listado)</span>
            <span className="text-neutral-400 font-normal">
              {form.description?.length || 0} / 300
            </span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            maxLength={300}
            className="w-full resize-y rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
          />
        </div>

        {/* CONTENIDO Y FECHA */}
        <div>
          <label className="mb-1 block text-sm text-cite-teal-dark">Fecha de publicación</label>
          <input
            type="date"
            name="dateOfPublication"
            value={form.dateOfPublication}
            onChange={handleChange}
            required
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 mb-4 outline-none focus:border-cite-teal-dark"
          />
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
            {editingId ? "Guardar cambios" : "Crear artículo"}
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
  );
}