import Banner from "@/components/Banner";
import Hero from "@/components/Hero";

import Library from "@/components/Library";
// Página /recursos-informativos. Reutiliza los mismos componentes que el
// inicio (Banner, Hero, Library) con otros textos: ésa es la ventaja de

export default function ResourcesPage() {
  return (
    <main>
      <Banner />
      
      <Hero 
        title="Recursos Informativos"
        subtitle="Descubre nuestra colección de materiales"
        description="Accede a una amplia gama de recursos informativos en diversas áreas de conocimiento, diseñados para mantenerte actualizado y bien informado, desde informes y estadísticas hasta noticias de actualidad."
        
      />
    
      <Library />
    </main>
  );
}
