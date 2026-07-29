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

    const { id } = await params;
    const body = await request.json();

    const article = await Article.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        content: body.content,
        category: body.category,
        imageUrl: body.imageUrl,
        published: body.published,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return NextResponse.json(
        { message: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);

  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar el artículo",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return NextResponse.json(
        { message: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Artículo eliminado correctamente",
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al eliminar el artículo",
        error: error.message,
      },
      { status: 500 }
    );
  }
 
}