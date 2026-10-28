import "./globals.css";
import Signature from "@/components/Signaturee";

export const metadata = {
  title: "Observatorio CITE",
  description: "Centro de Investigación en Tecnología Educativa",
};
export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Signature />
        {children}
      </body>
     
    </html>
  );
}
