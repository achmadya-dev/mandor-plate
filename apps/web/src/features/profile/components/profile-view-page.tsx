'use client';

import ProfileAvatarForm from '@/features/profile/components/profile-avatar-form';
import { sessionUserDisplayName, useSessionUser } from '@/lib/auth/use-session';

export default function ProfileViewPage() {
  const user = useSessionUser();

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <div>
        <h1 className='text-2xl font-semibold'>Profile</h1>
        <p className='text-muted-foreground text-sm'>
          Update your avatar. Files upload through the BFF to the NestJS API (local storage in dev).
        </p>
      </div>

      <ProfileAvatarForm />

      <dl className='grid max-w-md gap-2 text-sm'>
        <div>
          <dt className='font-medium'>Name</dt>
          <dd>{sessionUserDisplayName(user)}</dd>
        </div>
        <div>
          <dt className='font-medium'>Email</dt>
          <dd>{user?.email ?? '—'}</dd>
        </div>
        <div>
          <dt className='font-medium'>Role</dt>
          <dd>{user?.role?.name ?? '—'}</dd>
        </div>
      </dl>
    </div>
  );
}
