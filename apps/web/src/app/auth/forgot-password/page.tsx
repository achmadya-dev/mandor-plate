import ForgotPasswordForm from '@/features/auth/components/forgot-password-form';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Forgot password',
  description: 'Request a password reset link.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      description={
        <>
          Enter your email and we will send a reset link. In local dev, open
          Maildev at{' '}
          <a
            href="http://localhost:1080"
            className="text-primary underline-offset-4 hover:underline"
          >
            localhost:1080
          </a>
          .
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
