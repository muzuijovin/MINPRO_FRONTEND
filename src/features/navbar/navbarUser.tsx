"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { MdOutlineConfirmationNumber } from "react-icons/md";

const BRAND_NAME = "SportTicketing";

type NavLink = { label: string; href: string };

type NavbarUserProps = {
  user: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  /** Jumlah notifikasi belum dibaca (0 = titik merah disembunyikan) */
  unreadCount?: number;
  onLogout: () => void;
};

const MAIN_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi Event", href: "/events" },
  { label: "Tiket Saya", href: "/my-tickets" },
  { label: "Riwayat Transaksi", href: "/orders" },
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes="36px"
          unoptimized
          className="object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

export function NavbarUser({ user, unreadCount = 0, onLogout }: NavbarUserProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
      isActive(href) ? "text-primary" : "text-secondary"
    }`;

  const closeDropdown = () => {
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="navbar mx-auto max-w-7xl gap-2 px-4 md:px-6">
        {/* Kiri: hamburger (mobile) + logo */}
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              aria-label="Buka menu"
              className="btn btn-ghost btn-sm btn-square"
            >
              <FiMenu size={20} />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
            >
              {MAIN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={closeDropdown}
                    className={isActive(l.href) ? "text-primary" : ""}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
            {MAIN_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kanan: notifikasi + menu akun */}
        <div className="navbar-end gap-2">
          <Link
            href="/notifications"
            aria-label="Notifikasi"
            className="btn btn-circle btn-ghost btn-sm relative h-9 w-9 text-secondary"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </Link>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-label="Menu akun"
              className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100"
            >
              <Avatar name={user.name} avatarUrl={user.avatarUrl} />
              <span className="hidden max-w-32 truncate text-sm font-medium text-secondary md:block">
                {user.name}
              </span>
              <FiChevronDown size={14} className="hidden text-gray-400 md:block" />
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
            >
              <li className="pointer-events-none px-3 pb-2 pt-1">
                <div className="flex flex-col items-start gap-0 p-0">
                  <span className="text-sm font-semibold text-secondary">
                    {user.name}
                  </span>
                  {user.email && (
                    <span className="text-xs text-gray-500">{user.email}</span>
                  )}
                </div>
              </li>
              <li className="my-1 h-px bg-gray-100" />
              <li>
                <Link href="/profile" onClick={closeDropdown}>
                  <FiUser /> Profil Saya
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" onClick={closeDropdown}>
                  <MdOutlineConfirmationNumber size={16} /> Tiket Saya
                </Link>
              </li>
              <li>
                <Link href="/orders" onClick={closeDropdown}>
                  <FiShoppingBag /> Riwayat Transaksi
                </Link>
              </li>
              <li className="my-1 h-px bg-gray-100" />
              <li>
                <button
                  type="button"
                  onClick={() => {
                    closeDropdown();
                    onLogout();
                  }}
                  className="text-red-600"
                >
                  <FiLogOut /> Keluar
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
