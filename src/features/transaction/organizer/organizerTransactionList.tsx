"use client";

import Link from "next/link";
import { useState } from "react";
import { FiChevronRight, FiClock } from "react-icons/fi";
import { EventPagination } from "@/features/(public)/events/components/eventPagination";
import { formatDate, formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { TransactionListFilters, useOrganizerTransactions } from "../hooks/useTransactions";
import { StatusBadge, cardCls, focusRing } from "../components/transactionUi";
import { TransactionFilterBar } from "../components/transactionFilterBar";

// default langsung tampilkan yang perlu diverifikasi EO
const INITIAL_FILTERS: TransactionListFilters = { page: 1, search: "", status: "WAITING_FOR_CONFIRMATION" };

export function OrganizerTransactionListSection() {
  const [filters, setFilterState] = useState(INITIAL_FILTERS);
  const setFilters = (next: Partial<TransactionListFilters>) =>
    setFilterState((prev) => ({ ...prev, ...next }));

  const { data, isLoading, isError, isPlaceholderData, refetch } = useOrganizerTransactions(filters);
  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Kelola Transaksi</h1>
          <p className="text-sm text-ink-muted">
            Verifikasi bukti transfer customer dari semua event kamu. Batas verifikasi 3 hari sejak bukti diunggah.
          </p>
        </div>

        <TransactionFilterBar
          filters={filters}
          setFilters={setFilters}
          placeholder="Cari kode transaksi, event, atau username..."
        />

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <p className="text-sm font-medium text-danger-text">Gagal memuat transaksi.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className={`min-h-11 cursor-pointer rounded-lg bg-surface-sunken px-5 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
            >
              Coba Lagi
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className={`${cardCls} text-center`}>
            <p className="text-base font-semibold text-ink">Tidak ada transaksi</p>
            <p className="text-sm text-ink-muted">Coba pilih status lain atau ubah kata kunci.</p>
          </div>
        ) : (
          <div className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {/* header kolom cuma tampil di desktop, di mobile tiap baris jadi kartu */}
            <div className="hidden grid-cols-[1.2fr_1.6fr_1.2fr_1fr_1fr_24px] gap-4 border-b border-line bg-surface-muted px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:grid">
              <span>Transaksi</span>
              <span>Event</span>
              <span>Pembeli</span>
              <span>Total</span>
              <span>Status</span>
              <span />
            </div>
            <ul className="divide-y divide-line">
              {transactions.map((trx) => (
                <li key={trx.id}>
                  <Link
                    href={`/organizer/transactions/${trx.id}`}
                    className={`grid gap-2 px-5 py-4 hover:bg-surface-muted lg:grid-cols-[1.2fr_1.6fr_1.2fr_1fr_1fr_24px] lg:items-center lg:gap-4 ${focusRing}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-ink">{trx.transactionCode}</span>
                      <span className="text-xs text-ink-muted">
                        {formatDate(trx.createdAt, "d MMM yyyy, HH:mm")} WIB
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-bold text-ink">{trx.events.title}</span>
                      <span className="text-xs text-ink-muted">{trx.quantity}x Tiket</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-ink">
                        {trx.users.customerProfile?.fullname ?? trx.users.username}
                      </span>
                      <span className="truncate text-xs text-ink-muted">{trx.users.email}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-ink">
                      {formatRupiah(Number(trx.finalAmount))}
                    </span>
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={trx.status} />
                      {trx.status === "WAITING_FOR_CONFIRMATION" && trx.confirmationDeadline && (
                        <span className="flex items-center gap-1 text-xs text-ink-muted">
                          <FiClock aria-hidden />
                          s/d {formatDate(trx.confirmationDeadline, "d MMM, HH:mm")}
                        </span>
                      )}
                    </div>
                    <FiChevronRight aria-hidden className="hidden text-ink-muted lg:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {meta && meta.totalTransactions > 0 && (
        <EventPagination
          itemLabel="transaksi"
          meta={{ ...meta, totalEvents: meta.totalTransactions }}
          onPageChange={(page) => setFilters({ page })}
        />
      )}
    </div>
  );
}
