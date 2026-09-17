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