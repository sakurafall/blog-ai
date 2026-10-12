import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { isAdmin } from "@/lib/auth/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 登录校验
  if (!session?.user) {
    redirect("/login");
  }

  // 角色校验
  if (!isAdmin(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="text-sm text-gray-500">
              博客管理后台
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {session.user.role}
              </span>
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>

              <LogoutButton />
            </div>
          </header>

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}