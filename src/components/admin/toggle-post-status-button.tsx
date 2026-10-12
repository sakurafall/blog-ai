"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { togglePostPublished } from "@/app/admin/posts/actions";
import type { PostMutationState } from "@/features/posts/post-action.types";

type TogglePostStatusButtonProps = {
  id: number;
  published: boolean;
};

const initialState: PostMutationState = {};

export function TogglePostStatusButton({
  id,
  published,
}: TogglePostStatusButtonProps) {
  const [state, formAction, pending] = useActionState(
    togglePostPublished,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input
        type="hidden"
        name="published"
        value={String(published)}
      />

      <button
        type="submit"
        disabled={pending}
        className="text-sm text-gray-600 hover:text-gray-950"
      >
        {pending
          ? "处理中...": published ? "设为草稿": "发布"
        }
      </button> 
    </form>
  );
}