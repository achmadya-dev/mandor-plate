import RegisterForm from '@/features/auth/components/register-form';

export default function SignUpViewPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>Create account</h1>
          <p className='text-muted-foreground text-sm'>
            Register a new user. You will need to confirm your email before signing in.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
