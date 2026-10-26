import { FiTag } from "react-icons/fi";
import { EventDetail } from "@/types/event.type";
import { formatDate } from "../utils/formatters";

export function EventDescription({ event }: { event: EventDetail }) {
  return (
    <section className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold leading-9 tracking-[-0.7px] text-[#1a1c1c] md:text-[28px]">
          Deskripsi Event
        </h3>
        {/* whitespace-pre-line supaya enter dari form create event tetap tampil */}
        <p className="whitespace-pre-line text-base leading-6.5 text-[#5a4137]">
          {event.description}
        </p>
      </div>

      {/* voucher aktif dari BE, cuma tampil kalau ada */}
      {event.eventVoucher.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl bg-[#f3f3f3] p-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-lg font-bold leading-6.5 text-[#1a1c1c]">
              <FiTag className="text-[#a43e00]" />
              Voucher Tersedia
            </h4>
            <span className="text-[11px] font-semibold leading-4 tracking-[0.22px] text-[#a43e00]">
              Kuota Terbatas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {event.eventVoucher.map((voucher) => (
              <div key={voucher.id} className="flex flex-col gap-0.5 rounded-lg bg-white p-4">
                <p className="text-[13px] font-bold leading-4.5 text-[#1a1c1c]">
                  {voucher.code} • Diskon {voucher.discountPercentage}%
                </p>
                <p className="text-xs leading-4.5 text-[#5a4137]">
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
