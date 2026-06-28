import { Suspense } from 'react';

import GoogleSignInButton from '@/features/auth/components/google-sign-in-button';
import LoginForm from '@/features/auth/components/login-form';
import OAuthErrorAlert from '@/features/auth/components/oauth-error-alert';

import { AuthShell } from './auth-shell';

export default function SignInViewPage() {
  return (
    <AuthShell
      title="Welcome back"
      description={
        <>
          Sign in to your account to continue. Demo admin:{' '}
          <span className="text-foreground font-medium">admin@example.com</span>{' '}
          / <span className="text-foreground font-medium">secret</span>
        </>
      }
    >
      <OAuthErrorAlert />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <Suspense fallback={null}>
        <GoogleSignInButton />
      </Suspense>
    </AuthShell>
  );
}
