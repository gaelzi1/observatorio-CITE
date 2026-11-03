"use client";

import { useEffect, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { APA_FIELDS_BY_TYPE, TYPE_OPTIONS } from "./articleFormConfig";

const inputClass =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30";

const SPAN = { 1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-3", 4: "sm:col-span-4" };

function Field({ label, htmlFor, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-primary">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <fieldset className="space-y-4 border-b pb-6 last:border-b-0">
      <legend className="mb-1">
        <span className="block font-semibold text-primary">{title}</span>
        {description && <span className="block text-sm text-muted">{description}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function ImagePreview({ url }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  if (!url) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-lg border bg-base">
      {failed ? (
        <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted">
          <ImageOff className="h-4 w-4" aria-hidden="true" /> No se pudo cargar la imagen
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Vista previa de la portada" className="h-40 w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export default function ArticleForm({ form, setForm, editing, saving, onSubmit, onCancel, categories }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const apaFields = APA_FIELDS_BY_TYPE[form.typeOfComponent] || [];

  return (
    <section className="rounded-2xl border bg-surface shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-primary">{editing ? "Editar recurso" : "Nuevo recurso"}</h2>
        <p className="text-sm text-muted">Los campos marcados con * son obligatorios.</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-6 px-6 py-6">
          <Section title="Información general">
            <Field label="Título *" htmlFor="title">
              <input id="title" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </Field>

            <Field label="Autor(es) *" htmlFor="author" hint="Separa varios con punto y coma">
              <input
                id="author"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                placeholder="Ej. Pérez, J.; López, M."
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo de recurso *" htmlFor="typeOfComponent">
                <select
                  id="typeOfComponent"
                  name="typeOfComponent"
                  value={form.typeOfComponent}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecciona un tipo...
                  </option>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Categoría *" htmlFor="category">
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  list="category-options"
                  placeholder="Ej. Tecnología Educativa"
                  className={inputClass}
                />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>

              <Field label="Fecha de publicación *" htmlFor="dateOfPublication">
                <input
                  id="dateOfPublication"
                  type="date"
                  name="dateOfPublication"
                  value={form.dateOfPublication}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

            </div>

            <Field label="Imagen de portada" htmlFor="imageUrl" hint="URL, opcional">
              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              <ImagePreview url={form.imageUrl} />
            </Field>
          </Section>

          <Section title="Contenido">
            <Field label="Descripción corta *" htmlFor="description" hint={`${form.description.length} / 300`}>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                maxLength={300}
                placeholder="Aparece en las tarjetas del listado"
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Contenido completo *" htmlFor="content" hint="Separa párrafos con una línea en blanco">
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={10}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
          </Section>

          {form.typeOfComponent && (
            <Section title="Datos para citación (APA 7)" description="Se usan para generar la referencia automáticamente.">
              {apaFields.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-4">
                  {apaFields.map((f) => (
                    <Field key={f.name} label={f.label} htmlFor={f.name} className={SPAN[f.span || 1]}>
                      <input
                        id={f.name}
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className={inputClass}
                      />
                    </Field>
                  ))}
                </div>
              )}
              <Field label="DOI o URL de la fuente" htmlFor="doiOrUrl" hint="Opcional">
                <input
                  id="doiOrUrl"
                  name="doiOrUrl"
                  value={form.doiOrUrl}
                  onChange={handleChange}
                  placeholder="https://doi.org/..."
                  className={inputClass}
                />
              </Field>
            </Section>
          )}
        </div>

        <div className="flex gap-3 border-t bg-base px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-inverse transition hover:bg-cite-teal disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {editing ? "Guardar cambios" : "Crear recurso"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border bg-surface px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
