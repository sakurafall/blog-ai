// 权限、业务校验、数据库写入

'use server'

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/prisma/db";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getCategoryFormData } from "@/features/categories/category.form";
import { categorySchema } from "@/features/categories/category.schema";
import { revalidatePath } from "next/cache";
import { getCategoryByIdForAdmin } from "@/features/categories/category.queries";

export type CategoryActionState = {
  error?: string;

  // 手写
  fieldErrors?: {
    name?: string[];
    slug?: string[];
  };

  // 索引签名自动匹配（有很多字段）
  // fieldErrors?: Record<string, string[] | undefined>;
};

// 创建分类
export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  // 确认当前请求有管理员权限
  await requireAdmin()

  // 格式化表单数据
  const formValues = getCategoryFormData(formData);

  // 通过zod验证数据
  const result = categorySchema.safeParse(formValues);

  if (!result.success) {
    const errors = z.flattenError(result.error);
  
    return {
      error: "请检查表单内容",
      fieldErrors: errors.fieldErrors,
    };
  }

  // 业务校验：检查name和slug是否重复等业务规则
  const data = result.data;

  const categoryWithSameName = await db.orm.public.Category.where({
    name: data.name,
  })
  .first();

  if (categoryWithSameName) {
    return {
      error: "这个分类名称已经存在",
      fieldErrors: {
        name: ["分类名称不能重复"],
      },
    };
  }

  const categoryWithSameSlug = await db.orm.public.Category.where({
    slug: data.slug,
  }).first();

  if (categoryWithSameSlug) {
    return {
      error: "这个 Slug 已经被使用，请换一个",
      fieldErrors: {
        slug: ["Slug 不能重复"],
      },
    };
  }

  // 执行数据库写入
  await db.orm.public.Category.create(data);
  
  // 让相关页面缓存失效，重新获取数据
  revalidatePath("/admin/categories");
  
  // 跳转到目标页面
  redirect("/admin/categories?success=created");
}

// 更新分类
export async function updateCategory(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  // 权限校验
  await requireAdmin()

  // 校验 id 是合法正整数
  const id = Number(formData.get('id'))

  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      error: 'id不符合规则',
    }
  }

  // 检查数据是否合规
  const formDataValue = getCategoryFormData(formData)
  const result = categorySchema.safeParse(formDataValue)

  if (!result.success) {
    const errors = z.flattenError(result.error);
  
    return {
      error: "请检查表单内容",
      fieldErrors: errors.fieldErrors,
    };
  }

  const data = result.data;

  // 查询 currentCategory
  const currentCategory = await db.orm.public.Category
  .where({ id })
  .first();

  if (!currentCategory) {
    return {
      error: "分类不存在",
    };
  }

  // 校验 name 冲突
  const categoryWithSameName = await db.orm.public.Category.where({
    name: data.name,
  })
  .first();

  if (categoryWithSameName && categoryWithSameName.id !== id) {
    return {
      error: "这个分类名称已经存在",
      fieldErrors: {
        name: ["分类名称不能重复"],
      },
    };
  }

  // 校验 slug 冲突
  const categoryWithSameSlug = await db.orm.public.Category.where({
    slug: data.slug,
  }).first();

  if (categoryWithSameSlug && categoryWithSameSlug.id !== id) {
    return {
      error: "这个 Slug 已经被使用，请换一个",
      fieldErrors: {
        slug: ["Slug 不能重复"],
      },
    };
  }

  await db.orm.public.Category.where({id}).update(data)

  // 让相关页面缓存失效，重新获取数据
  revalidatePath("/admin/categories");
  
  // 跳转到目标页面
  redirect("/admin/categories?success=updated");
}

// 删除分类
export async function deleteCategory(formData: FormData) {
  await requireAdmin()

  const id = Number(formData.get('id'))

  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      success: false as const,
      error: '分类 ID 格式不合法'
    }
  }

  const currentCategory = await getCategoryByIdForAdmin(id)

  if (!currentCategory) {
    return {
      success: false as const,
      error: '当前分类不存在'
    }
  }

  const postInCategory  = await db.orm.public.Post.where({
    categoryId: id
  }).first()

  if (postInCategory) {
    return {
      success: false as const,
      error: '该分类下还有文章，不能删除'
    }
  }

  try {
    await db.orm.public.Category.where({
      id
    }).delete()
  } catch (error) {
    console.error("删除分类数据库操作失败", error);

    return {
      success: false as const,
      error: "删除失败，请稍后重试",
    };
  }

  revalidatePath("/admin/categories")
  redirect("/admin/categories?success=deleted")
}