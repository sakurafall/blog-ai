export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
};

export const posts: Post[] = [
  {
    slug: "why-nextjs",
    title: "从 Vue 转向 React，我为什么选择 Next.js",
    description:
      "记录我从 Vue 技术栈迁移到 React / Next.js 的过程，以及我的全栈学习路线。",
    content:
      "我之前主要使用 Vue 技术栈，但为了向 React 全栈方向发展，我开始学习 Next.js。Next.js 不只是 React 框架，它还提供了路由、服务端渲染、API、数据获取等能力，非常适合用来做完整产品。",
    date: "2026-09-16",
    category: "前端",
  },
  {
    slug: "typescript-ai-fullstack-roadmap",
    title: "我的 TypeScript / AI 全栈学习路线",
    description:
      "以 TypeScript 为主线，前端使用 React / Next.js，后端使用 Node / NestJS，再逐步接入 Prisma、PostgreSQL 和 AI 能力。",
    content:
      "我的当前路线不是单纯成为 React 工程师，而是成为 TypeScript 全栈或 AI 全栈工程师。React 和 Next.js 只是前端框架层的选择，后面还会逐步加入 Node、NestJS、Prisma、PostgreSQL、Docker、Redis 和 AI 应用能力。",
    date: "2026-09-15",
    category: "成长",
  },
  {
    slug: "why-build-blog",
    title: "为什么我要做这个博客",
    description:
      "这个博客不只是个人主页，也是我学习 TypeScript / AI 全栈、工程化和长期实验项目。",
    content:
      "这个博客项目会长期迭代。第一阶段它只是一个静态博客，后面会逐步加入数据库、后台管理、登录权限、AI 摘要、搜索、评论和部署能力。它不是一个简单练习，而是我的 TypeScript / AI 全栈实验场。",
    date: "2026-09-14",
    category: "随笔",
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}