"use client";

import { useEffect, useState } from "react";
import { Check, Link2 } from "lucide-react";

// Botones para compartir el artículo en redes y copiar el enlace.
//
// Concepto importante — HIDRATACIÓN: Next genera el HTML en el servidor y
// luego React, en el navegador, "conecta" ese HTML con el JavaScript. Si el
// primer render del navegador es distinto del HTML del servidor, React da un
// error de hidratación. Como en el servidor no existe `window.location`, la
// URL se lee DESPUÉS, dentro de un useEffect.
export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  // 1. Iniciamos la URL vacía para evitar el error de hidratación
  const [currentUrl, setCurrentUrl] = useState("");

  // 2. Llenamos la URL solo cuando ya estamos en el navegador del cliente
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // 3. Usamos currentUrl en lugar de window para construir las rutas
  // encodeURIComponent escapa caracteres especiales (espacios, &, ?...) para
  // poder meter la URL y el título dentro de otra URL sin romperla.
  const shareUrl = currentUrl ? encodeURIComponent(currentUrl) : "";
  const shareTitle = encodeURIComponent(title);

  // 4. Si la URL aún está vacía (durante el servidor), le ponemos un "#" temporal
  // Nota: Mantenemos los colores originales para las redes sociales por identidad de marca
  const shareLinks = [
    {
      label: "Compartir en Facebook",
      href: currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` : "#",
      bg: "bg-[#1877F2]",
      icon: "f",
    },
    {
      label: "Compartir en LinkedIn",
      href: currentUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` : "#",
      bg: "bg-[#0A66C2]",
      icon: "in",
    },
    {
      label: "Compartir en X",
      href: currentUrl ? `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` : "#",
      bg: "bg-black",
      icon: "𝕏",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("No se pudo copiar el enlace", error);
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <span className="mr-2 text-xs font-medium uppercase tracking-wider text-muted">
        Compartir
      </span>
      {shareLinks.map((link) => (
        // target="_blank" abre en otra pestaña; rel="noopener noreferrer"
        // impide que esa página controle la nuestra (buena práctica de seguridad).
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${link.bg}`}
        >
          {link.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        aria-label="Copiar enlace"
        title="Copiar enlace"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-surface text-secondary transition-all hover:-translate-y-0.5 hover:border-focus hover:bg-base hover:shadow-sm"
      >
        <Link2 className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* El aviso "Copiado" siempre existe en el HTML; sólo cambia su opacidad.
          aria-live hace que los lectores de pantalla anuncien el cambio. */}
      <span
        role="status"
        aria-live="polite"
        className={`absolute -top-8 right-0 inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-inverse transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        <Check className="h-3 w-3" aria-hidden="true" /> Copiado
      </span>
    </div>
  );
}