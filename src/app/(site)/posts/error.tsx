"use client";

import { useEffect } from "react";
import { Container } from "@/components/container";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-sm font-medium text-red-600">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          文章加载失败
        </h1>

        <p className="mt-4 leading-7 text-gray-600">
          加载文章时出现了问题，请稍后再试。
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          重试
        </button>
      </Container>
    </main>
  );
}