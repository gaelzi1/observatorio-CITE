import Header from "@/components/Header";
import ArticleCarousel from "@/components/ArticleCarousel";
import Hero from "@/components/Hero";
import Biblioteca from "@/components/Biblioteca";
export default function Page() {
    return (
        <main >
            
            <Header />
            <Hero 
              title="Bienvenido a nuestro sitio"
              subtitle="Descubre el poder de la información"
              description="Somos una organización dedicada a proporcionar información precisa y actualizada en diversas áreas de conocimiento."
              backgroundColor="#0F172A"
            />
            
            <ArticleCarousel />
            <Biblioteca />

            
        </main>
    );
}

