import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Panel administrativo | Observatorio CITE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const adminSession = await getAdminSession();
  if (!adminSession) redirect("/login");

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader email={adminSession.email} />
      {children}
    </div>
  );
}
