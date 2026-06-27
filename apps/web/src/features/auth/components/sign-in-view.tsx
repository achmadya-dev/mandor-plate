import { Suspense } from 'react';
import GoogleSignInButton from '@/features/auth/components/google-sign-in-button';
import LoginForm from '@/features/auth/components/login-form';
import OAuthErrorAlert from '@/features/auth/components/oauth-error-alert';

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
        <OAuthErrorAlert />
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>Or continue with</span>
          </div>
        </div>
        <Suspense fallback={null}>
          <GoogleSignInButton />
        </Suspense>
      </div>
    </div>
  );
}
