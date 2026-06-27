import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            About
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">Mandor Plate</p>
        </div>

        <div className="space-y-8">
          <section className="bg-card rounded-2xl border p-8 shadow-sm">
            <h2 className="text-foreground mb-4 text-xl font-semibold">
              What this is
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Mandor Plate is a full-stack monorepo: NestJS API, Next.js
              dashboard, and shared Zod contracts. Authentication uses JWT
              sessions via a Next.js BFF with httpOnly cookies.
            </p>
          </section>

          <section className="bg-card rounded-2xl border p-8 shadow-sm">
            <h2 className="text-foreground mb-4 text-xl font-semibold">
              Stack
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Next.js 16, TanStack Query & Form, shadcn/ui, Tailwind CSS v4, and
              TypeScript on the web; NestJS and PostgreSQL on the API.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
