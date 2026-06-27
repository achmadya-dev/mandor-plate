import { Suspense } from 'react';
import LoginForm from '@/features/auth/components/login-form';

export default function SignInViewPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>Sign in</h1>
          <p className='text-muted-foreground text-sm'>
            Use your Mandor Plate account. Seeded admin: admin@example.com / secret
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
