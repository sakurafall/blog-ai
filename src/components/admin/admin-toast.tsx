"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type AdminToastProps = {
  messages: {
    created?: string;
    updated?: string;
    deleted?: string;
  };
};

export function AdminToast({messages}: AdminToastProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");

    if (!success) {
      return;
    }

    const message =
      messages[success as keyof typeof messages];

    if (!message) {
      return;
    }

    toast.success(message, {
      id: "admin-action-success",
    });

    // 显示一次以后，把提示参数清掉，如果有其他参数保留
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("success");

    const query = params.toString();

    router.replace(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false }
    );
  }, [searchParams, pathname, router, messages]);

  return null;
}
