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
      description={<>Enter your email and we will send a reset link.</>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
