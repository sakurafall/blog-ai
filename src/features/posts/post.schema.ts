// 文章的类型注解

import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "请输入文章标题")
    .max(100, "文章标题不能超过 100 个字符"),

  slug: z
    .string()
    .trim()
    .min(1, "请输入文章 Slug")
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和横线"),

  categoryId: z
    .number()
    .int("分类 ID 必须是整数")
    .positive("请选择文章分类"),

  description: z
    .string()
    .trim()
    .min(1, "请输入文章描述")
    .max(300, "文章描述不能超过 300 个字符"),

  content: z
    .string()
    .trim()
    .min(1, "请输入文章正文"),

  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;