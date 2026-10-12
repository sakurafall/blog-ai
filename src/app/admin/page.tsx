import Link from "next/link";
import {
  getPostStats,
  getRecentPosts,
} from "@/features/posts/post.queries";

export const metadata = {
  title: "后台首页",
};

export default async function AdminPage() {
  const [stats, recentPosts] = await Promise.all([
    getPostStats(),
    getRecentPosts(5),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">后台首页</h1>

        <p className="mt-2 text-sm text-gray-600">
          查看博客当前内容状态。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">文章总数</p>

          <p className="mt-3 text-3xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">已发布</p>

          <p className="mt-3 text-3xl font-bold">
            {stats.published}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">草稿</p>

          <p className="mt-3 text-3xl font-bold">
            {stats.drafts}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">最近文章</h2>
            <p className="mt-1 text-sm text-gray-500">
              最近创建的 5 篇文章
            </p>
          </div>

          <Link
            href="/admin/posts"
            className="text-sm font-medium text-gray-700 hover:text-gray-950"
          >
            查看全部 →
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {recentPosts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              暂时还没有文章
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString(
                          "zh-CN",
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={[
                      "rounded-full px-2 py-1 text-xs",
                      post.published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}