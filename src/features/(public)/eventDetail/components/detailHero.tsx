"use client";

import Image from "next/image";
import { useState } from "react";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { EventDetail } from "@/types/event.type";
import { EVENT_FORMAT_LABEL } from "../utils/formatters";

// status pendaftaran dihitung dari endsAt & quota
function getRegistrationStatus(event: EventDetail) {
  if (event.endsAt && new Date(event.endsAt) < new Date())
    return { label: "Event Telah Selesai", dot: "bg-gray-400", text: "text-gray-600" };
  if (event.quota <= 0)
    return { label: "Kuota Habis", dot: "bg-red-500", text: "text-red-700" };
  return { label: "Pendaftaran Dibuka • Tersedia", dot: "bg-[#00af79]", text: "text-success-text" };
}

export function DetailHero({ event }: { event: EventDetail }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const status = getRegistrationStatus(event);

  // pakai share bawaan device kalau ada, kalau tidak copy link ke clipboard
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // user batal share -> abaikan
    }
  };

  return (
    <section className="relative flex h-80 flex-col justify-between overflow-hidden rounded-2xl bg-surface-muted p-6 shadow-md md:h-110 md:p-8">
      {event.coverImageUrl && (
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          priority
          sizes="(min-width: 1280px) 1184px, 100vw"
          className="object-cover"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/30 to-black/20" />

      {/* Badge kategori & status + tombol aksi */}
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-text px-3 py-1 text-xs font-semibold leading-4 tracking-[0.22px] text-white">
            {event.categories?.name}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1">
            <span aria-hidden className={`size-2 rounded-full ${status.dot}`} />
            <span className={`text-xs font-semibold leading-4 tracking-[0.22px] ${status.text}`}>
              {status.label}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isLiked ? "Hapus dari favorit" : "Tambah ke favorit"}
            aria-pressed={isLiked}
            onClick={() => setIsLiked((prev) => !prev)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <FiHeart size={17} className={isLiked ? "fill-primary" : ""} />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Bagikan event"
              onClick={handleShare}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiShare2 size={16} />
            </button>
            {isCopied && (
              <span role="status" className="absolute right-0 top-12 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white">
                Link disalin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Format event + judul */}
      <div className="relative flex flex-col gap-1 pt-1">
        <span className="w-fit rounded bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.55px] text-white backdrop-blur-[2px]">
          Event {EVENT_FORMAT_LABEL[event.format] ?? event.format}
        </span>
        <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-[-0.9px] text-white md:text-4xl md:leading-11">
          {event.title}
        </h1>
      </div>
    </section>
  );
}
