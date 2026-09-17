import Link from "next/link";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/features/posts/post.queries";

export default async function Home() {
  const posts = await getPublishedPosts()
  
  return (
    <main className="min-h-screen py-16">
      <Container>
        <section className="mb-16">
          <p className="mb-3 text-sm text-gray-500">Hello, I'm Sakura 👋</p>

          <h1 className="text-4xl font-bold tracking-tight">
            记录技术、成长和产品实践
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            这里记录我的 TypeScript 全栈、Next.js、AI 实践，以及独立产品开发过程。
          </p>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">最新文章</h2>

            <span className="text-sm text-gray-500">
              {posts.length} 篇文章
            </span>
          </div>

          <div className="space-y-8">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/posts"
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              查看全部文章 →
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}