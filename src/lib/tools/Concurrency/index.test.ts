// 我建议下一步我们使用 Vitest，为这个并发池编写测试。

import { beforeEach, expect, test } from "vitest";
import { runWithConcurrency } from ".";

// 尤其要测试一个场景：
// - 一共 5 个任务。
// - 最大并发数为 2。
// - 第 2 个任务故意失败。
// - 其他任务正常完成。
// - 最后检查结果是否仍然按照原始顺序排列。

// 环境准备
let activeCount = 0;
let maxActiveCount = 0;

const events: string[] = [];


// 任务函数的构造
function createTask(taskNumber: number) {
  return async () => {
    activeCount++;

    maxActiveCount = Math.max(
      activeCount,
      maxActiveCount
    );

    events.push(`任务${taskNumber}开始`);

    // 设置任务耗时
    const timeout = taskNumber === 1 ? 300 : 50;

    try {
      // 模拟任务耗时
      await new Promise((resolve) => {
        setTimeout(resolve, timeout);
      });

      // 第二个任务故意失败
      if (taskNumber === 2) {
        throw new Error("任务2失败");
      }

      return `任务${taskNumber}成功`;

    } finally {
      events.push(`任务${taskNumber}结束`);
      activeCount--;
    }
  };
}

// 创建5个任务
const tasks = [1, 2, 3, 4, 5].map(createTask)

// 最大并发限制
const concurrencyLimit = 2

// 最后resule的data
const resultsData = [
  {
    status: "fulfilled",
    value: "任务1成功",
  },
  {
    status: "rejected",
    reason: expect.objectContaining({
      message: "任务2失败",
    }),
  },
  {
    status: "fulfilled",
    value: "任务3成功",
  },
  {
    status: "fulfilled",
    value: "任务4成功",
  },
  {
    status: "fulfilled",
    value: "任务5成功",
  },
]

// 每次测试前重置状态
beforeEach(() => {
  activeCount = 0;
  maxActiveCount = 0;
  events.length = 0;
});

test("测试并发池, 共5个任务, 最大并发数为2", async () => {
  // Act
  const results = await runWithConcurrency(
    tasks,
    concurrencyLimit
  );

  // Assert 1：验证完整结果和顺序
  expect(results).toEqual(resultsData);

  // Assert 2：验证最大并发数
  expect(maxActiveCount).toBe(2)

  // Assert 3：验证任务全部结束
  expect(activeCount).toBe(0)

  // Assert 4：验证动态补位
  const task3Start = events.indexOf("任务3开始");
  const task1End = events.indexOf("任务1结束");

  expect(task3Start).not.toBe(-1);
  expect(task1End).not.toBe(-1);

  expect(task3Start).toBeLessThan(task1End);
})