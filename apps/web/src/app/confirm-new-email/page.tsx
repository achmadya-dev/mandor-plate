import { Metadata } from 'next';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { ConfirmEmailStatus } from '@/features/auth/components/confirm-email-status';

export const metadata: Metadata = {
  title: 'Authentication | Confirm new email',
};

export default function ConfirmNewEmailPage() {
  return (
    <AuthShell
      title="Confirm new email"
      description="Verifying your new email address."
    >
      <ConfirmEmailStatus endpoint="/api/auth/confirm-new-email" />
    </AuthShell>
  );
}
