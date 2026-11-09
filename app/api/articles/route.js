// =============================================================================
// app/api/articles/route.js — API REST de artículos  →  /api/articles
// -----------------------------------------------------------------------------
// En el App Router, un archivo `route.js` dentro de /app/api crea un "endpoint"
// (una URL que devuelve datos, no una página). Cada función exportada con el
// nombre de un método HTTP responde a ese método:
//   GET  /api/articles   → lista artículos (con búsqueda, filtros y paginación)
//   POST /api/articles   → crea un artículo nuevo (sólo admin)
// Este código SIEMPRE corre en el servidor; el navegador nunca lo ve.
// =============================================================================

// NextResponse sirve para construir la respuesta HTTP (JSON, código de estado...).
import { NextResponse } from "next/server";
import Article from "@/models/Article";
import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import { createUniqueSlug, parseAuthors, pickApaFields } from "@/lib/articles";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = 3600;

// Máximo de registros por página: el público pagina, el admin carga la tabla completa
const MAX_LIMIT_PUBLIC = 100;
const MAX_LIMIT_ADMIN = 1000;

// Filtros de metadatos: búsqueda parcial (sin distinguir mayúsculas) o valor exacto
const PARTIAL_FILTERS = ["journalName", "publisher", "degree", "institution", "conferenceName", "location", "materialType"];
const EXACT_FILTERS = ["volume", "issue", "pages", "edition", "reportNumber", "doiOrUrl"];

// Helper para crear RegExp seguro
// Escapa los caracteres especiales de las regex (. * + ? etc.) para que lo que
// escribe el usuario se busque literalmente. Sin esto, buscar "c++" rompería la
// consulta. La "i" hace que no distinga mayúsculas de minúsculas.
const makeSafeRegex = (text) => {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

// GET /api/articles?q=...&category=...&page=2&limit=6&sort=recent
// Los filtros llegan como "query params" (lo que va después del ? en la URL).
export async function GET(request) {
  try {
    await dbConnect();

    // searchParams permite leer los parámetros: searchParams.get("page") → "2"
    const { searchParams } = new URL(request.url);
    // Atajo: lee un parámetro y le quita espacios (undefined si no viene).
    const param = (name) => searchParams.get(name)?.trim();

    // Los borradores solo los ve el administrador
    const isAdmin = Boolean(await getAdminSession());

    const q = param("q");
    const category = param("category");
    const author = param("author");
    const year = param("year");
    const sort = searchParams.get("sort") || "recent";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const maxLimit = isAdmin ? MAX_LIMIT_ADMIN : MAX_LIMIT_PUBLIC;
    const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get("limit")) || 6));
    const typeOfComponent = param("typeOfComponent");

    // `filter` es el objeto de consulta de MongoDB. Lo vamos armando pieza por
    // pieza según los parámetros que lleguen; si no llega ninguno, queda {}
    // (que significa "todos los documentos").
    const filter = {};
    if (!isAdmin) filter.published = { $ne: false };

    // Filtro por tipo de componente
    if (typeOfComponent) {
      if (typeOfComponent === "article") {
        filter.typeOfComponent = { $in: ["article", null, ""] };
      } else {
        filter.typeOfComponent = typeOfComponent;
      }
    }

    // Búsqueda general
    // `$or`: el artículo coincide si el texto aparece en CUALQUIERA de estos campos.
    if (q) {
      const regex = makeSafeRegex(q);
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { author: regex },
        { journalName: regex },
        { publisher: regex },
        { institution: regex },
        { conferenceName: regex },
      ];
    }

    // Filtros estándar
    if (category) filter.category = category;
    if (author) filter.author = makeSafeRegex(author);

    if (year) {
      const parsedYear = Number(year);
      if (!isNaN(parsedYear)) {
        const startOfYear = new Date(`${parsedYear}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${parsedYear}-12-31T23:59:59.999Z`);
        filter.dateOfPublication = { $gte: startOfYear, $lte: endOfYear };
      }
    }

    // Metadatos específicos
    for (const field of PARTIAL_FILTERS) {
      const value = param(field);
      if (value) filter[field] = makeSafeRegex(value);
    }
    for (const field of EXACT_FILTERS) {
      const value = param(field);
      if (value) filter[field] = value;
    }

    // Traduce el valor de `sort` a un orden de MongoDB (1 = ascendente, -1 = descendente).
    const SORT_MAP = {
      recent: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const sortQuery = SORT_MAP[sort] || SORT_MAP.recent;
    // Paginación: en la página 3 con limit 6 saltamos (3-1)*6 = 12 resultados.
    const skip = (page - 1) * limit;


 // Usamos searchParams.toString() para capturar exactamente lo que el usuario
// escribió en la URL (ej. "author=juan&page=1") y usarlo como llave única.
const cacheKey = `articles-cache-${isAdmin ? "admin" : "public"}-${searchParams.toString()}`;

    // 3. Envolver la consulta a MongoDB en unstable_cache
    // unstable_cache (de Next.js) guarda el resultado en la caché del servidor.
    // La siguiente petición con la misma llave no toca la BD. El "tag"
    // "articles" permite borrar esta caché con revalidateTag("articles")
    // cuando se crea, edita o elimina un artículo (ver POST, PUT y DELETE).
    const getCachedArticles = unstable_cache(
      async () => {
        // Promise.all ejecuta las dos consultas EN PARALELO y espera a ambas:
        // la página de resultados y el total (para calcular cuántas páginas hay).
        return await Promise.all([
          Article.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
          Article.countDocuments(filter),
        ]);
      },
      [cacheKey], // Si alguien más busca exactamente lo mismo, usa esta llave
      { revalidate: 3600, tags: ["articles"] } // 1 hora, o hasta que se cree, edite o borre un artículo
    );

    // 4. Ejecutar la función en caché en lugar de consultar a Mongoose directamente
    // Desestructuración de arreglos: el 1er resultado va a `articles`, el 2º a `total`.
    const [articles, total] = await getCachedArticles();

    return NextResponse.json({
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error en GET /api/articles:", error);
    return NextResponse.json(
      { message: "Error al obtener artículos" },
      { status: 500 }
    );
  }
}
// POST /api/articles — crea un artículo. El cuerpo (body) llega como JSON.
export async function POST(request) {
  // Primero verificamos que sea un admin. 401 = "No autorizado".
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    await dbConnect();

    // Convierte el cuerpo JSON de la petición en un objeto JavaScript.
    const body = await request.json();

    // Desestructuración de objetos: saca esas propiedades de `body` a variables.
    const {
      title,
      description,
      content,
      category,
      imageUrl,
      dateOfPublication,
      typeOfComponent
    } = body;
    const authors = parseAuthors(body.author);

    // Validación en el servidor: aunque el formulario ya valide, nunca hay que
    // confiar sólo en el navegador (cualquiera puede mandar peticiones a mano).
    // 400 = "Petición incorrecta".
    if (!title || !description || !content || !category || authors.length === 0 || dateOfPublication === undefined || typeOfComponent === undefined) {
      return NextResponse.json(
        {
          message:
            "Título, autor, tipo de contenido, descripción, fecha, contenido y categoría son obligatorios",
        },
        { status: 400 }
      );
    }

    const article = new Article({
      title,
      author: authors,
      slug: await createUniqueSlug(title),
      description,
      content,
      category,
      imageUrl: imageUrl || "",
      dateOfPublication: dateOfPublication || new Date(),
      typeOfComponent: typeOfComponent || "other",
      ...pickApaFields(body), // Datos para citación APA
      published: true, // Todos los recursos se publican al crearse
    });

    const saved = await article.save();

    // Borra la caché para que el sitio muestre el artículo nuevo de inmediato:
    // revalidateTag  → invalida todo lo guardado con unstable_cache y tag "articles".
    // revalidatePath → regenera las páginas ISR (desde "/" hacia abajo).
    revalidateTag("articles");
    revalidatePath("/", "layout");

    // 201 = "Creado".
    return NextResponse.json(saved, {
      status: 201,
    });

  } catch (error) {
    console.error("Error al crear el artículo:", error);

    // Los errores de validación de Mongoose sí son útiles para quien llena el formulario
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error al crear el artículo" },
      { status: 500 }
    );
  }
}
