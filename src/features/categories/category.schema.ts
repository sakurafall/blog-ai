// 分类的类型校验规则 zod
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "请输入分类名称")
    .max(100, "分类名称不能超过 100 个字符"),

  slug: z
    .string()
    .trim()
    .min(1, "请输入分类 Slug")
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和横线"),
});

export type CategoryInput = z.infer<typeof categorySchema>;