// 数据库获取

import { db } from "@/prisma/db";

// 获取分类列表
export async function getAllCategories() {
  return db.orm.public.Category.all();
}

// 通过分类id查询分类项
export async function getCategoryByIdForAdmin(id: number) {
  return db.orm.public.Category
    .where({ id })
    .first();
}