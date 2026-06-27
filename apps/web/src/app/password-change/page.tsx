import ResetPasswordForm from '@/features/auth/components/reset-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Reset password',
  description: 'Set a new password using your reset link.',
};

/** Matches the URL in API password-reset emails (`/password-change?hash=...`). */
export default function PasswordChangePage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>Reset password</h1>
          <p className='text-muted-foreground text-sm'>Choose a new password for your account.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
