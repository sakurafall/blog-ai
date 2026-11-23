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