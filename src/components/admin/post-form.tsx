"use client";

import { useActionState } from "react";
import type { PostActionState } from "@/app/admin/posts/actions";
import type { PostFormData } from "@/features/posts/post.types";

type CategoryOption = {
  id: number;
  name: string;
};

type PostFormProps = {
  action: (
    state: PostActionState,
    formData: FormData,
  ) => Promise<PostActionState>;

  post?: PostFormData;
  categories: CategoryOption[]
  submitText?: string;
};

const initialState: PostActionState = {};

export function PostForm({
  action,
  categories,
  post,
  submitText = "保存文章",
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {post?.id && (
        <input type="hidden" name="id" value={post.id} />
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
          标题
        </label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={post?.title}
          placeholder="请输入文章标题"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {state.fieldErrors?.title && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.title[0]}
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

        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={post?.slug}
          placeholder="例如：learn-nextjs"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        <p className="mt-2 text-sm text-gray-500">
          文章地址：/posts/learn-nextjs
        </p>

        {state.fieldErrors?.slug && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.slug[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-900"
        >
          分类
        </label>

        <div className="relative">
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={
              post?.categoryId
                ? String(post.categoryId)
                : ""
            }
            className="
              h-11
              w-full
              appearance-none
              rounded-md
              border
              border-gray-300
              px-3
              pr-10
              text-sm
              text-gray-900
              outline-none
              transition
              focus:border-gray-900
              focus:ring-2
              focus:ring-gray-200
              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-500
            "
          >
            <option value="">
              请选择分类
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {state.fieldErrors?.categoryId?.map((error) => (
          <p
            key={error}
            className="text-sm text-red-600"
          >
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          描述
        </label>

        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={post?.description}
          placeholder="请输入文章描述"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {state.fieldErrors?.description && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium"
        >
          正文
        </label>

        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={post?.content}
          placeholder="请输入文章正文"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />

        {state.fieldErrors?.content && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.content[0]}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="published"
          type="checkbox"
          defaultChecked={post?.published ?? true}
        />

        发布文章
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "保存中..." : submitText}
      </button>
    </form>
  );
}