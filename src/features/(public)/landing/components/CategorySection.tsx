"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { getCategoryColor } from "@/features/(public)/events/constants/categoryColors";
import { CATEGORY_INFO } from "../constants/landingData";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

// 3 kartu kategori induk + chip subkategori, semua link ke /events?category=
export function CategorySection() {
  const { data: categories = [], isLoading } = useCategoryTree();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-12">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.55px] text-accent-text">Kategori Populer</p>
          <h2 className="text-3xl font-bold tracking-tight text-ink">Kategori Olahraga</h2>
        </div>
        <p className="max-w-md text-sm text-ink-muted">
          Pilih cabang olahraga favoritmu, lalu saring berdasarkan format lomba atau turnamen.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)
          : categories.map((parent) => {
              const info = CATEGORY_INFO[parent.slug];
              const Icon = info?.icon;
              const color = getCategoryColor(parent.slug, categories);
              return (
                <article key={parent.id} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
                  <Link
                    href={`/events?category=${parent.slug}`}
                    className={`group flex gap-4 rounded-xl ${focusRing}`}
                  >
                    <span
                      aria-hidden
                      className={`flex size-14 shrink-0 items-center justify-center rounded-xl text-white ${color.solid}`}
                    >
                      {Icon && <Icon size={28} />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-lg font-bold text-ink group-hover:text-accent-text">
                        {parent.name}
                        <FiArrowRight
                          aria-hidden
                          size={14}
                          className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                        />
                      </span>
                      <span className="text-sm text-ink-muted">{info?.description}</span>
                    </span>
                  </Link>

                  {parent.children.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-line pt-4">
                      <p className="text-xs font-semibold text-ink-muted">Subkategori:</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {parent.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/events?category=${child.slug}`}
                              className={`flex min-h-8 items-center rounded-full bg-surface-sunken px-3 text-xs font-semibold text-ink-muted transition-colors hover:bg-gray-200 hover:text-ink ${focusRing}`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
      </div>
    </section>
  );
}
