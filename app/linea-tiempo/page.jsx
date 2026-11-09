// Página /linea-tiempo: muestra la barra de navegación y la línea de tiempo.
// Toda la lógica (pedir datos, animaciones) vive dentro de <Timeline />.
// Por convención los componentes se nombran en PascalCase (LineaTiempoPage).
import Timeline from "@/components/Timeline";
import Banner from "@/components/Banner"
export default async function LineaTiempoPage(){
return(
  <>
  <Banner/>
   <Timeline/>
   </>


)
}
