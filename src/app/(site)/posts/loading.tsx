import { Container } from "@/components/container";

export default function Loading() {
  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-40 rounded bg-gray-200" />

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-8"
              >
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-full rounded bg-gray-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}