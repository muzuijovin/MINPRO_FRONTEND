import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5 MB
// harus sama dengan yang diizinkan uploadMiddleware di backend
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];

// nilai enum harus SAMA PERSIS dengan enum di prisma backend
export const EVENT_FORMATS = ["SPECTATOR", "PARTICIPANT"] as const;
export const TYPE_PRICES = ["FREE", "PAID"] as const;

// FileList cuma ada di browser, jadi dicek pakai typeof dulu supaya tidak error saat SSR
// (z.instanceof(FileList) langsung error "FileList is not defined" di server)
export const createEventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Nama event wajib diisi")
      .max(200, "Nama event maksimal 200 karakter"),
    // parentCategoryId cuma dipakai di form untuk memilih kategori utama, tidak dikirim ke backend
    parentCategoryId: z.string().min(1, "Kategori utama wajib dipilih"),
    categoryId: z.string().min(1, "Subkategori wajib dipilih"),
    format: z.enum(EVENT_FORMATS),
    // venue + location nanti DIGABUNG jadi satu string "venue, kota" sebelum dikirim
    // (lihat mutationFn di organizer/events/components/create/createEvent.tsx), karena backend cuma punya kolom location (maks 300 karakter).
    // venue dibatasi 250, sisanya cukup untuk ", " + nama kota (paling panjang 10 karakter)
    venue: z
      .string()
      .trim()
      .min(1, "Nama tempat wajib diisi")
      .max(250, "Nama tempat maksimal 250 karakter"),
    location: z.string().min(1, "Kota wajib dipilih"),
    description: z
      .string()
      .trim()
      .min(1, "Deskripsi event wajib diisi")
      .max(2000, "Deskripsi maksimal 2000 karakter"),
    coverImage: z
      .custom<FileList>(
        (value) => typeof FileList !== "undefined" && value instanceof FileList,
        "At least one image is required",
      )
      .refine((files) => files.length > 0, "At least one image is required")
      .refine((files) => files.length <= 1, "Maximum 1 images are allowed")
      // INPUT schema = FileList, OUTPUT schema = File[] (lihat CreateEventFormInput/Values di bawah)
      .transform((files) => Array.from(files))
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        "Each image must not exceed 10 MB",
      )
      .refine(
        (files) =>
          files.every((file) => {
            const extension = file.name.split(".").pop();
            return extension && ALLOWED_EXTENSIONS.includes(extension);
          }),
        "Only jpg, jpeg, png, webp, and svg files are allowed",
      ),
    // value dari <input type="datetime-local">, contoh: "2026-10-21T15:00"
    startsAt: z.string().min(1, "Waktu mulai wajib diisi"),
    endsAt: z.string().min(1, "Waktu selesai wajib diisi"),
    typePrice: z.enum(TYPE_PRICES),
    // input number yang kosong menghasilkan NaN, jadi diberi pesan error sendiri
    price: z
      .number({ error: "Harga wajib diisi" })
      .min(0, "Harga tidak boleh negatif"),
    quota: z
      .number({ error: "Kuota wajib diisi" })
      .int("Kuota harus bilangan bulat")
      .min(1, "Kuota minimal 1"),
  })
  // aturan bisnis yang sama dengan backend
  .superRefine((data, ctx) => {
    if (data.typePrice === "PAID" && data.price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Event berbayar harus memiliki harga lebih dari 0",
      });
    }

    // event baru tidak boleh dijadwalkan di waktu yang sudah lewat
    if (data.startsAt && new Date(data.startsAt) <= new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["startsAt"],
        message: "Waktu mulai harus setelah waktu sekarang",
      });
    }

    if (
      data.startsAt &&
      data.endsAt &&
      new Date(data.endsAt) <= new Date(data.startsAt)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Waktu selesai harus setelah waktu mulai",
      });
    }
  });

// Karena ada .transform(), tipe SEBELUM dan SESUDAH validasi jadi berbeda:
// - CreateEventFormInput  : nilai mentah di form (coverImage = FileList)
// - CreateEventFormValues : hasil zod yang diterima onSubmit (coverImage = File[])
export type CreateEventFormInput = z.input<typeof createEventFormSchema>;
export type CreateEventFormValues = z.output<typeof createEventFormSchema>;
