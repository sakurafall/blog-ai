// 业务单元测试

/** 
 * 创建名称重复的分类
 *  requireAdmin() 模拟权限验证通过
 *  Category.where().first() 模拟查到已有分类
 *  createCategory() 返回名称重复错误
 *  Category.create() 没有执行
 *  redirect() 没有执行
 */

// 隔离外部依赖，测试真实业务逻辑。

// mockResolvedValueOnce() 的作用：按照调用顺序，为每次调用提供不同的返回值。

import { beforeEach, expect, test, vi } from "vitest";
import { createCategory } from "./action";

// ① 创建共用的 Mock 函数
const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  where: vi.fn(),
  first: vi.fn(),
  create: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
}));

// ② 模拟管理员权限验证
vi.mock("@/lib/auth/require-admin", () => ({
  requireAdmin: mocks.requireAdmin,
}));

// ③ 模拟 ORM 数据库
vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        Category: {
          where: mocks.where,
          create: mocks.create,
        },
      },
    },
  },
}));

// ④ 模拟 Next.js 缓存和跳转
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

beforeEach(() => {
  // vi.clearAllMocks(); // 它会清理 Mock 的调用记录，但不会重置所有 Mock 的实现或排队等待的返回值
  vi.resetAllMocks() // 清理 Mock 的调用记录，重置所有Mock的实现或排队等待的返回值
});

// 测试用例
test("分类名称重复时，不应该创建分类", async () => {
  // 模拟 where().first() 的链式调用
  mocks.where.mockReturnValue({
    first: mocks.first,
  });

  // 模拟数据库里已经有一个分类
  mocks.first.mockResolvedValue({
    id: 1,
    name: "前端",
    slug: "frontend",
  });

  // 构造 FormData
  const formData = new FormData();
  formData.set("name", "前端");
  formData.set("slug", "frontend-new");

  // ⑤ 调用真正的 Server Action
  const result = await createCategory({}, formData);

  // ⑥ 验证业务错误
  expect(result).toEqual({
    error: "这个分类名称已经存在",
    fieldErrors: {
      name: ["分类名称不能重复"],
    },
  });

  // ⑦ 验证数据库没有执行创建
  expect(mocks.create).not.toHaveBeenCalled();

  // ⑧ 验证没有刷新缓存和跳转
  expect(mocks.revalidatePath).not.toHaveBeenCalled();
  expect(mocks.redirect).not.toHaveBeenCalled();
});


// 测试用例
test("分类 Slug 重复时，不应该创建分类", async () => {
  // ① 模拟链式查询
  mocks.where.mockReturnValue({
    first: mocks.first,
  });

  // ② 第一次查 Name → 不存在
  // 第二次查 Slug → 已存在
  mocks.first
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({
      id: 1,
      name: "前端",
      slug: "frontend",
    });

  // ③ 构造 FormData
  const formData = new FormData();
  formData.set("name", "前端技术");
  formData.set("slug", "frontend");

  // ④ 调用真实 Server Action
  const result = await createCategory({}, formData);

  // ⑤ 验证返回的业务错误
  expect(result).toEqual({
    error: "这个 Slug 已经被使用，请换一个",
    fieldErrors: {
      slug: ["Slug 不能重复"],
    },
  });

  // ⑥ 验证只进行了两次查询
  expect(mocks.first).toHaveBeenCalledTimes(2);

  // ⑦ 验证没有创建数据
  expect(mocks.create).not.toHaveBeenCalled();

  // ⑧ 验证没有触发成功流程
  expect(mocks.revalidatePath).not.toHaveBeenCalled();
  expect(mocks.redirect).not.toHaveBeenCalled();
});


// 测试用例
test("Zod 校验失败时，不应该访问数据库", async () => {
  const formData = new FormData()

  formData.set("name", "");
  formData.set("slug", "AI-tools");

  const result = await createCategory({}, formData);

  expect(result?.error).toBe("请检查表单内容")

  expect(result?.fieldErrors?.slug?.[0]).toBe("Slug 只能包含小写字母、数字和横线")

  // 不应访问 Category 查询或写入
  expect(mocks.where).not.toHaveBeenCalled()
  expect(mocks.create).not.toHaveBeenCalled();

  // 不应进入成功流程
  expect(mocks.revalidatePath).not.toHaveBeenCalled();
  expect(mocks.redirect).not.toHaveBeenCalled();

})


// 测试用例
test("合法分类应该创建成功并刷新列表", async() => {
  mocks.where.mockReturnValue({
    first: mocks.first,
  });

  // Name 和 Slug 均不存在
  mocks.first.mockResolvedValue(null);

  const formData = new FormData();
  formData.set("name", "人工智能");
  formData.set("slug", "ai");

  await createCategory({}, formData)

  // 验证数据库创建参数
  expect(mocks.create).toHaveBeenCalledWith({
    name: "人工智能",
    slug: "ai",
  })

  // 验证两次唯一性查询
  expect(mocks.first).toHaveBeenCalledTimes(2);

  // 验证缓存失效
  expect(mocks.revalidatePath).toHaveBeenCalledWith(
    "/admin/categories",
  );

  // 验证成功跳转
  expect(mocks.redirect).toHaveBeenCalledWith(
    "/admin/categories?success=created",
  );
})