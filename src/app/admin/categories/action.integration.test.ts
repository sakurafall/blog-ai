// 集成测试
import { randomUUID } from "node:crypto";
import { beforeEach, expect, test, vi } from "vitest";

import { db } from "@/prisma/db";
import { createCategory } from "./action";

// 模拟本次测试不需要真实执行的依赖。
const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
}));

// 模拟管理员权限验证
vi.mock("@/lib/auth/require-admin", () => ({
  requireAdmin: mocks.requireAdmin,
}));

// 模拟 Next.js 缓存和跳转
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

beforeEach(() => {
  vi.resetAllMocks()
});

// 测试用例
test("分类名称重复时，不应该创建分类", async () => {
  // 每次运行使用不同的数据，避免与其他测试互相影响。

  const suffix = randomUUID();
  const existingName = `测试分类-${suffix}`;
  const existingSlug = `existing-${suffix}`;
  const newSlug = `new-${suffix}`;

  try {
    // ① 准备：在测试库中创建一条已有分类。
    await db.orm.public.Category.create({
      name: existingName,
      slug: existingSlug,
    });

    // ② 执行：提交相同名称和不同 Slug。
    const formData = new FormData();
    formData.set("name", existingName);
    formData.set("slug", newSlug);

    const result = await createCategory({}, formData);

    // ③ 验证：返回名称重复的业务错误。
    expect(result).toEqual({
      error: "这个分类名称已经存在",
      fieldErrors: {
        name: ["分类名称不能重复"],
      },
    });

    // ④ 验证：新 Slug 对应的分类没有被创建。
    const newCategory = await db.orm.public.Category.where({
      slug: newSlug,
    }).first();

    expect(newCategory).toBeNull();

    // ⑤ 验证：没有进入创建成功后的流程。
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  } finally {
    // ⑥ 清理：只删除本次测试生成的已有分类。
    // 先查询，是为了兼容准备数据失败的情况。
    const existingCategory = await db.orm.public.Category.where({
      slug: existingSlug,
    }).first();

    if (existingCategory) {
      await db.orm.public.Category.where({
        slug: existingSlug,
      }).delete();
    }
  }
});


// // 测试用例
// test("分类 Slug 重复时，不应该创建分类", async () => {
//   // ③ 构造 FormData
//   const formData = new FormData();
//   formData.set("name", "前端技术");
//   formData.set("slug", "frontend");

//   // ④ 调用真实 Server Action
//   const result = await createCategory({}, formData);

//   // ⑤ 验证返回的业务错误
//   expect(result).toEqual({
//     error: "这个 Slug 已经被使用，请换一个",
//     fieldErrors: {
//       slug: ["Slug 不能重复"],
//     },
//   });

//   // ⑧ 验证没有触发成功流程
//   expect(mocks.revalidatePath).not.toHaveBeenCalled();
//   expect(mocks.redirect).not.toHaveBeenCalled();
// });


// // 测试用例
// test("Zod 校验失败时，不应该访问数据库", async () => {
//   const formData = new FormData()

//   formData.set("name", "");
//   formData.set("slug", "AI-tools");

//   const result = await createCategory({}, formData);

//   expect(result?.error).toBe("请检查表单内容")

//   expect(result?.fieldErrors?.slug?.[0]).toBe("Slug 只能包含小写字母、数字和横线")

//   // 不应进入成功流程
//   expect(mocks.revalidatePath).not.toHaveBeenCalled();
//   expect(mocks.redirect).not.toHaveBeenCalled();

// })


// // 测试用例
// test("合法分类应该创建成功并刷新列表", async() => {
//   const formData = new FormData();
//   formData.set("name", "人工智能");
//   formData.set("slug", "ai");

//   await createCategory({}, formData)

//   // 验证数据库创建参数
//   expect(mocks.create).toHaveBeenCalledWith({
//     name: "人工智能",
//     slug: "ai",
//   })

//   // 验证缓存失效
//   expect(mocks.revalidatePath).toHaveBeenCalledWith(
//     "/admin/categories",
//   );

//   // 验证成功跳转
//   expect(mocks.redirect).toHaveBeenCalledWith(
//     "/admin/categories?success=created",
//   );
// })