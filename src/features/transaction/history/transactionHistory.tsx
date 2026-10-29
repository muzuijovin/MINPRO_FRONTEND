"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiCalendar, FiChevronRight } from "react-icons/fi";
import { EventPagination } from "@/features/(public)/events/components/eventPagination";
import { formatDate, formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { TransactionListFilters, useMyTransactions } from "../hooks/useTransactions";
import { StatusBadge, cardCls, focusRing } from "../components/transactionUi";
import { TransactionFilterBar } from "../components/transactionFilterBar";

const INITIAL_FILTERS: TransactionListFilters = { page: 1, search: "", status: "" };

// riwayat transaksi customer, klik item -> halaman bayar / detail
export function TransactionHistorySection() {
  const [filters, setFilterState] = useState(INITIAL_FILTERS);
  const setFilters = (next: Partial<TransactionListFilters>) =>
    setFilterState((prev) => ({ ...prev, ...next }));

  const { data, isLoading, isError, isPlaceholderData, refetch } = useMyTransactions(filters);
  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Riwayat Transaksi</h1>
          <p className="text-sm text-ink-muted">Pantau status pembayaran dan tiket yang sudah kamu beli.</p>
        </div>

        <TransactionFilterBar
          filters={filters}
          setFilters={setFilters}
          placeholder="Cari kode transaksi atau nama event..."
        />

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
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
          <div className={`${cardCls} flex flex-col items-center gap-2 text-center`}>
            <p className="text-base font-semibold text-ink">Belum ada transaksi</p>
            <p className="text-sm text-ink-muted">Transaksi yang kamu buat akan muncul di sini.</p>
            <Link href="/events" className={`btn btn-primary mt-2 rounded-full ${focusRing}`}>
              Jelajahi Event
            </Link>
          </div>
        ) : (
          <ul className={`flex flex-col gap-3 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {transactions.map((trx) => (
              <li key={trx.id}>
                <Link
                  href={`/transaction/${trx.id}`}
                  className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${focusRing}`}
                >
                  <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:block">
                    <Image src={trx.events.coverImageUrl} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-ink-muted">{trx.transactionCode}</span>
                      <StatusBadge status={trx.status} />
                    </div>
                    <p className="truncate text-base font-bold text-ink">{trx.events.title}</p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <FiCalendar aria-hidden />
                      {formatDate(trx.createdAt, "d MMM yyyy, HH:mm")} WIB • {trx.quantity}x Tiket
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-base font-bold tabular-nums text-accent-text">
                      {formatRupiah(Number(trx.finalAmount))}
                    </span>
                    <FiChevronRight aria-hidden className="text-ink-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
