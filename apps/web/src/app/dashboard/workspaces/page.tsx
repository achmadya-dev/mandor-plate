'use client';

import PageContainer from '@/components/layout/page-container';

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Organization workspaces were removed with Clerk.'
    >
      <p className='text-muted-foreground text-sm'>Workspace management is out of scope for Mandor Plate.</p>
    </PageContainer>
  );
}
