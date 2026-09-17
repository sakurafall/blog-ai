import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link
              href="/admin/posts"
              className="text-lg font-semibold text-gray-900"
            >
              Sakura Admin
            </Link>
          </div>

          <nav className="space-y-1 p-4">
            <Link
              href="/admin/posts"
              className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              文章管理
            </Link>

            <Link
              href="/admin/posts/new"
              className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              新建文章
            </Link>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="text-sm text-gray-500">
              博客管理后台
            </div>

            <div className="flex items-center gap-4">
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
    </div>
  );
}