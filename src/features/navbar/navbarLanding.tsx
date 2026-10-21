"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiMenu, FiUser } from "react-icons/fi";

const BRAND_NAME = "SportTicketing";

type NavLink = { label: string; href: string };

const CATEGORY_LINKS: NavLink[] = [
  { label: "Running", href: "/events?category=running" },
  { label: "Mini Soccer & Futsal", href: "/events?category=soccer" },
  { label: "Esports", href: "/events?category=esports" },
];

const TICKET_TYPE_LINKS: NavLink[] = [
  { label: "Tiket Individu", href: "/events?ticket=individual" },
  { label: "Tiket Tim", href: "/events?ticket=team" },
  { label: "Early Bird", href: "/events?ticket=early-bird" },
];

function Dropdown({ label, items }: { label: string; items: NavLink[] }) {
  return (
    <details className="dropdown">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-primary [&::-webkit-details-marker]:hidden">
        {label}
        <FiChevronDown size={14} />
      </summary>
      <ul className="menu dropdown-content z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-secondary">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function NavbarLanding() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
      pathname === href ? "text-primary" : "text-secondary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="navbar mx-auto max-w-7xl gap-2 px-4 md:px-6">
        {/* Kiri: hamburger (mobile) + logo */}
        <div className="navbar-start gap-2">
          <details className="dropdown lg:hidden">
            <summary
              aria-label="Buka menu"
              className="btn btn-ghost btn-sm btn-square list-none [&::-webkit-details-marker]:hidden"
            >
              <FiMenu size={20} />
            </summary>
            <ul className="menu dropdown-content z-50 mt-3 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <li>
                <Link href="/">Beranda</Link>
              </li>
              <li>
                <Link href="/events">Jelajahi Event</Link>
              </li>
              <li>
                <span className="menu-title">Kategori & Olahraga</span>
                <ul>
                  {CATEGORY_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <span className="menu-title">Tipe Tiket</span>
                <ul>
                  {TICKET_TYPE_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </details>

          <Link href="/" className="flex items-center gap-2">
            <span className="relative block h-9 w-9 overflow-hidden rounded-lg bg-primary">
              <Image
                src="/jovlen-logo.jpg"
                alt={`Logo ${BRAND_NAME}`}
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <span className="text-base font-bold text-primary">
              {BRAND_NAME}
            </span>
          </Link>
        </div>

        {/* Tengah: menu desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/" className={linkClass("/")}>
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/events" className={linkClass("/events")}>
                Jelajahi Event
              </Link>
            </li>
            <li>
              <Dropdown label="Kategori & Olahraga" items={CATEGORY_LINKS} />
            </li>
            <li>
              <Dropdown label="Tipe Tiket" items={TICKET_TYPE_LINKS} />
            </li>
          </ul>
        </div>

        {/* Kanan: aksi */}
        <div className="navbar-end gap-3">
          <Link
            href="/events/create"
            className="btn btn-sm h-9 rounded-full border-none bg-primary px-5 text-white hover:brightness-110"
          >
            Buat Event
          </Link>
          <span className="hidden h-6 w-px bg-gray-200 sm:block" />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-secondary hover:text-primary sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/login"
            aria-label="Akun"
            className="btn btn-circle btn-sm h-9 w-9 border-none bg-gray-100 text-secondary hover:bg-gray-200"
          >
            <FiUser size={16} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
