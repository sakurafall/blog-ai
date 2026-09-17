import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PostForm } from "@/components/admin/post-form";
import { updatePost } from "@/app/admin/posts/actions";
import { getPostByIdForAdmin } from "@/features/posts/post.queries";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "编辑文章",
  description: "编辑博客文章",
};

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { id } = await params;

  const postId = Number(id);

  if (!postId) {
    notFound();
  }

  const post = await getPostByIdForAdmin(postId);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen py-16">
      <Container className="max-w-3xl">
        <Link
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← 返回文章管理
        </Link>

        <div className="mt-10">
          <h1 className="text-4xl font-bold tracking-tight">
            编辑文章
          </h1>

          <p className="mt-4 text-gray-600">
            修改文章内容并保存。
          </p>
        </div>

        <div className="mt-10">
          <PostForm
            action={updatePost}
            post={post}
            submitText="保存修改"
          />
        </div>
      </Container>
    </main>
  );
}