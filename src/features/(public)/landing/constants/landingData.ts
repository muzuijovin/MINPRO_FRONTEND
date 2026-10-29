import { IconType } from "react-icons";
import { FiCreditCard, FiShield } from "react-icons/fi";
import { MdDirectionsRun, MdOutlineQrCode2, MdSportsEsports, MdSportsSoccer } from "react-icons/md";

// ikon & deskripsi kartu kategori, key = slug parent dari GET /categories/tree
export const CATEGORY_INFO: Record<string, { icon: IconType; description: string }> = {
  running: {
    icon: MdDirectionsRun,
    description: "Fun run, 10K, half marathon hingga full marathon di kota-kota besar.",
  },
  football: {
    icon: MdSportsSoccer,
    description: "Turnamen sepak bola, mini soccer dan futsal untuk tim & komunitas.",
  },
  esports: {
    icon: MdSportsEsports,
    description: "Kompetisi Mobile Legends, Valorant, PUBG dan eFootball resmi.",
  },
};

export const FEATURED_LIMIT = 3;
export const UPCOMING_LIMIT = 4;

export const BENEFITS: { icon: IconType; title: string; description: string }[] = [
  {
    icon: MdOutlineQrCode2,
    title: "Check-In BIB & QR 3 Detik",
    description: "E-ticket langsung terbit setelah pembayaran diverifikasi, tinggal tunjukkan di lokasi.",
  },
  {
    icon: FiCreditCard,
    title: "Pembayaran Tim & Individu",
    description: "Beli hingga 5 tiket sekaligus, pakai voucher event dan poin reward untuk potongan harga.",
  },
  {
    icon: FiShield,
    title: "Proteksi & Asuransi Olahraga",
    description: "Kuota, voucher dan poin dikembalikan otomatis bila pesanan batal, ditolak, atau kedaluwarsa.",
  },
];
