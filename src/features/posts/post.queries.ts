// 文章的查询方法

import { db } from "@/prisma/db";

export async function getPublishedPosts() {
  const posts = await db.orm.public.Post.where({
    published: true,
  }).all();

  return posts;
}

export async function getPostBySlugFromDb(slug: string) {
  const post = await db.orm.public.Post.where({
    slug,
    published: true,
  }).first();

  return post;
}

export async function getAllPostsForAdmin() {
  const posts = await db.orm.public.Post.all();

  return posts;
}

export async function getPostByIdForAdmin(id: number) {
  const post = await db.orm.public.Post.where({
    id,
  }).first();

  return post;
}

export async function getPostStats() {
  const posts = await db.orm.public.Post.all();

  const total = posts.length;
  const published = posts.filter((post) => post.published).length;
  const drafts = total - published;

  return {
    total,
    published,
    drafts,
  };
}


// 获得最近的文章（支持数量限制）
export async function getRecentPosts(limit = 5) {
  const posts = await db.orm.public.Post.all();

  return posts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

