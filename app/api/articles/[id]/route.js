import { NextResponse } from "next/server";
import Article from "@/models/Article";
import dbConnect from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const article = await Article.findById(id);

   
    if (!article) {
      return NextResponse.json(
        { message: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      {
        message: "Error al obtener el artículo",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
    }

    const body = await request.json();

    const formattedAuthors = Array.isArray(body.author)
      ? body.author
      : typeof body.author === "string" && body.author.trim()
      ? body.author.includes(";")
        ? body.author.split(";").map((a) => a.trim()).filter(Boolean)
        : [body.author.trim()]
      : [];

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: body.title,
        author: formattedAuthors,
        description: body.description,
        content: body.content,
        category: body.category,
        imageUrl: body.imageUrl || "",
        dateOfPublication: body.dateOfPublication,
        published: body.published,
        typeOfComponent: body.typeOfComponent || "other",
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
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArticle) {
      return NextResponse.json({ message: "Artículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Error en PUT /api/articles/[id]:", error);
    return NextResponse.json(
      { message: "Error al actualizar el artículo", error: error.message },
      { status: 500 }
    );
  }
}