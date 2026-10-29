import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { EventDetail } from "@/types/event.type";
import { getInitials } from "../utils/formatters";

export function OrganizerCard({ event }: { event: EventDetail }) {
  const { organizer } = event;

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {/* belum ada kolom foto EO di BE -> pakai inisial nama organisasi */}
        <div className="relative shrink-0">
          <span aria-hidden className="flex size-16 items-center justify-center rounded-xl bg-accent-text text-xl font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            {getInitials(organizer.organizationName)}
          </span>
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-success-text p-0.5 text-white shadow">
            <MdVerified size={14} />
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-1">
            <h2 className="text-lg font-bold leading-6.5 text-ink">
              {organizer.organizationName}
            </h2>
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold leading-4 tracking-[0.22px] text-[#005236]">
              Verified EO
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs leading-4.5">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <FaStar className="text-primary" size={13} />
              {event.averageRating.toFixed(1)} / 5.0
            </span>
            <span className="text-ink-muted">•</span>
            <span className="text-ink-muted">{event.totalReviews} Ulasan</span>
          </div>
        </div>
      </div>

      {/* halaman profil EO belum ada */}
      <Link
        href="#"
        className="flex min-h-11 w-fit items-center rounded-full bg-surface-sunken px-4 text-sm font-semibold leading-5 text-ink transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        Lihat Profil EO
      </Link>
    </section>
  );
}
