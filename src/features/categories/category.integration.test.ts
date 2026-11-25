// 最小集成测试，验证测试环境和真实 ORM 能否正常协作
// 这属于一个简单的数据库集成冒烟测试（Smoke Test）

import { afterAll, expect, test } from "vitest";
import { db } from "@/prisma/db";

afterAll(async () => {
  await db.close();
});

test("能够连接测试数据库并查询分类", async () => {
  const categories = await db.orm.public.Category.all();

  expect(Array.isArray(categories)).toBe(true);
});