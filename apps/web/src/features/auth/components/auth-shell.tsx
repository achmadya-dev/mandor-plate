import Link from 'next/link';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

import { InteractiveGridPattern } from './interactive-grid';

interface AuthShellProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthShell({
  title,
  description,
  children,
  className,
}: AuthShellProps) {
  return (
    <div className="flex min-h-svh">
      <aside className="bg-primary text-primary-foreground relative hidden w-[42%] flex-col justify-between overflow-hidden p-10 xl:flex">
        <InteractiveGridPattern
          className="text-primary-foreground/20 border-0"
          squaresClassName="stroke-current/20 [&:not(:hover)]:duration-1000 hover:fill-primary-foreground/10"
        />
        <div className="bg-primary-foreground/10 pointer-events-none absolute -top-24 -right-24 size-96 rounded-full blur-3xl" />
        <div className="bg-primary-foreground/5 pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/auth/sign-in" className="flex items-center gap-3">
            <div className="bg-primary-foreground/10 flex size-10 items-center justify-center rounded-xl backdrop-blur-sm">
              <Icons.logo className="size-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Mandor Plate
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm space-y-3">
          <p className="text-2xl leading-snug font-semibold tracking-tight">
            Your operations hub, simplified.
          </p>
          <p className="text-primary-foreground/75 text-sm leading-relaxed">
            Manage products, teams, and workflows from a single dashboard built
            for clarity and speed.
          </p>
        </div>

        <p className="text-primary-foreground/50 relative z-10 text-xs">
          © {new Date().getFullYear()} Mandor Plate
        </p>
      </aside>

      <main
        className={cn(
          'bg-muted/30 flex flex-1 flex-col items-center justify-center p-6 sm:p-10',
          className,
        )}
      >
        <div className="mb-8 flex items-center gap-2.5 xl:hidden">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
            <Icons.logo className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Mandor Plate
          </span>
        </div>

        <div className="bg-card w-full max-w-md space-y-6 rounded-2xl border p-8 shadow-sm">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <div className="text-muted-foreground text-sm">{description}</div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
