"use client"; // Obligatorio para los archivos error.jsx de Next.js
import { useEffect } from "react";
import ErrorState from "@/components/ErrorState"; // Asegúrate de que la ruta sea correcta

export default function ArticleError({ error, reset }) {
  
  useEffect(() => {
    // Esto es muy útil para ti como desarrollador para ver qué falló en consola
    console.error("Error capturado en la ruta del artículo:", error);
  }, [error]);

  return (
    <ErrorState 
      message="No pudimos cargar la información de este recurso. Por favor, revisa tu conexión o intenta de nuevo." 
      onRetry={() => reset()} 
    />
  );
}