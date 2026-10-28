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
const makeSafeRegex = (text) => {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
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

    const SORT_MAP = {
      recent: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const sortQuery = SORT_MAP[sort] || SORT_MAP.recent;
    const skip = (page - 1) * limit;


 // Usamos searchParams.toString() para capturar exactamente lo que el usuario
// escribió en la URL (ej. "author=juan&page=1") y usarlo como llave única.
const cacheKey = `articles-cache-${isAdmin ? "admin" : "public"}-${searchParams.toString()}`;

    // 3. Envolver la consulta a MongoDB en unstable_cache
    const getCachedArticles = unstable_cache(
      async () => {
        return await Promise.all([
          Article.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
          Article.countDocuments(filter),
        ]);
      },
      [cacheKey], // Si alguien más busca exactamente lo mismo, usa esta llave
      { revalidate: 3600, tags: ["articles"] } // 1 hora, o hasta que se cree, edite o borre un artículo
    );

    // 4. Ejecutar la función en caché en lugar de consultar a Mongoose directamente
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
export async function POST(request) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();

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
      published: true, // Por defecto, se marca como publicado al crear
    });

    const saved = await article.save();

    revalidateTag("articles");
    revalidatePath("/", "layout");

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
