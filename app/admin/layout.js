
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

// Verifica que diga "export default function"
export default async function AdminLayout({ children }) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    redirect("/login");
  }

  return (
    <section className="bg-white">
      {children}
    </section>
  );
}