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
          <span className="flex size-16 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            {getInitials(organizer.organizationName)}
          </span>
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-[#006c49] p-0.5 text-white shadow">
            <MdVerified size={14} />
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-1">
            <h3 className="text-lg font-bold leading-6.5 text-[#1a1c1c]">
              {organizer.organizationName}
            </h3>
            <span className="rounded-full bg-[#6ffbbe] px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-[0.22px] text-[#005236]">
              Verified EO
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs leading-4.5">
            <span className="flex items-center gap-1 font-semibold text-[#1a1c1c]">
              <FaStar className="text-primary" size={13} />
              {event.averageRating.toFixed(1)} / 5.0
            </span>
            <span className="text-[#5a4137]">•</span>
            <span className="text-[#5a4137]">{event.totalReviews} Ulasan</span>
          </div>
        </div>
      </div>

      {/* halaman profil EO belum ada */}
      <Link
        href="#"
        className="w-fit rounded-full bg-[#eee] px-4 py-2 text-sm font-semibold leading-5 text-[#1a1c1c] transition-colors hover:bg-[#e2e2e2]"
      >
        Lihat Profil EO
      </Link>
    </section>
  );
}
