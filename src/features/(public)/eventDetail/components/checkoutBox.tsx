"use client";

import { useState } from "react";
import { FiArrowRight, FiMinus, FiPlus, FiShield } from "react-icons/fi";
import { MdOutlineLocalFireDepartment, MdQrCode2 } from "react-icons/md";
import { EventDetail } from "@/types/event.type";
import { formatRupiah } from "../utils/formatters";

const MAX_TICKET_PER_ACCOUNT = 5;

const ASSURANCES = [
  { icon: FiShield, label: "100% Slot Resmi Terverifikasi" },
  { icon: MdQrCode2, label: "E-Ticket QR Langsung Aktif" },
  { icon: FiShield, label: "Transaksi Aman & Terenkripsi" },
];

export function CheckoutBox({ event }: { event: EventDetail }) {
  const [quantity, setQuantity] = useState(1);

  const isFree = event.typePrice === "FREE";
  const price = isFree ? 0 : Number(event.price);
  const isEnded = !!event.endsAt && new Date(event.endsAt) < new Date();
  const isSoldOut = event.quota <= 0;
  const maxQuantity = Math.max(1, Math.min(MAX_TICKET_PER_ACCOUNT, event.quota));

  return (
    <aside className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-lg font-bold leading-6.5 text-[#1a1c1c]">Pilih Tiket</h3>
          <p className="text-xs leading-4.5 text-[#5a4137]">Pendaftaran instan bergaransi</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ffdad6] px-2.5 py-1 text-[11px] font-semibold leading-4 tracking-[0.22px] text-[#ba1a1a]">
          <MdOutlineLocalFireDepartment size={13} />
          Sisa {event.quota} Kuota
        </span>
      </div>

      {/* event cuma punya satu jenis tiket, jadi langsung tampil terpilih */}
      <div className="flex flex-col gap-1 rounded-xl bg-[#ffdbcd]/20 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-primary/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-white" />
            <p className="text-[15px] font-bold leading-5.5 text-[#1a1c1c]">Tiket {event.title}</p>
          </div>
          <p className="shrink-0 text-lg font-bold leading-6.5 text-[#a43e00]">
            {isFree ? "Gratis" : formatRupiah(price)}
          </p>
        </div>
        <p className="pl-6 text-xs leading-4.5 text-[#5a4137]">
          {event.categories?.name} • {event.location}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f3f3] p-4">
        <div>
          <p className="text-sm font-bold leading-5 text-[#1a1c1c]">Jumlah Tiket</p>
          <p className="text-xs leading-4.5 text-[#5a4137]">
            Maksimal {MAX_TICKET_PER_ACCOUNT} tiket per akun
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-white p-1 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            aria-label="Kurangi jumlah tiket"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => q - 1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#eee] text-[#1a1c1c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiMinus size={14} />
          </button>
          <span className="w-6 text-center text-lg font-bold leading-6.5 text-[#1a1c1c]">{quantity}</span>
          <button
            type="button"
            aria-label="Tambah jumlah tiket"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-[#eee] p-4">
        <div className="flex items-center justify-between text-xs leading-4.5">
          <span className="text-[#5a4137]">{quantity}x Tiket</span>
          <span className="font-medium text-[#1a1c1c]">
            {isFree ? "Gratis" : formatRupiah(price * quantity)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs leading-4.5">
          <span className="text-[#5a4137]">Biaya Layanan</span>
          <span className="font-semibold text-[#006c49]">Termasuk</span>
        </div>
        <div className="h-px w-full bg-[#e2e2e2]" />
        <div className="flex items-end justify-between gap-2 pt-2">
          <div className="text-[#5a4137]">
            <p className="text-[13px] font-medium leading-4.5">Total Pembayaran</p>
            <p className="text-xs leading-4.5">Untuk {quantity} tiket</p>
          </div>
          <p className="text-2xl font-bold leading-9 tracking-[-0.56px] text-[#a43e00]">
            {isFree ? "Gratis" : formatRupiah(price * quantity)}
          </p>
        </div>
      </div>

      {/* TODO: arahkan ke halaman transaksi kalau fiturnya sudah ada */}
      <button
        type="button"
        disabled={isEnded || isSoldOut}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold leading-6.5 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
      >
        {isEnded ? "Event Telah Selesai" : isSoldOut ? "Kuota Habis" : "Daftar & Beli Tiket Sekarang"}
        {!isEnded && !isSoldOut && <FiArrowRight />}
      </button>

      <ul className="flex flex-col gap-2 pt-1">
        {ASSURANCES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-xs leading-4.5 text-[#5a4137]">
            <Icon className="shrink-0 text-[#006c49]" size={15} />
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
