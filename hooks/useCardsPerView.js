// =============================================================================
// hooks/useCardsPerView.js — HOOK PERSONALIZADO
// -----------------------------------------------------------------------------
// Un "hook" es una función de React cuyo nombre empieza con "use" y que puede
// usar otros hooks (useState, useEffect...). Sirve para reutilizar lógica con
// estado entre componentes. Éste responde: "¿cuántas tarjetas caben en el
// carrusel según el ancho de la pantalla?" y se actualiza al redimensionar.
//
// Uso: const cards = useCardsPerView();  // 1, 2 o 3
// =============================================================================

// "use client" indica que este código corre en el navegador. Es necesario
// porque usa hooks y `window`, que no existen en el servidor.
"use client";

import { useState, useEffect } from "react";

export function useCardsPerView() {
  // Calcula el valor según media queries (los mismos cortes que Tailwind:
  // sm = 640px, lg = 1024px).
  const getValue = () => {
    // En el servidor no hay `window`; devolvemos un valor por defecto.
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  };

  // useState(getValue): al pasar la FUNCIÓN (sin paréntesis), React la ejecuta
  // sólo una vez para obtener el valor inicial ("inicialización perezosa").
  const [cardsPerView, setCardsPerView] = useState(getValue);

  // useEffect se ejecuta DESPUÉS de que el componente aparece en pantalla.
  // El arreglo vacío [] significa "ejecútalo una sola vez, al montar".
  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");

    // Cada vez que se cruza uno de los cortes, recalculamos el valor.
    const update = () => setCardsPerView(getValue());

    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);

    // La función que se devuelve es la "limpieza": React la ejecuta cuando el
    // componente desaparece, para no dejar listeners colgados (fugas de memoria).
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  return cardsPerView;
}
