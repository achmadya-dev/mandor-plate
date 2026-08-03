'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { fetchBff } from '@/lib/auth/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type ConfirmationState = 'loading' | 'success' | 'error';

function ConfirmEmailStatusInner({ endpoint }: { endpoint: string }) {
  const hash = useSearchParams().get('hash') ?? '';
  const [state, setState] = useState<ConfirmationState>(
    hash ? 'loading' : 'error',
  );

  useEffect(() => {
    if (!hash) return;

    let active = true;
    void fetchBff<void>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ hash }),
    }).then((result) => {
      if (active) setState(result.error ? 'error' : 'success');
    });

    return () => {
      active = false;
    };
  }, [endpoint, hash]);

  if (state === 'loading') {
    return (
      <p className="text-muted-foreground text-sm">Confirming your email...</p>
    );
  }

  if (state === 'success') {
    return (
      <Alert>
        <Icons.check className="h-4 w-4" />
        <AlertTitle>Email confirmed</AlertTitle>
        <AlertDescription>
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Continue to sign in
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <Icons.alertCircle className="h-4 w-4" />
      <AlertTitle>Confirmation failed</AlertTitle>
      <AlertDescription>
        The confirmation link is missing, invalid, expired, or already used.
      </AlertDescription>
    </Alert>
  );
}

export function ConfirmEmailStatus({ endpoint }: { endpoint: string }) {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailStatusInner endpoint={endpoint} />
    </Suspense>
  );
}
