"use client";

import Link from "next/link";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { EventPagination } from "@/features/(public)/events/components/eventPagination";
import { cardCls, focusRing, getErrorMessage } from "@/features/transaction/components/transactionUi";
import { OrganizerEvent, OrganizerEventTime } from "@/types/organizerEvent.type";
import { OrganizerEventFilters, useDeleteEvent, useOrganizerEvents } from "../../hooks/useOrganizerEvents";
import { OrganizerEventsWelcome } from "../organizerEventsWelcome";
import { DeleteEventDialog } from "./deleteEventDialog";
import { OrganizerEventCard } from "./organizerEventCard";

const TIME_TABS: { value: OrganizerEventTime; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "upcoming", label: "Mendatang" },
  { value: "past", label: "Sudah Lewat" },
];

const INITIAL_FILTERS: OrganizerEventFilters = { page: 1, search: "", time: "all" };

export function OrganizerEventListSection() {
  const [filters, setFilterState] = useState(INITIAL_FILTERS);
  const setFilters = (next: Partial<OrganizerEventFilters>) => setFilterState((prev) => ({ ...prev, ...next }));
  const [keyword, setKeyword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<OrganizerEvent | null>(null);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useOrganizerEvents(filters);
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const events = data?.events ?? [];
  const meta = data?.meta;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value.trim(), page: 1 });
  }, 500);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Event berhasil dihapus");
        setDeleteTarget(null);
        // halaman terakhir jadi kosong setelah hapus -> mundur 1 halaman
        if (events.length === 1 && filters.page > 1) setFilters({ page: filters.page - 1 });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  // EO belum pernah bikin event sama sekali -> tampilkan halaman ajakan membuat event
  const hasNoEventAtAll =
    !isLoading && !isError && meta?.totalEvents === 0 && !filters.search && filters.time === "all";
  if (hasNoEventAtAll) return <OrganizerEventsWelcome />;

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Event Saya</h1>
            <p className="text-sm text-ink-muted">Lihat, ubah, dan kelola semua event serta voucher yang kamu buat.</p>
          </div>
          <Link
            href="/organizer/events/create"
            className={`flex min-h-11 w-fit items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:brightness-110 ${focusRing}`}
          >
            <FiPlus aria-hidden size={16} />
            Buat Event
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex h-11 items-center gap-2 rounded-lg bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] focus-within:ring-2 focus-within:ring-primary/40 md:max-w-md">
            <FiSearch aria-hidden className="shrink-0 text-ink-muted" size={16} />
            <input
              type="search"
              aria-label="Cari event"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder="Cari judul event..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/80"
            />
          </label>

          <div role="group" aria-label="Filter waktu event" className="flex flex-wrap gap-2">
            {TIME_TABS.map((tab) => {
              const active = filters.time === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilters({ time: tab.value, page: 1 })}
                  className={`flex min-h-10 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition-colors ${focusRing} ${
                    active ? "bg-ink text-white shadow-sm" : "bg-white text-ink hover:bg-surface-sunken"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <p className="text-sm font-medium text-danger-text">Gagal memuat event.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className={`min-h-11 cursor-pointer rounded-lg bg-surface-sunken px-5 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
            >
              Coba Lagi
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className={`${cardCls} text-center`}>
            <p className="text-base font-semibold text-ink">Event tidak ditemukan</p>
            <p className="text-sm text-ink-muted">Coba ubah kata kunci atau filter waktu.</p>
          </div>
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {events.map((event) => (
              <OrganizerEventCard key={event.id} event={event} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      {meta && meta.totalEvents > 0 && (
        <EventPagination meta={meta} onPageChange={(page) => setFilters({ page })} />
      )}

      <DeleteEventDialog
        event={deleteTarget}
        isPending={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
