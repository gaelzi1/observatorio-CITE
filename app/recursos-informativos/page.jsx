import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Biblioteca from "@/components/Biblioteca";
import ArticleCarousel from "@/components/ArticleCarousel";
export default function ResourcesPage() {
  return (
    <main>
      <Header />
      <Hero 
        title="Recursos Informativos"
        subtitle="Descubre nuestra colección de materiales"
        description="Accede a una amplia gama de recursos informativos en diversas áreas de conocimiento, diseñados para mantenerte actualizado y bien informado, desde informes y estadísticas hasta noticias de actualidad."
        
      />
    
      <Biblioteca />
    </main>
  );
}
