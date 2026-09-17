import { Container } from "@/components/container";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "登录",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen py-24">
      <Container className="max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">
          后台登录
        </h1>

        <p className="mt-4 text-gray-600">
          登录后进入博客管理后台。
        </p>

        <LoginForm />
      </Container>
    </main>
  );
}