"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { TransactionStatus } from "@/types/transaction.type";
import { formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { TRANSACTION_STATUS } from "../constants/transactionStatus";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

export const cardCls = "rounded-2xl bg-white p-6 shadow-sm";

// pesan error dari BE ({ message }) atau fallback pesan axios
export const getErrorMessage = (error: unknown) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message)
    : "Terjadi kesalahan, coba lagi";

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const info = TRANSACTION_STATUS[status];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${info.badge}`}>
      {info.label}
    </span>
  );
}

// sisa waktu dalam ms sampai deadline, update tiap detik (0 kalau sudah lewat)
export function useCountdown(deadline: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) return 0;
  return Math.max(0, new Date(deadline).getTime() - now);
}

const pad = (value: number) => String(value).padStart(2, "0");

// 125000 ms -> "02 : 05", lebih dari 1 jam -> "1h 02j" dipakai untuk SLA 3 hari EO
export function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days} hari ${hours} jam`;
  if (hours > 0) return `${hours} jam ${pad(minutes)} menit`;
  return `${pad(minutes)} : ${pad(seconds)}`;
}

type SummaryRow = { label: string; value: number; discount?: boolean };

// rincian harga transaksi (subtotal, diskon, poin, total), dipakai di halaman bayar & verifikasi EO
export function PriceSummary({ rows, total }: { rows: SummaryRow[]; total: number }) {
  return (
    <div className="flex flex-col gap-3">
      <dl className="flex flex-col gap-3 text-sm">
        {rows
          .filter((row) => !row.discount || row.value > 0)
          .map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <dt className={row.discount ? "text-success-text" : "text-ink-muted"}>{row.label}</dt>
              <dd className={`font-semibold tabular-nums ${row.discount ? "text-success-text" : "text-ink"}`}>
                {row.discount ? `-${formatRupiah(row.value)}` : formatRupiah(row.value)}
              </dd>
            </div>
          ))}
      </dl>
      <div className="h-px bg-line" />
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-base font-bold text-ink">Total Pembayaran</p>
          <p className="text-xs text-ink-muted">Biaya layanan sudah termasuk</p>
        </div>
        <p className="text-2xl font-bold tracking-tight tabular-nums text-accent-text md:text-3xl">
          {formatRupiah(total)}
        </p>
      </div>
    </div>
  );
}
