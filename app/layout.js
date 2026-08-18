import "./globals.css";
import Signature from "@/components/Signaturee";

export const metadata = {
  title: "Observatorio CITE",
  description: "Centro de Investigación en Tecnología Educativa",
};

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
