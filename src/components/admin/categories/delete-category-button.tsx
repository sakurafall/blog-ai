"use client"

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/admin/categories/action";

import type { SubmitEvent  } from "react";


type DeleteCategoryButtonProps = {
  id: number,
  name: string
}

export function DeleteCategoryButton({
  id, 
  name
}: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    // ① 阻止浏览器默认提交
    event.preventDefault();

    // ② 正在删除时，不允许重复提交
    if (isPending) return;

    // ③ 让用户确认
    const confirmed = window.confirm(
      `确认删除《${name}》吗？`
    );

    if (!confirmed) return;

    // ④ 获取表单数据
    const formData = new FormData(event.currentTarget);

     // ⑤ 开始异步操作
    startTransition(async () => {
      const result = await deleteCategory(formData);
      
      // ⑥ 处理可预期的业务错误
      if (result?.success === false) {
        toast.error(result.error);
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />

      <button
        type="submit"
        disabled={isPending}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isPending ? "删除中..." : "删除"}
      </button>
    </form>
  );
}