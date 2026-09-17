import { Container } from "@/components/container";

export const metadata = {
  title: "关于",
  description: "关于 Sakura Blog",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen py-16">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">关于我</h1>

        <div className="mt-8 space-y-6 leading-8 text-gray-700">
          <p>
            这是我的个人博客，也是我的 TypeScript 全栈 / AI 全栈长期实验项目。
          </p>

          <p>
            我会在这里记录从前端开发转向 TypeScript 全栈开发的过程，包括
            React、Next.js、Node.js、Prisma、数据库、工程化、部署以及 AI 应用。
          </p>

          <p>
            这个项目会从一个简单博客开始，逐步演进成包含后台管理、用户系统、
            内容管理、AI 摘要、搜索和数据分析能力的完整产品。
          </p>
        </div>
      </Container>
    </main>
  );
}