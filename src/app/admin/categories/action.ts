import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/prisma/db";

export type CategoryActionState = {
  error?: string;

  // 手写
  fieldErrors?: {
    name?: string[];
    slug?: string[];
  };

  // 索引签名自动匹配（有很多字段）
  // fieldErrors?: Record<string, string[] | undefined>;
};