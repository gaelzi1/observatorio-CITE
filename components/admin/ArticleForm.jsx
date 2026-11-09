"use client";

import { useEffect, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { APA_FIELDS_BY_TYPE, TYPE_OPTIONS } from "./articleFormConfig";

const inputClass =
  "w-full rounded border bg-surface px-3 py-2 text-sm text-primary outline-none transition placeholder:text-gray-400 focus:border-focus focus:ring-2 focus:ring-cite-turquesa/30";

// Tailwind sólo genera las clases que encuentra ESCRITAS COMPLETAS en el
// código. Por eso no se puede armar `sm:col-span-${n}` dinámicamente: hay que
// tener la lista con las clases completas, como aquí.
const SPAN = { 1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-3", 4: "sm:col-span-4" };

// --- Componentes pequeños de uso interno --------------------------------------
// Se pueden declarar varios componentes en un archivo; sólo el `export default`
// se usa desde fuera. Sirven para no repetir el mismo marcado una y otra vez.

// Etiqueta + campo. `children` es el <input>/<select> que se coloca dentro.
// `className = ""` es un valor por defecto si no se pasa la prop.
// En JSX se escribe `htmlFor` en vez de `for` (palabra reservada de JS).
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

// Agrupa campos relacionados con un título (<fieldset> + <legend> es lo
// accesible para lectores de pantalla).
function Section({ title, description, children }) {
  return (
    <fieldset className="space-y-4 border-b pb-5 last:border-b-0 last:pb-0">
      <legend className="mb-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-secondary">{title}</span>
        {description && <span className="block text-sm text-muted">{description}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

// Muestra la portada a partir de la URL escrita. Si la imagen no carga
// (onError), muestra un aviso en su lugar.
function ImagePreview({ url }) {
  const [failed, setFailed] = useState(false);
  // Si el usuario cambia la URL, volvemos a intentar mostrarla.
  useEffect(() => setFailed(false), [url]);

  // Devolver null significa "no pintar nada".
  if (!url) return null;
  return (
    <div className="overflow-hidden rounded border bg-base">
      {failed ? (
        <div className="flex h-28 items-center justify-center gap-2 text-sm text-muted">
          <ImageOff className="h-4 w-4" aria-hidden="true" /> No se pudo cargar la imagen
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Vista previa de la portada" className="h-28 w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

// Formulario para crear/editar un recurso.
// Es un componente "controlado por el padre": el estado `form` vive en
// app/admin/page.jsx y aquí sólo lo mostramos y lo actualizamos con `setForm`.
// Así el padre puede saber si hay cambios sin guardar, enviarlo, etc.
export default function ArticleForm({ form, setForm, editing, saving, onSubmit, onCancel, categories }) {
  // UN SOLO manejador para todos los campos: usa el atributo `name` del input
  // para saber qué propiedad del formulario actualizar.
  // `[name]: value` es una "propiedad computada": si name es "title", queda
  // { ...prev, title: value }. `...prev` copia el resto de campos sin tocarlos.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Ctrl/Cmd + S guarda sin tener que buscar el botón
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (!saving) e.currentTarget.requestSubmit();
    }
  };

  // Campos APA que corresponden al tipo elegido (p. ej. "book" → editorial y edición).
  const apaFields = APA_FIELDS_BY_TYPE[form.typeOfComponent] || [];

  return (
    <form onSubmit={onSubmit} onKeyDown={handleKeyDown} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <Section title="Información general">
          <Field label="Título *" htmlFor="title">
            <input id="title" name="title" value={form.title} onChange={handleChange} required autoFocus className={inputClass} />
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
              {/* <datalist> sugiere las categorías existentes mientras se
                  escribe, pero permite escribir una nueva. */}
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
            </Field>
          </div>
          <ImagePreview url={form.imageUrl} />
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
              rows={8}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
        </Section>

        {form.typeOfComponent && (
          <Section title="Datos para citación (APA 7)" description="Se usan para generar la referencia automáticamente.">
            {/* Los campos se generan a partir de la configuración
                (articleFormConfig.js) en lugar de escribir cada <input> a mano. */}
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

      <div className="flex items-center justify-end gap-3 border-t bg-base px-6 py-3">
        <span className="mr-auto hidden text-xs text-muted sm:inline">* Obligatorio · Ctrl + S para guardar</span>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded border bg-surface px-4 py-2 text-sm font-medium text-secondary transition hover:bg-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-sm font-semibold text-inverse transition hover:bg-cite-teal disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {editing ? "Guardar cambios" : "Crear recurso"}
        </button>
      </div>
    </form>
  );
}
