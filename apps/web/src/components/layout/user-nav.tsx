'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { logoutViaBff } from '@/lib/auth/client';
import { sessionUserDisplayName, useSessionUser } from '@/lib/auth/use-session';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function UserNav() {
  const user = useSessionUser();
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const displayUser = {
    fullName: sessionUserDisplayName(user),
    email: user?.email ?? '',
    imageUrl: user?.photo?.path,
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutViaBff();
      router.push('/auth/sign-in');
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          disabled={loading}
        >
          <UserAvatarProfile user={displayUser} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {displayUser.fullName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {displayUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/overview')}>
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={loading}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
