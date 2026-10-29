import { FiTag } from "react-icons/fi";
import { EventDetail } from "@/types/event.type";
import { formatDate } from "../utils/formatters";

export function EventDescription({ event }: { event: EventDetail }) {
  return (
    <section className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-9 tracking-[-0.7px] text-ink md:text-[28px]">
          Deskripsi Event
        </h2>
        {/* whitespace-pre-line supaya enter dari form create event tetap tampil */}
        <p className="whitespace-pre-line text-base leading-6.5 text-ink-muted">
          {event.description}
        </p>
      </div>

      {/* voucher aktif dari BE, cuma tampil kalau ada */}
      {event.eventVoucher.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl bg-surface-muted p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold leading-6.5 text-ink">
              <FiTag className="text-accent-text" />
              Voucher Tersedia
            </h3>
            <span className="text-xs font-semibold leading-4 tracking-[0.22px] text-accent-text">
              Kuota Terbatas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {event.eventVoucher.map((voucher) => (
              <div key={voucher.id} className="flex flex-col gap-0.5 rounded-lg bg-white p-4">
                <p className="text-[13px] font-bold leading-4.5 text-ink">
                  {voucher.code} • Diskon {voucher.discountPercentage}%
                </p>
                <p className="text-xs leading-4.5 text-ink-muted">
                  Sisa {voucher.quota} voucher, berlaku sampai{" "}
                  {formatDate(voucher.endAt, "d MMM yyyy")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
