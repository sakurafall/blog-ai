import Link from "next/link";
import type { PostListItem } from "@/features/posts/post.types";

type PostCardProps = {
  post: PostListItem;
};


export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-gray-200 pb-8">
      <div className="mb-2 flex gap-3 text-sm text-gray-500">
        <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
        <span>·</span>
        <span>{post.category}</span>
      </div>

      <h3 className="text-xl font-semibold">
        <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 leading-7 text-gray-600">{post.description}</p>
    </article>
  );
}