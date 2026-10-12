import { db } from "../src/prisma/db";

function createSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    throw new Error(
      `分类 "${name}" 无法自动生成 slug，请手动配置`,
    );
  }

  return slug;
}

// 程序化验证：迁移是否成功
// 确认invariant（不变量），这里是每篇文章都必须有 categoryId
async function invariants() {
  const migratedPosts = await db.orm.public.Post.all();

  const unmigratedPosts = migratedPosts.filter(
    (post) => post.categoryId == null,
  );

  if (unmigratedPosts.length > 0) {
    console.error("还有文章没有完成分类迁移：");

    console.table(
      unmigratedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        category: post.category,
      })),
    );

    throw new Error("Category migration incomplete");
  }

  console.log("所有文章均已完成分类迁移");
  db.close()
}

async function main() {
  const posts = await db.orm.public.Post.all();

  console.log(`找到 ${posts.length} 篇文章`);

  // 找出分类
  const categoryNames = [
    ...new Set(
      posts
        .map((post) => post.category.trim())
        .filter(Boolean),
    ),
  ];

  console.log("旧分类：", categoryNames);

  // 创建分类
  for (const categoryName of categoryNames) {
    let category = await db.orm.public.Category
      .where({
        name: categoryName,
      })
      .first();

    // 幂等性 - 多次执行结果与一次执行结果一致
    if (!category) {
      const slug = createSlug(categoryName);

      category = await db.orm.public.Category.create({
        name: categoryName,
        slug,
      });

      console.log(
        `创建分类：${categoryName} -> ${slug}`,
      );
    }

    // 查某个分类的所有文章
    const categoryPosts = posts.filter(
      (post) => post.category.trim() === categoryName,
    );

    // 遍历这个分类的文章
    for (const post of categoryPosts) {
      // 如果文章的分类id和分类自己的id一致，则跳过
      if (post.categoryId === category.id) {
        continue;
      }

      // 如果文章的分类id没有映射，则先查到这篇文章的数据，然后更新这个文章的分类id
      await db.orm.public.Post
        .where({
          id: post.id,
        })
        .update({
          categoryId: category.id,
        });

      console.log(
        `迁移文章：${post.title} -> ${categoryName}`,
      );
    }
  }

  console.log("分类迁移完成");

  // 2. 所有迁移完成后再验证
  invariants()
}

main().catch((error) => {
  console.error("分类迁移失败：", error);
  process.exit(1);
});