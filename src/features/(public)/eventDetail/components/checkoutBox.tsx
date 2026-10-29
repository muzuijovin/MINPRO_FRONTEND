"use client";

import { useState } from "react";
import { FiArrowRight, FiMinus, FiPlus, FiShield, FiTag } from "react-icons/fi";
import { MdOutlineLocalFireDepartment, MdQrCode2 } from "react-icons/md";
import { EventDetail } from "@/types/event.type";
import { formatDate, formatRupiah } from "../utils/formatters";

const MAX_TICKET_PER_ACCOUNT = 5;

const ASSURANCES = [
  { icon: FiShield, label: "100% Slot Resmi Terverifikasi" },
  { icon: MdQrCode2, label: "E-Ticket QR Langsung Aktif" },
  { icon: FiShield, label: "Transaksi Aman & Terenkripsi" },
];

export function CheckoutBox({ event }: { event: EventDetail }) {
  const [quantity, setQuantity] = useState(1);
  // null = tanpa voucher
  const [voucherId, setVoucherId] = useState<string | null>(null);

  const isFree = event.typePrice === "FREE";
  const price = isFree ? 0 : Number(event.price);
  const isEnded = !!event.endsAt && new Date(event.endsAt) < new Date();
  const isSoldOut = event.quota <= 0;
  const maxQuantity = Math.max(1, Math.min(MAX_TICKET_PER_ACCOUNT, event.quota));

  // BE cuma kirim voucher yang masih berlaku & kuotanya > 0, event gratis tidak perlu voucher
  const vouchers = isFree ? [] : event.eventVoucher;
  const selectedVoucher = vouchers.find((voucher) => voucher.id === voucherId);

  // perkiraan harga di FE, harga final tetap dihitung ulang BE waktu transaksi dibuat
  const subtotal = price * quantity;
  const voucherDiscount = selectedVoucher
    ? Math.floor((subtotal * Number(selectedVoucher.discountPercentage)) / 100)
    : 0;
  const total = subtotal - voucherDiscount;

  return (
    <aside className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-lg font-bold leading-6.5 text-ink">Pilih Tiket</h2>
          <p className="text-xs leading-4.5 text-ink-muted">Pendaftaran instan bergaransi</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold leading-4 tracking-[0.22px] text-danger-text">
          <MdOutlineLocalFireDepartment aria-hidden size={13} />
          Sisa {event.quota} Kuota
        </span>
      </div>

      {/* event cuma punya satu jenis tiket, jadi langsung tampil terpilih */}
      <div className="flex flex-col gap-1 rounded-xl bg-accent-soft/20 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-primary/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-white" />
            <p className="text-[15px] font-bold leading-5.5 text-ink">Tiket {event.title}</p>
          </div>
          <p className="shrink-0 text-lg font-bold leading-6.5 tabular-nums text-accent-text">
            {isFree ? "Gratis" : formatRupiah(price)}
          </p>
        </div>
        <p className="pl-6 text-xs leading-4.5 text-ink-muted">
          {event.categories?.name} • {event.location}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-4">
        <div>
          <p className="text-sm font-bold leading-5 text-ink">Jumlah Tiket</p>
          <p className="text-xs leading-4.5 text-ink-muted">
            Maksimal {MAX_TICKET_PER_ACCOUNT} tiket per akun
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-white p-1 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            aria-label="Kurangi jumlah tiket"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => q - 1)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-surface-sunken text-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            <FiMinus size={14} />
          </button>
          <span aria-live="polite" className="w-6 text-center text-lg font-bold leading-6.5 tabular-nums text-ink">{quantity}</span>
          <button
            type="button"
            aria-label="Tambah jumlah tiket"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </div>

      {vouchers.length > 0 && (
        <fieldset className="flex flex-col gap-2 rounded-xl bg-surface-muted p-4">
          <legend className="sr-only">Pilih voucher</legend>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold leading-5 text-ink">
              <FiTag aria-hidden className="text-accent-text" />
              Voucher Promo
            </p>
            <p className="text-xs leading-4.5 text-ink-muted">
              1 voucher per transaksi, tiap akun hanya bisa memakai voucher yang sama 1 kali
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 text-[13px] font-medium text-ink has-checked:ring-1 has-checked:ring-primary">
            <input
              type="radio"
              name="voucher"
              className="radio radio-primary radio-sm"
              checked={voucherId === null}
              onChange={() => setVoucherId(null)}
            />
            Tanpa voucher
          </label>

          {vouchers.map((voucher) => (
            <label
              key={voucher.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 has-checked:ring-1 has-checked:ring-primary"
            >
              <input
                type="radio"
                name="voucher"
                className="radio radio-primary radio-sm"
                checked={voucherId === voucher.id}
                onChange={() => setVoucherId(voucher.id)}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[13px] font-bold tracking-wider text-ink">
                    {voucher.code}
                  </span>
                  <span className="shrink-0 text-[13px] font-bold text-accent-text">
                    -{Number(voucher.discountPercentage)}%
                  </span>
                </span>
                <span className="text-xs leading-4 text-ink-muted">
                  Sisa {voucher.quota} • s/d {formatDate(voucher.endAt, "d MMM yyyy")}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="flex flex-col gap-2 rounded-xl bg-surface-sunken p-4">
        <div className="flex items-center justify-between text-xs leading-4.5">
          <span className="text-ink-muted">{quantity}x Tiket</span>
          <span className="font-medium text-ink">
            {isFree ? "Gratis" : formatRupiah(subtotal)}
          </span>
        </div>
        {selectedVoucher && (
          <div className="flex items-center justify-between text-xs leading-4.5">
            <span className="text-ink-muted">Voucher {selectedVoucher.code}</span>
            <span className="font-semibold text-success-text">
              -{formatRupiah(voucherDiscount)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs leading-4.5">
          <span className="text-ink-muted">Biaya Layanan</span>
          <span className="font-semibold text-success-text">Termasuk</span>
        </div>
        <div className="h-px w-full bg-line" />
        <div className="flex items-end justify-between gap-2 pt-2">
          <div className="text-ink-muted">
            <p className="text-[13px] font-medium leading-4.5">Total Pembayaran</p>
            <p className="text-xs leading-4.5">Untuk {quantity} tiket</p>
          </div>
          <p className="text-2xl font-bold leading-9 tracking-[-0.56px] tabular-nums text-accent-text">
            {isFree ? "Gratis" : formatRupiah(total)}
          </p>
        </div>
      </div>

      {/* TODO (branch transaction): arahkan ke /checkout?slug=...&qty={quantity}&voucherId={voucherId} */}
      <button
        type="button"
        disabled={isEnded || isSoldOut}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold leading-6.5 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        {isEnded ? "Event Telah Selesai" : isSoldOut ? "Kuota Habis" : "Daftar & Beli Tiket Sekarang"}
        {!isEnded && !isSoldOut && <FiArrowRight aria-hidden />}
      </button>

      <ul className="flex flex-col gap-2 pt-1">
        {ASSURANCES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-xs leading-4.5 text-ink-muted">
            <Icon aria-hidden className="shrink-0 text-success-text" size={15} />
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
