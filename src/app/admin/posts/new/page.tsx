import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { createPost } from "@/app/admin/posts/actions";
import { getAllCategories } from "@/features/categories/category.queries";

export const metadata = {
  title: "新建文章",
  description: "创建一篇新的博客文章",
};

export default async function NewPostPage() {
  const categories = await getAllCategories();

  return (
      <div>
        <Link
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← 返回文章管理
        </Link>

        <div className="mt-10">
          <h1 className="text-4xl font-bold tracking-tight">
            新建文章
          </h1>

          <p className="mt-4 text-gray-600">
            创建一篇新的博客文章。
          </p>
        </div>

        <div className="mt-10">
          <PostForm
            action={createPost}
            categories={categories}
            submitText="发布文章"
          />
        </div>
      </div>
  );
}