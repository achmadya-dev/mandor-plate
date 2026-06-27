'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/components/ui/tanstack-form';
import { Icons } from '@/components/icons';
import { resetPasswordRequestSchema } from '@mandor-plate/shared';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { fetchBff } from '@/lib/auth/client';

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, startTransition] = useTransition();
  const [tokenError, setTokenError] = useState<string | null>(null);

  const hash = searchParams.get('hash') ?? '';
  const expires = searchParams.get('expires');

  const linkExpired = useMemo(() => {
    if (!expires) return false;
    const expiresAt = Number(expires);
    return Number.isFinite(expiresAt) && Date.now() > expiresAt;
  }, [expires]);

  const missingHash = !hash;

  const form = useAppForm({
    defaultValues: { password: '' },
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordRequestSchema.safeParse({
          password: value.password,
          hash,
        });
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
      },
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        setTokenError(null);
        const result = await fetchBff<void>('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ password: value.password, hash }),
        });

        if (result.error) {
          const body = result.error as { errors?: { hash?: string[] } };
          if (body.errors?.hash) {
            setTokenError('This reset link is invalid or has expired.');
            return;
          }
          toast.error('Could not reset password. Try again.');
          return;
        }

        toast.success('Password updated. You can sign in now.');
        router.push('/auth/sign-in');
      });
    },
  });

  if (missingHash || linkExpired) {
    return (
      <Alert variant='destructive'>
        <Icons.alertCircle className='h-4 w-4' />
        <AlertTitle>Invalid reset link</AlertTitle>
        <AlertDescription className='space-y-2'>
          <p>
            {linkExpired
              ? 'This password reset link has expired.'
              : 'This page requires a reset token from your email.'}
          </p>
          <Link href='/auth/forgot-password' className='text-primary underline-offset-4 hover:underline'>
            Request a new link
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-4'>
      {tokenError ? (
        <Alert variant='destructive'>
          <Icons.alertCircle className='h-4 w-4' />
          <AlertTitle>Reset failed</AlertTitle>
          <AlertDescription className='space-y-2'>
            <p>{tokenError}</p>
            <Link href='/auth/forgot-password' className='text-primary underline-offset-4 hover:underline'>
              Request a new link
            </Link>
          </AlertDescription>
        </Alert>
      ) : null}
      <form.AppForm>
        <form.Form className='w-full space-y-4'>
          <form.AppField
            name='password'
            children={(field) => (
              <field.FieldSet>
                <field.Field>
                  <field.FieldLabel htmlFor={field.name}>New password</field.FieldLabel>
                  <Input
                    id={field.name}
                    type='password'
                    autoComplete='new-password'
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
            Update password
          </Button>
        </form.Form>
      </form.AppForm>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
