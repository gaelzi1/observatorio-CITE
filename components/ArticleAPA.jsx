"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ArticleAPA({ citation }) {
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    try {
      // Elimina etiquetas HTML por si citation viene con formato <i> o <em>
      const plainText = typeof citation === "string" 
        ? citation.replace(/<[^>]+>/g, "") 
        : citation;

      await navigator.clipboard.writeText(plainText);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar la cita:", error);
    }
  };

  return (
    <>
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Citar este recurso
          </h3>

          <span className="rounded-full bg-[#10313C]/10 px-3 py-1 text-xs font-medium text-[#10313C]">
            APA 7
          </span>
        </div>

        {/* Bloque de cita con sangría francesa y soporte para formato */}
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4 font-serif text-[15px] leading-7 text-neutral-700 [text-indent:-1.5rem] [padding-left:2.5rem]">
          {typeof citation === "string" && citation.includes("<") ? (
            <span dangerouslySetInnerHTML={{ __html: citation }} />
          ) : (
            citation
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyCitation}
            className="inline-flex items-center gap-2 rounded-xl bg-[#10313C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#144252] hover:shadow-md"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>¡Copiada!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copiar cita</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Toast flotante único con animación */}
      {copied && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <div className="flex items-center gap-2 rounded-xl bg-[#10313C] px-4 py-3 text-sm font-medium text-white shadow-xl">
            <Check size={18} className="text-emerald-400" />
            <span>Cita copiada al portapapeles</span>
          </div>
        </aside>
      )}
    </>
  );
}