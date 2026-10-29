import Link from "next/link";
import { FiGift } from "react-icons/fi";
import { BENEFITS } from "../constants/landingData";

// banner promo (di antara Event Pilihan & Event Mendatang)
export function PromoCallout() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-12">
      <div className="flex flex-col gap-6 rounded-2xl bg-ink p-8 shadow-md md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
            <FiGift aria-hidden size={12} />
            Promo Komunitas
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ajak teman satu tim, kumpulkan poin dari kode referral!
          </h2>
          <p className="text-sm text-white/80">
            Setiap teman yang daftar pakai kodemu memberi{" "}
            <span className="rounded bg-white/15 px-1.5 py-0.5 font-semibold text-white">10.000 poin</span>{" "}
            untuk memotong harga tiket.
          </p>
        </div>
        <Link
          href="/events?typePrice=FREE"
          className="flex min-h-12 w-fit shrink-0 items-center rounded-full bg-primary px-8 text-sm font-bold text-white shadow-sm hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Lihat Event Gratis
        </Link>
      </div>
    </section>
  );
}

// "Kenapa Kami": 3 kartu keunggulan
export function LandingBenefits() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-12">
        <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-2 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.55px] text-accent-text">Kenapa Kami</p>
          <h2 className="text-3xl font-bold tracking-tight text-ink">Daftar Event Olahraga Tanpa Ribet</h2>
          <p className="text-sm text-ink-muted">
            Dari pembelian tiket hingga check-in di lokasi, semua bisa diurus dari satu tempat.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-8">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="text-sm text-ink-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
