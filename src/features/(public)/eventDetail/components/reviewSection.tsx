"use client";

import { AxiosError } from "axios";
import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiCheckCircle, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/features/transaction/components/transactionUi";
import { useAuthStore } from "@/store/useAuthStore";
import { EventDetail } from "@/types/event.type";
import { EventReview } from "@/types/review.type";
import { useCreateReview, useEventReviews, useHasPaidTransaction } from "../hooks/useReviews";
import { formatDate, getInitials } from "../utils/formatters";

const MAX_COMMENT_LENGTH = 1000;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} dari 5`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} aria-hidden size={size} className={star <= value ? "text-primary" : "text-line"} />
      ))}
    </div>
  );
}

// kotak info pengganti form (belum login, event belum selesai, belum punya tiket, dll)
function FormNotice({ children, success }: { children: ReactNode; success?: boolean }) {
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-xl p-5 text-sm ${
        success ? "bg-success-soft/25 text-success-text ring-1 ring-success-text/30" : "border border-surface-sunken text-ink-muted"
      }`}
    >
      {success && <FiCheckCircle aria-hidden className="shrink-0" size={18} />}
      <div>{children}</div>
    </div>
  );
}

function ReviewForm({ event, onDone }: { event: EventDetail; onDone: (message: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: createReview, isPending } = useCreateReview(event.slug);

  const activeRating = hoverRating || rating;
  const canSubmit = rating > 0 && comment.trim().length > 0 && !isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    createReview(
      { eventId: event.id, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success("Ulasan berhasil dikirim, terima kasih!");
          onDone("Terima kasih, ulasanmu sudah tersimpan.");
        },
        onError: (error) => {
          // 409 = customer ini sudah pernah review event ini, form tidak perlu ditampilkan lagi
          if (error instanceof AxiosError && error.response?.status === 409) {
            onDone("Kamu sudah memberikan ulasan untuk event ini.");
            return;
          }
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-surface-sunken p-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="pb-2 text-sm font-bold leading-5 text-ink">Beri Rating</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Rating ${star} bintang`}
              aria-pressed={rating === star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className={`flex size-10 cursor-pointer items-center justify-center rounded ${FOCUS}`}
            >
              <FaStar
                aria-hidden
                size={24}
                className={`transition-colors ${star <= activeRating ? "text-primary" : "text-line"}`}
              />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold leading-5 text-ink">Tulis Ulasan</span>
        <textarea
          rows={4}
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalamanmu: rute, fasilitas, panitia, dll."
          className="resize-none rounded-xl bg-surface-muted p-4 text-sm leading-5.5 text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40"
        />
        <span className="self-end text-xs tabular-nums text-ink-muted">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`min-h-11 w-fit cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`}
      >
        {isPending ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}

// syarat review sama dengan BE: login sebagai customer, event sudah selesai, punya transaksi PAID
function ReviewFormGate({ event }: { event: EventDetail }) {
  const role = useAuthStore((state) => state.role);
  const isChecked = useAuthStore((state) => state.isChecked);
  const [doneMessage, setDoneMessage] = useState("");

  const finishedAt = event.endsAt ?? event.startsAt;
  const isFinished = !!finishedAt && new Date(finishedAt) <= new Date();
  const isCustomer = role === "CUSTOMER";

  const { data: hasPaid, isLoading } = useHasPaidTransaction(event.id, isCustomer && isFinished);

  if (!isChecked) return null;

  if (!role)
    return (
      <FormNotice>
        <Link href="/login" className={`rounded font-semibold text-accent-text underline ${FOCUS}`}>
          Masuk
        </Link>{" "}
        sebagai peserta untuk memberikan ulasan.
      </FormNotice>
    );

  // EO tidak bisa review
  if (!isCustomer) return null;

  if (doneMessage) return <FormNotice success>{doneMessage}</FormNotice>;

  if (!isFinished) return <FormNotice>Ulasan bisa dikirim setelah event selesai.</FormNotice>;

  if (isLoading) return <div className="skeleton h-40 rounded-xl" />;

  if (!hasPaid)
    return (
      <FormNotice>Hanya peserta dengan transaksi yang sudah dikonfirmasi yang dapat memberikan ulasan.</FormNotice>
    );

  return <ReviewForm event={event} onDone={setDoneMessage} />;
}

function ReviewItem({ review }: { review: EventReview }) {
  const name = review.users?.customerProfile?.fullname || review.users?.username || "Peserta";
  return (
    <li className="flex gap-4 border-b border-line py-5 last:border-b-0">
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-text"
      >
        {getInitials(name)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="truncate text-sm font-bold text-ink">{name}</p>
          <time dateTime={review.createdAt} className="text-xs text-ink-muted">
            {formatDate(review.createdAt, "d MMM yyyy")}
          </time>
        </div>
        <Stars value={review.rating} size={14} />
        <p className="whitespace-pre-line break-words pt-1 text-sm leading-5.5 text-ink-muted">{review.comment}</p>
      </div>
    </li>
  );
}

function ReviewList({ eventId }: { eventId: string }) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useEventReviews(eventId);
  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );

  if (reviews.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-bold text-ink">Ulasan Peserta</h3>
      <ul>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={`min-h-11 w-fit cursor-pointer self-center rounded-full bg-surface-sunken px-6 text-sm font-semibold text-ink hover:bg-gray-200 disabled:opacity-50 ${FOCUS}`}
        >
          {isFetchingNextPage ? "Memuat..." : "Muat ulasan lainnya"}
        </button>
      )}
    </div>
  );
}

export function ReviewSection({ event }: { event: EventDetail }) {
  return (
    <section className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:p-8">
      <div>
        <p className="text-xs font-bold uppercase leading-4 tracking-[0.55px] text-accent-text">
          Ulasan Peserta
        </p>
        <h2 className="text-2xl font-bold leading-9 tracking-[-0.7px] text-ink md:text-[28px]">
          Rating & Ulasan
        </h2>
        <p className="text-xs leading-4.5 text-ink-muted">
          Bagikan pengalamanmu mengikuti event ini
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg bg-surface-muted p-4">
        <FiInfo aria-hidden className="shrink-0 text-accent-text" size={20} />
        <p className="text-xs leading-4.5 text-ink-muted">
          <span className="font-bold text-ink">Kebijakan Transparansi:</span>{" "}
          Hanya peserta yang telah hadir di event yang dapat memberikan ulasan dan rating.
        </p>
      </div>

      {/* Ringkasan rating dari GET /events/:slug */}
      <div className="flex flex-col items-center rounded-xl bg-surface-muted p-6 text-center">
        <p className="text-[54px] font-bold leading-17 tabular-nums text-ink">
          {event.averageRating.toFixed(1)}
        </p>
        <div className="py-1">
          <Stars value={Math.round(event.averageRating)} size={20} />
        </div>
        <p className="pt-0.5 text-xs leading-4.5 text-ink-muted">
          {event.totalReviews > 0
            ? `Dari total ${event.totalReviews} ulasan peserta`
            : "Belum ada ulasan untuk event ini"}
        </p>
      </div>

      <ReviewFormGate event={event} />

      <ReviewList eventId={event.id} />
    </section>
  );
}
