'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/components/ui/tanstack-form';
import { forgotPasswordRequestSchema } from '@mandor-plate/shared';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { fetchBff } from '@/lib/auth/client';

export default function ForgotPasswordForm() {
  const [loading, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordRequestSchema },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await fetchBff<void>('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify(value),
        });

        if (result.error) {
          toast.error('No account found for that email address.');
          return;
        }

        toast.success('If that email exists, a reset link has been sent.');
      });
    },
  });

  return (
    <form.AppForm>
      <form.Form className='w-full space-y-4'>
        <form.AppField
          name='email'
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>Email</field.FieldLabel>
                <Input
                  id={field.name}
                  type='email'
                  autoComplete='email'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={loading}
                />
              </field.Field>
              <field.FieldError />
            </field.FieldSet>
          )}
        />
        <Button disabled={loading} className='w-full' type='submit'>
          Send reset link
        </Button>
        <p className='text-muted-foreground text-center text-sm'>
          <Link href='/auth/sign-in' className='text-primary underline-offset-4 hover:underline'>
            Back to sign in
          </Link>
        </p>
      </form.Form>
    </form.AppForm>
  );
}
