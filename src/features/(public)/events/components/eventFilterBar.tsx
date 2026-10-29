"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiMapPin,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { getCategoryColor } from "../constants/categoryColors";
import { EventFilters } from "../hooks/useEventFilters";
import { useActiveEventsCount, useEventLocations } from "../hooks/useEvents";

type Props = {
  filters: EventFilters;
  setFilters: (next: Partial<EventFilters>) => void;
};

// fokus keyboard yang terlihat untuk semua tombol / chip di filter bar
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

// chip aktif pakai warna kategori nya (lolos kontras 4.5:1 dengan teks putih), "Semua" pakai ink (netral)
const chipCls = (active: boolean, activeBg = "bg-ink") =>
  `flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors ${focusRing} ${
    active ? `${activeBg} text-white shadow-sm` : "bg-surface-sunken text-ink-muted hover:bg-gray-200"
  }`;

const subChipCls = (active: boolean, activeBg = "bg-ink") =>
  `flex min-h-8 cursor-pointer items-center rounded-full px-3 text-xs font-semibold tracking-[0.22px] transition-colors ${focusRing} ${
    active ? `${activeBg} text-white` : "bg-surface-sunken text-ink-muted hover:bg-gray-200"
  }`;

export function EventFilterBar({ filters, setFilters }: Props) {
  const [keyword, setKeyword] = useState(filters.search);

  const { data: categories = [] } = useCategoryTree();
  const { data: locations = [] } = useEventLocations();
  const { data: activeCount } = useActiveEventsCount();

  // URL (dan request ke BE) baru di-update 500ms setelah user berhenti mengetik
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value.trim() });
  }, 500);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    debouncedSetSearch.cancel();
    setFilters({ search: keyword.trim() });
  };

  // parent yang aktif: slug nya sendiri yang dipilih, atau salah satu sub category nya
  const activeParent = categories.find(
    (parent) =>
      parent.slug === filters.category ||
      parent.children.some((child) => child.slug === filters.category),
  );
  const activeColor = getCategoryColor(activeParent?.slug, categories).solid;
  const subCategories = activeParent
    ? activeParent.children
    : categories.flatMap((parent) => parent.children);

  return (
    <section className="bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:px-12">
        {/* Breadcrumb & judul */}
        <div className="flex flex-col gap-1 pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px]">
            <Link href="/" className={`rounded font-medium text-ink-muted hover:text-accent-text ${focusRing}`}>
              Beranda
            </Link>
            <FiChevronRight aria-hidden className="text-ink-muted" size={12} />
            <span aria-current="page" className="font-semibold text-accent-text">
              Jelajahi Event Olahraga
            </span>
          </nav>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-[-0.9px] text-ink md:text-4xl md:leading-11">
                Jelajahi Event Olahraga
              </h1>
              <p className="text-base text-ink-muted">
                Temukan ribuan turnamen sepak bola, kompetisi esports, dan race
                lari maraton resmi di seluruh Indonesia.
              </p>
            </div>
            {activeCount !== undefined && (
              <span className="flex w-fit shrink-0 items-center gap-1 rounded-full bg-surface-muted px-4 py-1 text-xs">
                <span aria-hidden className="size-2 rounded-full bg-tertiary" />
                <strong className="font-semibold text-ink">
                  {activeCount}
                </strong>
                <span className="text-ink-muted">Event Olahraga Aktif</span>
              </span>
            )}
          </div>
        </div>

        {/* Search, lokasi & tombol */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 rounded-xl bg-surface-muted p-2 shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:flex-row"
        >
          <label className="flex h-11 flex-1 items-center gap-2 rounded-lg bg-white px-4 focus-within:ring-2 focus-within:ring-primary/40">
            <FiSearch aria-hidden className="shrink-0 text-ink-muted" size={16} />
            <input
              type="search"
              aria-label="Cari event"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSetSearch(e.target.value);
              }}
              placeholder="Cari turnamen, lomba lari, tim, atau esports..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/80"
            />
          </label>

          <label className="relative flex h-11 items-center gap-2 rounded-lg bg-white px-4 focus-within:ring-2 focus-within:ring-primary/40 md:w-52">
            <FiMapPin aria-hidden className="shrink-0 text-ink-muted" size={15} />
            <select
              aria-label="Filter kota"
              value={filters.location}
              onChange={(e) => setFilters({ location: e.target.value })}
              className="w-full appearance-none truncate bg-transparent pr-5 text-sm font-semibold text-ink outline-none"
            >
              <option value="">Semua Kota</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-ink-muted" />
          </label>

          <button
            type="submit"
            className={`flex h-11 cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:brightness-110 ${focusRing}`}
          >
            <FiSliders aria-hidden size={14} />
            Terapkan Filter
          </button>
        </form>

        {/* Chip kategori & subkategori dari GET /categories/tree */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pr-1 text-xs font-semibold uppercase tracking-[0.55px] text-ink-muted">
              Kategori Olahraga:
            </span>
            <button
              type="button"
              aria-pressed={!filters.category}
              onClick={() => setFilters({ category: "" })}
              className={chipCls(!filters.category)}
            >
              <FiGrid aria-hidden size={13} />
              Semua
            </button>
            {categories.map((parent) => {
              const color = getCategoryColor(parent.slug, categories);
              const active = activeParent?.id === parent.id;
              return (
                <button
                  key={parent.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilters({ category: parent.slug })}
                  className={chipCls(active, color.solid)}
                >
                  {/* titik warna supaya kategori tetap terbedakan walau belum dipilih */}
                  <span
                    aria-hidden
                    className={`size-2 rounded-full ${active ? "bg-white" : color.dot}`}
                  />
                  {parent.name}
                </button>
              );
            })}
          </div>

          {subCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-surface-sunken pt-2">
              <span className="pr-1 text-xs font-semibold tracking-[0.22px] text-ink-muted">
                Subkategori:
              </span>
              <button
                type="button"
                aria-pressed={!filters.category || filters.category === activeParent?.slug}
                onClick={() => setFilters({ category: activeParent?.slug ?? "" })}
                className={subChipCls(
                  !filters.category || filters.category === activeParent?.slug,
                  activeColor,
                )}
              >
                Semua Format
              </button>
              {subCategories.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  aria-pressed={filters.category === child.slug}
                  onClick={() => setFilters({ category: child.slug })}
                  className={subChipCls(
                    filters.category === child.slug,
                    getCategoryColor(child.slug, categories).solid,
                  )}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
