"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { CheckoutBox } from "./components/checkoutBox";
import { DetailHero } from "./components/detailHero";
import { EventDescription } from "./components/eventDescription";
import { EventMetaCard } from "./components/eventMetaCard";
import { OrganizerCard } from "./components/organizerCard";
import { ReviewSection } from "./components/reviewSection";
import { useEventDetail } from "./hooks/useEventDetail";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

function Breadcrumb({ title }: { title?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs leading-4.5 text-ink-muted">
      <Link href="/" className={`rounded hover:text-accent-text ${FOCUS}`}>
        Beranda
      </Link>
      <FiChevronRight size={12} />
      <Link href="/events" className={`rounded hover:text-accent-text ${FOCUS}`}>
        Jelajahi Event
      </Link>
      {title && (
        <>
          <FiChevronRight size={12} />
          <span aria-current="page" className="truncate font-semibold text-ink">{title}</span>
        </>
      )}
    </nav>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-80 rounded-2xl bg-gray-200 md:h-110" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div className="h-28 rounded-xl bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-200" />
          <div className="h-72 rounded-xl bg-gray-200" />
        </div>
        <div className="h-130 rounded-2xl bg-gray-200 lg:col-span-4" />
      </div>
    </div>
  );
}

export function EventDetailSection() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, isError } = useEventDetail(slug);

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:px-12">
        <Breadcrumb title={event?.title} />

        {isLoading ? (
          <EventDetailSkeleton />
        ) : isError || !event ? (
          // BE balikin 404 kalau slug tidak ditemukan / event sudah dihapus
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-base font-semibold text-ink">Event tidak ditemukan</p>
            <p className="text-sm text-ink-muted">
              Event mungkin sudah dihapus atau link nya salah.
            </p>
            <Link
              href="/events"
              className={`flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:brightness-110 ${FOCUS}`}
            >
              Jelajahi Event Lain
            </Link>
          </div>
        ) : (
          <>
            <DetailHero event={event} />

            <div className="grid grid-cols-1 items-start gap-8 pt-4 lg:grid-cols-12">
              <div className="flex flex-col gap-8 lg:col-span-8">
                <EventMetaCard event={event} />
                <OrganizerCard event={event} />
                <EventDescription event={event} />
                <ReviewSection event={event} />
              </div>

              <div className="lg:col-span-4">
                <CheckoutBox event={event} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
