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
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
          <FiCalendar size={22} />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4.5 text-ink-muted">
            Tanggal & Waktu Event
          </p>
          <p className="text-lg font-semibold leading-6.5 text-ink">
            {event.startsAt
              ? formatDate(event.startsAt, "EEEE, d MMMM yyyy")
              : "Segera diumumkan"}
          </p>
          <p className="text-xs leading-4.5 text-ink-muted">{timeRange}</p>
        </div>
      </div>

      <div aria-hidden className="hidden h-10 w-px bg-surface-sunken sm:block" />

      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-info-soft text-[#555f6f]">
          <FiMapPin size={22} />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4.5 text-ink-muted">
            Lokasi Event
          </p>
          <p className="text-lg font-semibold leading-6.5 text-ink">
            {event.location}
          </p>
          <p className="text-xs leading-4.5 text-ink-muted">
            Event {(EVENT_FORMAT_LABEL[event.format] ?? event.format).toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}
