import Link from "next/link";
import { FiFlag } from "react-icons/fi";

export function EventPromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-12">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary via-accent-text to-accent-text p-8 shadow-md">
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-[20px]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col gap-1">
            <span className="flex w-fit items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.55px] text-white">
              <FiFlag aria-hidden size={10} />
              Promotor &amp; Penyelenggara Olahraga
            </span>
            <h2 className="pt-px text-2xl font-bold tracking-[-0.56px] text-white md:text-[28px] md:leading-9">
              Punya Turnamen atau Lomba Lari? Buka Pendaftaran di
              SportTicketing!
            </h2>
            <p className="text-sm text-white/90">
              Daftarkan turnamen, liga sepak bola, atau race maraton Anda. Akses
              manajemen bib runner, bracket turnamen esports, dan payout instan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/organizer/events"
              className="flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-accent-text shadow-sm hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Mulai Buat Event Olahraga Gratis
            </Link>
            <Link
              href="/"
              className="flex min-h-11 items-center rounded-full bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Pelajari Keunggulan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
