'use client';

import { useStubUser } from '@/lib/stub-session';

export default function ProfileViewPage() {
  const user = useStubUser();

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <h1 className='text-2xl font-semibold'>Profile</h1>
      <p className='text-muted-foreground text-sm'>
        Profile settings will connect to the NestJS API in MP-008.
      </p>
      <dl className='grid max-w-md gap-2 text-sm'>
        <div>
          <dt className='font-medium'>Name</dt>
          <dd>{user.fullName}</dd>
        </div>
        <div>
          <dt className='font-medium'>Email</dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
    </div>
  );
}
