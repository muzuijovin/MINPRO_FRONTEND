"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FiCalendar, FiChevronRight, FiEdit3, FiImage, FiMapPin, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCategoryTree } from "@/features/categories/hooks/useCategoryTree";
import { cardCls, focusRing, getErrorMessage } from "@/features/transaction/components/transactionUi";
import { EditEventFormValues, editEventFormSchema } from "@/features/validation/editEventSchema";
import { toDateTimeLocal } from "@/lib/datetime.lib";
import { OrganizerEvent } from "@/types/organizerEvent.type";
import { FORMAT_OPTIONS, LOCATION_OPTIONS, TYPE_PRICE_OPTIONS } from "../../constants/createEventData";
import { useOrganizerEventDetail, useUpdateEvent } from "../../hooks/useOrganizerEvents";
import { isEventFinished } from "../../utils/eventSchedule";

const inputCls =
  "min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

const errorCls = "mt-1 text-xs text-danger-text";

function SectionCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 border-b border-line bg-surface-muted px-5 py-4">
        <span aria-hidden className="rounded-lg bg-accent-soft p-2 text-accent-text">
          {icon}
        </span>
        <h2 className="font-bold text-ink">{title}</h2>
      </div>
      <div className="flex flex-col gap-5 p-5">{children}</div>
    </section>
  );
}

// location di BE disimpan "venue, kota" -> dipisah lagi untuk form (kota = bagian setelah koma terakhir)
function splitLocation(location: string) {
  const index = location.lastIndexOf(",");
  if (index === -1) {
    return LOCATION_OPTIONS.includes(location) ? { venue: "", city: location } : { venue: location, city: "" };
  }
  return { venue: location.slice(0, index).trim(), city: location.slice(index + 1).trim() };
}

function toFormValues(event: OrganizerEvent): EditEventFormValues {
  const { venue, city } = splitLocation(event.location);
  return {
    title: event.title,
    // event bisa tersimpan langsung di kategori utama (parentId null)
    parentCategoryId: event.categories?.parentId ?? event.categoryId,
    categoryId: event.categoryId,
    format: event.format as EditEventFormValues["format"],
    venue,
    location: city,
    description: event.description,
    startsAt: event.startsAt ? toDateTimeLocal(event.startsAt) : "",
    endsAt: event.endsAt ? toDateTimeLocal(event.endsAt) : "",
    typePrice: event.typePrice,
    price: Number(event.price),
    quota: event.quota,
  };
}

function EditEventForm({ event }: { event: OrganizerEvent }) {
  const router = useRouter();
  const { data: categories = [] } = useCategoryTree();
  const { mutateAsync: updateEvent } = useUpdateEvent(event.id);
  const initialCity = splitLocation(event.location).city;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: toFormValues(event),
  });

  const parentCategoryId = useWatch({ control, name: "parentCategoryId" });
  const typePrice = useWatch({ control, name: "typePrice" });
  const startsAt = useWatch({ control, name: "startsAt" });
  const title = useWatch({ control, name: "title" });

  const selectedParent = categories.find((c) => c.id === parentCategoryId);
  // parent tanpa subkategori -> parent itu sendiri jadi pilihan (sama seperti form create)
  const subCategories = selectedParent
    ? selectedParent.children.length > 0
      ? selectedParent.children
      : [selectedParent]
    : [];
  // kota lama yang tidak ada di daftar tetap ditampilkan supaya tidak hilang saat edit
  const cityOptions =
    initialCity && !LOCATION_OPTIONS.includes(initialCity) ? [...LOCATION_OPTIONS, initialCity] : LOCATION_OPTIONS;
  const isFree = typePrice === "FREE";

  const onSubmit = async (data: EditEventFormValues) => {
    try {
      await updateEvent({
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        location: data.venue ? `${data.venue}, ${data.location}` : data.location,
        format: data.format,
        typePrice: data.typePrice,
        price: data.typePrice === "FREE" ? 0 : data.price,
        quota: data.quota,
        startsAt: new Date(data.startsAt).toISOString(),
        endsAt: new Date(data.endsAt).toISOString(),
      });
      toast.success("Perubahan event berhasil disimpan");
      router.push("/organizer/events");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <SectionCard icon={<FiEdit3 />} title="Informasi Dasar">
        <div>
          <label htmlFor="title" className={labelCls}>
            Nama Event <span className="text-danger-text">*</span>
          </label>
          <input id="title" className={inputCls} {...register("title")} />
          <p className="mt-1 text-right text-xs tabular-nums text-ink-muted">{title?.length ?? 0}/200</p>
          <p className={errorCls}>{errors.title?.message}</p>
        </div>

        <fieldset>
          <legend className={labelCls}>
            Kategori Utama Olahraga <span className="text-danger-text">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <label key={category.id}>
                <input
                  type="radio"
                  value={category.id}
                  className="peer sr-only"
                  {...register("parentCategoryId", { onChange: () => setValue("categoryId", "") })}
                />
                <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-line text-sm text-ink transition hover:border-primary peer-checked:border-primary peer-checked:bg-accent-soft peer-checked:font-semibold peer-checked:text-accent-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
          <p className={errorCls}>{errors.parentCategoryId?.message}</p>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className={labelCls}>
              Subkategori <span className="text-danger-text">*</span>
            </label>
            <select id="categoryId" className={inputCls} {...register("categoryId")}>
              <option value="">Pilih subkategori</option>
              {subCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className={errorCls}>{errors.categoryId?.message}</p>
          </div>

          <fieldset>
            <legend className={labelCls}>Tipe Penyelenggaraan</legend>
            <div className="flex gap-2 rounded-lg bg-surface-muted p-1">
              {FORMAT_OPTIONS.map((option) => (
                <label key={option.value} className="flex-1">
                  <input type="radio" value={option.value} className="peer sr-only" {...register("format")} />
                  <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-md text-center text-xs text-ink transition peer-checked:bg-primary peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent-text sm:text-sm">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="venue" className={labelCls}>
              Nama Tempat / Venue <span className="text-danger-text">*</span>
            </label>
            <div className="relative">
              <FiMapPin aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input id="venue" className={`${inputCls} pl-9`} {...register("venue")} />
            </div>
            <p className={errorCls}>{errors.venue?.message}</p>
          </div>
          <div>
            <label htmlFor="location" className={labelCls}>
              Kota <span className="text-danger-text">*</span>
            </label>
            <select id="location" className={inputCls} {...register("location")}>
              <option value="">Pilih kota</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className={errorCls}>{errors.location?.message}</p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>
            Deskripsi Event <span className="text-danger-text">*</span>
          </label>
          <textarea id="description" rows={5} className={`${inputCls} resize-y`} {...register("description")} />
          <p className={errorCls}>{errors.description?.message}</p>
        </div>
      </SectionCard>

      <SectionCard icon={<FiImage />} title="Banner Event">
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-surface-sunken">
          {event.coverImageUrl && (
            <Image src={event.coverImageUrl} alt={`Banner ${event.title}`} fill sizes="448px" className="object-cover" />
          )}
        </div>
        <p className="text-xs text-ink-muted">Banner belum bisa diganti dari halaman edit.</p>
      </SectionCard>

      <SectionCard icon={<FiCalendar />} title="Waktu & Tanggal">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={labelCls}>
              Waktu Mulai <span className="text-danger-text">*</span>
            </label>
            <input id="startsAt" type="datetime-local" className={inputCls} {...register("startsAt")} />
            <p className={errorCls}>{errors.startsAt?.message}</p>
          </div>
          <div>
            <label htmlFor="endsAt" className={labelCls}>
              Waktu Selesai <span className="text-danger-text">*</span>
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
        <p className="text-xs text-ink-muted">Waktu mengikuti zona waktu perangkat kamu (WIB / GMT+7).</p>
      </SectionCard>

      <SectionCard icon={<FiTag />} title="Tiket & Kuota">
        <fieldset>
          <legend className={labelCls}>Tipe Akses Tiket</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {TYPE_PRICE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  typePrice === option.value ? "border-primary bg-accent-soft/40" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="radio radio-primary radio-sm mt-1"
                  {...register("typePrice", {
                    onChange: (e) => {
                      if (e.target.value === "FREE") setValue("price", 0);
                    },
                  })}
                />
                <span>
                  <span className="block font-semibold text-ink">{option.label}</span>
                  <span className="text-xs text-ink-muted">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          {!isFree && (
            <div>
              <label htmlFor="price" className={labelCls}>
                Harga Tiket (IDR) <span className="text-danger-text">*</span>
              </label>
              <input
                id="price"
                type="number"
                min={0}
                className={`${inputCls} tabular-nums`}
                {...register("price", { valueAsNumber: true })}
              />
              <p className={errorCls}>{errors.price?.message}</p>
            </div>
          )}
          <div>
            <label htmlFor="quota" className={labelCls}>
              Sisa Kuota Tiket <span className="text-danger-text">*</span>
            </label>
            <input
              id="quota"
              type="number"
              min={1}
              className={`${inputCls} tabular-nums`}
              {...register("quota", { valueAsNumber: true })}
            />
            <p className={errorCls}>{errors.quota?.message}</p>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-col-reverse gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:justify-end">
        <Link
          href="/organizer/events"
          className={`flex min-h-11 items-center justify-center rounded-full bg-surface-sunken px-6 text-sm font-semibold text-ink hover:bg-gray-200 ${focusRing}`}
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className={`min-h-11 cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}

export function EditEventSection() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading, isError } = useOrganizerEventDetail(eventId);
  // form baru dirender setelah kategori siap, supaya pilihan subkategori lama langsung terpilih
  const { isLoading: isCategoryLoading } = useCategoryTree();

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-muted">
          <Link href="/organizer/events" className={`rounded hover:text-accent-text ${focusRing}`}>
            Event Saya
          </Link>
          <FiChevronRight aria-hidden size={12} />
          <span aria-current="page" className="font-semibold text-ink">
            Edit Event
          </span>
        </nav>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Edit Event</h1>
          <p className="text-sm text-ink-muted">Perubahan langsung tampil di halaman event setelah disimpan.</p>
        </div>

        {isLoading || isCategoryLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-56 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError || !event ? (
          // 404 juga kalau event milik EO lain
          <div className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <p className="text-base font-semibold text-ink">Event tidak ditemukan</p>
            <Link
              href="/organizer/events"
              className={`flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white ${focusRing}`}
            >
              Kembali ke Event Saya
            </Link>
          </div>
        ) : isEventFinished(event) ? (
          // buka link edit langsung pun tetap ditolak kalau event sudah selesai
          <div role="status" className={`${cardCls} flex flex-col items-center gap-3 text-center`}>
            <p className="text-base font-semibold text-ink">Event sudah selesai</p>
            <p className="text-sm text-ink-muted">
              <strong className="font-semibold text-ink">{event.title}</strong> sudah berakhir, jadi datanya tidak bisa
              diubah lagi.
            </p>
            <Link
              href="/organizer/events"
              className={`flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white ${focusRing}`}
            >
              Kembali ke Event Saya
            </Link>
          </div>
        ) : (
          <EditEventForm key={event.id} event={event} />
        )}
      </div>
    </div>
  );
}
