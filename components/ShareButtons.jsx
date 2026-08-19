"use client";

import { useEffect, useState } from "react";

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  // 1. Iniciamos la URL vacía para evitar el error de hidratación
  const [currentUrl, setCurrentUrl] = useState("");

  // 2. Llenamos la URL solo cuando ya estamos en el navegador del cliente
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // 3. Usamos currentUrl en lugar de window para construir las rutas
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
        🔗
      </button>

      <span
        role="status"
        aria-live="polite"
        className={`absolute -top-8 right-0 rounded bg-primary px-2 py-1 text-xs text-inverse transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        Copiado 💾
      </span>
    </div>
  );
}