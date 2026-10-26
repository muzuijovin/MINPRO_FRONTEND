import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { EventItem } from "@/types/event.type";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function EventCard({ event }: { event: EventItem }) {
  const isFree = event.typePrice === "FREE";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="group relative h-48 w-full bg-[#eee]">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold tracking-[0.22px] text-white">
          {event.categories?.name}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[11px] font-bold tracking-[0.22px] text-[#d97706]">
          Kuota {event.quota} Slot
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[#5a4137]">
            <MdVerified className="shrink-0 text-primary" size={15} />
            <span className="truncate">{event.organizer?.organizationName}</span>
          </div>
          <h3 className="truncate text-lg font-bold leading-[22.5px] text-[#1a1c1c]">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1 pt-1 text-xs text-[#5a4137]">
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
            <span className="text-[11px] font-semibold tracking-[0.22px] text-[#5a4137]">
              {isFree ? "Harga" : "Mulai Dari"}
            </span>
            <span className="text-lg font-bold leading-6.5 text-primary">
              {isFree ? "Gratis" : formatRupiah(Number(event.price))}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="rounded-lg bg-[#eee] px-4 py-2 text-sm font-semibold text-[#1a1c1c] transition-colors hover:bg-primary hover:text-white"
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
