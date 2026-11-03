"use client";

import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { focusRing } from "@/features/transaction/components/transactionUi";
import { OrganizerEvent } from "@/types/organizerEvent.type";

type Props = {
  event: OrganizerEvent | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// <dialog> native: fokus terkunci di modal & tombol Esc menutup otomatis
export function DeleteEventDialog({ event, isPending, onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (event && !dialog.open) dialog.showModal();
    if (!event && dialog.open) dialog.close();
  }, [event]);

  return (
    <dialog ref={ref} className="modal" aria-labelledby="delete-event-title" onClose={onCancel}>
      <div className="modal-box flex flex-col gap-4 rounded-2xl bg-white">
        <div className="flex items-start gap-3">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-text">
            <FiAlertTriangle size={18} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="delete-event-title" className="text-lg font-bold text-ink">
              Hapus event ini?
            </h2>
            <p className="text-sm text-ink-muted">
              <strong className="font-semibold text-ink">{event?.title}</strong> akan dihapus dari daftar event dan
              tidak bisa dibeli lagi. Transaksi yang sudah ada tetap tersimpan.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className={`min-h-11 cursor-pointer rounded-lg bg-surface-sunken px-5 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`min-h-11 cursor-pointer rounded-lg bg-danger-text px-5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60 ${focusRing}`}
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Event"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
