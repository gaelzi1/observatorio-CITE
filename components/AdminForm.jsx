export default function AdminForm({
  form,
  handleChange,
  handleSubmit,
  editingId,
  resetForm,
}) {
  const isJournal = form.typeOfComponent === "journal_article";
  const isBook = form.typeOfComponent === "book";
  const isThesis = form.typeOfComponent === "thesis";
  const isReport = form.typeOfComponent === "report";
  const isConference = form.typeOfComponent === "conference_paper";
  const isEducational = form.typeOfComponent === "educational_resource";

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

        {/* AUTOR(ES) */}
        <div>
          <label className="mb-1 block text-sm text-cite-teal-dark">
            Autor(es) <span className="text-xs text-neutral-400 font-normal">(Ej. Apellido, N. o varios separados por coma)</span>
          </label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            placeholder="Ej. Pérez, J., López, M."
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
          />
        </div>

        {/* CATEGORÍA Y TIPO DE COMPONENTE */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">Categoría</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej. Innovación Educativa, Competencias Digitales"
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cite-teal-dark">Tipo de recurso</label>
            <select
              name="typeOfComponent"
              value={form.typeOfComponent}
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            >
              <option value="" disabled>Selecciona un tipo...</option>
              <option value="article">Artículo general</option>
              <option value="journal_article">Artículo de revista científica</option>
              <option value="book">Libro</option>
              <option value="thesis">Tesis académica</option>
              <option value="report">Informe técnico / Reporte</option>
              <option value="conference_paper">Ponencia / Congreso</option>
              <option value="educational_resource">Recurso educativo / Guía</option>
              <option value="other">Otro recurso</option>
            </select>
          </div>
          {/* IMAGEN DE PORTADA (OPCIONAL) */} 
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-cite-teal-dark">URL de imagen de portada (opcional)</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cite-teal-dark"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECCIÓN CONDICIONAL: CAMPOS ESPECÍFICOS PARA CITACIÓN APA */}
        {/* ========================================================= */}
        {form.typeOfComponent && form.typeOfComponent !== "other" && (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cite-teal-dark">
              Datos para citación (APA 7)
            </h4>

            {/* CAMPOS PARA REVISTA CIENTÍFICA */}
            {isJournal && (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-neutral-600">Nombre de la revista</label>
                  <input
                    type="text"
                    name="journalName"
                    value={form.journalName || ""}
                    onChange={handleChange}
                    placeholder="Ej. Revista Iberoamericana de Educación"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Volumen (Número)</label>
                  <input
                    type="text"
                    name="volume"
                    value={form.volume || ""}
                    onChange={handleChange}
                    placeholder="Ej. 14(2)"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Páginas</label>
                  <input
                    type="text"
                    name="pages"
                    value={form.pages || ""}
                    onChange={handleChange}
                    placeholder="Ej. 45-60"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* CAMPOS PARA LIBRO */}
            {isBook && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Editorial</label>
                  <input
                    type="text"
                    name="publisher"
                    value={form.publisher || ""}
                    onChange={handleChange}
                    placeholder="Ej. Editorial Universitaria / McGraw-Hill"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Edición / Volumen (Opcional)</label>
                  <input
                    type="text"
                    name="edition"
                    value={form.edition || ""}
                    onChange={handleChange}
                    placeholder="Ej. 2.ª ed."
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* CAMPOS PARA TESIS */}
            {isThesis && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Grado académico</label>
                  <input
                    type="text"
                    name="degree"
                    value={form.degree || ""}
                    onChange={handleChange}
                    placeholder="Ej. Tesis de Licenciatura / Maestría"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Institución universitaria</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution || ""}
                    onChange={handleChange}
                    placeholder="Ej. Universidad Autónoma de Querétaro"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* CAMPOS PARA INFORME / REPORTE */}
            {isReport && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Entidad / Institución emisora</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution || ""}
                    onChange={handleChange}
                    placeholder="Ej. Observatorio de Habilidades Digitales"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">N.º de reporte / serie (Opcional)</label>
                  <input
                    type="text"
                    name="reportNumber"
                    value={form.reportNumber || ""}
                    onChange={handleChange}
                    placeholder="Ej. Informe Técnico N.º 4"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* CAMPOS PARA CONGRESO / PONENCIA */}
            {isConference && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Nombre del congreso o evento</label>
                  <input
                    type="text"
                    name="conferenceName"
                    value={form.conferenceName || ""}
                    onChange={handleChange}
                    placeholder="Ej. Congreso Internacional de Software Educativo"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Lugar (Ciudad, País)</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                    placeholder="Ej. Querétaro, México"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* CAMPOS PARA RECURSO EDUCATIVO */}
            {isEducational && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Tipo de material</label>
                  <input
                    type="text"
                    name="materialType"
                    value={form.materialType || ""}
                    onChange={handleChange}
                    placeholder="Ej. Guía docente, Manual de laboratorio"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600">Institución / Plataforma</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution || ""}
                    onChange={handleChange}
                    placeholder="Ej. Centro de Desarrollo Tecnológico"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
                  />
                </div>
              </div>
            )}

            {/* DOI O ENLACE EXTERNO FUENTE (COMÚN A TODOS) */}
            <div className="mt-3">
              <label className="mb-1 block text-xs text-neutral-600">DOI o URL de la fuente original (Opcional)</label>
              <input
                type="text"
                name="doiOrUrl"
                value={form.doiOrUrl || ""}
                onChange={handleChange}
                placeholder="https://doi.org/... o https://repositorio..."
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cite-teal-dark"
              />
            </div>
          </div>
        )}

        {/* DESCRIPCIÓN CORTA */}
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

        {/* BOTONES DE ACCIÓN */}
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