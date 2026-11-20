"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "仪表盘",
    href: "/admin",
    match: (pathname: string) => pathname === "/admin",
  },
  {
    label: "文章管理",
    href: "/admin/posts",
    match: (pathname: string) =>
      pathname === "/admin/posts" ||
      /^\/admin\/posts\/\d+\/edit$/.test(pathname),
  },
  {
    label: "新建文章",
    href: "/admin/posts/new",
    match: (pathname: string) =>
      pathname === "/admin/posts/new",
  },
  {
    label: "分类管理",
    href: "/admin/categories",
    match: (pathname: string) =>
      pathname === "/admin/categories",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link
          href="/admin"
          className="text-lg font-semibold text-gray-900"
        >
          Sakura Admin
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}