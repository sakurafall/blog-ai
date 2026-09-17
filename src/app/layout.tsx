import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sakura Blog",
    template: "%s | Sakura Blog",
  },
  description: "记录技术、成长和产品实践",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-950">
        {children}
      </body>
    </html>
  );
}