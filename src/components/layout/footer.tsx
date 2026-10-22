
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto flex min-h-[64px] w-full items-center justify-between gap-4 px-6 py-4 md:px-7">
        {/* Copyright — Left */}
        <p className="text-[11px] leading-5 text-[#6B7280]">
          © 2025 Jovlen Experiences Inc. All rights reserved.
        </p>

        {/* Navigation — Right */}
        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-4 text-[11px] leading-5 text-[#6B7280] sm:gap-6"
        >
          <Link
            href="/privacy"
            className="whitespace-nowrap transition-colors hover:text-[#E85D2A]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="whitespace-nowrap transition-colors hover:text-[#E85D2A]"
          >
            Terms of Service
          </Link>

          <Link
            href="/organizers"
            className="whitespace-nowrap transition-colors hover:text-[#E85D2A]"
          >
            Event Organizers
          </Link>
        </nav>
      </div>
    </footer>
  );
}
