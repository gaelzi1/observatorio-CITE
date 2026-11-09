"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

// Diálogo genérico de confirmación ("¿Seguro que quieres...?").
// Reutilizable: el texto y las acciones llegan por props.
//   open      → si se muestra o no
//   loading   → bloquea los botones mientras se procesa
//   onConfirm / onCancel → qué hacer al aceptar / cancelar
export default function ConfirmDialog({ open, title, message, confirmLabel = "Eliminar", loading, onConfirm, onCancel }) {
  // Mientras está abierto, la tecla Esc lo cierra.
  // `a && b()` es un atajo de "si a es verdadero, ejecuta b()".
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  // Importante: los hooks (useEffect) van ANTES de cualquier `return`.
  // React exige que se llamen siempre en el mismo orden en cada render.
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      {/* Fondo oscuro: al hacer clic fuera de la caja se cancela. */}
      <div className="absolute inset-0 bg-gray-900/40" onClick={() => !loading && onCancel()} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-md bg-surface p-6 shadow-xl">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirm-title" className="font-display text-lg font-semibold text-primary">
              {title}
            </h2>
            <p className="mt-1 text-sm text-secondary">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            autoFocus
            className="rounded border px-4 py-2 text-sm font-medium text-secondary transition hover:bg-base"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
