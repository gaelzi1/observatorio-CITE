import { useState } from "react";

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  );
  const shareTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Compartir en Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      bg: "bg-[#1877F2]",
      icon: "f",
    },
    {
      label: "Compartir en LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      bg: "bg-[#0A66C2]",
      icon: "in",
    },
    {
      label: "Compartir en X",
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
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
      <span className="mr-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
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
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
      >
        🔗
      </button>

      <span
        role="status"
        aria-live="polite"
        className={`absolute -top-8 right-0 rounded bg-neutral-800 px-2 py-1 text-xs text-white transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        Copiado 💾
      </span>
    </div>
  );
}