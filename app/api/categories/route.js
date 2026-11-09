// =============================================================================
// app/api/categories/route.js  →  GET /api/categories
// -----------------------------------------------------------------------------
// Devuelve la lista de categorías distintas que existen en los artículos
// publicados (para llenar el filtro de categorías de la biblioteca).
// =============================================================================

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
        // distinct() devuelve los valores únicos de un campo.
        // `$nin` = "not in": excluye categorías nulas o vacías.
        const uniqueCategories = await Article.distinct("category", {
          category: { $nin: [null, ""] },
          published: { $ne: false }, // Las categorías de borradores no se muestran
        });
        // localeCompare ordena alfabéticamente respetando acentos y la ñ.
        return uniqueCategories.sort((a, b) => a.localeCompare(b));
      },
      // Llave de la caché (única para esta consulta) y opciones de invalidación.
      ['categories-cache-global'],
      { revalidate: 3600, tags: ["articles"] }
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