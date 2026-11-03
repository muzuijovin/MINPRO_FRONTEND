import * as z from "zod";
import { EVENT_FORMATS, TYPE_PRICES } from "./createEventSchema";

// sama seperti form create, bedanya: tanpa cover image (PUT /events/:id belum terima file)
// dan waktu mulai boleh di masa lalu (event yang sudah berjalan tetap bisa diedit, sama seperti BE)
export const editEventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Nama event wajib diisi")
      .max(200, "Nama event maksimal 200 karakter"),
    parentCategoryId: z.string().min(1, "Kategori utama wajib dipilih"),
    categoryId: z.string().min(1, "Subkategori wajib dipilih"),
    format: z.enum(EVENT_FORMATS),
    // venue + kota digabung jadi "venue, kota" sebelum dikirim (lihat editEvent.tsx)
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
    startsAt: z.string().min(1, "Waktu mulai wajib diisi"),
    endsAt: z.string().min(1, "Waktu selesai wajib diisi"),
    typePrice: z.enum(TYPE_PRICES),
    price: z
      .number({ error: "Harga wajib diisi" })
      .min(0, "Harga tidak boleh negatif"),
    quota: z
      .number({ error: "Kuota wajib diisi" })
      .int("Kuota harus bilangan bulat")
      .min(1, "Kuota minimal 1"),
  })
  .superRefine((data, ctx) => {
    if (data.typePrice === "PAID" && data.price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Event berbayar harus memiliki harga lebih dari 0",
      });
    }

    if (data.startsAt && data.endsAt && new Date(data.endsAt) <= new Date(data.startsAt)) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Waktu selesai harus setelah waktu mulai",
      });
    }
  });

export type EditEventFormValues = z.infer<typeof editEventFormSchema>;
