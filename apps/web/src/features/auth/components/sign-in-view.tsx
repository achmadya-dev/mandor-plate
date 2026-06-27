import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SignInViewPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='max-w-md space-y-4 text-center'>
        <h1 className='text-2xl font-semibold'>Sign in</h1>
        <p className='text-muted-foreground text-sm'>
          Custom auth UI arrives in MP-004. For now, open the dashboard shell directly.
        </p>
        <Link href='/dashboard/overview' className={cn(buttonVariants())}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
