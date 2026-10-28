"use client";

import {
  createEventFormSchema,
  CreateEventFormInput,
  CreateEventFormValues,
} from "@/features/validation/createEventSchema";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { toDateTimeLocal } from "@/lib/datetime.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem } from "@/types/event.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  FiCalendar,
  FiEdit3,
  FiFlag,
  FiImage,
  FiInfo,
  FiMapPin,
  FiShield,
  FiTag,
  FiUploadCloud,
} from "react-icons/fi";
import {
  FORMAT_OPTIONS,
  LOCATION_OPTIONS,
  TYPE_PRICE_OPTIONS,
} from "../../constants/createEventData";
import { toast } from "react-toastify";

const inputCls =
  "w-full rounded-lg border border-base-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

const errorCls = "mt-1 text-xs text-red-500";

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-white">
      <div className="flex items-start gap-3 border-b border-base-300 bg-neutral px-5 py-4">
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          {icon}
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-secondary/60">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export function CreateEventTemplate() {
  const router = useRouter();

  const {
    data: categories = [],
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategoryTree();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormInput, unknown, CreateEventFormValues>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: "",
      parentCategoryId: "",
      categoryId: "",
      format: "SPECTATOR",
      venue: "",
      location: "",
      description: "",
      startsAt: "",
      endsAt: "",
      typePrice: "PAID",
      price: 0,
    },
  });

  // mutateAsync supaya handleSubmit menunggu request -> isSubmitting tetap true
  const { mutateAsync: createEventMutation } = useMutation({
    mutationFn: async (data: CreateEventFormValues) => {
      // backend pakai multer, jadi kirim sebagai FormData (bukan JSON)
      const fd = new FormData();
      // organizerId tidak dikirim, BE ambil dari token di cookie (withCredentials)
      // parentCategoryId sengaja tidak dikirim, hanya dipakai di form
      fd.append("categoryId", data?.categoryId);
      fd.append("title", data?.title);
      fd.append("description", data?.description);
      fd.append("location", `${data?.venue}, ${data?.location}`);
      fd.append("format", data?.format);
      fd.append("typePrice", data?.typePrice);
      fd.append("price", String(data?.typePrice === "FREE" ? 0 : data?.price));
      fd.append("quota", String(data?.quota));
      fd.append("startsAt", new Date(data?.startsAt).toISOString());
      fd.append("endsAt", new Date(data?.endsAt).toISOString());
      // nama field harus sama dengan route backend: { name: "coverImage" }
      fd.append("coverImage", data?.coverImage[0]);

      const res = await axiosInstance.post<ApiResponse<EventItem>>(
        "/events",
        fd,
      );
      return res?.data?.data;
    },
    onSuccess(event) {
      toast.success("Event berhasil dibuat!");
      reset();
      // lanjut ke step opsional: bikin voucher untuk event yang baru dibuat
      router.push(`/organizer/events/create/createVoucher?slug=${event?.slug}`);
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message ?? error?.message);
      }
    },
  });

  const parentCategoryId = useWatch({ control, name: "parentCategoryId" });
  const selectedParent = categories.find((c) => c.id === parentCategoryId);
  // parent tanpa subkategori -> parent itu sendiri yang dipakai sebagai categoryId
  const subCategories = selectedParent
    ? selectedParent.children.length > 0
      ? selectedParent.children
      : [selectedParent]
    : [];

  const handleChangeParent = () => {
    setValue("categoryId", "");
  };

  const typePrice = useWatch({ control, name: "typePrice" });
  const isFree = typePrice === "FREE";

  const coverImage = useWatch({ control, name: "coverImage" });
  const coverFile = coverImage?.[0];
  const previewUrl = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile],
  );

  const title = useWatch({ control, name: "title" });
  // waktu selesai tidak boleh sebelum waktu mulai
  const startsAt = useWatch({ control, name: "startsAt" });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* bradcrumbs */}
      <div className="breadcrumbs mb-4 text-xs text-secondary/60">
        <ul>
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>
            <Link href="/organizer/events">Event Saya</Link>
          </li>
          <li className="font-medium text-secondary">
            Buat Event Olahraga Baru
          </li>
        </ul>
      </div>


      <h1 className="text-2xl font-bold sm:text-3xl">
        Buat Event Olahraga Baru
      </h1>
      <p className="mb-6 text-sm text-secondary/60">
        Isi informasi lengkap untuk mempublikasikan kompetisi dan event olahraga
        Anda di SportTicketing.
      </p>

      <form
        onSubmit={handleSubmit(async (data) => {
          // error sudah ditampilkan di onError, catch agar tidak jadi unhandled error
          try {
            await createEventMutation(data);
          } catch {}
        })}
        className="space-y-6"
      >
        {/* SECTION 1. INFORMASI DASAR */}
        <SectionCard
          icon={<FiEdit3 />}
          title="1. Informasi Dasar"
          subtitle="Tentukan nama, kategori, serta deskripsi lengkap acara Anda"
        >
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              className={inputCls}
              placeholder="Contoh: Jakarta Sunset 10K Championship 2025"
              {...register("title")}
            />
            <div className="mt-1 flex justify-between text-xs text-secondary/50">
              <span>
                Gunakan nama yang jelas dan menarik perhatian calon audiens.
              </span>
              <span>{title?.length ?? 0}/200</span>
            </div>
            <p className={errorCls}>{errors.title?.message}</p>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">
              Kategori Utama Olahraga <span className="text-red-500">*</span>
            </p>
            {isCategoryLoading ? (
              <p className="text-sm text-secondary/50">Memuat kategori...</p>
            ) : isCategoryError ? (
              <p className="text-sm text-red-500">
                Gagal memuat kategori. Pastikan backend sudah dijalankan.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((category) => (
                  <label key={category.id}>
                    <input
                      type="radio"
                      value={category.id}
                      className="peer sr-only"
                      {...register("parentCategoryId", {
                        onChange: handleChangeParent,
                      })}
                    />
                    <span className="block cursor-pointer rounded-lg border border-base-300 py-2.5 text-center text-sm transition hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:font-semibold peer-checked:text-primary">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <p className={errorCls}>{errors.parentCategoryId?.message}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="categoryId"
                className="mb-1.5 block text-sm font-medium"
              >
                Subkategori <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                className={inputCls}
                {...register("categoryId")}
              >
                <option value="">
                  {!parentCategoryId
                    ? "Pilih kategori utama dulu"
                    : "Pilih subkategori"}
                </option>
                {subCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className={errorCls}>{errors.categoryId?.message}</p>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium">Tipe Penyelenggaraan</p>
              <div className="flex gap-2 rounded-lg bg-neutral p-1">
                {FORMAT_OPTIONS.map((option) => (
                  <label key={option.value} className="flex-1">
                    <input
                      type="radio"
                      value={option.value}
                      className="peer sr-only"
                      {...register("format")}
                    />
                    <span className="block cursor-pointer rounded-md py-2 text-center text-xs transition peer-checked:bg-primary peer-checked:font-semibold peer-checked:text-white sm:text-sm">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="venue"
                className="mb-1.5 block text-sm font-medium"
              >
                Nama Tempat / Venue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" />
                <input
                  id="venue"
                  className={`${inputCls} pl-9`}
                  placeholder="Contoh: Stadion Madya GBK, Senayan"
                  {...register("venue")}
                />
              </div>
              <p className={errorCls}>{errors.venue?.message}</p>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-sm font-medium"
              >
                Kota <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                className={inputCls}
                {...register("location")}
              >
                <option value="">Pilih kota</option>
                {LOCATION_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <p className={errorCls}>{errors.location?.message}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium"
            >
              Deskripsi Event <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              className={`${inputCls} resize-y`}
              placeholder="Ceritakan detail event, rute, fasilitas peserta, dll."
              {...register("description")}
            />
            <p className={errorCls}>{errors.description?.message}</p>
          </div>
        </SectionCard>

        {/* SECTION 2. MEDIA BANNER */}
        <SectionCard
          icon={<FiImage />}
          title="2. Media Banner Event"
          subtitle="Rekomendasi rasio 16:9 (1920x1080 px), format JPG/PNG/WEBP, maks 5 MB"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label
              htmlFor="coverImage"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-base-300 bg-neutral p-6 text-center transition hover:border-primary"
            >
              <span className="rounded-full bg-white p-3 text-xl text-primary">
                <FiUploadCloud />
              </span>
              <span className="text-sm font-medium">
                Klik untuk memilih gambar
              </span>
              <span className="text-xs text-secondary/50">
                Disarankan rasio lanskap 16:9 agar tidak terpotong
              </span>
              <input
                id="coverImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="sr-only"
                {...register("coverImage")}
              />
            </label>

            <div>
              <p className="mb-1.5 text-sm font-medium">Pratinjau Banner</p>
              {previewUrl ? (
                <>
                  {/* src berupa blob lokal, jadi pakai <img> biasa */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Pratinjau banner"
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <div className="mt-1 flex justify-between text-xs text-secondary/60">
                    <span className="truncate">{coverFile?.name}</span>
                    <span>
                      {((coverFile?.size ?? 0) / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral text-xs text-secondary/40">
                  Belum ada gambar
                </div>
              )}
            </div>
          </div>
          <p className={errorCls}>{errors.coverImage?.message}</p>
        </SectionCard>

        {/* SECTION 3. WAKTU & TANGGAL */}
        <SectionCard
          icon={<FiCalendar />}
          title="3. Waktu & Tanggal"
          subtitle="Tentukan jadwal mulai dan batas akhir pelaksanaan kegiatan"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-base-300 p-4">
              <label
                htmlFor="startsAt"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Waktu Mulai Acara <span className="text-red-500">*</span>
              </label>
              <input
                id="startsAt"
                type="datetime-local"
                className={inputCls}
                // min diisi waktu sekarang saat input dibuka (bukan saat render, biar tidak beda antara server & browser)
                onFocus={(e) => {
                  e.currentTarget.min = toDateTimeLocal(new Date());
                }}
                {...register("startsAt")}
              />
              <p className={errorCls}>{errors.startsAt?.message}</p>
            </div>

            <div className="rounded-xl border border-base-300 p-4">
              <label
                htmlFor="endsAt"
                className="mb-2 block text-sm font-medium"
              >
                Waktu Selesai Acara <span className="text-red-500">*</span>
              </label>
              <input
                id="endsAt"
                type="datetime-local"
                min={startsAt || undefined}
                className={inputCls}
                {...register("endsAt")}
              />
              <p className={errorCls}>{errors.endsAt?.message}</p>
            </div>
          </div>
          <p className="text-xs text-secondary/50">
            Waktu mengikuti zona waktu perangkat Anda (WIB / GMT+7).
          </p>
        </SectionCard>

        {/* SECTION 4. TIKET & KUOTA */}
        <SectionCard
          icon={<FiTag />}
          title="4. Pengaturan Tiket & Kuota"
          subtitle="Konfigurasi jenis akses masuk, nominal harga tiket, dan kapasitas audiens"
        >
          <div>
            <p className="mb-1.5 text-sm font-medium">Tipe Akses Tiket</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {TYPE_PRICE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    typePrice === option.value
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="radio radio-primary radio-sm mt-1"
                    {...register("typePrice", {
                      // set harga 0 agar validasi lolos walau input harga disembunyikan
                      onChange: (e) => {
                        if (e.target.value === "FREE") setValue("price", 0);
                      },
                    })}
                  />
                  <span>
                    <span className="block font-semibold">{option.label}</span>
                    <span className="text-xs text-secondary/60">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {!isFree && (
              <div>
                <label
                  htmlFor="price"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Harga Tiket (IDR) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="rounded-l-lg border border-r-0 border-base-300 bg-neutral px-3 py-2.5 text-sm">
                    Rp
                  </span>
                  <input
                    id="price"
                    type="number"
                    min={0}
                    className={`${inputCls} rounded-l-none`}
                    placeholder="250000"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
                <p className={errorCls}>{errors.price?.message}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="quota"
                className="mb-1.5 block text-sm font-medium"
              >
                Total Kuota Tiket <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  id="quota"
                  type="number"
                  min={1}
                  className={`${inputCls} rounded-r-none`}
                  placeholder="500"
                  {...register("quota", { valueAsNumber: true })}
                />
                <span className="rounded-r-lg border border-l-0 border-base-300 bg-neutral px-3 py-2.5 text-sm">
                  Peserta
                </span>
              </div>
              <p className="mt-1 text-xs text-secondary/50">
                Penjualan akan otomatis ditutup ketika kuota habis.
              </p>
              <p className={errorCls}>{errors.quota?.message}</p>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg bg-neutral p-3 text-xs text-secondary/70">
            <FiInfo className="mt-0.5 shrink-0" />
            <span>
              Setelah event diterbitkan, kamu bisa langsung membuat voucher
              promosi untuk event ini.
            </span>
          </div>
        </SectionCard>

        <div className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-secondary/60">
            <FiShield className="text-tertiary" />
            Sistem kuota & transaksi terenkripsi dengan standar keamanan
            SportTicketing
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary rounded-full"
          >
            <FiFlag />
            {isSubmitting ? "Menyimpan..." : "Publikasikan Event Olahraga"}
          </button>
        </div>
      </form>
    </div>
  );
}
