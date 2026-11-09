// Botones de paginación (Anterior · 1 2 3 · Siguiente).
// El estado `currentPage` vive en el padre (Library.jsx); aquí recibimos su
// valor y la función para cambiarlo.
export default function LibraryPagination({ currentPage, totalPages, setCurrentPage }) {
  // Con una sola página no hace falta paginar.
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-sm">
      <button
        disabled={currentPage === 1}
        // Forma funcional: calcula la nueva página a partir de la anterior.
        onClick={() => setCurrentPage((page) => page - 1)}
        className="rounded border border-gray-200 bg-surface px-4 py-2 font-medium text-primary transition-colors hover:bg-base disabled:pointer-events-none disabled:opacity-50"
      >
        Anterior
      </button>

      {/* Crea un botón por página. Array.from({ length: n }, fn) genera un
          arreglo de n elementos usando fn; index empieza en 0, por eso +1. */}
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`rounded border px-3 py-2 font-medium transition-colors ${
              currentPage === page
                ? "border-primary bg-primary text-inverse"
                : "border-gray-200 bg-surface text-primary hover:bg-base"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((page) => page + 1)}
        className="rounded border border-gray-200 bg-surface px-4 py-2 font-medium text-primary transition-colors hover:bg-base disabled:pointer-events-none disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}