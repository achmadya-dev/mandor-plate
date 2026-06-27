'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link href='/dashboard/overview'>
            <div className='bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Icons.logo className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Mandor Plate</span>
              <span className='truncate text-xs'>Dashboard</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
