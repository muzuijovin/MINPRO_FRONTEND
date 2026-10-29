"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiCalendar, FiCheckCircle, FiChevronRight, FiClock, FiExternalLink, FiXCircle } from "react-icons/fi";
import { MdOutlineConfirmationNumber, MdOutlineReceiptLong } from "react-icons/md";
import { formatDate, formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { PaymentDecision, TransactionDetail } from "@/types/transaction.type";
import { TRANSACTION_STATUS } from "../constants/transactionStatus";
import { useConfirmPayment, useTransactionDetail } from "../hooks/useTransactions";
import {
  PriceSummary,
  StatusBadge,
  cardCls,
  focusRing,
  formatCountdown,
  getErrorMessage,
  useCountdown,
} from "../components/transactionUi";

// halaman verifikasi bukti transfer untuk EO (approve -> PAID & tiket terbit, reject -> REJECTED)
export function OrganizerTransactionDetailSection() {
  const { id } = useParams<{ id: string }>();
  const { data: transaction, isLoading, isError } = useTransactionDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-base font-semibold text-ink">Transaksi tidak ditemukan</p>
        <Link href="/organizer/transactions" className={`btn btn-primary mt-5 rounded-full ${focusRing}`}>
          Ke Kelola Transaksi
        </Link>
      </div>
    );
  }

  return <VerificationContent transaction={transaction} />;
}

function VerificationContent({ transaction }: { transaction: TransactionDetail }) {
  const { status, events: event } = transaction;
  const latestProof = transaction.paymentProofs[0];
  const isWaiting = status === "WAITING_FOR_CONFIRMATION";
  const remaining = useCountdown(isWaiting ? transaction.confirmationDeadline : null);
  const { mutate: confirm, isPending, variables } = useConfirmPayment(transaction.id);

  const onDecision = (decision: PaymentDecision) => {
    // tolak tidak bisa dibatalkan (kuota, voucher & poin langsung dikembalikan), jadi minta konfirmasi
    if (decision === "REJECTED" && !window.confirm("Tolak bukti pembayaran ini? Tindakan tidak bisa dibatalkan."))
      return;
    confirm(decision, {
      onSuccess() {
        toast.success(
          decision === "ACCEPTED"
            ? `Pembayaran diterima, ${transaction.quantity} tiket diterbitkan`
            : "Bukti pembayaran ditolak",
        );
      },
      onError(error) {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px]">
          <Link
            href="/organizer/transactions"
            className={`rounded font-medium text-ink-muted hover:text-accent-text ${focusRing}`}
          >
            Kelola Transaksi
          </Link>
          <FiChevronRight aria-hidden className="text-ink-muted" size={12} />
          <span aria-current="page" className="font-mono font-semibold text-accent-text">
            {transaction.transactionCode}
          </span>
        </nav>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Verifikasi Pembayaran & Penerbitan Tiket
            </h1>
            <p className="max-w-2xl text-sm text-ink-muted">{TRANSACTION_STATUS[status].description}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <StatusBadge status={status} />
            {isWaiting && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                <FiClock aria-hidden />
                Sisa {formatCountdown(remaining)} batas verifikasi
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bukti transfer + aksi */}
          <section className={`${cardCls} flex flex-col gap-5`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <MdOutlineReceiptLong aria-hidden className="text-accent-text" />
                Bukti Transfer Customer
              </h2>
              {latestProof && (
                <a
                  href={latestProof.storagePath}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Buka bukti transfer ukuran penuh di tab baru"
                  className={`flex size-10 items-center justify-center rounded-full bg-surface-muted text-ink hover:bg-surface-sunken ${focusRing}`}
                >
                  <FiExternalLink aria-hidden />
                </a>
              )}
            </div>

            {latestProof ? (
              <>
                <div className="relative h-96 overflow-hidden rounded-xl bg-surface-muted">
                  <Image
                    src={latestProof.storagePath}
                    alt={`Bukti transfer ${transaction.transactionCode}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>
                <dl className="grid grid-cols-2 gap-4 rounded-xl bg-surface-muted p-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-ink-muted">Diunggah</dt>
                    <dd className="font-semibold text-ink">
                      {formatDate(latestProof.uploadedAt, "d MMM yyyy, HH:mm")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-ink-muted">Tujuan Rekening</dt>
                    <dd className="font-semibold text-ink">
                      {transaction.bankEo.bankName} {transaction.bankEo.accountNumber}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs font-semibold uppercase text-ink-muted">Nominal Harus Masuk</dt>
                    <dd className="text-xl font-bold tabular-nums text-success-text">
                      {formatRupiah(Number(transaction.finalAmount))}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="rounded-xl bg-surface-muted p-6 text-center text-sm text-ink-muted">
                Customer belum mengunggah bukti transfer.
              </p>
            )}

            {isWaiting && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onDecision("ACCEPTED")}
                  disabled={isPending}
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
                >
                  {isPending && variables === "ACCEPTED" ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <FiCheckCircle aria-hidden />
                  )}
                  Setujui & Terbitkan {transaction.quantity} Tiket
                </button>
                <button
                  type="button"
                  onClick={() => onDecision("REJECTED")}
                  disabled={isPending}
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-surface-muted px-6 text-sm font-semibold text-danger-text hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
                >
                  {isPending && variables === "REJECTED" ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <FiXCircle aria-hidden />
                  )}
                  Tolak Bukti Pembayaran
                </button>
              </div>
            )}
          </section>

          <div className="flex flex-col gap-6">
            {/* Rincian transaksi */}
            <section className={`${cardCls} flex flex-col gap-5`}>
              <h2 className="text-lg font-bold text-ink">Rincian Transaksi Pesanan</h2>
              <div className="flex gap-4 rounded-xl bg-surface-muted p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                  <Image src={event.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-xs font-semibold uppercase text-accent-text">Event</p>
                  <p className="text-base font-bold text-ink">{event.title}</p>
                  {event.startsAt && (
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <FiCalendar aria-hidden />
                      {formatDate(event.startsAt, "d MMM yyyy • HH:mm")} WIB • {event.location}
                    </p>
                  )}
                </div>
              </div>
              <PriceSummary
                total={Number(transaction.finalAmount)}
                rows={[
                  {
                    label: `Subtotal (${transaction.quantity} x ${formatRupiah(Number(transaction.ticketPrice))})`,
                    value: Number(transaction.subtotal),
                  },
                  {
                    label: `Voucher ${transaction.eventVoucher?.code ?? ""}`,
                    value: Number(transaction.voucherDiscount),
                    discount: true,
                  },
                  {
                    label: `Kupon ${transaction.coupons?.code ?? ""}`,
                    value: Number(transaction.couponDiscount),
                    discount: true,
                  },
                  {
                    label: `Poin (${transaction.pointUsed.toLocaleString("id-ID")} poin)`,
                    value: Number(transaction.pointDiscount),
                    discount: true,
                  },
                ]}
              />
            </section>

            {/* Tiket */}
            <section className={cardCls}>
              <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-ink">
                <MdOutlineConfirmationNumber aria-hidden className="text-accent-text" />
                Penerbitan Tiket ({transaction.quantity})
              </h2>
              {transaction.tickets.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {transaction.tickets.map((ticket, index) => (
                    <li
                      key={ticket.id}
                      className="flex flex-col gap-1 rounded-xl bg-surface-muted p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-semibold text-ink">Tiket {index + 1}</span>
                      <span className="break-all font-mono text-xs text-ink-muted">{ticket.id}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-surface-muted p-6 text-center text-sm text-ink-muted">
                  {isWaiting
                    ? "Tiket terbit otomatis setelah pembayaran disetujui."
                    : "Tidak ada tiket untuk transaksi ini."}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
