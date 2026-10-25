"use client";

import { useState } from "react";
import { EventCard, EventCardSkeleton } from "./components/eventCard";
import { EventFilterBar } from "./components/eventFilterBar";
import { EventMetaBar } from "./components/eventMetaBar";
import { EventPagination } from "./components/eventPagination";
import { EventPromoBanner } from "./components/eventPromoBanner";
import { useEventFilters } from "./hooks/useEventFilters";
import { EVENTS_PER_PAGE, useEvents } from "./hooks/useEvents";

export function EvenListSection() {
  const { filters, setFilters, resetFilters, hasActiveFilter } =
    useEventFilters();
  const { data, isLoading, isError, isPlaceholderData } = useEvents(filters);

  // key untuk reset input search di filter bar waktu "Hapus Filter" diklik
  const [resetKey, setResetKey] = useState(0);
  const handleReset = () => {
    resetFilters();
    setResetKey((key) => key + 1);
  };

  const events = data?.events ?? [];
  const meta = data?.meta;

  const changePage = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] font-sans">
      <EventFilterBar key={resetKey} filters={filters} setFilters={setFilters} />

      <EventMetaBar
        filters={filters}
        setFilters={setFilters}
        totalEvents={meta?.totalEvents}
        hasActiveFilter={hasActiveFilter}
        onReset={handleReset}
      />

      {/* Grid kartu event */}
      <section className="mx-auto max-w-7xl px-4 py-1 md:px-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: EVENTS_PER_PAGE }, (_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-red-500 shadow-sm">
            Gagal memuat event. Coba muat ulang halaman.
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-base font-semibold text-[#1a1c1c]">
              Event tidak ditemukan
            </p>
            <p className="text-sm text-[#5a4137]">
              Coba ubah kata kunci, kota, atau kategori yang dipilih.
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Hapus Filter
              </button>
            )}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {meta && meta.totalEvents > 0 && (
        <EventPagination meta={meta} onPageChange={changePage} />
      )}

      <EventPromoBanner />
    </main>
  );
}
