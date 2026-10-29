"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCopy,
  FiMapPin,
  FiUploadCloud,
} from "react-icons/fi";
import { MdOutlineAccountBalance, MdOutlineConfirmationNumber } from "react-icons/md";
import { formatDate } from "@/features/(public)/eventDetail/utils/formatters";
import { TransactionDetail } from "@/types/transaction.type";
import { TRANSACTION_STATUS } from "../constants/transactionStatus";
import { useTransactionDetail } from "../hooks/useTransactions";
import {
  PriceSummary,
  StatusBadge,
  cardCls,
  focusRing,
  formatCountdown,
  useCountdown,
} from "../components/transactionUi";
import { ProofUploader } from "./proofUploader";

// 3 tahap utama alur bayar, status gagal (REJECTED/EXPIRED/CANCELLED) tampil sebagai alert
const STEPS = [
  { status: "WAITING_FOR_PAYMENT", label: "Upload Bukti" },
  { status: "WAITING_FOR_CONFIRMATION", label: "Menunggu Konfirmasi" },
  { status: "PAID", label: "Lunas & Tiket Terbit" },
] as const;

export function TransactionPaymentSection() {
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
        <Link href="/transaction" className={`btn btn-primary mt-5 rounded-full ${focusRing}`}>
          Ke Riwayat Transaksi
        </Link>
      </div>
    );
  }

  return <PaymentContent transaction={transaction} />;
}

function PaymentContent({ transaction }: { transaction: TransactionDetail }) {
  const { status, events: event } = transaction;
  const remaining = useCountdown(status === "WAITING_FOR_PAYMENT" ? transaction.paymentDeadline : null);
  // status di DB baru berubah EXPIRED setelah scheduler jalan, jadi FE kunci upload begitu waktu habis
  const isPaymentOver = status === "WAITING_FOR_PAYMENT" && remaining === 0;
  const latestProof = transaction.paymentProofs[0];
  const stepIndex = STEPS.findIndex((step) => step.status === status);
  const isFailed = stepIndex === -1;

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px]">
          <Link href="/transaction" className={`rounded font-medium text-ink-muted hover:text-accent-text ${focusRing}`}>
            Riwayat Transaksi
          </Link>
          <FiChevronRight aria-hidden className="text-ink-muted" size={12} />
          <span aria-current="page" className="font-semibold text-accent-text">Pembayaran</span>
          <span className="ml-1 rounded-md bg-surface-sunken px-2 py-0.5 font-mono text-xs text-ink">
            {transaction.transactionCode}
          </span>
        </nav>

        {/* Header + timer */}
        <section className={`${cardCls} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
          <div className="flex gap-4">
            <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
              <FiClock size={22} />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-ink">
                  {status === "WAITING_FOR_PAYMENT" ? "Selesaikan Pembayaran & Unggah Bukti" : "Status Pembayaran"}
                </h1>
                <StatusBadge status={status} />
              </div>
              <p className="max-w-2xl text-sm text-ink-muted">
                {isPaymentOver
                  ? "Batas waktu pembayaran sudah lewat. Kuota, voucher dan poin akan dikembalikan otomatis."
                  : TRANSACTION_STATUS[status].description}
              </p>
            </div>
          </div>
          {status === "WAITING_FOR_PAYMENT" && (
            <div className="flex shrink-0 flex-col items-start rounded-xl bg-accent-soft/40 px-5 py-3 md:items-end">
              <span className="text-xs font-medium text-ink-muted">Sisa Waktu Unggah</span>
              {/* role timer: screen reader tidak membacakan tiap detik */}
              <span role="timer" aria-live="off" className="text-3xl font-bold tabular-nums text-accent-text">
                {formatCountdown(remaining)}
              </span>
            </div>
          )}
        </section>

        {/* Progress */}
        <section className={cardCls} aria-label="Tahapan transaksi">
          {isFailed ? (
            <p role="status" className="rounded-xl bg-danger-soft p-4 text-sm font-medium text-danger-text">
              Transaksi {TRANSACTION_STATUS[status].label.toLowerCase()}. {TRANSACTION_STATUS[status].description}
            </p>
          ) : (
            <ol className="grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, index) => {
                const isDone = index < stepIndex || status === "PAID";
                const isActive = index === stepIndex && status !== "PAID";
                return (
                  <li
                    key={step.status}
                    aria-current={isActive ? "step" : undefined}
                    className={`flex items-center gap-3 rounded-xl p-4 ${
                      isActive ? "bg-accent-soft/40 ring-1 ring-primary" : isDone ? "bg-success-soft/30" : "bg-surface-muted"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isDone ? "bg-success-text text-white" : isActive ? "bg-accent-text text-white" : "bg-white text-ink-muted"
                      }`}
                    >
                      {isDone ? <FiCheckCircle aria-hidden /> : index + 1}
                    </span>
                    <span className={`text-sm font-semibold ${isActive || isDone ? "text-ink" : "text-ink-muted"}`}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-6">
            {/* Detail tiket */}
            <section className={cardCls}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
                <MdOutlineConfirmationNumber aria-hidden className="text-accent-text" />
                Detail Tiket
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:w-40">
                  <Image src={event.coverImageUrl} alt={event.title} fill sizes="160px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <Link
                    href={`/events/${event.slug}`}
                    className={`rounded text-lg font-bold text-ink hover:text-accent-text ${focusRing}`}
                  >
                    {event.title}
                  </Link>
                  {event.startsAt && (
                    <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                      <FiCalendar aria-hidden className="shrink-0" />
                      {formatDate(event.startsAt, "EEEE, d MMMM yyyy • HH:mm")} WIB
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <FiMapPin aria-hidden className="shrink-0" />
                    {event.location}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Penyelenggara: <span className="font-semibold text-ink">{event.organizer.organizationName}</span>
                  </p>
                  <span className="mt-1 w-fit rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-ink">
                    {transaction.quantity}x Tiket
                  </span>
                </div>
              </div>
            </section>

            {/* Tiket terbit */}
            {status === "PAID" && <IssuedTickets transaction={transaction} />}

            {/* Rekening tujuan */}
            {Number(transaction.finalAmount) > 0 && <BankTransferCard transaction={transaction} />}

            {/* Upload bukti / bukti terkirim */}
            {status === "WAITING_FOR_PAYMENT" ? (
              <section className={cardCls}>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                    <FiUploadCloud aria-hidden className="text-accent-text" />
                    Unggah Bukti Pembayaran
                  </h2>
                  <span className="text-xs font-semibold text-danger-text">Wajib dilampirkan</span>
                </div>
                <ProofUploader transactionId={transaction.id} disabled={isPaymentOver} />
              </section>
            ) : (
              latestProof && (
                <section className={cardCls}>
                  <h2 className="mb-1 text-lg font-bold text-ink">Bukti Pembayaran</h2>
                  <p className="mb-4 text-xs text-ink-muted">
                    Diunggah {formatDate(latestProof.uploadedAt, "d MMM yyyy, HH:mm")} WIB
                  </p>
                  <a
                    href={latestProof.storagePath}
                    target="_blank"
                    rel="noreferrer"
                    className={`relative block h-72 overflow-hidden rounded-xl bg-surface-muted ${focusRing}`}
                  >
                    <Image
                      src={latestProof.storagePath}
                      alt="Bukti pembayaran yang diunggah"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-contain"
                    />
                  </a>
                </section>
              )
            )}
          </div>

          <aside className={`${cardCls} flex h-fit flex-col gap-5 lg:sticky lg:top-24`}>
            <h2 className="text-lg font-bold text-ink">Ringkasan Pembayaran</h2>
            <PriceSummary
              total={Number(transaction.finalAmount)}
              rows={[
                { label: `Harga Tiket (${transaction.quantity}x)`, value: Number(transaction.subtotal) },
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
                  label: `Poin Reward (${transaction.pointUsed.toLocaleString("id-ID")} poin)`,
                  value: Number(transaction.pointDiscount),
                  discount: true,
                },
              ]}
            />
            <p className="text-xs text-ink-muted">
              Dibuat {formatDate(transaction.createdAt, "d MMM yyyy, HH:mm")} WIB
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function BankTransferCard({ transaction }: { transaction: TransactionDetail }) {
  const [isCopied, setIsCopied] = useState(false);
  const { bankEo } = transaction;

  const copyNumber = async () => {
    await navigator.clipboard.writeText(bankEo.accountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className={cardCls}>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
        <MdOutlineAccountBalance aria-hidden className="text-accent-text" />
        Tujuan Transfer Bank
      </h2>
      <div className="flex flex-col gap-3 rounded-xl bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-ink">{bankEo.bankName}</p>
          <p className="text-xs text-ink-muted">Atas nama</p>
          <p className="text-sm font-semibold text-ink">{bankEo.accountHolder}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="font-mono text-xl font-bold tabular-nums text-accent-text">{bankEo.accountNumber}</p>
          <button
            type="button"
            onClick={copyNumber}
            className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-ink shadow-sm hover:bg-surface-sunken ${focusRing}`}
          >
            <FiCopy aria-hidden />
            {isCopied ? "Tersalin" : "Salin Nomor"}
          </button>
          <span role="status" className="sr-only">
            {isCopied ? "Nomor rekening disalin" : ""}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Transfer tepat sesuai total pembayaran, lalu simpan struk atau tangkapan layar untuk diunggah di bawah.
      </p>
    </section>
  );
}

function IssuedTickets({ transaction }: { transaction: TransactionDetail }) {
  return (
    <section className={cardCls}>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-ink">
        <FiCheckCircle aria-hidden className="text-success-text" />
        E-Ticket Terbit
      </h2>
      <p className="mb-4 text-xs text-ink-muted">Tunjukkan kode tiket saat registrasi ulang di lokasi.</p>
      <ul className="flex flex-col gap-2">
        {transaction.tickets.map((ticket, index) => (
          <li
            key={ticket.id}
            className="flex flex-col gap-1 rounded-xl bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-semibold text-ink">Tiket {index + 1}</span>
            <span className="break-all font-mono text-xs text-ink-muted">{ticket.id}</span>
            <span
              className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${
                ticket.status === "VALID" ? "bg-success-soft/50 text-success-text" : "bg-danger-soft text-danger-text"
              }`}
            >
              {ticket.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
