"use client";

import { useEffect } from "react";

export default function Signature() {
  useEffect(() => {
    window.signature = () => {
      console.log("👋 Hola, este sitio fue desarrollado por Gael Brito. ");
    };

   
  }, []);

  return null;
}