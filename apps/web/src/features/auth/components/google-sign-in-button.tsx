'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';
import { fetchBff } from '@/lib/auth/client';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type LoginResponse = {
  user: {
    id: number;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
};

export default function GoogleSignInButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) {
      return;
    }

    let cancelled = false;

    const handleCredential = (response: { credential?: string }) => {
      if (!response.credential) {
        router.replace('/auth/sign-in?error=google');
        return;
      }

      startTransition(async () => {
        const result = await fetchBff<LoginResponse>('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({ idToken: response.credential }),
        });

        if (result.error || !result.data) {
          router.replace('/auth/sign-in?error=google');
          return;
        }

        toast.success('Signed in with Google');
        const redirect = searchParams.get('redirect') ?? '/dashboard/overview';
        router.push(redirect);
        router.refresh();
      });
    };

    const renderGoogleButton = () => {
      if (cancelled || !containerRef.current || !window.google?.accounts?.id) {
        return;
      }

      containerRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        error_callback: () => router.replace('/auth/sign-in?error=google'),
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signin_with',
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = renderGoogleButton;
    script.onerror = () => router.replace('/auth/sign-in?error=google');
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
    };
  }, [router, searchParams]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled
        title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in"
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        ref={containerRef}
        className={loading ? 'pointer-events-none opacity-60' : ''}
      />
      {loading ? (
        <p className="text-muted-foreground text-xs">Signing in…</p>
      ) : null}
    </div>
  );
}
