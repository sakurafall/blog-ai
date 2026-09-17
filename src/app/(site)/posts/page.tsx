import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/features/posts/post.queries";

export const metadata = {
  title: "文章",
  description: "所有文章列表",
};

export default async function PostsPage() {
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen py-16">
      <Container>
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">文章</h1>

          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            这里整理了我关于 TypeScript 全栈、Next.js、AI、产品实践和成长复盘的文章。
          </p>
        </section>

        <section>
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}