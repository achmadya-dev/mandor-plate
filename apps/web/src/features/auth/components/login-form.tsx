'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/components/ui/tanstack-form';
import { emailLoginRequestSchema } from '@mandor-plate/shared';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { fetchBff } from '@/lib/auth/client';

type LoginResponse = {
  user: {
    id: number;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: emailLoginRequestSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await fetchBff<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(value),
        });

        if (result.error || !result.data) {
          toast.error('Sign in failed. Check your email and password.');
          return;
        }

        toast.success('Signed in successfully');
        const redirect = searchParams.get('redirect') ?? '/dashboard/overview';
        router.push(redirect);
        router.refresh();
      });
    },
  });

  return (
    <form.AppForm>
      <form.Form className="w-full space-y-4">
        <form.AppField
          name="email"
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>Email</field.FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={loading}
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                />
              </field.Field>
              <field.FieldError />
            </field.FieldSet>
          )}
        />
        <form.AppField
          name="password"
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>
                  Password
                </field.FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={loading}
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                />
              </field.Field>
              <field.FieldError />
            </field.FieldSet>
          )}
        />
        <Button disabled={loading} className="w-full" type="submit">
          Sign in
        </Button>
        <p className="text-center text-sm">
          <Link
            href="/auth/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
        <p className="text-muted-foreground text-center text-sm">
          No account?{' '}
          <Link
            href="/auth/sign-up"
            className="text-primary underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form.Form>
    </form.AppForm>
  );
}
