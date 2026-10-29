"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { EventItem } from "@/types/event.type";
import { getCategoryColor } from "../constants/categoryColors";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function EventCard({ event }: { event: EventItem }) {
  const isFree = event.typePrice === "FREE";
  const { data: categories = [] } = useCategoryTree();
  const categoryColor = getCategoryColor(event.categories?.slug, categories);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="group relative h-48 w-full bg-surface-sunken">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover ease-out motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full ${categoryColor.solid} px-2.5 py-0.5 text-xs font-bold tracking-[0.22px] text-white`}>
          {event.categories?.name}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold tracking-[0.22px] text-amber-800">
          Kuota {event.quota} Slot
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <MdVerified className="shrink-0 text-primary" size={15} />
            <span className="truncate">{event.organizer?.organizationName}</span>
          </div>
          {/* judul panjang dipotong, teks lengkap tetap bisa dibaca lewat tooltip */}
          <h3 title={event.title} className="truncate text-lg font-bold leading-[22.5px] text-ink">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1 pt-1 text-xs text-ink-muted">
            {event.startsAt && (
              <span className="flex items-center gap-2">
                <FiCalendar className="shrink-0" size={13} />
                {format(new Date(event.startsAt), "d MMMM yyyy • HH:mm", {
                  locale: idLocale,
                })}{" "}
                WIB
              </span>
            )}
            <span className="flex items-center gap-2">
              <FiMapPin className="shrink-0" size={13} />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-[0.22px] text-ink-muted">
              {isFree ? "Harga" : "Mulai Dari"}
            </span>
            <span className="text-lg font-bold leading-6.5 tabular-nums text-accent-text">
              {isFree ? "Gratis" : formatRupiah(Number(event.price))}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            aria-label={`Lihat detail ${event.title}`}
            className="flex min-h-11 items-center rounded-lg bg-surface-sunken px-4 text-sm font-semibold text-ink transition-colors hover:bg-accent-text hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="h-48 w-full bg-gray-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="mt-6 h-8 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
