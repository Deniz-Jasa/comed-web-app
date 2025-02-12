'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/lib/store';
import {
  Users,
  ClipboardList,
  MessageSquare,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { ViewToggle } from './ViewToggle';
import Image from 'next/image';

export function Navbar() {
  const pathname = usePathname();
  const { isPhysicianView } = useViewStore();

  const nurseNavItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
    },
    {
      title: 'Triage',
      href: '/triage',
      icon: ClipboardList,
    },
  ];

  const physicianNavItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
    },
    {
      title: 'Consultations',
      href: '/consultations',
      icon: MessageSquare,
    },
  ];

  const navItems = isPhysicianView ? physicianNavItems : nurseNavItems;

  return (
    <div className="w-64 border-r bg-card h-screen flex flex-col">
      <div className="h-16 flex items-center p-12 mr-2">
        <div className="flex items-center justify-center gap-2 mt-8 w-full">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            style={{ marginRight: '7px' }}
          />
        </div>

      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      <ViewToggle />

      <div className="p-6 border-t flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
