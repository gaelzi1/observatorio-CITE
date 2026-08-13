"use client";

import { useState, useEffect } from "react";

export function useCardsPerView() {
  const getValue = () => {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  };

  const [cardsPerView, setCardsPerView] = useState(getValue);

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    
    const update = () => setCardsPerView(getValue());
    
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  return cardsPerView;
}