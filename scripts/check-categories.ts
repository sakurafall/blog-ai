import { db } from "../src/prisma/db";

async function main() {
  const categories =
    await db.orm.public.Category.all();

  const posts =
    await db.orm.public.Post.all();

  console.log("categories:");
  console.table(categories);

  console.log("posts:");

  console.table(
    posts.map((post) => ({
      id: post.id,
      title: post.title,
      oldCategory: post.category,
      categoryId: post.categoryId,
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});