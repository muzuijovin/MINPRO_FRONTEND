"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { IconType } from "react-icons";
import { FiCalendar, FiGift, FiPause, FiPlay, FiStar } from "react-icons/fi";
import { MdOutlineCampaign } from "react-icons/md";
import { formatDate } from "@/features/(public)/eventDetail/utils/formatters";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem } from "@/types/event.type";

type Announcement = { icon: IconType; text: ReactNode; cta: string; href: string };

// isi pengumuman cuma fitur yang benar-benar ada di aplikasi
const STATIC_ANNOUNCEMENTS: Announcement[] = [
  {
    icon: FiGift,
    text: "Ajak teman daftar pakai kode referralmu, dapat 10.000 poin untuk potong harga tiket",
    cta: "Daftar sekarang",
    href: "/register",
  },
  {
    icon: FiStar,
    text: "Banyak event olahraga GRATIS menunggumu",
    cta: "Lihat event gratis",
    href: "/events?typePrice=FREE",
  },
  {
    icon: MdOutlineCampaign,
    text: "Punya turnamen atau lomba lari? Publikasikan event-mu di JOVLEN",
    cta: "Buat event",
    href: "/organizer/events",
  },
];

// event terdekat untuk pesan dinamis (cuma ambil 1)
function useNearestEvent() {
  return useQuery({
    queryKey: ["events", "nearest"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<EventItem[]>>("/events", {
        params: { limit: 1, time: "upcoming", sortBy: "startsAt", order: "asc" },
      });
      return res?.data?.data?.[0] ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function AnnouncementItem({ item, hidden }: { item: Announcement; hidden?: boolean }) {
  const Icon = item.icon;
  return (
    <li aria-hidden={hidden} className="flex shrink-0 items-center gap-2 px-6">
      <Icon aria-hidden className="shrink-0 text-primary" size={14} />
      <span>{item.text}</span>
      <Link
        href={item.href}
        // salinan kedua cuma untuk efek loop, tidak perlu ikut urutan Tab
        tabIndex={hidden ? -1 : undefined}
        className="rounded font-bold text-white underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {item.cta} →
      </Link>
      <span aria-hidden className="ml-6 size-1 rounded-full bg-white/40" />
    </li>
  );
}

// bar pengumuman berjalan pelan dari kanan ke kiri di atas navbar
export function AnnouncementBar() {
  const [isPaused, setIsPaused] = useState(false);
  const { data: nearestEvent } = useNearestEvent();

  const announcements: Announcement[] = nearestEvent
    ? [
        {
          icon: FiCalendar,
          text: (
            <>
              Event terdekat: <strong className="font-bold text-white">{nearestEvent.title}</strong>
              {nearestEvent.startsAt && `, ${formatDate(nearestEvent.startsAt, "d MMM yyyy")}`} · sisa{" "}
              {nearestEvent.quota} slot
            </>
          ),
          cta: "Beli tiket",
          href: `/events/${nearestEvent.slug}`,
        },
        ...STATIC_ANNOUNCEMENTS,
      ]
    : STATIC_ANNOUNCEMENTS;

  return (
    <aside aria-label="Pengumuman" className="relative flex h-9 items-center bg-ink text-xs text-white/85">
      {/* pinggir kiri-kanan dipudarkan supaya teks terlihat masuk & keluar dengan halus */}
      <div className="relative h-full flex-1 overflow-hidden mask-x-from-95% mask-x-to-100% motion-reduce:overflow-x-auto">
        <ul
          className={`flex h-full w-max items-center animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none ${
            isPaused ? "[animation-play-state:paused]" : ""
          }`}
        >
          {announcements.map((item) => (
            <AnnouncementItem key={item.href} item={item} />
          ))}
          {announcements.map((item) => (
            <AnnouncementItem key={`copy-${item.href}`} item={item} hidden />
          ))}
        </ul>
      </div>

      {/* WCAG 2.2.2: konten yang bergerak terus harus bisa dihentikan */}
      <div className="flex h-full shrink-0 items-center border-l border-white/10 px-1.5 motion-reduce:hidden">
        <AnnouncementButton
          label={isPaused ? "Jalankan pengumuman" : "Hentikan pengumuman"}
          onClick={() => setIsPaused((prev) => !prev)}
        >
          {isPaused ? <FiPlay aria-hidden size={13} /> : <FiPause aria-hidden size={13} />}
        </AnnouncementButton>
      </div>
    </aside>
  );
}

function AnnouncementButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
    >
      {children}
    </button>
  );
}
