
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<PromiseSettledResult<T>[]> {

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("concurrency 必须是正整数");
  }

  // 1. 下一个待领取任务的索引
  let nextIndex = 0;

  // 2. 预先创建结果数组
  const results: PromiseSettledResult<T>[] =
    new Array(tasks.length);

  // 3. 定义 Worker
  async function worker() {
    while (true) {

      // 领取任务
      const currentIndex = nextIndex++;

      // 没有剩余任务，退出 Worker
      if (currentIndex >= tasks.length) {
        return;
      }

      try {
        // 执行任务
        const res = await tasks[currentIndex]();

        // 保存成功结果
        results[currentIndex] = {
          status: "fulfilled",
          value: res,
        };

      } catch (error) {

        // 保存失败结果
        results[currentIndex] = {
          status: "rejected",
          reason: error,
        };
      }
    }
  }

  // 4. 创建 Worker
  const workerCount = Math.min(
    concurrency,
    tasks.length
  );

  const workers = Array.from(
    { length: workerCount },
    () => worker()
  );

  // 5. 等待所有 Worker 完成
  await Promise.all(workers);

  // 6. 返回结果
  return results;
}
