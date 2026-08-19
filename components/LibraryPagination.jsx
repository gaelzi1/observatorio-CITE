export default function LibraryPagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => page - 1)}
        className="rounded border border-gray-200 bg-surface px-4 py-2 font-medium text-primary transition-colors hover:bg-base disabled:pointer-events-none disabled:opacity-50"
      >
        Anterior
      </button>

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