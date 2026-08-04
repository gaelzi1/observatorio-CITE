import { useState } from "react";
import { Copy, Check, Printer } from "lucide-react";

export default function ArticleAPA({ citation }) {
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
    <section >
      
         

       <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
         <div className="flex items-center justify-between">
           <h3 className="text-lg font-semibold text-neutral-900">
             Citar este artículo
           </h3>

           <span className="rounded-full bg-[#10313C]/10 px-3 py-1 text-xs font-medium text-[#10313C]">
             APA 7
           </span>
         </div>

         <p className="mt-4 rounded-lg border border-neutral-200 bg-white p-4 font-serif text-[15px] leading-7 text-neutral-700">
           {citation}
         </p>

         <div className="mt-6 flex flex-wrap gap-3">
           <button
             onClick={copyCitation}
             className="inline-flex items-center gap-2 rounded-xl bg-[#10313C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#144252] hover:shadow-md"
           >
             {copied ? (
               <>
                 <Check size={18} />
                 ¡Copiada!
               </>
             ) : (
               <>
                 <Copy size={18} />
                 Copiar cita
               </>
             )}
           </button>

          
         </div>
       </div>
       {copied && (
  <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
    <div className="flex items-center gap-2 rounded-xl bg-[#10313C] px-4 py-3 text-sm font-medium text-white shadow-xl">
      <Check size={18} />
      Cita copiada al portapapeles
    </div>
  </div>
)}
    </section>
{copied && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#10313C] px-4 py-3 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <Check size={18} />
            <span>Cita copiada al portapapeles</span>
          </div>
        </div>
      )}
    </>
  );

}