import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article"; 

// Guarda la respuesta en la RAM del servidor por 1 hora
export const revalidate = 3600;

export async function GET() {
  try {
    await dbConnect();

    const uniqueCategories = await Article.distinct("category", { 
      category: { $nin: [null, ""] } 
    });

    const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ 
      success: true, 
      data: sortedCategories 
    });

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar las categorías" },
      { status: 500 }
    );
  }
}