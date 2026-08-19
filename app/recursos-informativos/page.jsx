import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticleCarousel from "@/components/ArticleCarousel";
import Library from "@/components/Library";
export default function ResourcesPage() {
  return (
    <main>
      <Header />
      
      <Hero 
        title="Recursos Informativos"
        subtitle="Descubre nuestra colección de materiales"
        description="Accede a una amplia gama de recursos informativos en diversas áreas de conocimiento, diseñados para mantenerte actualizado y bien informado, desde informes y estadísticas hasta noticias de actualidad."
        
      />
    
      <Library />
    </main>
  );
}
