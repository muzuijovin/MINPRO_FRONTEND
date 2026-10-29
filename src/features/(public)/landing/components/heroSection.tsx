"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiSearch,
  FiShield,
  FiTag,
} from "react-icons/fi";
import { MdQrCode2 } from "react-icons/md";

import { CITY_OPTIONS, POPULAR_PILLS } from "../constants/heroData";
import { MIN_SEARCH_LENGTH, useSearchEvents } from "../hooks/useSearchEvents";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { SearchSchema, searchSchema } from "../validation/searchSchema";

const TRUST_ITEMS = [
  {
    id: 1,
    icon: FiCheckCircle,
    iconClass: "text-tertiary",
    label: "Penyelenggara Resmi Terverifikasi",
  },
  {
    id: 2,
    icon: MdQrCode2,
    iconClass: "text-primary",
    label: "E-Ticket Instan",
  },
  {
    id: 3,
    icon: FiShield,
    iconClass: "text-secondary",
    label: "Asuransi Perlindungan Peserta",
  },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("Rp", "IDR ");

export function HeroSection() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 3 event terdekat dari GET /events
  const { data: events = [], isLoading: isEventsLoading } =
    useUpcomingEvents(3);

  const { register, handleSubmit, watch, setValue } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { keyword: "", city: "" },
  });

  const keyword = watch("keyword");
  const city = watch("city");
  // request suggestion baru jalan 500ms setelah user berhenti mengetik
  const [debouncedKeyword] = useDebounce(keyword, 500);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  const {
    data: suggestions = [],
    isFetching: isSuggestFetching,
    isError: isSuggestError,
  } = useSearchEvents(debouncedKeyword, city);

  const showSuggest =
    isSuggestOpen && debouncedKeyword.trim().length >= MIN_SEARCH_LENGTH;

  // nama param disamakan dengan query GET /events di BE (search & location)
  const onSubmit = (data: SearchSchema) => {
    const params = new URLSearchParams();
    if (data.keyword.trim()) params.set("search", data.keyword.trim());
    if (data.city) params.set("location", data.city);
    setIsSuggestOpen(false);
    router.push(`/events?${params.toString()}`);
  };

  const scrollToSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const target = (index + events.length) % events.length;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section className="relative mb-32 font-sans">
      {/* satu h1 per halaman; judul tiap slide pakai h2 */}
      <h1 className="sr-only">SportTicketing, tiket event olahraga di Indonesia</h1>

      {/* ===== Banner Carousel (daisyUI) ===== */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          aria-roledescription="carousel"
          aria-label="Event terdekat"
          className="carousel w-full rounded-b-xl"
        >
          {isEventsLoading ? (
            <div className="carousel-item h-130 w-full animate-pulse bg-gray-300 md:h-140" />
          ) : events.length === 0 ? (
            // belum ada event terdekat / request gagal -> banner default
            <article className="carousel-item relative h-130 w-full bg-secondary md:h-140">
              <div className="relative z-10 flex h-full flex-col justify-end gap-4 px-6 pb-24 md:px-14 md:pb-28">
                <h2 className="max-w-2xl text-3xl font-extrabold text-balance text-white md:text-5xl">
                  Belum ada event terdekat
                </h2>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  Pantau terus, event olahraga baru akan segera hadir.
                </p>
                <div className="mt-2">
                  <Link
                    href="/events"
                    className="btn rounded-full border-none bg-primary px-6 text-white shadow-none hover:brightness-110"
                  >
                    Jelajahi Event
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            events.map((event, index) => (
              <article
                key={event.id}
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${events.length}`}
                className="carousel-item relative h-130 w-full md:h-140"
              >
                <Image
                  src={event.coverImageUrl}
                  alt={event.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />

                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
                <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-end gap-4 px-6 pb-24 md:px-14 md:pb-28">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge border-none bg-accent-text text-xs font-bold text-white p-1">
                      {event.typePrice === "FREE" ? "GRATIS" : "EVENT TERDEKAT"}
                    </span>
                    <span className="badge border-none bg-white/20 text-xs font-semibold text-white backdrop-blur p-1">
                      {event.categories?.name}
                    </span>
                    <span className="badge border-none bg-red-600 text-xs font-bold text-white p-1">
                      Kuota {event.quota} Slot
                    </span>
                  </div>

                  <h2 className="max-w-2xl text-3xl font-extrabold text-balance text-white md:text-5xl">
                    {event.title}
                  </h2>
                  <p className="line-clamp-2 max-w-xl text-sm text-white/80 md:text-base">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/90 md:text-sm">
                    {event.startsAt && (
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="text-primary" />
                        {format(
                          new Date(event.startsAt),
                          "d MMMM yyyy • HH:mm",
                          {
                            locale: idLocale,
                          },
                        )}{" "}
                        WIB
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-primary" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiTag className="text-primary" />
                      {event.typePrice === "FREE" ? (
                        <strong className="text-base">Gratis</strong>
                      ) : (
                        <>
                          Mulai{" "}
                          <strong className="text-base tabular-nums">
                            {formatRupiah(Number(event.price))}
                          </strong>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <Link
                      href={`/events/${event.slug}`}
                      className="btn rounded-full border-none bg-primary px-6 text-white shadow-none hover:brightness-110"
                    >
                      Daftar / Beli Tiket Sekarang
                      <FiArrowRight />
                    </Link>
                    <Link
                      href={`/events/${event.slug}`}
                      className="btn rounded-full border border-white/30 bg-white/15 px-6 text-white shadow-none backdrop-blur hover:bg-white/25"
                    >
                      Lihat Detail Event
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Tombol prev / next & indicator cuma muncul kalau slide nya lebih dari 1 */}
        {events.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Slide sebelumnya"
              onClick={() => scrollToSlide(activeIndex - 1)}
              className="btn btn-circle absolute left-3 top-1/2 z-20 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiChevronLeft aria-hidden size={20} />
            </button>
            <button
              type="button"
              aria-label="Slide berikutnya"
              onClick={() => scrollToSlide(activeIndex + 1)}
              className="btn btn-circle absolute right-3 top-1/2 z-20 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiChevronRight aria-hidden size={20} />
            </button>

            {/* Indicator */}
            <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white lg:flex">
              <span className="tabular-nums">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(events.length).padStart(2, "0")}
              </span>
              <div className="flex items-center">
                {events.map((event, i) => (
                  // area klik 24px, garis indikatornya tetap kecil di dalam
                  <button
                    type="button"
                    key={event.id}
                    aria-label={`Ke slide ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => scrollToSlide(i)}
                    className="flex h-6 cursor-pointer items-center px-0.5 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <span
                      className={`block h-1.5 rounded-full motion-safe:transition-all ${
                        i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== Search Card ===== */}
      <div className="absolute -bottom-24 left-1/2 z-20 flex w-[92%] max-w-3xl -translate-x-1/2 flex-col items-center gap-4">
        <div className="w-full rounded-2xl bg-white p-3 shadow-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 md:flex-row"
          >
            <div className="relative flex-1">
              <label className="flex h-11 items-center gap-2 rounded-xl bg-neutral px-4 focus-within:ring-2 focus-within:ring-primary/40">
                <FiSearch aria-hidden className="shrink-0 text-ink-muted" />
                <input
                  type="search"
                  autoComplete="off"
                  aria-label="Cari event olahraga"
                  placeholder="Cari race maraton, liga mini soccer, turnamen esports..."
                  className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-ink-muted/80"
                  {...register("keyword", {
                    onChange: () => setIsSuggestOpen(true),
                    onBlur: () => setIsSuggestOpen(false),
                  })}
                  onFocus={() => setIsSuggestOpen(true)}
                />
              </label>

              {/* Dropdown suggestion */}
              {showSuggest && (
                <ul
                  // preventDefault supaya input tidak blur (dropdown tidak ketutup) sebelum link ke klik
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute left-0 right-0 top-12 z-30 max-h-72 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
                >
                  {isSuggestFetching && suggestions.length === 0 ? (
                    <li className="flex items-center gap-2 px-3 py-2 text-xs text-ink-muted">
                      <span aria-hidden className="loading loading-spinner loading-xs" />
                      Mencari event...
                    </li>
                  ) : isSuggestError ? (
                    <li className="px-3 py-2 text-xs text-danger-text">
                      Gagal memuat hasil pencarian. Coba ketik ulang kata kuncinya.
                    </li>
                  ) : suggestions.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-ink-muted">
                      Event &quot;{debouncedKeyword}&quot; tidak ditemukan
                    </li>
                  ) : (
                    <>
                      {suggestions.map((event) => (
                        <li key={event.id}>
                          <Link
                            href={`/events/${event.slug}`}
                            className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 hover:bg-neutral focus-visible:outline-2 focus-visible:outline-accent-text"
                          >
                            <span className="truncate text-sm font-medium text-secondary">
                              {event.title}
                            </span>
                            <span className="truncate text-xs text-ink-muted">
                              {event.categories?.name} • {event.location}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          type="submit"
                          className="min-h-11 w-full cursor-pointer rounded-lg px-3 text-left text-xs font-semibold text-accent-text hover:bg-neutral focus-visible:outline-2 focus-visible:outline-accent-text"
                        >
                          Lihat semua hasil &quot;{debouncedKeyword}&quot;
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>

            <label className="relative flex h-11 items-center gap-2 rounded-xl bg-neutral px-4 focus-within:ring-2 focus-within:ring-primary/40 md:w-44">
              <FiMapPin aria-hidden className="shrink-0 text-ink-muted" />
              <select
                aria-label="Pilih kota"
                className="w-full appearance-none bg-transparent pr-5 text-sm text-secondary outline-none"
                {...register("city")}
              >
                {CITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FiChevronDown aria-hidden className="pointer-events-none absolute right-3 text-ink-muted" />
            </label>

            <button
              type="submit"
              className="btn h-11 min-h-0 rounded-xl border-none bg-primary px-6 text-sm text-white shadow-none hover:brightness-110"
            >
              Cari Tiket Olahraga
              <FiArrowRight />
            </button>
          </form>

          {/* Pill populer */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              Pill Populer:
            </span>
            {POPULAR_PILLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setValue("keyword", label)}
                className="flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-neutral px-3 text-xs font-medium text-secondary transition-colors hover:border-accent-text hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
              >
                <Icon aria-hidden size={14} className="text-accent-text" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges (di bawah kartu, sesuai desain) */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {TRUST_ITEMS.map(({ id, icon: Icon, iconClass, label }) => (
            <li
              key={id}
              className="flex items-center gap-1.5 text-xs font-medium text-secondary"
            >
              <Icon aria-hidden className={iconClass} size={14} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
