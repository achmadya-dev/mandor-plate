'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  google: 'Google sign-in failed. Check API Google credentials or try email login.',
  google_config: 'Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and API GOOGLE_CLIENT_*.',
};

function OAuthErrorAlertInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error || !errorMessages[error]) {
    return null;
  }

  return (
    <Alert variant='destructive'>
      <Icons.alertCircle className='h-4 w-4' />
      <AlertTitle>Sign-in error</AlertTitle>
      <AlertDescription>{errorMessages[error]}</AlertDescription>
    </Alert>
  );
}

export default function OAuthErrorAlert() {
  return (
    <Suspense fallback={null}>
      <OAuthErrorAlertInner />
    </Suspense>
  );
}
