import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { parse } from "dotenv";

function readEnv(path) {
  try {
    return parse(readFileSync(path));
  } catch {
    throw new Error(`无法读取 ${path}；请先配置独立测试库。`);
  }
}

const productionUrl = process.env.DATABASE_URL || readEnv(".env").DATABASE_URL;
const testUrl = readEnv(".env.test.local").TEST_DATABASE_URL;

if (!productionUrl || !testUrl) {
  throw new Error("缺少 DATABASE_URL 或 TEST_DATABASE_URL，已停止执行。");
}

let production;
let test;
try {
  production = new URL(productionUrl);
  test = new URL(testUrl);
} catch {
  throw new Error("数据库连接地址格式错误，已停止执行（不会显示连接地址）。");
}

if (!['postgresql:', 'postgres:'].includes(test.protocol)) {
  throw new Error("测试库必须是 PostgreSQL，已停止执行。");
}

// Neon 的 pooled / direct 地址可能指向同一个数据库。
const endpoint = (url) => url.hostname.replace(/-pooler(?=\.)/, "");
const sameDatabase = endpoint(production) === endpoint(test) &&
  production.port === test.port &&
  production.pathname === test.pathname;

if (sameDatabase) {
  throw new Error("测试库与业务库指向同一个数据库，已停止执行。");
}

const mode = process.argv[2];
const args = mode === "init"
  ? ["prisma", "db", "init"]
  : mode === "test"
    ? ["exec", "vitest", "run", "--config", "vitest.integration.config.ts"]
    : null;

if (!args) {
  throw new Error("仅支持 init 或 test 模式。");
}

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const child = spawn(command, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, DATABASE_URL: testUrl, TEST_DATABASE_URL: testUrl },
});

child.on("error", () => {
  console.error("无法启动 pnpm；请在项目中安装依赖并确认 pnpm 可用。");
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
