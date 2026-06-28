import RegisterForm from '@/features/auth/components/register-form';

import { AuthShell } from './auth-shell';

export default function SignUpViewPage() {
  return (
    <AuthShell
      title="Create account"
      description="Register a new user. You will need to confirm your email before signing in."
    >
      <RegisterForm />
    </AuthShell>
  );
}
