// GET /api/timeline — devuelve todos los eventos de la línea de tiempo.
// Lo consume el componente components/Timeline.jsx.
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Timeline from "@/models/Timeline";
// La respuesta se guarda en caché y se regenera como máximo cada hora.
export const revalidate = 3600;
export async function GET() {
  try {
    await dbConnect();

    // Obtenemos los eventos y los ordenamos por año ascendente
    // ({} = sin filtro, trae todos; .lean() = objetos JS simples).
    const eventos = await Timeline.find({}).sort({ year: 1 }).lean();

    // Tu componente espera que el arreglo venga dentro de la propiedad "data"
    return NextResponse.json({ data: eventos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener la línea de tiempo" },
      { status: 500 }
    );
  }
}
