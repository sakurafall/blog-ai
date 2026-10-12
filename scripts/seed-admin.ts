import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/prisma/db";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "请在 .env 中配置 ADMIN_EMAIL 和 ADMIN_PASSWORD",
    );
  }

  const existingUser = await db.orm.public.User.where({
    email,
  }).first();

  if (existingUser) {
    console.log(`管理员已存在：${email}`);
    db.close()
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.orm.public.User.create({
    email,
    name: "Admin",
    passwordHash,
    role: "ADMIN",
  });

  console.log(`管理员创建成功：${email}`);

  db.close()
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});