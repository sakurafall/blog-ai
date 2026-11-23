import Link from "next/link";
import { getAllCategories } from "@/features/categories/category.queries";
import { DeleteCategoryButton } from "@/components/admin/categories/delete-category-button";
import { AdminToast } from "@/components/admin/admin-toast";

export const metadata = {
  title: "分类管理",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <AdminToast 
        messages={{
          created: "分类创建成功",
          updated: "分类保存成功",
          deleted: "分类删除成功",
        }}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            分类管理
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            管理博客中的所有分类。
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          新建分类
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">创建时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t border-gray-200"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {category.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {category.slug}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(category.createdAt).toLocaleDateString("zh-CN")}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="hover:text-blue-600"
                    >
                      编辑
                    </Link>

                    <DeleteCategoryButton 
                      id={category.id}
                      name={category.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}