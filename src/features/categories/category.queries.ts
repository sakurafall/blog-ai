import { db } from "@/prisma/db";

export async function getAllCategories() {
  return db.orm.public.Category.all();
}