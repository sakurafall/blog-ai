"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AdminToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");

    if (!success) {
      return;
    }

    if (success === "created") {
      toast.success("文章创建成功", { id: "post-action-success" });
    }

    if (success === "updated") {
      toast.success("文章保存成功", { id: "post-action-success" });
    }

    if (success === "deleted") {
      toast.success("文章删除成功", { id: "post-action-success" });
    }

    // 显示一次以后，把提示参数清掉，如果有其他参数保留
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("success");

    const query = params.toString();

    router.replace(
      query ? `/admin/posts?${query}` : "/admin/posts",
      { scroll: false }
    );
  }, [searchParams, router]);

  return null;
}
