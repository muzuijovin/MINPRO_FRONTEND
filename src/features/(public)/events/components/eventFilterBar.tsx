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
import { EventFilters } from "../hooks/useEventFilters";
import { useActiveEventsCount, useEventLocations } from "../hooks/useEvents";

type Props = {
  filters: EventFilters;
  setFilters: (next: Partial<EventFilters>) => void;
};

const chipCls = (active: boolean) =>
  `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
    active ? "bg-primary text-white shadow-sm" : "bg-[#eee] text-[#5a4137] hover:bg-gray-200"
  }`;

const subChipCls = (active: boolean) =>
  `rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.22px] transition-colors ${
    active ? "bg-primary text-white" : "bg-[#eee] text-[#5a4137] hover:bg-gray-200"
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
  const subCategories = activeParent
    ? activeParent.children
    : categories.flatMap((parent) => parent.children);

  return (
    <section className="bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:px-12">
        {/* Breadcrumb & judul */}
        <div className="flex flex-col gap-1 pb-2">
          <nav className="flex items-center gap-1 text-[13px]">
            <Link href="/" className="font-medium text-[#5a4137] hover:text-primary">
              Beranda
            </Link>
            <FiChevronRight className="text-[#5a4137]" size={12} />
            <span className="font-semibold text-[#a43e00]">
              Jelajahi Event Olahraga
            </span>
          </nav>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-[-0.9px] text-[#1a1c1c] md:text-4xl md:leading-11">
                Jelajahi Event Olahraga
              </h1>
              <p className="text-base text-[#5a4137]">
                Temukan ribuan turnamen sepak bola, kompetisi esports, dan race
                lari maraton resmi di seluruh Indonesia.
              </p>
            </div>
            {activeCount !== undefined && (
              <span className="flex w-fit shrink-0 items-center gap-1 rounded-full bg-[#f3f3f3] px-4 py-1 text-xs">
                <span className="size-2 rounded-full bg-tertiary" />
                <strong className="font-semibold text-[#1a1c1c]">
                  {activeCount}
                </strong>
                <span className="text-[#5a4137]">Event Olahraga Aktif</span>
              </span>
            )}
          </div>
        </div>

        {/* Search, lokasi & tombol */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 rounded-xl bg-[#f3f3f3] p-2 shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:flex-row"
        >
          <label className="flex h-11 flex-1 items-center gap-2 rounded-lg bg-white px-4 focus-within:ring-2 focus-within:ring-primary/40">
            <FiSearch className="shrink-0 text-[#5a4137]" size={16} />
            <input
              type="search"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSetSearch(e.target.value);
              }}
              placeholder="Cari turnamen, lomba lari, tim, atau esports..."
              className="w-full bg-transparent text-sm text-[#1a1c1c] outline-none placeholder:text-[#5a4137]/60"
            />
          </label>

          <label className="relative flex h-11 items-center gap-2 rounded-lg bg-white px-4 focus-within:ring-2 focus-within:ring-primary/40 md:w-52">
            <FiMapPin className="shrink-0 text-[#5a4137]" size={15} />
            <select
              value={filters.location}
              onChange={(e) => setFilters({ location: e.target.value })}
              className="w-full appearance-none truncate bg-transparent pr-5 text-sm font-semibold text-[#1a1c1c] outline-none"
            >
              <option value="">Semua Kota</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-[#5a4137]" />
          </label>

          <button
            type="submit"
            className="flex h-11 items-center justify-center gap-1 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            <FiSliders size={14} />
            Terapkan Filter
          </button>
        </form>

        {/* Chip kategori & subkategori dari GET /categories/tree */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="pr-1 text-[11px] font-semibold uppercase tracking-[0.55px] text-[#5a4137]">
              Kategori Olahraga:
            </span>
            <button
              type="button"
              onClick={() => setFilters({ category: "" })}
              className={chipCls(!filters.category)}
            >
              <FiGrid size={13} />
              Semua
            </button>
            {categories.map((parent) => (
              <button
                key={parent.id}
                type="button"
                onClick={() => setFilters({ category: parent.slug })}
                className={chipCls(activeParent?.id === parent.id)}
              >
                {parent.name}
              </button>
            ))}
          </div>

          {subCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-[#eee] pt-1.5">
              <span className="pr-1 text-[11px] font-semibold tracking-[0.22px] text-[#5a4137]/80">
                Subkategori:
              </span>
              <button
                type="button"
                onClick={() => setFilters({ category: activeParent?.slug ?? "" })}
                className={subChipCls(
                  !filters.category || filters.category === activeParent?.slug,
                )}
              >
                Semua Format
              </button>
              {subCategories.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setFilters({ category: child.slug })}
                  className={subChipCls(filters.category === child.slug)}
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
