import ForgotPasswordForm from '@/features/auth/components/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Forgot password',
  description: 'Request a password reset link.',
};

export default function ForgotPasswordPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>Forgot password</h1>
          <p className='text-muted-foreground text-sm'>
            Enter your email and we will send a reset link. In local dev, open Maildev at{' '}
            <a href='http://localhost:1080' className='text-primary underline-offset-4 hover:underline'>
              localhost:1080
            </a>
            .
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
