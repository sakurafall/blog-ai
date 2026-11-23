import { CategoryForm } from "@/components/admin/categories/category-form"
import { createCategory } from "@/app/admin/categories/action"

export default async function NewCategoryPage() {

  return (
    <div>
      <CategoryForm 
        action={createCategory}
        submitText="创建分类"
      />
    </div>
  )
}