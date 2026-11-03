"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiCalendar, FiChevronRight, FiMapPin, FiSearch } from "react-icons/fi";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { EventPagination } from "@/features/(public)/events/components/eventPagination";
import { formatDate } from "@/features/(public)/eventDetail/utils/formatters";
import { TransactionListItem } from "@/types/transaction.type";
import { cardCls, focusRing } from "../components/transactionUi";
import { TransactionListFilters, useMyTransactions } from "../hooks/useTransactions";

// tiket cuma terbit untuk transaksi PAID, jadi Tiket Saya = riwayat transaksi yang sudah lunas
const INITIAL_FILTERS: TransactionListFilters = { page: 1, search: "", status: "PAID" };

function getEventTiming(transaction: TransactionListItem) {
  const { startsAt, endsAt } = transaction.events;
  const finishedAt = endsAt ?? startsAt;
  if (finishedAt && new Date(finishedAt) < new Date())
    return { label: "Event Selesai", cls: "bg-surface-sunken text-ink-muted" };
  return { label: "Akan Datang", cls: "bg-success-soft text-success-text" };
}

function TicketCard({ transaction }: { transaction: TransactionListItem }) {
  const { events: event } = transaction;
  const timing = getEventTiming(transaction);
  const ticketCount = transaction._count?.tickets || transaction.quantity;

  return (
    <li>
      <Link
        href={`/transaction/${transaction.id}`}
        className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row ${focusRing}`}
      >
        <div className="relative aspect-video w-full shrink-0 bg-surface-sunken sm:aspect-auto sm:w-52">
          {event.coverImageUrl && (
            <Image src={event.coverImageUrl} alt="" fill sizes="(min-width: 640px) 208px, 100vw" className="object-cover" />
          )}
        </div>

        {/* garis putus-putus seperti sobekan tiket */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 border-dashed border-line p-5 sm:border-l-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${timing.cls}`}>{timing.label}</span>
            <span className="font-mono text-xs text-ink-muted">{transaction.transactionCode}</span>
          </div>

          <h2 title={event.title} className="truncate text-lg font-bold text-ink group-hover:text-accent-text">
            {event.title}
          </h2>

          <div className="flex flex-col gap-1.5 text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <FiCalendar aria-hidden className="shrink-0" size={14} />
              {event.startsAt ? `${formatDate(event.startsAt, "EEEE, d MMMM yyyy • HH:mm")} WIB` : "Jadwal belum diatur"}
            </span>
            <span className="flex items-center gap-2">
              <FiMapPin aria-hidden className="shrink-0" size={14} />
              <span className="truncate">{event.location}</span>
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-ink">
              <MdOutlineConfirmationNumber aria-hidden className="text-accent-text" size={18} />
              {ticketCount} E-Ticket
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-accent-text">
              Lihat Tiket
              <FiChevronRight aria-hidden size={14} />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function MyTicketsSection() {
  const [filters, setFilterState] = useState(INITIAL_FILTERS);
  const setFilters = (next: Partial<TransactionListFilters>) => setFilterState((prev) => ({ ...prev, ...next }));
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, isError, isPlaceholderData, refetch } = useMyTransactions(filters);
  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value.trim(), page: 1 });
  }, 500);

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Tiket Saya</h1>
          <p className="text-sm text-ink-muted">
            E-ticket dari pembelian yang sudah dikonfirmasi penyelenggara. Tunjukkan kode tiket saat registrasi ulang.
          </p>
        </div>

        <label className="flex h-11 items-center gap-2 rounded-lg bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] focus-within:ring-2 focus-within:ring-primary/40 md:max-w-md">
          <FiSearch aria-hidden className="shrink-0 text-ink-muted" size={16} />
          <input
            type="search"
            aria-label="Cari tiket"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              debouncedSearch(e.target.value);
            }}
            placeholder="Cari nama event atau kode transaksi..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/80"
          />
        </label>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <p className="text-sm font-medium text-danger-text">Gagal memuat tiket.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className={`min-h-11 cursor-pointer rounded-lg bg-surface-sunken px-5 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
            >
              Coba Lagi
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent-text">
              <MdOutlineConfirmationNumber size={26} />
            </span>
            <p className="text-base font-semibold text-ink">
              {filters.search ? "Tiket tidak ditemukan" : "Belum ada tiket"}
            </p>
            <p className="text-sm text-ink-muted">
              {filters.search
                ? "Coba kata kunci lain."
                : "Tiket muncul di sini setelah pembayaranmu dikonfirmasi penyelenggara."}
            </p>
            {!filters.search && (
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/events"
                  className={`flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:brightness-110 ${focusRing}`}
                >
                  Jelajahi Event
                </Link>
                <Link
                  href="/transaction"
                  className={`flex min-h-11 items-center rounded-full bg-surface-sunken px-5 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
                >
                  Riwayat Transaksi
                </Link>
              </div>
            )}
          </div>
        ) : (
          <ul className={`flex flex-col gap-4 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {transactions.map((transaction) => (
              <TicketCard key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>

      {meta && meta.totalTransactions > 0 && (
        <EventPagination
          meta={{ ...meta, totalEvents: meta.totalTransactions }}
          onPageChange={(page) => setFilters({ page })}
          itemLabel="transaksi tiket"
        />
      )}
    </div>
  );
}
