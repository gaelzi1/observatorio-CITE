import { NextResponse } from "next/server";
import Article from "@/models/Article";
import dbConnect from "@/lib/mongodb";
import { createSlug } from "@/utils/slugify";
import { cookies } from "next/headers"; 
import { revalidatePath } from "next/cache";

export async function GET(request, { params }) {
  try {
    await dbConnect();

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
      { revalidate: 3600 } // Guarda este artículo específico en RAM por 1 hora
    );

    const article = await getCachedArticle(identifier);

    if (!article) {
      return NextResponse.json(
        { message: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    return NextResponse.json(
      { message: "Error al obtener el artículo", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  const cokieStore =cookies();
  const token = cokieStore.get("sesion_token")?.value;
  if (!token){
    return NextResponse.json({message:"no autorizado"},{status:401})
  }
  try {
    await dbConnect();
    
    const resolvedParams = await Promise.resolve(params);
     console.log("Resolved Params:", resolvedParams); // Depuración
    const id = resolvedParams.slug || resolvedParams.id; // Intentamos obtener el slug o el id

   

    if (!id) {
      return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
    }

    const body = await request.json();

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return NextResponse.json({ message: "Artículo no encontrado" }, { status: 404 });
    }

    
    const finalSlug = existingArticle.slug || createSlug(body.title);

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
        slug: finalSlug,
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
        returnDocument: "after",  
        runValidators: true,
      }
    );
    revalidatePath("/", "layout");  

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Error en PUT /api/articles/[id]:", error);
    return NextResponse.json(
      { message: "Error al actualizar el artículo", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
   const cokieStore =cookies();
  const token = cokieStore.get("sesion_token")?.value;
  if (!token){
    return NextResponse.json({message:"no autorizado"},{status:401})
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