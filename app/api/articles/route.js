import { NextResponse } from "next/server";
import Article from "@/models/Article";
import dbConnect from "@/lib/mongodb";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const autor = searchParams.get("autor")?.trim();
    const sort = searchParams.get("sort") || "recent";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 6;

    const filter = {
      published: true,
    };

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(escaped, "i");

      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        {autor: regex}
      ];
    }

    if (category) {
      filter.category = category;
    }

if (autor) {
  filter.autor = new RegExp(autor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

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
        .limit(limit),

      Article.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

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
      autor,
      description,
      content,
      category,
      imageUrl,
      published,
    } = body;

    if (!title || !description || !content || !category || !autor) {
      return NextResponse.json(
        {
          message:
            "Título, autor, descripción, contenido y categoría son obligatorios",
        },
        { status: 400 }
      );
    }

    const article = new Article({
      title,
      autor,
      description,
      content,
      category,
      imageUrl: imageUrl || "",
      published: true,
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