
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserRound,
  Tag,
  Ticket,
  History,
} from 'lucide-react';

const tabs = [
  {
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
  },
  {
    label: 'Referrals & Points',
    href: '/profile/referrals',
    icon: Tag,
  },
  {
    label: 'Coupons & Rewards',
    href: '/profile/coupons',
    icon: Ticket,
  },
  {
    label: 'Security & Password',
    href: '/profile/security',
    icon: History,
  },
];

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-1 flex flex-wrap items-center gap-x-7 gap-y-1 rounded-xl border border-[#EDF0F7] bg-white px-4 py-3 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 text-xs ${
              isActive
                ? 'border-b-2 border-[#FF650F] pb-2 font-semibold text-[#FF650F]'
                : 'py-1 text-[#52688C]'
            }`}
          >
            <Icon size={13} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
