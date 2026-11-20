"use client";

import { useActionState } from "react";
import { CategoryActionState } from "@/app/admin/categories/action";
import { CategoryFormData } from "@/features/categories/post.types"

// 第一版只要求：
// - "use client"
// - 两个字段：`name`、`slug`
// - 使用 useActionState
// - 能显示 state.error
// - 能显示 fieldErrors.name
// - 能显示 fieldErrors.slug
// - 提交按钮有 pending
// - 接收外部传进来的 action

type PostFormProps = {
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
   submitText
}: PostFormProps) {

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  )

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <div>名字</div>
        <div>
          <input type="text" value={category?.name} />
        </div>
      </div>
      <div>
        <div>slug</div>
        <div>
          <input type="text" value={category?.slug} />
        </div>
      </div>
    </form>
  )
} 