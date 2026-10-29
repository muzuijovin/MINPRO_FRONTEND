import { TransactionStatus } from "@/types/transaction.type";

type StatusInfo = { label: string; description: string; badge: string };

// label + warna badge per status, semua kombinasi warna lolos kontras 4.5:1
export const TRANSACTION_STATUS: Record<TransactionStatus, StatusInfo> = {
  WAITING_FOR_PAYMENT: {
    label: "Menunggu Pembayaran",
    description: "Segera transfer dan unggah bukti sebelum batas waktu 10 menit berakhir.",
    badge: "bg-amber-50 text-amber-800",
  },
  WAITING_FOR_CONFIRMATION: {
    label: "Menunggu Konfirmasi",
    description: "Bukti transfer sudah diterima, penyelenggara akan memverifikasi maksimal 3 hari.",
    badge: "bg-info-soft text-blue-900",
  },
  PAID: {
    label: "Lunas",
    description: "Pembayaran terverifikasi dan e-ticket sudah terbit.",
    badge: "bg-success-soft/50 text-success-text",
  },
  REJECTED: {
    label: "Ditolak",
    description: "Bukti transfer ditolak penyelenggara. Kuota, voucher dan poin dikembalikan.",
    badge: "bg-danger-soft text-danger-text",
  },
  EXPIRED: {
    label: "Kedaluwarsa",
    description: "Batas waktu lewat. Kuota, voucher dan poin dikembalikan otomatis.",
    badge: "bg-surface-sunken text-ink-muted",
  },
  CANCELLED: {
    label: "Dibatalkan",
    description: "Transaksi dibatalkan. Kuota, voucher dan poin dikembalikan otomatis.",
    badge: "bg-surface-sunken text-ink-muted",
  },
};

// status yang dianggap "sudah beli", customer tidak bisa checkout event yang sama lagi (dicek juga di BE)
export const ACTIVE_TRANSACTION_STATUSES: TransactionStatus[] = [
  "WAITING_FOR_PAYMENT",
  "WAITING_FOR_CONFIRMATION",
  "PAID",
];

export const STATUS_FILTER_OPTIONS: { value: TransactionStatus | ""; label: string }[] = [
  { value: "", label: "Semua" },
  ...(Object.keys(TRANSACTION_STATUS) as TransactionStatus[]).map((value) => ({
    value,
    label: TRANSACTION_STATUS[value].label,
  })),
];

// file bukti bayar yang diterima BE (uploadMiddleware jpg/jpeg/png/webp, maks 10MB)
// BE cek ekstensi case-sensitive, jadi "foto.JPG" harus ditolak dari FE dulu
export const PROOF_ACCEPT = ".jpg,.jpeg,.png,.webp";
export const PROOF_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const PROOF_MAX_SIZE_MB = 5;
