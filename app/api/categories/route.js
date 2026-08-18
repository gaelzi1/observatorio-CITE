export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
// IMPORTANTE: Ajusta estas rutas de importación según la estructura de tu proyecto
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article"; 

export async function GET() {
  try {
    // 1. Conectar a la base de datos
    await dbConnect();

    // 2. Obtener categorías únicas de los artículos publicados
    const uniqueCategories = await Article.distinct("category", { 
      category: { $nin: [null, ""] } 
    });

    // 3. Ordenar alfabéticamente
    const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));

    // 4. Devolver la respuesta en formato JSON
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