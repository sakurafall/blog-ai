import Link from "next/link";
import { getAllPostsForAdmin } from "@/features/posts/post.queries";
import { DeletePostButton } from "@/components/delete-post-button";

export const metadata = {
  title: "文章管理",
};

export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            文章管理
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            管理博客中的所有文章。
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          新建文章
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">标题</th>
              <th className="px-4 py-3 font-medium">分类</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">创建时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-t border-gray-200"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {post.title}
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    /posts/{post.slug}
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {post.category}
                </td>

                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                      已发布
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      草稿
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-blue-600"
                    >
                      查看
                    </Link>

                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="hover:text-blue-600"
                    >
                      编辑
                    </Link>

                    <DeletePostButton
                      id={post.id}
                      title={post.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}