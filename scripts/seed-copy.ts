
import { db } from "../src/prisma/db";

const posts = [
  {
    slug: "why-nextjs",
    title: "从 Vue 转向 React，我为什么选择 Next.js",
    description:
      "记录我从 Vue 技术栈迁移到 React / Next.js 的过程，以及我的 TypeScript 全栈学习路线。",
    content:
      "我之前主要使用 Vue 技术栈，但为了向 TypeScript 全栈和 AI 全栈方向发展，我开始学习 React 和 Next.js。Next.js 不只是 React 框架，它还提供了路由、服务端渲染、数据获取和服务端逻辑能力，非常适合用来做完整产品。",
    category: {
      name: "前端",
      slug: "frontend",
    },
    published: true,
  },
  {
    slug: "typescript-ai-fullstack-roadmap",
    title: "我的 TypeScript / AI 全栈学习路线",
    description:
      "以 TypeScript 为主线，前端使用 React / Next.js，后端逐步进入 Node / NestJS，再接入 Prisma、PostgreSQL 和 AI 能力。",
    content:
      "我的当前路线不是单纯成为 React 工程师，而是成为 TypeScript 全栈或 AI 全栈工程师。React 和 Next.js 只是前端框架层的选择，后面还会逐步加入 Node、NestJS、Prisma、PostgreSQL、Docker、Redis 和 AI 应用能力。",
    category: {
      name: "成长",
      slug: "growth",
    },
    published: true,
  },
  {
    slug: "why-build-blog",
    title: "为什么我要做这个博客",
    description:
      "这个博客不只是个人主页，也是我学习 TypeScript 全栈、AI 和工程化的长期实验项目。",
    content:
      "这个博客项目会长期迭代。第一阶段它只是一个静态博客，后面会逐步加入数据库、后台管理、登录权限、AI 摘要、搜索、评论和部署能力。它不是一个简单练习，而是我的 TypeScript 全栈和 AI 全栈实验场。",
    category: {
      name: "随笔",
      slug: "essay",
    },
    published: true,
  },
];

async function main() {
  for (const post of posts) {
    // 1. 查找分类
    let category = await db.orm.public.Category
      .where({ slug: post.category.slug })
      .first();

    // 2. 分类不存在就创建
    if (!category) {
      category = await db.orm.public.Category.create({
        name: post.category.name,
        slug: post.category.slug,
      });

      console.log(`分类创建成功：${post.category.name}`);
    }

    // 3. 检查文章是否已经存在
    const existingPost = await db.orm.public.Post
      .where({ slug: post.slug })
      .first();

    if (existingPost) {
      console.log(`文章已存在，跳过：${post.slug}`);
      continue;
    }

    // 4. 创建文章，使用 categoryId 关联分类
    await db.orm.public.Post.create({
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      categoryId: category.id,
      published: post.published,
    });

    console.log(`文章创建成功：${post.slug}`);
  }

  console.log("Seed 完成");
}

main()
  .catch((error) => {
    console.error("Seed 失败：", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
