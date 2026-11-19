"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/prisma/db";
import { requireAdmin } from "@/lib/auth/require-admin";
import { postSchema } from "@/features/posts/post.schema";
import { getPostFormData } from "@/features/posts/post.form";
import { revalidatePostPages } from "@/features/posts/post.revalidate";
import type { PostMutationState } from "@/features/posts/post-action.types";

import { AppError } from "@/lib/errors/app-error";
import { ERROR_CODES } from "@/lib/errors/error-codes";

// 鉴权
// → 取表单数据
// → Zod 校验
// → 查重
// → 数据库操作
// → revalidate
// → redirect

export type PostActionState = {
  error?: string;

  // 手写
  fieldErrors?: {
    title?: string[];
    slug?: string[];
    categoryId?: string[];
    description?: string[];
    content?: string[];
  };

  // 索引签名自动匹配（有很多字段）
  // fieldErrors?: Record<string, string[] | undefined>;
};

// 文章创建
export async function createPost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  // 确认当前请求有管理员权限
  await requireAdmin()

  // 格式化表单数据
  const formValues = getPostFormData(formData);

  // 通过zod验证数据
  const result = postSchema.safeParse(formValues);

  if (!result.success) {
    const errors = z.flattenError(result.error);
  
    return {
      error: "请检查表单内容",
      fieldErrors: errors.fieldErrors,
    };
  }

  // 业务校验：检查slug是否重复等业务规则
  const data = result.data;

  const existingPost = await db.orm.public.Post.where({
    slug: data.slug,
  }).first();

  if (existingPost) {
    return {
      error: "这个 Slug 已经被使用，请换一个",
    };
  }

  // 业务校验：检验文章分类是否存在
  const category =
    await db.orm.public.Category
      .where({
        id: data.categoryId,
      })
      .first();

  if (!category) {
    return {
      error: "请选择有效的文章分类",
      fieldErrors: {
        categoryId: ["该分类不存在"],
      },
    };
  }

  // 执行数据库写入
  await db.orm.public.Post.create(data);

  // 让相关页面缓存失效，重新获取数据
  revalidatePostPages(data.slug);

  // 跳转到目标页面
  // redirect(`/posts/${data.slug}`);
  redirect("/admin/posts?success=created");
}


// 文章更新
export async function updatePost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  await requireAdmin()

  const id = Number(formData.get("id"));

  if (!id) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      "文章 ID 不存在",
    );
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

  // 业务层检验文章分类是否存在
  const category =
    await db.orm.public.Category
      .where({
        id: data.categoryId,
      })
      .first();

  if (!category) {
    return {
      error: "请选择有效的文章分类",
      fieldErrors: {
        categoryId: ["该分类不存在"],
      },
    };
  }

  await db.orm.public.Post.where({
    id,
  }).update(data);

  revalidatePostPages(data.slug);

  // redirect("/admin/posts");
  redirect("/admin/posts?success=updated");
}


// 文章删除
export async function deletePost(formData: FormData) {
  await requireAdmin();

  // 检查文章 ID 格式是否合法
  const id = Number(formData.get("id"));

  // 可预期的业务失败
  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      success: false as const,
      error: "文章 ID 格式不合法",
    };
  }

  // 检查文章是否存在
  const existingPost = await db.orm.public.Post
  .where({ id })
  .first();

  // 可预期的业务失败
  if (!existingPost) {
    return {
      success: false as const,
      error: "文章不存在",
    };
  }

  // 异常流程 (如数据库连接失败, 超时, SQL 执行异常, 连接池异常)
  try {
    await db.orm.public.Post
      .where({ id })
      .delete();
  } catch (error) {
    console.error("删除文章失败", error);

    return {
      success: false as const,
      error: "删除失败，请稍后重试",
    };
  }

  revalidatePostPages();


  // 注意点：Next.js中redirect, 它内部会通过抛出一个特殊的控制流信号来中断当前执行过程，让 Next.js 去完成跳转。
  // 放到catch中的话，会被捕获。
  redirect("/admin/posts?success=deleted");
}


// 文章发布状态切换
export async function togglePostPublished(
  _prevState: PostMutationState,
  formData: FormData,
): Promise<PostMutationState>  {
  await requireAdmin()

  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";

  if (!id) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      "文章 ID 不存在",
    );
  }

  const nextPublished = !published;

  await db.orm.public.Post.where({
    id,
  }).update({
    published: !published,
  });

  revalidatePostPages();

  return {
    success: nextPublished
      ? "文章发布成功"
      : "文章已设为草稿",
  };
}