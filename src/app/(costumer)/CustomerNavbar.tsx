
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, UserRound } from 'lucide-react';

export default function CustomerNavbar() {
  return (
    <header className="h-[68px] w-full border-b border-[#061B3A]/[0.06] bg-white">
      <div className="mx-auto flex h-full w-full items-center justify-between px-6">
        {/* Brand */}
        <div className="flex shrink-0 items-center">
          <Image
            src="/jovlen-sporty-logo.png"
            alt="Jövlen"
            width={112}
            height={30}
            priority
            className="h-auto w-[112px] object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="ml-8 flex flex-1 items-center gap-6">
          <Link
            href="/events"
            className="font-['Plus_Jakarta_Sans'] text-xs font-medium text-[#061B3A]"
          >
            Explore Events
          </Link>

          <Link
            href="/help"
            className="font-['Plus_Jakarta_Sans'] text-xs font-medium text-[#061B3A]"
          >
            Help
          </Link>
        </nav>

        {/* Account */}
        <button
          type="button"
          aria-label="Open account menu"
          className="flex shrink-0 items-center gap-2 rounded-full bg-[#EEF3FF] px-2 py-1"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A84B0B] text-white">
            <UserRound size={12} strokeWidth={2} />
          </span>

          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold leading-4 tracking-[0.24px] text-[#061B3A]">
            Alex Pratama
          </span>

          <span className="rounded-full bg-[#061B3A] px-[6px] py-[2px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-[14px] tracking-[0.5px] text-white">
            CUSTOMER
          </span>

          <ChevronDown
            size={12}
            strokeWidth={1.8}
            className="text-[#061B3A]"
          />
        </button>
      </div>
    </header>
  );
}
