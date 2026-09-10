import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Timeline from "@/models/Timeline";

export async function GET() {
  try {
    await dbConnect();
    
    // Obtenemos los eventos y los ordenamos por año ascendente
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