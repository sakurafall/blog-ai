import Link from "next/link";
import { Container } from "@/components/container";
import { getPostBySlugFromDb } from "@/features/posts/post.queries";
import { notFound } from "next/navigation";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const { slug } = await params;

  const post = await getPostBySlugFromDb(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen py-16">
      <Container className="max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← 返回首页
        </Link>

        <article className="mt-10">
          <div className="mb-4 flex gap-3 text-sm text-gray-500">
            <span>
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </span>
            <span>·</span>
            <span>{post.category}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {post.description}
          </p>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <p className="leading-8 text-gray-700">{post.content}</p>
          </div>
        </article>
      </Container>
    </main>
  );
}