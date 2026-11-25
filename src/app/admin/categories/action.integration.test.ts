import { beforeEach, afterEach, afterAll, expect, vi,test } from "vitest";

import { randomUUID } from "node:crypto";
import { db } from "@/prisma/db";
import { createCategory } from "./action";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn()
}))

// 拟管理员权限验证
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

let testCategoryName = "";
let testCategorySlug = "";

// 每个测试执行前准备环境
beforeEach(() => {
  vi.resetAllMocks();

  const id = randomUUID();

  testCategoryName = `集成测试-${id}`;
  testCategorySlug = `integration-${id}`;

  mocks.requireAdmin.mockResolvedValue(undefined);
});

// 每个测试结束后清理自己的数据
afterEach(async () => {
  await db.orm.public.Category.where({
    slug: testCategorySlug,
  }).delete();
})

// 所有测试结束后关闭数据库
afterAll(async () => {
  await db.close();
});


test("合法分类应该真实写入数据库", async () => {
  // ① Arrange
  // 构造 FormData
  const formData = new FormData();
  formData.set("name", testCategoryName);
  formData.set("slug", testCategorySlug);


  // ② Act
  // 调用真正的 createCategory()
  await createCategory({}, formData)

  // ③ Assert
  // 使用真实 ORM 查询刚刚创建的分类
  // 验证分类存在
  // 验证 name 和 slug 正确
  // 验证缓存刷新和跳转被调用

  const category = await db.orm.public.Category.where({
    slug: testCategorySlug,
  }).first();

  // 验证数据库确实写入
  expect(category).toBeDefined();

  expect(category).toMatchObject({
    name: testCategoryName,
    slug: testCategorySlug,
  });

  // 验证权限校验
  expect(mocks.requireAdmin).toHaveBeenCalledTimes(1);

  // 验证缓存刷新
  expect(mocks.revalidatePath).toHaveBeenCalledWith(
    "/admin/categories"
  );

  // 验证成功跳转
  expect(mocks.redirect).toHaveBeenCalledWith(
    "/admin/categories?success=created"
  );
});