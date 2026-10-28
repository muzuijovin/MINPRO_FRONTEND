"use client";

import {
  createVoucherFormSchema,
  CreateVoucherFormValues,
  VOUCHER_CODE_MAX,
} from "@/features/validation/createVoucherSchema";
import { useEventDetail } from "@/features/(public)/eventDetail/hooks/useEventDetail";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { toDateTimeLocal } from "@/lib/datetime.lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { FiCalendar, FiCheck, FiInfo, FiPercent, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";

const inputCls =
  "w-full rounded-lg border border-base-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

const errorCls = "mt-1 text-xs text-red-500";

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CreateVoucherSection() {
  // slug dikirim dari halaman create event setelah event berhasil dibuat
  const slug = useSearchParams().get("slug") ?? "";
  const { data: event, isLoading, isError } = useEventDetail(slug);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateVoucherFormValues>({
    resolver: zodResolver(createVoucherFormSchema),
    defaultValues: {
      code: "",
      startAt: "",
      endAt: "",
    },
  });

  // mutateAsync supaya handleSubmit menunggu request -> isSubmitting tetap true
  const { mutateAsync: createVoucherMutation } = useMutation({
    mutationFn: async (data: CreateVoucherFormValues) => {
      await axiosInstance.post("/vouchers", {
        eventId: event?.id,
        code: data?.code,
        discountPercentage: data?.discountPercentage,
        quota: data?.quota,
        startAt: new Date(data?.startAt).toISOString(),
        endAt: new Date(data?.endAt).toISOString(),
      });
    },
    onSuccess(_, data) {
      toast.success(`Voucher ${data?.code} berhasil dibuat!`);
      // tetap di halaman ini, EO bisa langsung bikin voucher lain untuk event yang sama
      reset();
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message ?? error?.message);
      }
    },
  });

  const code = useWatch({ control, name: "code" });

  // register code dibungkus supaya input otomatis uppercase & karakter selain A-Z, 0-9, - dibuang
  const codeField = register("code");

  if (!slug || isError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <p className="text-sm text-secondary/60">
          Event tidak ditemukan. Pilih event dari daftar event kamu.
        </p>
        <Link
          href="/organizer/events"
          className="btn btn-primary mt-4 rounded-full"
        >
          Ke Event Saya
        </Link>
      </div>
    );
  }

  if (isLoading || !event) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  const eventEndsAt = event?.endsAt ? toDateTimeLocal(event.endsAt) : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* breadcrumbs */}
      <div className="breadcrumbs mb-4 text-xs text-secondary/60">
        <ul>
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>
            <Link href="/organizer/events">Event Saya</Link>
          </li>
          <li className="font-medium text-secondary">Buat Voucher</li>
        </ul>
      </div>

      <h1 className="text-2xl font-bold sm:text-3xl">Buat Voucher Promo</h1>
      <p className="mb-6 text-sm text-secondary/60">
        Opsional. Buat kode voucher diskon untuk menarik lebih banyak peserta.
      </p>

      {/* ringkasan event yang dibuatkan voucher */}
      <div className="mb-6 rounded-2xl border border-base-300 bg-white p-5">
        <p className="text-xs text-secondary/60">Event</p>
        <p className="font-semibold">{event?.title}</p>
        <p className="mt-1 text-xs text-secondary/60">
          {formatDateTime(event?.startsAt)} - {formatDateTime(event?.endsAt)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(async (data) => {
          // voucher tidak boleh berlaku setelah event selesai (sama dengan backend)
          if (event?.endsAt && new Date(data.endAt) > new Date(event.endsAt)) {
            setError("endAt", {
              message: "Voucher tidak boleh berakhir setelah event selesai",
            });
            return;
          }

          // error sudah ditampilkan di onError, catch agar tidak jadi unhandled error
          try {
            await createVoucherMutation(data);
          } catch {}
        })}
        className="overflow-hidden rounded-2xl border border-base-300 bg-white"
      >
        <div className="flex items-start gap-3 border-b border-base-300 bg-neutral px-5 py-4">
          <span className="rounded-lg bg-primary/10 p-2 text-primary">
            <FiTag />
          </span>
          <div>
            <h2 className="font-semibold">Detail Voucher</h2>
            <p className="text-xs text-secondary/60">
              Tentukan kode, besar diskon, kuota, dan masa berlaku voucher
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium">
              Kode Voucher <span className="text-red-500">*</span>
            </label>
            <input
              id="code"
              maxLength={VOUCHER_CODE_MAX}
              autoComplete="off"
              className={`${inputCls} font-mono uppercase tracking-wider`}
              placeholder="Contoh: LARI-HEMAT10"
              {...codeField}
              onChange={(e) => {
                e.target.value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9-]/g, "");
                codeField.onChange(e);
              }}
            />
            <div className="mt-1 flex justify-between text-xs text-secondary/50">
              <span>
                4-20 karakter: huruf, angka, dan tanda - (tidak di awal/akhir).
              </span>
              <span>
                {code?.length ?? 0}/{VOUCHER_CODE_MAX}
              </span>
            </div>
            <p className={errorCls}>{errors.code?.message}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="discountPercentage"
                className="mb-1.5 block text-sm font-medium"
              >
                Diskon <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  id="discountPercentage"
                  type="number"
                  min={1}
                  max={100}
                  className={`${inputCls} rounded-r-none`}
                  placeholder="10"
                  {...register("discountPercentage", { valueAsNumber: true })}
                />
                <span className="flex items-center rounded-r-lg border border-l-0 border-base-300 bg-neutral px-3 text-sm">
                  <FiPercent />
                </span>
              </div>
              <p className={errorCls}>{errors.discountPercentage?.message}</p>
            </div>

            <div>
              <label
                htmlFor="quota"
                className="mb-1.5 block text-sm font-medium"
              >
                Kuota Voucher <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  id="quota"
                  type="number"
                  min={1}
                  className={`${inputCls} rounded-r-none`}
                  placeholder="100"
                  {...register("quota", { valueAsNumber: true })}
                />
                <span className="rounded-r-lg border border-l-0 border-base-300 bg-neutral px-3 py-2.5 text-sm">
                  Kali
                </span>
              </div>
              <p className={errorCls}>{errors.quota?.message}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startAt"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"
              >
                <FiCalendar /> Berlaku Mulai{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="startAt"
                type="datetime-local"
                max={eventEndsAt}
                className={inputCls}
                {...register("startAt")}
              />
              <p className={errorCls}>{errors.startAt?.message}</p>
            </div>

            <div>
              <label
                htmlFor="endAt"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"
              >
                <FiCalendar /> Berlaku Sampai{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="endAt"
                type="datetime-local"
                max={eventEndsAt}
                className={inputCls}
                {...register("endAt")}
              />
              <p className={errorCls}>{errors.endAt?.message}</p>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg bg-neutral p-3 text-xs text-secondary/70">
            <FiInfo className="mt-0.5 shrink-0" />
            <span>
              Kode voucher harus unik untuk event ini dan tidak boleh berlaku
              melewati waktu selesai event.
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-base-300 p-4 sm:flex-row sm:justify-end">
          <Link href="/organizer/events" className="btn btn-ghost rounded-full">
            Selesai / Lewati
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary rounded-full"
          >
            <FiCheck />
            {isSubmitting ? "Menyimpan..." : "Simpan Voucher"}
          </button>
        </div>
      </form>
    </div>
  );
}
