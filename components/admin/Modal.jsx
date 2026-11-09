"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

// Ventana centrada para formularios
// `children` es lo que se escribe entre <Modal> y </Modal> (aquí, el formulario).
export default function Modal({ open, title, subtitle, onClose, children }) {
  // Mientras está abierta, bloqueamos el scroll de la página de fondo.
  // Al cerrarse (limpieza del efecto) restauramos el valor anterior.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-md bg-surface shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="font-display text-xl font-semibold text-primary">
              {title}
            </h2>
            {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-2 text-muted transition hover:bg-base hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
