'use client';

import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileAvatarForm from '@/features/profile/components/profile-avatar-form';
import { normalizeAvatarSrc } from '@/lib/auth/avatar-url';
import { sessionUserDisplayName, useSessionUser } from '@/lib/auth/use-session';

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export default function ProfileViewPage() {
  const user = useSessionUser();
  const displayName = sessionUserDisplayName(user);
  const photoSrc = normalizeAvatarSrc(user?.photo?.path);
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <PageContainer
      pageTitle="Profile"
      pageDescription="View your account details and update your profile picture."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <Avatar className="ring-background size-24 shadow-md ring-4">
              <AvatarImage src={photoSrc} alt={displayName} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{displayName}</p>
              <p className="text-muted-foreground text-sm">
                {user?.email ?? '—'}
              </p>
            </div>
            {user?.role?.name ? (
              <Badge variant="secondary" className="capitalize">
                {user.role.name}
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icons.user className="size-4" />
                Account details
              </CardTitle>
              <CardDescription>
                Information associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <DetailRow label="Full name" value={displayName} />
                <Separator />
                <DetailRow label="Email" value={user?.email ?? '—'} />
                <Separator />
                <DetailRow
                  label="Role"
                  value={
                    user?.role?.name ? (
                      <Badge variant="outline" className="capitalize">
                        {user.role.name}
                      </Badge>
                    ) : (
                      '—'
                    )
                  }
                />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icons.media className="size-4" />
                Profile picture
              </CardTitle>
              <CardDescription>
                Upload a photo. Files go through the BFF to the NestJS API
                (local storage in dev).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileAvatarForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
