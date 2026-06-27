'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/components/ui/tanstack-form';
import { registerRequestSchema } from '@mandor-plate/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { fetchBff } from '@/lib/auth/client';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validators: {
      onSubmit: registerRequestSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await fetchBff<void>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(value),
        });

        if (result.error) {
          toast.error('Registration failed. This email may already be in use.');
          return;
        }

        toast.success('Account created. Check your email to confirm before signing in.');
        router.push('/auth/sign-in');
      });
    },
  });

  return (
    <form.AppForm>
      <form.Form className='w-full space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='firstName'
            children={(field) => (
              <field.FieldSet>
                <field.Field>
                  <field.FieldLabel htmlFor={field.name}>First name</field.FieldLabel>
                  <Input
                    id={field.name}
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
          <form.AppField
            name='lastName'
            children={(field) => (
              <field.FieldSet>
                <field.Field>
                  <field.FieldLabel htmlFor={field.name}>Last name</field.FieldLabel>
                  <Input
                    id={field.name}
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
        </div>
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
        <form.AppField
          name='password'
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>Password</field.FieldLabel>
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
          Create account
        </Button>
        <p className='text-muted-foreground text-center text-sm'>
          Already have an account?{' '}
          <Link href='/auth/sign-in' className='text-primary underline-offset-4 hover:underline'>
            Sign in
          </Link>
        </p>
      </form.Form>
    </form.AppForm>
  );
}
