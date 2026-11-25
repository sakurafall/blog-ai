import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { parse } from "dotenv";

// 只读取测试环境配置，不回退到开发环境
const env = parse(readFileSync(".env.test"));
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("缺少测试数据库 DATABASE_URL");
}

// 安全检查：只允许连接指定的测试数据库
const url = new URL(databaseUrl);

const allowedHosts = [
  "ep-tiny-snow-bil3oshi.c-5.ap-southeast-1.aws.neon.tech",
  "ep-tiny-snow-bil3oshi-pooler.c-5.ap-southeast-1.aws.neon.tech",
];

if (
  !allowedHosts.includes(url.hostname) ||
  url.pathname !== "/neondb"
) {
  throw new Error("禁止连接非指定测试数据库");
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    environment: "node",

    include: ["**/*.integration.test.ts"],

    env: { // 为测试进程注入数据库连接变量
      DATABASE_URL: databaseUrl,
    },

    testTimeout: 30000, // 避免远程数据库响应慢导致测试过早超时
    hookTimeout: 30000, // 	为测试初始化和清理预留时间

    fileParallelism: false, // 暂时禁止测试文件并行执行，降低共享数据库干扰
  },
});