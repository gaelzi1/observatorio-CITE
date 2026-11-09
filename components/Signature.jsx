"use client";

import { useEffect } from "react";

// "Easter egg": registra la función window.signature() para que, al escribir
// `signature()` en la consola del navegador, aparezca la firma del autor.
// No pinta nada (return null); sólo existe por su efecto secundario.
export default function Signature() {
  // useEffect con [] corre una vez, ya en el navegador (donde existe `window`).
  useEffect(() => {
    window.signature = () => {
      console.log("👋 Hola, este sitio fue desarrollado por Gael Brito. ");
    };

   
  }, []);

  return null;
}