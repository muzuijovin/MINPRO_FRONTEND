"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiEdit2,
  FiExternalLink,
  FiMapPin,
  FiPlus,
  FiTag,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { formatDate, formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { focusRing } from "@/features/transaction/components/transactionUi";
import { OrganizerEvent, OrganizerEventVoucher } from "@/types/organizerEvent.type";
import { isEventFinished } from "../../utils/eventSchedule";

const actionCls = `flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${focusRing}`;

// status event dari jadwal: belum mulai / sedang berjalan / selesai
function getEventStatus(event: OrganizerEvent) {
  if (isEventFinished(event)) return { label: "Selesai", cls: "bg-surface-sunken text-ink-muted" };
  if (event.startsAt && new Date(event.startsAt) <= new Date()) return { label: "Berlangsung", cls: "bg-info-soft text-ink" };
  return { label: "Mendatang", cls: "bg-success-soft text-success-text" };
}

// voucher nonaktif / lewat periode ditandai berbeda supaya EO tahu mana yang masih bisa dipakai
function getVoucherStatus(voucher: OrganizerEventVoucher) {
  const now = new Date();
  if (!voucher.isActive || new Date(voucher.endAt) < now)
    return { label: "Berakhir", cls: "bg-surface-sunken text-ink-muted" };
  if (new Date(voucher.startAt) > now) return { label: "Terjadwal", cls: "bg-info-soft text-ink" };
  return { label: "Aktif", cls: "bg-success-soft text-success-text" };
}

function VoucherList({ event }: { event: OrganizerEvent }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line bg-surface-muted p-4 md:px-5">
      {event.eventVoucher.length === 0 ? (
        <p className="text-sm text-ink-muted">Event ini belum punya voucher.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {event.eventVoucher.map((voucher) => {
            const status = getVoucherStatus(voucher);
            return (
              <li
                key={voucher.id}
                className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-dashed border-accent-text px-2 py-0.5 font-mono text-sm font-bold text-accent-text">
                    {voucher.code}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-ink">
                    Diskon {Number(voucher.discountPercentage)}%
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.cls}`}>{status.label}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-ink-muted">
                  <span>Sisa kuota {voucher.quota}</span>
                  <span>
                    {formatDate(voucher.startAt, "d MMM yyyy")} – {formatDate(voucher.endAt, "d MMM yyyy")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href={`/organizer/events/create/createVoucher?slug=${event.slug}`}
        className={`flex min-h-10 w-fit items-center gap-1.5 rounded-lg text-sm font-semibold text-accent-text hover:underline ${focusRing}`}
      >
        <FiPlus aria-hidden size={14} />
        Tambah Voucher
      </Link>
    </div>
  );
}

export function OrganizerEventCard({
  event,
  onDelete,
}: {
  event: OrganizerEvent;
  onDelete: (event: OrganizerEvent) => void;
}) {
  const [showVouchers, setShowVouchers] = useState(false);
  const status = getEventStatus(event);
  const isFinished = isEventFinished(event);
  const isFree = event.typePrice === "FREE";
  const voucherPanelId = `vouchers-${event.id}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:p-5">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-surface-sunken md:w-56">
          {event.coverImageUrl && (
            <Image src={event.coverImageUrl} alt="" fill sizes="(min-width: 768px) 224px, 100vw" className="object-cover" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}>{status.label}</span>
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text">
              {event.categories?.name}
            </span>
          </div>

          <h2 title={event.title} className="truncate text-lg font-bold text-ink">
            {event.title}
          </h2>

          <dl className="grid gap-x-6 gap-y-1.5 text-sm text-ink-muted sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Jadwal</dt>
              <FiCalendar aria-hidden className="shrink-0" size={14} />
              <dd className="truncate">
                {event.startsAt ? `${formatDate(event.startsAt, "d MMM yyyy • HH:mm")} WIB` : "Jadwal belum diatur"}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Lokasi</dt>
              <FiMapPin aria-hidden className="shrink-0" size={14} />
              <dd className="truncate">{event.location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Kuota</dt>
              <FiUsers aria-hidden className="shrink-0" size={14} />
              <dd className="tabular-nums">Sisa kuota {event.quota}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Harga</dt>
              <FiTag aria-hidden className="shrink-0" size={14} />
              <dd className="font-semibold tabular-nums text-ink">
                {isFree ? "Gratis" : formatRupiah(Number(event.price))}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              aria-expanded={showVouchers}
              aria-controls={voucherPanelId}
              onClick={() => setShowVouchers((prev) => !prev)}
              className={`${actionCls} bg-surface-sunken text-ink hover:bg-gray-200`}
            >
              Voucher ({event.eventVoucher.length})
              <FiChevronDown
                aria-hidden
                size={14}
                className={`motion-safe:transition-transform ${showVouchers ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              className={`${actionCls} text-ink hover:bg-surface-sunken`}
            >
              <FiExternalLink aria-hidden size={14} />
              Lihat
              <span className="sr-only">(tab baru)</span>
            </Link>
            {/* event yang sudah selesai tidak bisa diedit lagi */}
            {isFinished ? (
              <span
                aria-disabled="true"
                title="Event sudah selesai, tidak bisa diedit"
                className={`${actionCls} cursor-not-allowed text-ink-muted opacity-50`}
              >
                <FiEdit2 aria-hidden size={14} />
                Edit
                <span className="sr-only">(event sudah selesai, tidak bisa diedit)</span>
              </span>
            ) : (
              <Link
                href={`/organizer/events/${event.id}/edit`}
                className={`${actionCls} text-ink hover:bg-surface-sunken`}
              >
                <FiEdit2 aria-hidden size={14} />
                Edit
              </Link>
            )}
            <button
              type="button"
              onClick={() => onDelete(event)}
              className={`${actionCls} text-danger-text hover:bg-danger-soft/40`}
            >
              <FiTrash2 aria-hidden size={14} />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {showVouchers && (
        <div id={voucherPanelId}>
          <VoucherList event={event} />
        </div>
      )}
    </article>
  );
}
