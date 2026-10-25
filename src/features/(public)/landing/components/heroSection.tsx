"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

import {
  CITY_OPTIONS,
  HERO_SLIDES,
  POPULAR_PILLS,
} from "../constants/heroData";
import { useDebounce } from "../hooks/useDebounce";
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

  const { register, handleSubmit, watch, setValue } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { keyword: "", city: "" },
  });

  const keyword = watch("keyword");
  const city = watch("city");
  const debouncedKeyword = useDebounce(keyword, 500);

  // Jalan otomatis 500ms setelah user berhenti mengetik
  useEffect(() => {
    if (debouncedKeyword.trim().length < 2) return;

    // TODO: ganti dengan useQuery (@tanstack/react-query) / API call suggestion
    console.log("Search (debounced):", { keyword: debouncedKeyword, city });
  }, [debouncedKeyword, city]);

  const onSubmit = (data: SearchSchema) => {
    const params = new URLSearchParams();
    if (data.keyword.trim()) params.set("q", data.keyword.trim());
    if (data.city) params.set("city", data.city);
    router.push(`/events?${params.toString()}`);
  };

  const scrollToSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const target = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section className="relative mb-32 font-sans">
      {/* ===== Banner Carousel (daisyUI) ===== */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="carousel w-full rounded-b-xl"
        >
          {HERO_SLIDES.map((slide, index) => (
            <article
              key={slide.id}
              className="carousel-item relative h-130 w-full md:h-140"
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
              <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-end gap-4 px-6 pb-24 md:px-14 md:pb-28">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge border-none bg-primary text-xs font-bold text-white p-1">
                    {slide.badge}
                  </span>
                  <span className="badge border-none bg-white/20 text-xs font-semibold text-white backdrop-blur p-1">
                    {slide.category}
                  </span>
                  <span className="badge border-none bg-red-600 text-xs font-bold text-white p-1">
                    Sisa {slide.slotLeft} Slot
                  </span>
                </div>

                <h1 className="max-w-2xl text-3xl font-extrabold text-white md:text-5xl">
                  {slide.title}
                </h1>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/90 md:text-sm">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-primary" />
                    {format(new Date(slide.date), "d MMMM yyyy • HH:mm", {
                      locale: idLocale,
                    })}{" "}
                    WIB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-primary" />
                    {slide.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiTag className="text-primary" />
                    Mulai{" "}
                    <strong className="text-base">
                      {formatRupiah(slide.startPrice)}
                    </strong>
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <button type="button" className="btn rounded-full border-none bg-primary px-6 text-white shadow-none hover:brightness-110">
                    Daftar / Beli Tiket Sekarang
                    <FiArrowRight />
                  </button>
                  <button type="button" className="btn rounded-full border border-white/30 bg-white/15 px-6 text-white shadow-none backdrop-blur hover:bg-white/25">
                    Lihat Detail Event
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Tombol prev / next */}
        <button
          type="button"
          aria-label="Slide sebelumnya"
          onClick={() => scrollToSlide(activeIndex - 1)}
          className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80"
        >
          <FiChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Slide berikutnya"
          onClick={() => scrollToSlide(activeIndex + 1)}
          className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80"
        >
          <FiChevronRight size={18} />
        </button>

        {/* Indicator */}
        <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white lg:flex">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, i) => (
              <button
                type="button"
                key={slide.id}
                aria-label={`Ke slide ${i + 1}`}
                onClick={() => scrollToSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Search Card ===== */}
      <div className="absolute -bottom-24 left-1/2 z-20 flex w-[92%] max-w-3xl -translate-x-1/2 flex-col items-center gap-4">
        <div className="w-full rounded-2xl bg-white p-3 shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 md:flex-row"
        >
          <label className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-neutral px-4 focus-within:ring-2 focus-within:ring-primary/40">
            <FiSearch className="shrink-0 text-gray-400" />
            <input
              type="search"
              placeholder="Cari race maraton, liga mini soccer, turnamen esports..."
              className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-gray-400"
              {...register("keyword")}
            />
          </label>

          <label className="relative flex h-11 items-center gap-2 rounded-xl bg-neutral px-4 focus-within:ring-2 focus-within:ring-primary/40 md:w-44">
            <FiMapPin className="shrink-0 text-gray-400" />
            <select
              className="w-full appearance-none bg-transparent pr-5 text-sm text-secondary outline-none"
              {...register("city")}
            >
              {CITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-gray-400" />
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
          <span className="text-[11px] font-semibold text-gray-500">
            Pill Populer:
          </span>
          {POPULAR_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setValue("keyword", pill.label)}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-neutral px-3 py-1 text-[11px] font-medium text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <span>{pill.emoji}</span>
              {pill.label}
            </button>
          ))}
        </div>
        </div>

        {/* Trust badges (di bawah kartu, sesuai desain) */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {TRUST_ITEMS.map(({ id, icon: Icon, iconClass, label }) => (
            <li
              key={id}
              className="flex items-center gap-1.5 text-[11px] font-medium text-secondary"
            >
              <Icon className={iconClass} size={14} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
