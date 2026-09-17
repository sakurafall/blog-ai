import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <main className="min-h-screen py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-sm font-medium text-gray-500">404</p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          文章不存在
        </h1>

        <p className="mt-4 leading-7 text-gray-600">
          这篇文章可能已经被删除，或者链接地址不正确。
        </p>

        <Link
          href="/posts"
          className="mt-8 inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          返回文章列表
        </Link>
      </Container>
    </main>
  );
}