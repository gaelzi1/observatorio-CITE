// Inserta artículos de EJEMPLO en la base de datos (contenido ficticio).
// Uso: node --env-file=.env.local scripts/seed-articles.mjs
// Es idempotente: si ya existe un artículo con el mismo título, lo omite.
import mongoose from "mongoose";
import Article from "../models/Article.js";
import { createSlug } from "../utils/slugify.js";

const img = (id) => `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&w=1200&q=80`;

const ARTICLES = [
  {
    title: "Competencias digitales docentes en la educación media superior",
    author: ["María Fernanda López Ruiz", "Carlos Méndez Ortega"],
    category: "Tecnología Educativa",
    typeOfComponent: "journal_article",
    dateOfPublication: "2025-03-15",
    imageUrl: img("photo-1522202176988-66273c2fd55f"),
    journalName: "Revista de Innovación Educativa",
    volume: "12",
    issue: "1",
    pages: "45-62",
    description:
      "Estudio sobre el nivel de competencia digital de docentes de bachillerato a partir del marco europeo DigCompEdu.",
    content: `La transformación digital de las instituciones educativas exige que los docentes desarrollen competencias que van más allá del uso instrumental de la tecnología. Este estudio analiza el nivel de competencia digital de 320 docentes de educación media superior.

Se aplicó un cuestionario de autoevaluación basado en las seis áreas del marco DigCompEdu: compromiso profesional, contenidos digitales, enseñanza y aprendizaje, evaluación, empoderamiento del alumnado y desarrollo de la competencia digital de los estudiantes.

Los resultados muestran que la mayoría de los participantes se ubica en un nivel intermedio (B1), con fortalezas en la búsqueda y uso de contenidos digitales y áreas de oportunidad en la evaluación con herramientas digitales y en la protección de datos.

Se concluye que los programas de formación continua deben priorizar el diseño de evaluaciones digitales y la seguridad de la información, acompañados de comunidades de práctica entre pares.`,
  },
  {
    title: "Alfabetización en inteligencia artificial para estudiantes universitarios",
    author: ["Ana Sofía Ramírez Torres"],
    category: "Innovación",
    typeOfComponent: "article",
    dateOfPublication: "2025-09-02",
    imageUrl: img("photo-1488590528505-98d2b5aba04b"),
    description:
      "Reflexión sobre qué deben saber los estudiantes para usar herramientas de IA generativa de forma crítica y responsable.",
    content: `Las herramientas de inteligencia artificial generativa se han incorporado rápidamente a la vida académica. Sin embargo, su uso efectivo requiere una nueva forma de alfabetización que combine conocimientos técnicos, pensamiento crítico y ética.

Una alfabetización en IA básica incluye comprender, de manera general, cómo funcionan los modelos de lenguaje, reconocer sus limitaciones —como la generación de información incorrecta— y saber verificar los resultados con fuentes confiables.

Además, los estudiantes deben conocer las políticas de integridad académica de su institución y aprender a declarar de forma transparente cuándo y cómo utilizaron estas herramientas en sus trabajos.

Las universidades tienen la oportunidad de integrar estos contenidos de forma transversal en los planes de estudio, en lugar de tratarlos como un tema aislado.`,
  },
  {
    title: "Informe sobre brecha digital en comunidades rurales 2025",
    author: ["Observatorio de Competencias Digitales"],
    category: "Tecnología Educativa",
    typeOfComponent: "report",
    dateOfPublication: "2025-11-20",
    imageUrl: img("photo-1451187580459-43490279c0fa"),
    institution: "Observatorio de Competencias Digitales",
    reportNumber: "OCD-2025-04",
    description:
      "Diagnóstico del acceso a internet, dispositivos y habilidades digitales en hogares de comunidades rurales.",
    content: `Este informe presenta un diagnóstico sobre el acceso y uso de tecnologías digitales en comunidades rurales, con base en encuestas aplicadas a hogares y escuelas.

En el acceso, se identificó que una proporción importante de los hogares depende exclusivamente del teléfono móvil para conectarse a internet, lo que limita la realización de tareas escolares y trámites en línea.

En habilidades, las brechas más marcadas se observan en la creación de contenidos digitales y en la resolución de problemas técnicos, mientras que el uso de mensajería y redes sociales está ampliamente extendido.

El informe recomienda fortalecer los puntos de acceso comunitarios, impulsar programas de formación para familias y coordinar esfuerzos entre escuelas, gobiernos locales y organizaciones civiles.`,
  },
  {
    title: "Fundamentos de ciudadanía digital",
    author: ["Jorge Alberto Salinas Vega", "Lucía Hernández Cruz"],
    category: "Seguridad",
    typeOfComponent: "book",
    dateOfPublication: "2024-06-10",
    imageUrl: img("photo-1550751827-4bd374c3f58b"),
    publisher: "Editorial Universitaria",
    edition: "2",
    description:
      "Libro introductorio sobre derechos, responsabilidades y seguridad en entornos digitales.",
    content: `Este libro ofrece una introducción a la ciudadanía digital, entendida como el conjunto de prácticas que permiten participar de forma segura, ética y responsable en la sociedad conectada.

Los primeros capítulos abordan la identidad digital y la huella que dejamos en internet, así como la gestión de la privacidad en redes sociales y servicios en línea.

La segunda parte se centra en la seguridad: contraseñas robustas, autenticación en dos pasos, reconocimiento de fraudes y buenas prácticas para proteger dispositivos personales.

Finalmente, se discuten temas de convivencia digital, como el respeto en la comunicación en línea, la prevención del ciberacoso y la evaluación crítica de la información.`,
  },
  {
    title: "Modelo de evaluación de habilidades de programación mediante analítica de aprendizaje",
    author: ["Diego Armando Castillo Pérez"],
    category: "Ingeniería de Software",
    typeOfComponent: "thesis",
    dateOfPublication: "2025-01-28",
    imageUrl: img("photo-1504384308090-c894fdcc538d"),
    degree: "Tesis de maestría",
    institution: "Universidad Autónoma de Querétaro",
    description:
      "Propuesta de un modelo que utiliza datos de plataformas de práctica para estimar el progreso en habilidades de programación.",
    content: `Esta tesis propone un modelo para evaluar el desarrollo de habilidades de programación a partir de los datos que generan los estudiantes en plataformas de práctica en línea.

El modelo considera indicadores como el número de intentos por ejercicio, el tiempo de resolución, los tipos de error más frecuentes y la evolución de estos indicadores a lo largo del curso.

Se realizó una prueba piloto con estudiantes de primer semestre. Los resultados del modelo mostraron una correlación positiva con las calificaciones obtenidas en evaluaciones tradicionales.

Se concluye que la analítica de aprendizaje puede complementar la evaluación docente al ofrecer retroalimentación temprana y detectar a estudiantes que requieren apoyo adicional.`,
  },
  {
    title: "Guía para crear contenidos educativos accesibles",
    author: ["Paola Guadalupe Morales Díaz"],
    category: "Tecnología Educativa",
    typeOfComponent: "educational_resource",
    dateOfPublication: "2025-08-05",
    imageUrl: img("photo-1516321318423-f06f85e504b3"),
    institution: "Observatorio de Competencias Digitales",
    materialType: "Guía didáctica",
    description:
      "Recomendaciones prácticas para diseñar materiales digitales que todas las personas puedan usar.",
    content: `La accesibilidad digital garantiza que los materiales educativos puedan ser utilizados por todas las personas, incluidas aquellas con discapacidad visual, auditiva, motriz o cognitiva.

Al crear documentos y presentaciones, utilice estilos de encabezado, listas reales y un contraste de color suficiente entre el texto y el fondo. Evite transmitir información únicamente mediante el color.

Agregue texto alternativo a las imágenes que aporten información y subtítulos a los videos. En el caso de audios, ofrezca una transcripción.

Antes de publicar, revise el material con un verificador de accesibilidad y, si es posible, pida a un usuario de lector de pantalla que lo pruebe.`,
  },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("Falta MONGODB_URI (usa --env-file=.env.local)");
  await mongoose.connect(process.env.MONGODB_URI);

  for (const data of ARTICLES) {
    if (await Article.exists({ title: data.title })) {
      console.log(`Omitido (ya existe): ${data.title}`);
      continue;
    }
    let slug = createSlug(data.title);
    for (let n = 2; await Article.exists({ slug }); n++) slug = `${createSlug(data.title)}-${n}`;

    await Article.create({
      ...data,
      slug,
      dateOfPublication: new Date(data.dateOfPublication),
      published: true,
    });
    console.log(`Creado: ${data.title} -> /articles/${slug}`);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
