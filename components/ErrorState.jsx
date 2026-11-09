import { AlertTriangle, RefreshCw } from "lucide-react";

// Mensaje de error reutilizable con botón opcional de "Intentar de nuevo".
// Props:
//   message → texto a mostrar (tiene un valor por defecto)
//   onRetry → función opcional; si no se pasa, no aparece el botón
// No lleva "use client" propio, pero como lo importa error.jsx (que sí es de
// cliente), también se ejecuta en el navegador y el onClick funciona.
export default function ErrorState({
  message = "Algo salió mal al cargar el contenido.", 
  onRetry 
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-24 text-center">
      <AlertTriangle className="h-12 w-12 text-red-600" strokeWidth={1.5} aria-hidden="true" />
      
      <h1 className="text-2xl font-bold text-red-600">
        ¡Uy! Tuvimos un problema
      </h1>
      
      <p className="text-lg font-medium text-neutral-700 max-w-md">
        {message}
      </p>
      
      {/* Solo renderiza el botón si le pasamos la función de reintentar */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-cite-teal-dark px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}