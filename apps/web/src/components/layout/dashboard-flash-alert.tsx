'use client';

import OAuthErrorAlert from '@/features/auth/components/oauth-error-alert';

export function DashboardFlashAlert() {
  return (
    <div className="px-4 pt-2">
      <OAuthErrorAlert />
    </div>
  );
}
