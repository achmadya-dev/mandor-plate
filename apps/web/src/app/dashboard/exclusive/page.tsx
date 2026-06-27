'use client';

import PageContainer from '@/components/layout/page-container';

export default function ExclusivePage() {
  return (
    <PageContainer pageTitle='Exclusive' pageDescription='Demo exclusive page without Clerk gating.'>
      <p className='text-muted-foreground text-sm'>Shell demo page — plan gating arrives with custom RBAC in MP-007.</p>
    </PageContainer>
  );
}
