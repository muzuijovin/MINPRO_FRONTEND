import Image from "next/image";
import Link from "next/link";

export const BRAND_NAME = "JOVLEN";

// logo + wordmark yang sama di semua navbar (landing, auth)
export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME}, ke beranda`}
      className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
    >
      <span className="relative block size-10 overflow-hidden rounded-xl bg-primary shadow-sm ring-1 ring-black/5 motion-safe:transition-transform motion-safe:group-hover:-rotate-3">
        <Image src="/jovlen-logo.jpg" alt="" fill sizes="40px" className="object-cover" />
      </span>
      <span aria-hidden className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-[-0.04em] text-ink">
          JOV<span className="text-primary">LEN</span>
        </span>
        {/* tagline disembunyikan di layar kecil supaya navbar mobile tidak sesak */}
        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted sm:block">
          Sport Ticketing
        </span>
      </span>
    </Link>
  );
}
