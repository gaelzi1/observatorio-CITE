import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";  
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    //  LÓGICA DE BASE DE DATOS
    await dbConnect();
    const adminUser = await Admin.findOne({ email });
    if (!adminUser|| !(await bcrypt.compare(password, adminUser.password))){
      return NextResponse.json(
        {mensage: "Correo o contraseña incorrecto"},
        {status:401}
      )
    }
    
   
   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
   
   const token = await new SignJWT({
    id:adminUser._id,
    email:adminUser.email,
    role: adminUser.role
   })
   .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Expira en 1 día
      .sign(secret);

    cookies().set("sesion_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    });

   
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.log("error en el inicio de sesion", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}