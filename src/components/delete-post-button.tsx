"use client";

import { deletePost } from "@/app/admin/posts/actions";

type DeletePostButtonProps = {
  id: number;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        const confirmed = window.confirm(`确认删除《${title}》吗？`);

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />

      <button type="submit" className="text-red-600 hover:text-red-800">
        删除
      </button>
    </form>
  );
}