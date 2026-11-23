// 从 params 拿 id
// 把它转换成 number
// 校验是不是合法正整数
// 调 getCategoryByIdForAdmin
// 不存在就 notFound()
// 把查询出来的 category 传给 CategoryForm
// action={updateCategory} 可以先暂时留着，如果 updateCategory 还没写，就先不要导入

import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/categories/category-form"
import { getCategoryByIdForAdmin } from "@/features/categories/category.queries"
import { updateCategory } from "../../action";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function EditCategoryPage({params}: EditCategoryPageProps)  {
  const { id } = await params;

  const categoryId = Number(id);

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
    notFound();
  }

  const category = await getCategoryByIdForAdmin(categoryId)

  if (!category) {
    notFound()
  }

  return (
    <CategoryForm 
      action={updateCategory}
      category={category}
    />
  )
}