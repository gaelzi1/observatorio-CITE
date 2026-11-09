// =============================================================================
// app/articles/[slug]/error.jsx — Pantalla de ERROR para la ruta del artículo
// -----------------------------------------------------------------------------
// Next.js usa automáticamente `error.jsx` cuando algo lanza un error al
// renderizar page.jsx de esta carpeta. En vez de romper todo el sitio, sólo se
// reemplaza esta sección por lo que devuelva este componente.
// Next le pasa dos props:
//   - error: el error que ocurrió.
//   - reset: función que vuelve a intentar renderizar la página.
// =============================================================================

"use client"; // Obligatorio para los archivos error.jsx de Next.js
import { useEffect } from "react";
import ErrorState from "@/components/ErrorState"; // Asegúrate de que la ruta sea correcta

export default function ArticleError({ error, reset }) {

  // Se ejecuta cada vez que cambia `error` (por eso [error] en las dependencias).
  useEffect(() => {
    // Esto es muy útil para ti como desarrollador para ver qué falló en consola
    console.error("Error capturado en la ruta del artículo:", error);
  }, [error]);

  return (
    <ErrorState
      message="No pudimos cargar la información de este recurso. Por favor, revisa tu conexión o intenta de nuevo."
      // Pasamos una función como prop: ErrorState la llamará al pulsar "reintentar".
      onRetry={() => reset()}
    />
  );
}
