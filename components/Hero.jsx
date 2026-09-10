import Image from "next/image";

export default function Hero({
  title,
  subtitle,
  description,
  logo = "/logo_cite.svg",
  // Eliminamos backgroundColor y textColor de las props porque 
  // ahora dejaremos que Tailwind maneje la semántica visual.
}) {
  return (
   
    <section className="w-full bg-primary text-inverse">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-14 sm:flex-row">
        
        {/* Logo */}
        <div className="flex h-[220px] w-[220px] flex-shrink-0 items-center justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={180}
            height={180}
          />
        </div>

        {/* Texto */}
        <div className="flex flex-1 flex-col items-center text-center">
          <h1 className="font-display text-4xl font-semibold">
            {title}
          </h1>

          {/* Mantener opacity-80 aquí es una excelente práctica cuando el texto es inverse (blanco), 
              así no tienes que crear una variable extra solo para "blanco con opacidad" */}
          <p className="mt-2 text-sm uppercase tracking-[0.2em] opacity-80">
            {subtitle}
          </p>

          <p className="mt-5 text-sm leading-7 opacity-90">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}