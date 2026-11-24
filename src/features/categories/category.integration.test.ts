import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { parse } from "dotenv";
import { expect, test } from "vitest";

test("Category 在独立测试库中可创建、查询和清理", async () => {
  // 在导入 db.ts 之前检查连接目标；普通单元测试不会加载这个文件。
  const configuredTestUrl = parse(readFileSync(".env.test.local")).TEST_DATABASE_URL;
  const configuredBusinessUrl = parse(readFileSync(".env")).DATABASE_URL;
  if (!configuredTestUrl || process.env.DATABASE_URL !== configuredTestUrl) {
    throw new Error("测试库未启用；请使用 pnpm test:integration 运行。");
  }

  const business = new URL(configuredBusinessUrl);
  const testing = new URL(configuredTestUrl);
  const endpoint = (url: URL) => url.hostname.replace(/-pooler(?=\.)/, "");
  if (endpoint(business) === endpoint(testing) &&
      business.port === testing.port &&
      business.pathname === testing.pathname) {
    throw new Error("测试库与业务库指向同一个数据库，已停止执行。");
  }

  const { db } = await import("@/prisma/db");
  const slug = `integration-${randomUUID()}`;
  const name = `集成测试-${slug}`;
  let created = false;

  try {
    await db.orm.public.Category.create({ name, slug });
    created = true;

    const saved = await db.orm.public.Category.where({ slug }).first();
    expect(saved).toMatchObject({ name, slug });
    expect(saved?.id).toEqual(expect.any(Number));
  } finally {
    // 只清理本次测试生成的分类，不触碰其他数据。
    if (created) {
      await db.orm.public.Category.where({ slug }).delete();
    }
  }

  const afterCleanup = await db.orm.public.Category.where({ slug }).first();
  expect(afterCleanup).toBeNull();
});
