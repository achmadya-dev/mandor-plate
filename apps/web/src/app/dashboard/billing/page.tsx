'use client';

import PageContainer from '@/components/layout/page-container';

export default function BillingPage() {
  return (
    <PageContainer pageTitle='Billing' pageDescription='Billing removed with Clerk. Not in Mandor Plate scope.'>
      <p className='text-muted-foreground text-sm'>
        Multi-tenant billing is out of scope per PRD. This route is kept as a nav placeholder.
      </p>
    </PageContainer>
  );
}
