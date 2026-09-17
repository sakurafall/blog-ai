import { db } from "../src/prisma/db";

async function main() {
  const posts = await db.orm.public.Post.all();

  console.log("posts:", posts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});