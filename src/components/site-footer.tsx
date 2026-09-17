import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200">
      <Container className="py-8 text-sm text-gray-500">
        © 2026 Sakura Blog. Built with Next.js and TypeScript.
      </Container>
    </footer>
  );
}