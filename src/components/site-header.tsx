import Link from "next/link";
import { Container } from "@/components/container";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold">
          Sakura Blog
        </Link>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-950">
            首页
          </Link>
          <Link href="/posts" className="hover:text-gray-950">
            文章
          </Link>
          <Link href="/about" className="hover:text-gray-950">
            关于
          </Link>
          <Link href="/admin/posts" className="hover:text-gray-950">
            后台
          </Link>
        </nav>
      </Container>
    </header>
  );
}