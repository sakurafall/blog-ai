"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/prisma/db";
import { postSchema } from "@/features/posts/post.schema";

export type PostActionState = {
  error?: string;

  // 手写
  // fieldErrors?: {
  //   title?: string[];
  //   slug?: string[];
  //   category?: string[];
  //   description?: string[];
  //   content?: string[];
  // };

  // 索引签名自动匹配（有很多字段）
  fieldErrors?: Record<string, string[] | undefined>;
};

function getPostFormData(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const formValues = getPostFormData(formData);

  const result = postSchema.safeParse(formValues);

  if (!result.success) {
    const errors = z.flattenError(result.error);
  
    return {
      error: "请检查表单内容",
      fieldErrors: errors.fieldErrors,
    };
  }

  const data = result.data;

  const existingPost = await db.orm.public.Post.where({
    slug: data.slug,
  }).first();

  if (existingPost) {
    return {
      error: "这个 Slug 已经被使用，请换一个",
    };
  }

  await db.orm.public.Post.create(data);

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");

  redirect(`/posts/${data.slug}`);
}

export async function updatePost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      error: "文章 ID 不存在",
    };
  }

  const formValues = getPostFormData(formData);
  const result = postSchema.safeParse(formValues);

  if (!result.success) {
    const errors = z.flattenError(result.error);
  
    return {
      error: "请检查表单内容",
      fieldErrors: errors.fieldErrors,
    };
  }

  const data = result.data;

  const existingPost = await db.orm.public.Post.where({
    slug: data.slug,
  }).first();

  if (existingPost && existingPost.id !== id) {
    return {
      error: "这个 Slug 已经被其他文章使用",
    };
  }

  await db.orm.public.Post.where({
    id,
  }).update(data);

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${data.slug}`);

  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("文章 ID 不存在");
  }

  await db.orm.public.Post.where({
    id,
  }).delete();

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
}