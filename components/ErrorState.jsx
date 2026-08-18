export default function ErrorState({ 
  message = "Algo salió mal al cargar el contenido.", 
  onRetry 
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-24 text-center">
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      
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
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}