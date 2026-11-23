"use client";

import { useActionState } from "react";
import type { CategoryActionState } from "@/app/admin/categories/action";
import type { CategoryFormData } from "@/features/categories/category.types"

// 第一版只要求：
// - "use client"
// - 两个字段：`name`、`slug`
// - 使用 useActionState
// - 能显示 state.error
// - 能显示 fieldErrors.name
// - 能显示 fieldErrors.slug
// - 提交按钮有 pending
// - 接收外部传进来的 action

type CategoryFormProps = {
  action: (
    state: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;

  // post可选，组件支持两种模式（新建/编辑）
  category?: CategoryFormData;
  submitText?: string;
};

const initialState: CategoryActionState = {};

export function CategoryForm({
  action,
  category,
  submitText = "保存分类",
}: CategoryFormProps) {

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  )

  return (
    <form action={formAction} className="space-y-6">
      {category?.id && (
        <input type="hidden" name="id" value={category.id} />
      )}

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium"
        >
          名称
        </label>
        <div>
          <input 
            type="text" 
            name="name" 
            defaultValue={category?.name}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        {state.fieldErrors?.name && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium"
        >
          Slug
        </label>
        <div>
          <input 
            type="text" 
            name="slug" 
            defaultValue={category?.slug} 
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        {state.fieldErrors?.slug && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.slug[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "保存中..." : submitText}
      </button>
    </form>
  )
} 