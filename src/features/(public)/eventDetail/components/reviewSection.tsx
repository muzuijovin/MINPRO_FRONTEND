"use client";

import { FormEvent, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { EventDetail } from "@/types/event.type";

const MAX_COMMENT_LENGTH = 1000;

export function ReviewSection({ event }: { event: EventDetail }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");

  const activeRating = hoverRating || rating;
  const canSubmit = rating > 0 && comment.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: kirim ke API review kalau endpoint nya sudah ada
    setNotice("Fitur kirim ulasan segera hadir.");
  };

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
        <FiInfo className="shrink-0 text-accent-text" size={20} />
        <p className="text-xs leading-4.5 text-ink-muted">
          <span className="font-bold text-ink">Kebijakan Transparansi:</span>{" "}
          Hanya peserta yang telah hadir di event yang dapat memberikan ulasan dan rating.
        </p>
      </div>

      {/* Ringkasan rating dari GET /events/:slug */}
      <div className="flex flex-col items-center rounded-xl bg-surface-muted p-6 text-center">
        <p className="text-[54px] font-bold leading-17 text-ink">
          {event.averageRating.toFixed(1)}
        </p>
        <div className="flex items-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={20}
              className={star <= Math.round(event.averageRating) ? "text-primary" : "text-line"}
            />
          ))}
        </div>
        <p className="pt-0.5 text-xs leading-4.5 text-ink-muted">
          {event.totalReviews > 0
            ? `Dari total ${event.totalReviews} ulasan peserta`
            : "Belum ada ulasan untuk event ini"}
        </p>
      </div>

      {/* Form ulasan, belum terhubung ke API */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-surface-sunken p-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold leading-5 text-ink">Beri Rating</span>
          <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rating ${star} bintang`}
                aria-pressed={rating === star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                className="cursor-pointer rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
              >
                <FaStar
                  size={24}
                  className={`transition-colors ${star <= activeRating ? "text-primary" : "text-line"}`}
                />
              </button>
            ))}
          </div>
        </div>

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
          <span className="self-end text-xs text-ink-muted">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </label>

        {/* role=status: pesan dibacakan screen reader tanpa memindah fokus */}
        <p role="status" className="text-xs font-medium text-accent-text">{notice}</p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-11 w-fit cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
        >
          Kirim Ulasan
        </button>
      </form>
    </section>
  );
}
