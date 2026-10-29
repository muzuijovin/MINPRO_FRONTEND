"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiArrowRight, FiCalendar, FiChevronRight, FiCreditCard, FiMapPin, FiStar } from "react-icons/fi";
import { useSession } from "@/features/auth/hooks/useSession";
import { useEventDetail } from "@/features/(public)/eventDetail/hooks/useEventDetail";
import { formatDate, formatRupiah } from "@/features/(public)/eventDetail/utils/formatters";
import { useActiveEventTransaction, useBankAccountsByEvent, useCheckout } from "../hooks/useTransactions";
import { PriceSummary, cardCls, focusRing, getErrorMessage } from "../components/transactionUi";

const MAX_TICKET_PER_ACCOUNT = 5;

export function CheckoutSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // dikirim dari CheckoutBox di halaman detail event
  const slug = searchParams.get("slug") ?? "";
  const voucherId = searchParams.get("voucherId");
  const qtyParam = Number(searchParams.get("qty"));
  const quantity = Number.isInteger(qtyParam)
    ? Math.min(Math.max(qtyParam, 1), MAX_TICKET_PER_ACCOUNT)
    : 1;

  const { data: event, isLoading, isError } = useEventDetail(slug);
  const { data: bankAccounts = [], isLoading: isLoadingBank } = useBankAccountsByEvent(event?.id);
  // halaman ini sudah dijaga withAuthGuard(["CUSTOMER"]), jadi langsung cek transaksi aktif
  const { data: activeTransaction, isLoading: isCheckingActive } = useActiveEventTransaction(event?.id, true);
  const { mutate: checkout, isPending } = useCheckout();

  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const { data: session } = useSession();
  const [usePoints, setUsePoints] = useState(false);

  if (!slug || isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-base font-semibold text-ink">Event tidak ditemukan</p>
        <p className="mt-1 text-sm text-ink-muted">Pilih tiket dari halaman detail event terlebih dulu.</p>
        <Link href="/events" className={`btn btn-primary mt-5 rounded-full ${focusRing}`}>
          Jelajahi Event
        </Link>
      </div>
    );
  }

  if (isLoading || !event || isCheckingActive) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  // URL checkout dibuka langsung padahal sudah punya pesanan aktif -> arahkan ke transaksinya
  if (activeTransaction) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-base font-semibold text-ink">Kamu sudah punya pesanan aktif untuk event ini</p>
        <p className="mt-1 text-sm text-ink-muted">
          Satu akun hanya bisa memiliki satu pesanan aktif per event.
        </p>
        <Link
          href={`/transaction/${activeTransaction.id}`}
          className={`btn btn-primary mt-5 rounded-full ${focusRing}`}
        >
          Lihat Transaksi
        </Link>
      </div>
    );
  }

  const isFree = event.typePrice === "FREE";
  const price = isFree ? 0 : Number(event.price);
  const voucher = isFree ? undefined : event.eventVoucher.find((v) => v.id === voucherId);

  // perkiraan harga di FE (rumus sama dengan BE), harga final tetap dihitung BE
  const subtotal = price * quantity;
  const voucherDiscount = voucher
    ? Math.floor((subtotal * Number(voucher.discountPercentage)) / 100)
    : 0;
  const maxPoint = subtotal - voucherDiscount;
  // poin yang bisa dipakai = saldo user, tapi tidak boleh lebih dari harga setelah voucher
  const totalPoints = session?.totalPoints ?? 0;
  const usablePoints = Math.min(totalPoints, maxPoint);
  const pointDiscount = usePoints ? usablePoints : 0;
  const total = maxPoint - pointDiscount;

  // kalau EO cuma punya 1 rekening langsung terpilih
  const bankAccountId = selectedBankId ?? (bankAccounts.length === 1 ? bankAccounts[0].id : null);

  const onSubmit = () => {
    if (!bankAccountId) {
      toast.error("Pilih rekening tujuan transfer dulu");
      return;
    }
    checkout(
      {
        eventId: event.id,
        bankAccountId,
        quantity,
        eventVoucherId: voucher?.id ?? null,
        pointUsed: pointDiscount,
      },
      {
        onSuccess(transaction) {
          toast.success(
            transaction.status === "PAID"
              ? "Tiket gratis berhasil didapatkan!"
              : "Pesanan dibuat, segera lakukan pembayaran",
          );
          router.replace(`/transaction/${transaction.id}`);
        },
        onError(error) {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px]">
          <Link href="/events" className={`rounded font-medium text-ink-muted hover:text-accent-text ${focusRing}`}>
            Jelajahi Event
          </Link>
          <FiChevronRight aria-hidden className="text-ink-muted" size={12} />
          <Link href={`/events/${event.slug}`} className={`rounded font-medium text-ink-muted hover:text-accent-text ${focusRing}`}>
            {event.title}
          </Link>
          <FiChevronRight aria-hidden className="text-ink-muted" size={12} />
          <span aria-current="page" className="font-semibold text-accent-text">Checkout</span>
        </nav>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Checkout Pesanan</h1>
          <p className="text-sm text-ink-muted">Periksa pesanan lalu pilih rekening tujuan transfer.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            {/* Detail tiket */}
            <section className={cardCls}>
              <h2 className="mb-4 text-lg font-bold text-ink">Detail Tiket</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:w-44">
                  <Image src={event.coverImageUrl} alt={event.title} fill sizes="176px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text">
                    {event.categories?.name}
                  </span>
                  <p className="text-lg font-bold text-ink">{event.title}</p>
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
                  <span className="mt-1 w-fit rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-ink">
                    {quantity}x Tiket {isFree ? "Gratis" : formatRupiah(price)}
                  </span>
                </div>
              </div>
            </section>

            {/* Rekening tujuan */}
            <section className={cardCls}>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 flex items-center gap-2 text-lg font-bold text-ink">
                  <FiCreditCard aria-hidden className="text-accent-text" />
                  Rekening Tujuan Transfer
                </legend>
                {isLoadingBank ? (
                  <div className="skeleton h-16 w-full rounded-xl" />
                ) : bankAccounts.length === 0 ? (
                  <p role="alert" className="rounded-xl bg-danger-soft p-4 text-sm text-danger-text">
                    Penyelenggara belum menambahkan rekening aktif, checkout belum bisa dilakukan.
                  </p>
                ) : (
                  bankAccounts.map((bank) => (
                    <label
                      key={bank.id}
                      className="flex min-h-16 cursor-pointer items-center gap-3 rounded-xl bg-surface-muted p-4 has-checked:bg-accent-soft/30 has-checked:ring-1 has-checked:ring-primary"
                    >
                      <input
                        type="radio"
                        name="bankAccount"
                        className="radio radio-primary radio-sm"
                        checked={bankAccountId === bank.id}
                        onChange={() => setSelectedBankId(bank.id)}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-bold text-ink">{bank.bankName}</span>
                        <span className="text-xs text-ink-muted">a.n. {bank.accountHolder}</span>
                      </span>
                      <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                        {bank.accountNumber}
                      </span>
                    </label>
                  ))
                )}
                {isFree && (
                  <p className="text-xs text-ink-muted">
                    Event gratis tidak perlu transfer, tiket langsung terbit setelah checkout.
                  </p>
                )}
              </fieldset>
            </section>

            {/* Poin reward: saldo dari users.totalPoints (GET /auth/me), BE tetap cek ulang saat checkout */}
            {!isFree && (
              <section className={`${cardCls} flex flex-col gap-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                      <FiStar aria-hidden className="text-accent-text" />
                      Poin Reward
                    </h2>
                    <p className="text-sm text-ink-muted">
                      Saldo kamu:{" "}
                      <strong className="font-semibold tabular-nums text-ink">
                        {totalPoints.toLocaleString("id-ID")} poin
                      </strong>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink">
                    1 Poin = Rp 1
                  </span>
                </div>

                <label
                  className={`flex min-h-14 items-start gap-3 rounded-xl bg-surface-muted p-4 has-checked:bg-accent-soft/30 has-checked:ring-1 has-checked:ring-primary ${
                    usablePoints > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm mt-0.5"
                    checked={usePoints && usablePoints > 0}
                    disabled={usablePoints === 0}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    aria-describedby="pointHint"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-ink">
                      {usablePoints > 0
                        ? `Gunakan ${usablePoints.toLocaleString("id-ID")} Poin (-${formatRupiah(usablePoints)})`
                        : "Belum ada poin yang bisa dipakai"}
                    </span>
                    <span id="pointHint" className="text-xs text-ink-muted">
                      {totalPoints > maxPoint
                        ? `Maksimal ${maxPoint.toLocaleString("id-ID")} poin untuk pesanan ini. `
                        : ""}
                      Poin dikembalikan utuh bila pesanan batal atau kedaluwarsa.
                    </span>
                  </span>
                </label>
              </section>
            )}
          </div>

          {/* Ringkasan */}
          <aside className={`${cardCls} flex h-fit flex-col gap-5 lg:sticky lg:top-24`}>
            <h2 className="text-lg font-bold text-ink">Ringkasan Pembayaran</h2>
            <PriceSummary
              total={total}
              rows={[
                { label: `Harga Tiket (${quantity}x)`, value: subtotal },
                { label: `Voucher ${voucher?.code ?? ""}`, value: voucherDiscount, discount: true },
                { label: "Potongan Poin", value: pointDiscount, discount: true },
              ]}
            />
            <button
              type="button"
              onClick={onSubmit}
              disabled={isPending || bankAccounts.length === 0}
              className={`flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${focusRing}`}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  {isFree ? "Ambil Tiket Gratis" : "Buat Pesanan"}
                  <FiArrowRight aria-hidden />
                </>
              )}
            </button>
            {!isFree && (
              <p className="text-center text-xs text-ink-muted">
                Setelah pesanan dibuat, kamu punya waktu 10 menit untuk transfer dan unggah bukti.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
