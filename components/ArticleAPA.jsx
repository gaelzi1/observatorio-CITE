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
      {/* Unificado: bg-base en lugar de bg-neutral-50 */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-base p-6 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Unificado: text-primary en lugar de text-neutral-900 */}
          <h3 className="text-lg font-semibold text-primary">
            Citar este recurso
          </h3>

          {/* Unificado: bg-primary/10 y text-primary en lugar del hexadecimal oscuro */}
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            APA 7
          </span>
        </div>

        {/* Bloque de cita con sangría francesa y soporte para formato */}
        {/* Unificado: bg-surface y text-secondary */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-surface p-4 font-serif text-[15px] leading-7 text-secondary [text-indent:-1.5rem] [padding-left:2.5rem]">
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
            
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-inverse shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:opacity-90"
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
          {/* Unificado: bg-primary y text-inverse */}
          <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-inverse shadow-xl">
            {/* Mantuve el emerald-400 para el check porque suele verse mejor (con más brillo) sobre fondos oscuros que el verde estándar */}
            <Check size={18} className="text-emerald-400" />
            <span>Cita copiada al portapapeles</span>
          </div>
        </aside>
      )}
    </>
  );
}