// =============================================================================
// app/api/articles/[id]/route.js — Un artículo concreto  →  /api/articles/:id
// -----------------------------------------------------------------------------
// Los corchetes en el nombre de la carpeta ([id]) crean un SEGMENTO DINÁMICO:
// /api/articles/abc123 y /api/articles/mi-slug llegan aquí, y el valor de la
// URL se recibe en `params.id`.
//   GET    → obtiene un artículo por slug o por _id
//   PUT    → lo actualiza (sólo admin)
//   DELETE → lo elimina (sólo admin)
// =============================================================================

import { NextResponse } from "next/server";
import Article from "@/models/Article";
import dbConnect from "@/lib/mongodb";
import { createUniqueSlug, parseAuthors, pickApaFields } from "@/lib/articles";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

// El segundo argumento trae `params` con los segmentos dinámicos de la URL.
export async function GET(request, { params }) {
  try {
    await dbConnect();

    // En versiones nuevas de Next.js `params` es una promesa; Promise.resolve
    // hace que funcione tanto si es promesa como si es un objeto normal.
    const resolvedParams = await Promise.resolve(params);
    const identifier = resolvedParams.slug || resolvedParams.id;

    if (!identifier) {
      return NextResponse.json({ message: "Identificador no proporcionado" }, { status: 400 });
    }

    // Creamos una función en caché única para este identificador específico
    const getCachedArticle = unstable_cache(
      async (idToFind) => {
        // Usamos $or para que funcione sin importar si el frontend mandó el Slug o el _id de MongoDB
        // .lean() convierte el documento de Mongoose a JSON puro, acelerando la respuesta
        return await Article.findOne({
          $or: [
            { slug: idToFind },
            // Solo buscamos por _id si el identificador tiene 24 caracteres (formato válido de ObjectId)
            ...(idToFind.length === 24 ? [{ _id: idToFind }] : [])
          ]
        }).lean();
      },
      [`article-cache-${identifier}`], // Llave única: ej. "article-cache-mi-primer-post"
      { revalidate: 3600, tags: ["articles"] } // Se invalida al crear, editar o borrar
    );

    const article = await getCachedArticle(identifier);

    // Los borradores solo los puede ver el administrador
    if (!article || (article.published === false && !(await getAdminSession()))) {
      return NextResponse.json(
        { message: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    return NextResponse.json(
      { message: "Error al obtener el artículo" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  try {
    await dbConnect();

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.slug || resolvedParams.id; // Intentamos obtener el slug o el id

   

    if (!id) {
      return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
    }

    const body = await request.json();

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return NextResponse.json({ message: "Artículo no encontrado" }, { status: 404 });
    }

    // El slug no cambia al editar para no romper enlaces ya compartidos
    const finalSlug = existingArticle.slug || (await createUniqueSlug(body.title, id));

    // returnDocument: "after" → devuelve el artículo YA actualizado.
    // runValidators: true     → aplica las reglas del Schema también al editar.
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: body.title,
        author: parseAuthors(body.author),
        slug: finalSlug,
        description: body.description,
        content: body.content,
        category: body.category,
        imageUrl: body.imageUrl || "",
        dateOfPublication: body.dateOfPublication,
        typeOfComponent: body.typeOfComponent || "other",
        ...pickApaFields(body),
      },
      {
        returnDocument: "after",  
        runValidators: true,
      }
    );
    // Limpia la caché para que el cambio se vea en todo el sitio.
    revalidateTag("articles");
    revalidatePath("/", "layout");

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Error en PUT /api/articles/[id]:", error);
    // CastError ocurre cuando el id no tiene formato válido de ObjectId.
    if (error.name === "ValidationError" || error.name === "CastError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error al actualizar el artículo" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/:id — sólo acepta el _id de MongoDB (no el slug).
export async function DELETE(request, { params }) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  try {
   
    await dbConnect();

    
    const resolvedParams = await params;
    const identifier = resolvedParams.id; 

    const deletedArticle = await Article.findByIdAndDelete(identifier);
    
    if (!deletedArticle) {
      return NextResponse.json(
        { message: "Artículo no encontrado o ya fue eliminado." },
        { status: 404 }
      );
    }

    revalidateTag("articles");
    revalidatePath("/", "layout");

    // 5. ¡Éxito! Regresamos un JSON válido para que tu frontend sea feliz
    return NextResponse.json(
      { message: "Artículo eliminado correctamente." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { message: "Hubo un problema al procesar la eliminación." },
      { status: 500 }
    );
  }
}