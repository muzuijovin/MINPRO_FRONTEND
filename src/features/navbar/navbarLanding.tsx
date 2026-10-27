"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { TYPE_PRICE_OPTIONS } from "@/features/organizer/events/constants/createEventData";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/store/useAuthStore";
import { CategoryTree } from "@/types/category.type";
import { AccountMenu } from "./components/accountMenu";
import { ACCOUNT_LINKS, CREATE_EVENT_HREF, isUserRole } from "./constant/navbarData";

const BRAND_NAME = "SportTicketing";

type NavLink = { label: string; href: string };

const categoryHref = (slug: string) => `/events?category=${slug}`;

// typePrice cuma enum FREE / PAID, jadi tidak perlu fetch -> langsung pakai query ?typePrice= di GET /events
const TYPE_PRICE_LINKS: NavLink[] = TYPE_PRICE_OPTIONS.map((option) => ({
  label: option.label,
  href: `/events?typePrice=${option.value}`,
}));

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
            <Link href={item.href} className="text-sm text-secondary hover:bg-slate-200">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

// isi menu kategori: parent -> children (sub category), dipakai di dropdown desktop & menu mobile
function CategoryMenuItems({
  categories,
  isLoading,
  isError,
}: {
  categories: CategoryTree[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading)
    return (
      <li className="px-3 py-2">
        <span className="loading loading-spinner loading-xs" />
      </li>
    );

  if (isError)
    return (
      <li className="px-3 py-2 text-xs text-red-500">Gagal memuat kategori</li>
    );

  if (!categories.length)
    return (
      <li className="px-3 py-2 text-xs text-gray-400">Belum ada kategori</li>
    );

  return categories.map((parent) => (
    <li key={parent.id}>
      <Link href={categoryHref(parent.slug)} className="text-sm text-secondary hover:bg-slate-200">
        {parent.name}
      </Link>
      {parent.children.length > 0 && (
        <ul>
          {parent.children.map((child) => (
            <li key={child.id}>
              <Link
                href={categoryHref(child.slug)}
                className="text-sm text-secondary hover:bg-slate-200"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  ));
}

export function NavbarLanding() {
  const pathname = usePathname();
  // diisi AuthSync dari GET /auth/me; role kosong = belum login
  const { username, email, role, isChecked } = useAuthStore();
  const userRole = isUserRole(role) ? role : null;
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const {
    data: categories = [],
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategoryTree();

  const categoryMenu = (
    <CategoryMenuItems
      categories={categories}
      isLoading={isCategoryLoading}
      isError={isCategoryError}
    />
  );

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
                <ul>{categoryMenu}</ul>
              </li>
              <li>
                <span className="menu-title">Tipe Harga</span>
                <ul>
                  {TYPE_PRICE_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:bg-slate-200">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {/* menu akun versi mobile, sesuai role */}
              {isChecked && (
                <li>
                  <span className="menu-title">Akun</span>
                  <ul>
                    {userRole ? (
                      <>
                        {userRole === "EO" && (
                          <li>
                            <Link href={CREATE_EVENT_HREF} className="hover:bg-slate-200">
                              Buat Event
                            </Link>
                          </li>
                        )}
                        {ACCOUNT_LINKS[userRole].map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} className="hover:bg-slate-200">
                              {l.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            type="button"
                            disabled={isLoggingOut}
                            onClick={() => logout()}
                            className="text-red-600 hover:bg-red-50"
                          >
                            {isLoggingOut ? "Keluar..." : "Keluar"}
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href={CREATE_EVENT_HREF} className="hover:bg-slate-200">
                            Buat Event
                          </Link>
                        </li>
                        <li>
                          <Link href="/login" className="hover:bg-slate-200">
                            Masuk
                          </Link>
                        </li>
                        <li>
                          <Link href="/register" className="hover:bg-slate-200">
                            Daftar
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              )}
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
            <span className="text-base font-bold leading-6 tracking-[-0.4px] text-[#1a1c1c]">
              Sport<span className="text-primary">Ticketing</span>
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
              <details className="dropdown">
                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-primary [&::-webkit-details-marker]:hidden">
                  Kategori & Olahraga
                  <FiChevronDown size={14} />
                </summary>
                <ul className="menu dropdown-content z-50 mt-2 max-h-96 w-60 flex-nowrap overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  {categoryMenu}
                </ul>
              </details>
            </li>
            <li>
              <Dropdown label="Tipe Harga" items={TYPE_PRICE_LINKS} />
            </li>
          </ul>
        </div>

        {/* Kanan: aksi, beda untuk tamu / CUSTOMER / EO */}
        <div className="navbar-end gap-3">
          {!isChecked ? (
            // session masih dicek -> placeholder supaya tombol tamu tidak sempat "kedip"
            <span className="h-9 w-32 animate-pulse rounded-full bg-gray-100" />
          ) : (
            <>
              {/* tampil untuk tamu & EO; guard EO ada di halaman create setelah halaman sambutan */}
              {userRole !== "CUSTOMER" && (
                <Link
                  href={CREATE_EVENT_HREF}
                  className="btn btn-sm hidden h-9 rounded-full border-none bg-primary px-5 text-white hover:brightness-110 sm:inline-flex"
                >
                  Buat Event
                </Link>
              )}
              {userRole ? (
                <AccountMenu username={username} email={email} role={userRole} />
              ) : (
                <>
                  <span className="hidden h-6 w-px bg-gray-200 sm:block" />
                  <Link
                    href="/login"
                    className="text-sm font-medium text-secondary hover:text-primary"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-sm h-9 rounded-full border border-primary bg-white px-5 text-primary shadow-none hover:bg-primary/10"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
