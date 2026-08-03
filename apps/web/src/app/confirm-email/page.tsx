import { Metadata } from 'next';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { ConfirmEmailStatus } from '@/features/auth/components/confirm-email-status';

export const metadata: Metadata = {
  title: 'Authentication | Confirm email',
};

export default function ConfirmEmailPage() {
  return (
    <AuthShell
      title="Confirm email"
      description="Verifying your email address."
    >
      <ConfirmEmailStatus endpoint="/api/auth/confirm-email" />
    </AuthShell>
  );
}
