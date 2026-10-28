import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Article from "@/models/Article"; 

export async function GET() {
  try {
    await dbConnect();

    // 1. Envolvemos la consulta directa a MongoDB en caché estricta
    const getCachedCategories = unstable_cache(
      async () => {
        const uniqueCategories = await Article.distinct("category", { 
          category: { $nin: [null, ""] } 
        });
        return uniqueCategories.sort((a, b) => a.localeCompare(b));
      },
      ['categories-cache-global'], 
      { revalidate: 3600 } 
    );

    // 2. Ejecutamos la función protegida
    const sortedCategories = await getCachedCategories();

    return NextResponse.json(
      { 
        success: true, 
        data: sortedCategories 
      },
      {
        // 3. Le ordenamos a Google Chrome/Edge que guarde la respuesta y no vuelva a preguntar
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar las categorías" },
      { status: 500 }
    );
  }
}