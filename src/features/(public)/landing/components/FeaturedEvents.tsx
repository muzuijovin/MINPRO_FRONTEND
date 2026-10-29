"use client";

import Link from "next/link";
import { useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { EventCard, EventCardSkeleton } from "@/features/(public)/events/components/eventCard";
import { findParentCategory } from "@/features/(public)/events/constants/categoryColors";
import { EventItem } from "@/types/event.type";
import { FEATURED_LIMIT } from "../constants/landingData";
import { useLandingEvents } from "../hooks/useLandingEvents";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

const byQuotaDesc = (a: EventItem, b: EventItem) => b.quota - a.quota;

// tab "Semua" = 1 event kuota terbanyak dari tiap kategori,
// tab kategori = 3 event kuota terbanyak di kategori itu
export function FeaturedEvents() {
  const [activeSlug, setActiveSlug] = useState("");
  const { data: categories = [] } = useCategoryTree();
  const { data: events = [], isLoading } = useLandingEvents();

  // event dikelompokkan ke parent nya (event bisa tersimpan di sub category, mis. "5k" -> running)
  const eventsByParent = (slug: string) =>
    events
      .filter((event) => findParentCategory(event.categories?.slug, categories)?.slug === slug)
      .sort(byQuotaDesc);

  const featured = activeSlug
    ? eventsByParent(activeSlug).slice(0, FEATURED_LIMIT)
    : categories
        .map((parent) => eventsByParent(parent.slug)[0])
        .filter((event): event is EventItem => !!event)
        .slice(0, FEATURED_LIMIT);

  const tabs = [{ slug: "", name: "Semua" }, ...categories];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-text">
              <FiTrendingUp aria-hidden size={12} />
              Paling Diminati
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-ink">Event Pilihan</h2>
            <p className="text-sm text-ink-muted">Event dengan kuota peserta terbanyak di setiap kategori.</p>
          </div>

          <div role="group" aria-label="Filter kategori event pilihan" className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = activeSlug === tab.slug;
              return (
                <button
                  key={tab.slug || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveSlug(tab.slug)}
                  className={`flex min-h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-semibold transition-colors ${focusRing} ${
                    active ? "bg-ink text-white shadow-sm" : "bg-surface-sunken text-ink-muted hover:bg-gray-200"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1 baris: maksimal 3 kartu */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: FEATURED_LIMIT }, (_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-2xl bg-surface-muted p-10 text-center">
            <p className="text-base font-semibold text-ink">Belum ada event di kategori ini</p>
            <Link
              href="/events"
              className={`mt-2 inline-block rounded text-sm font-semibold text-accent-text underline ${focusRing}`}
            >
              Lihat semua event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
