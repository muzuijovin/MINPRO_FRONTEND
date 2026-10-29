import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full h-fit border-b border-[#E5E7EB]/80 bg-white">
      <nav className="mx-auto flex h-20 w-full items-center justify-between px-6 md:px-7">
        {/* Logo SportTicketing, sama dengan navbar landing */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative block h-9 w-9 overflow-hidden rounded-lg bg-primary">
            <Image
              src="/jovlen-logo.jpg"
              alt="Logo SportTicketing"
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="text-base font-bold leading-6 tracking-[-0.4px] text-ink">
            Sport<span className="text-primary">Ticketing</span>
          </span>
        </Link>

        {/* Navigation - Right Side */}
        <div className="flex items-center gap-4 md:gap-5">
          <Link
            href="/events"
            className="whitespace-nowrap text-[11px] font-medium text-[#10213B] transition-colors hover:text-[#E85D2A] md:text-xs"
          >
            Explore Events
          </Link>

          <Link
            href="/help"
            className="whitespace-nowrap text-[11px] font-medium text-[#10213B] transition-colors hover:text-[#E85D2A] md:text-xs"
          >
            Need Help?
          </Link>

          {/* Vertical Divider */}
          <div
            aria-hidden="true"
            className="h-4 w-px bg-[#E5E7EB]"
          />

          <Link
            href="/login"
            className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] font-medium text-[#E85D2A] transition-opacity hover:opacity-75 md:text-xs"
          >
            <span>Sign In</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
