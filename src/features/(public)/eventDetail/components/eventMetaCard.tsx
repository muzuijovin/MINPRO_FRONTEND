import { FiCalendar, FiMapPin } from "react-icons/fi";
import { EventDetail } from "@/types/event.type";
import { EVENT_FORMAT_LABEL, formatDate } from "../utils/formatters";

export function EventMetaCard({ event }: { event: EventDetail }) {
  const timeRange = event.startsAt
    ? `${formatDate(event.startsAt, "HH:mm")}${
        event.endsAt ? ` - ${formatDate(event.endsAt, "HH:mm")}` : ""
      } WIB`
    : "Waktu belum ditentukan";

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#ffdbcd] text-[#a43e00]">
          <FiCalendar size={22} />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4.5 text-[#5a4137]">
            Tanggal & Waktu Event
          </p>
          <h2 className="text-lg font-semibold leading-6.5 text-[#1a1c1c]">
            {event.startsAt
              ? formatDate(event.startsAt, "EEEE, d MMMM yyyy")
              : "Segera diumumkan"}
          </h2>
          <p className="text-xs leading-4.5 text-[#5a4137]">{timeRange}</p>
        </div>
      </div>

      <div className="hidden h-10 w-px bg-[#eee] sm:block" />

      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#d6e0f3] text-[#555f6f]">
          <FiMapPin size={22} />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4.5 text-[#5a4137]">
            Lokasi Event
          </p>
          <h2 className="text-lg font-semibold leading-6.5 text-[#1a1c1c]">
            {event.location}
          </h2>
          <p className="text-xs leading-4.5 text-[#5a4137]">
            Event {(EVENT_FORMAT_LABEL[event.format] ?? event.format).toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}
