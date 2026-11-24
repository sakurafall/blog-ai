// Category 业务逻辑自动化测试
// Mock(模拟)

import { vi, test, expect } from "vitest";

// vi.fn() 创建一个可追踪的模拟函数
// mockResolvedValue() 用来指定异步函数的模拟返回值
// toHaveBeenCalledTimes(n) 断言这个 mock 函数恰好被调用n次
// 测试不仅能检查返回值，还能检查程序是否执行了不该执行的操作。
test("理解 Mock", async () => {
  const findCategory = vi.fn();

  findCategory.mockResolvedValue({
    id: 1,
    name: "前端",
    slug: "fronted"
  })

  const category = await findCategory();

  expect(category.slug).toBe("fronted");
  expect(findCategory).toHaveBeenCalledTimes(1);
})


// 理解业务分支和 Mock 断言的练习
// 真正有价值的测试，应该调用实际业务函数并控制它的依赖返回值。
// 业务： 发现分类名称重复时，不仅要提示错误，还必须确保没有执行数据库写入。
test("名称重复时不应该创建分类", async () => {
  const createCategoryInDb = vi.fn();

  const categoryWithSameName = {
    id: 1,
    name: "前端",
    slug: "frontend",
  };

  if (!categoryWithSameName) {
    await createCategoryInDb();
  }

  expect(createCategoryInDb).not.toHaveBeenCalled();
});