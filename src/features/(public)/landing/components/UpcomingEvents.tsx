"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { EventCard, EventCardSkeleton } from "@/features/(public)/events/components/eventCard";
import { UPCOMING_LIMIT } from "../constants/landingData";
import { useLandingEvents } from "../hooks/useLandingEvents";

// 4 event terdekat (urut tanggal mulai), 1 baris
export function UpcomingEvents() {
  const { data: events = [], isLoading } = useLandingEvents();
  const upcoming = events.slice(0, UPCOMING_LIMIT);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-12">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.55px] text-accent-text">Segera Dimulai</p>
          <h2 className="text-3xl font-bold tracking-tight text-ink">Event Mendatang</h2>
          <p className="text-sm text-ink-muted">Amankan slot sebelum pendaftaran ditutup.</p>
        </div>
        <Link
          href="/events"
          className="flex min-h-11 w-fit items-center gap-1.5 rounded text-sm font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
        >
          Lihat Semua Event
          <FiArrowRight aria-hidden size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: UPCOMING_LIMIT }, (_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-ink-muted shadow-sm">
          Belum ada event mendatang.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
