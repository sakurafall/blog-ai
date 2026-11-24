// Schema 单元测试

import { test, expect } from "vitest"
import { categorySchema } from "./category.schema";

// test()：定义一个测试场景。
// categorySchema.safeParse()：执行我们真正的 Zod 校验逻辑。
// expect(...).toBe(true)：声明预期结果。

// 1
test("合法的分类 Slug 应该通过校验", () => {
 const result =  categorySchema.safeParse({
  name: "前端",
  slug: "frontend"
 })

 expect(result.success).toBe(true)
})


// 2
test("大写字母的 Slug 应该校验失败", () => {
  // 1. safeParse()
  const result = categorySchema.safeParse({
    name: 'ai工具',
    slug: 'AI-tools'
  })

  // 2. expect(result.success)
  //    应该等于什么？
  expect(result.success).toBe(false)
});


// 3. 参数化测试 test.each()
// 数据驱动测试（Data-Driven Testing）
const slugCases = [
  ["frontend", true],
  ["AI-tools", false],
  ["ai_tools", false],
  ["ai-tools", true],
  ["", false],
  [" frontend ", true]
] as const

test.each(slugCases)(
  "Slug %s 的校验结果为 %s",
  (slug, expected) => {
    const result = categorySchema.safeParse({
      name: "测试分类",
      slug
    })

    expect(result.success).toBe(expected)
  }
)

// 4. 额外验证，验证输出
test("Slug 应该自动去除两端空格", () => {
  const result = categorySchema.safeParse({
    name: "前端",
    slug: " frontend "
  })

  expect(result.success).toBe(true);

  if (!result.success) {
    return;
  }

  expect(result.data.slug).toBe("frontend");
})

// 5. 测试敏感性
// 这就是自动化测试的价值：当代码行为意外发生变化时，已有测试能够提醒我们
// 实验的目标不是修改业务规则，而是证明测试能够捕捉一次人为引入的错误
test("大写字母的 Slug 应该校验失败", () => {
  const result = categorySchema.safeParse({
    name: "AI工具",
    slug: "AI-tools",
  });

  expect(result.success).toBe(false);
});
