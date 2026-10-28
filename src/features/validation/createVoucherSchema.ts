import * as z from "zod";

// aturan kode harus SAMA dengan voucher.validator.ts di backend
export const VOUCHER_CODE_MIN = 4;
export const VOUCHER_CODE_MAX = 20;

export const createVoucherFormSchema = z
  .object({
    // kode dibuat sendiri oleh EO, otomatis uppercase (lihat onChange di createVoucher.tsx)
    code: z
      .string()
      .trim()
      .min(VOUCHER_CODE_MIN, `Kode voucher minimal ${VOUCHER_CODE_MIN} karakter`)
      .max(VOUCHER_CODE_MAX, `Kode voucher maksimal ${VOUCHER_CODE_MAX} karakter`)
      .regex(
        /^[A-Z0-9]+(-[A-Z0-9]+)*$/,
        "Kode voucher hanya boleh huruf, angka dan tanda - (tidak di awal/akhir)",
      ),
    // input number yang kosong menghasilkan NaN, jadi diberi pesan error sendiri
    discountPercentage: z
      .number({ error: "Diskon wajib diisi" })
      .int("Diskon harus bilangan bulat")
      .min(1, "Diskon minimal 1%")
      .max(100, "Diskon maksimal 100%"),
    quota: z
      .number({ error: "Kuota wajib diisi" })
      .int("Kuota harus bilangan bulat")
      .min(1, "Kuota minimal 1"),
    // value dari <input type="datetime-local">, contoh: "2026-10-21T15:00"
    startAt: z.string().min(1, "Tanggal mulai wajib diisi"),
    endAt: z.string().min(1, "Tanggal berakhir wajib diisi"),
  })
  // aturan bisnis yang sama dengan backend
  // (cek endAt tidak melewati selesainya event dilakukan di komponen karena butuh data event)
  .superRefine((data, ctx) => {
    if (
      data.startAt &&
      data.endAt &&
      new Date(data.endAt) <= new Date(data.startAt)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Tanggal berakhir harus setelah tanggal mulai",
      });
    }
  });

export type CreateVoucherFormValues = z.infer<typeof createVoucherFormSchema>;
