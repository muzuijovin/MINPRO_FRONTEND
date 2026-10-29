"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";

type FooterLink = { label: string; href: string };

// maksimal kategori yang ditampilkan di footer
const MAX_CATEGORIES = 3;

// halaman-halaman ini belum ada, sementara diarahkan ke "#"
const ABOUT_LINKS: FooterLink[] = [
  { label: "Tentang SportTicketing", href: "#" },
  { label: "Karir", href: "#" },
  { label: "Berita & Race Info", href: "#" },
  { label: "Kerja Sama Promotor", href: "#" },
  { label: "Press Kit", href: "#" },
];

const HELP_LINKS: FooterLink[] = [
  { label: "FAQ Tiket & Pengambilan BIB", href: "#" },
  { label: "Panduan Race Director", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Customer Service", href: "#" },
];

const CONTACTS = [
  {
    icon: "/icons/footer/location.svg",
    width: 10.6667,
    height: 13.3333,
    text: "Gelora Bung Karno Sports Complex, Senayan, Jakarta",
  },
  {
    icon: "/icons/footer/mail.svg",
    width: 13.3333,
    height: 10.6667,
    text: "support@sportticketing.id",
  },
  {
    icon: "/icons/footer/phone.svg",
    width: 12,
    height: 12,
    text: "+62 (21) 5789-2025",
  },
];

const BADGES = [
  { icon: "/icons/footer/shield.svg", text: "Transaksi Aman & Terenkripsi" },
  { icon: "/icons/footer/bolt.svg", text: "Konfirmasi Tiket Instan" },
];

const linkClass =
  "text-xs leading-4 text-ink-muted transition-colors hover:text-primary";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold leading-5 text-ink">{title}</h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function LinkList({ links }: { links: FooterLink[] }) {
  return links.map((link) => (
    <li key={link.label}>
      <Link href={link.href} className={linkClass}>
        {link.label}
      </Link>
    </li>
  ));
}

export default function FooterPublic() {
  // pakai cache yang sama dengan navbar, ambil parent category teratas saja
  const { data: categories = [], isLoading } = useCategoryTree();
  const topCategories = categories.slice(0, MAX_CATEGORIES);

  return (
    <footer className="w-full bg-white drop-shadow-[0px_-1px_4px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + kontak */}
          <div className="flex flex-col gap-3 sm:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative block size-7 overflow-hidden rounded-lg bg-primary">
                <Image
                  src="/jovlen-logo.jpg"
                  alt="Logo SportTicketing"
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span className="text-base font-bold leading-6 tracking-[-0.4px] text-ink">
                Sport<span className="text-primary">Ticketing</span>
              </span>
            </Link>

            <p className="max-w-80 text-xs leading-5 text-ink-muted">
              Platform resmi ticketing dan pendaftaran event olahraga terdepan
              di Indonesia. Menghubungkan penyelenggara lomba, komunitas, atlet,
              dan suporter dalam satu ekosistem terpadu.
            </p>

            <ul className="flex flex-col gap-1 pt-1">
              {CONTACTS.map((contact) => (
                <li key={contact.text} className="flex items-center gap-2">
                  <Image
                    src={contact.icon}
                    alt=""
                    width={contact.width}
                    height={contact.height}
                  />
                  <span className="text-xs leading-4 text-ink-muted">
                    {contact.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Kategori Olahraga">
            {isLoading ? (
              <li>
                <span className="loading loading-spinner loading-xs" />
              </li>
            ) : (
              topCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/events?category=${category.slug}`}
                    className={linkClass}
                  >
                    {category.name}
                  </Link>
                </li>
              ))
            )}
          </FooterColumn>

          <FooterColumn title="Tentang Kami">
            <LinkList links={ABOUT_LINKS} />
          </FooterColumn>

          <FooterColumn title="Pusat Bantuan">
            <LinkList links={HELP_LINKS} />
          </FooterColumn>
        </div>

        {/* Copyright + badge */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-4 text-ink-muted">
            © 2025 PT SportTicketing Indonesia. Hak Cipta Dilindungi.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {BADGES.map((badge) => (
              <div key={badge.text} className="flex items-center gap-1">
                <Image
                  src={badge.icon}
                  alt=""
                  width={10.6667}
                  height={13.3333}
                />
                <span className="text-xs leading-4 text-ink-muted">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
