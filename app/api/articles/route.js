import { NextResponse } from "next/server";
import Article from "@/models/Article";
import dbConnect from "@/lib/mongodb";
import { createSlug } from "@/utils/slugify";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const author = searchParams.get("author")?.trim();
    const year = searchParams.get("year")?.trim();
    const sort = searchParams.get("sort") || "recent";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 6);
    const typeOfComponent = searchParams.get("typeOfComponent")?.trim();

    // Filtros adicionales para metadatos
    const journalName = searchParams.get("journalName")?.trim();
    const volume = searchParams.get("volume")?.trim();
    const issue = searchParams.get("issue")?.trim();
    const pages = searchParams.get("pages")?.trim();
    const publisher = searchParams.get("publisher")?.trim();
    const edition = searchParams.get("edition")?.trim();
    const degree = searchParams.get("degree")?.trim();
    const institution = searchParams.get("institution")?.trim();
    const reportNumber = searchParams.get("reportNumber")?.trim();
    const conferenceName = searchParams.get("conferenceName")?.trim();
    const location = searchParams.get("location")?.trim();
    const materialType = searchParams.get("materialType")?.trim();
    const doiOrUrl = searchParams.get("doiOrUrl")?.trim();

    // Helper para crear RegExp seguro
    const makeSafeRegex = (text) => {
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(escaped, "i");
    };
    
    const filter = {};

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
    if (journalName) filter.journalName = makeSafeRegex(journalName);
    if (volume) filter.volume = volume;
    if (issue) filter.issue = issue;
    if (pages) filter.pages = pages;
    if (publisher) filter.publisher = makeSafeRegex(publisher);
    if (edition) filter.edition = edition;
    if (degree) filter.degree = makeSafeRegex(degree);
    if (institution) filter.institution = makeSafeRegex(institution);
    if (reportNumber) filter.reportNumber = reportNumber;
    if (conferenceName) filter.conferenceName = makeSafeRegex(conferenceName);
    if (location) filter.location = makeSafeRegex(location);
    if (materialType) filter.materialType = makeSafeRegex(materialType);
    if (doiOrUrl) filter.doiOrUrl = doiOrUrl;

    const SORT_MAP = {
      recent: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const sortQuery = SORT_MAP[sort] || SORT_MAP.recent;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error en GET /api/articles:", error);

    return NextResponse.json(
      {
        message: "Error al obtener artículos",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      title,
      author,
      description,
      content,
      category,
      imageUrl,
      dateOfPublication,
      typeOfComponent
    } = body;

    if (!title || !description || !content || !category || !author || author.length === 0 || dateOfPublication === undefined || typeOfComponent === undefined) {
      return NextResponse.json(
        {
          message:
            "Título, autor, tipo de contenido, descripción, fecha, contenido y categoría son obligatorios",
        },
        { status: 400 }
      );
    }
    
    // CORRECCIÓN 1: Le damos un nombre distinto a la variable para que no choque con la función importada
    const generatedSlug = createSlug(body.title);

    const formattedAuthors = Array.isArray(author)
      ? author
      : typeof author === "string" && author.trim()
      ? author.split(",").map((a) => a.trim()).filter(Boolean)
      : [];

    const article = new Article({
      title,
      author: formattedAuthors,
      // CORRECCIÓN 2: Usamos la variable que acabamos de crear en el paso anterior
      slug: generatedSlug, 
      description,
      content,
      category,
      imageUrl: imageUrl || "",
      dateOfPublication: dateOfPublication || new Date(),
      typeOfComponent: typeOfComponent || "other",
      
      // Datos para citación APA
      journalName: body.journalName || "",
      volume: body.volume || "",
      issue: body.issue || "",
      pages: body.pages || "",
      publisher: body.publisher || "",
      edition: body.edition || "",
      degree: body.degree || "",
      institution: body.institution || "",
      reportNumber: body.reportNumber || "",
      conferenceName: body.conferenceName || "",
      location: body.location || "",
      materialType: body.materialType || "",
      doiOrUrl: body.doiOrUrl || "",
      published: true, // Por defecto, se marca como publicado al crear
    });

    const saved = await article.save();

    return NextResponse.json(saved, {
      status: 201,
    });

  } catch (error) {
    console.error("Error al crear el artículo:", error);

    return NextResponse.json(
      {
        message: "Error al crear el artículo",
        error: error.message,
      },
      { status: 400 }
    );
  }
}