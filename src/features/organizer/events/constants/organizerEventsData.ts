import { FiCalendar, FiEdit3, FiFlag, FiImage } from "react-icons/fi";

// langkah membuat event, ditampilkan sebagai kartu bernomor
export const CREATE_EVENT_STEPS = [
  {
    icon: FiEdit3,
    title: "Isi Informasi Dasar",
    description: "Nama event, kategori olahraga, lokasi, dan deskripsi acara.",
  },
  {
    icon: FiImage,
    title: "Unggah Banner",
    description: "Gambar lanskap 16:9 agar event terlihat menarik di halaman depan.",
  },
  {
    icon: FiCalendar,
    title: "Atur Jadwal & Tiket",
    description: "Tentukan waktu acara, gratis atau berbayar, serta kuota peserta.",
  },
  {
    icon: FiFlag,
    title: "Publikasikan",
    description: "Event langsung tampil dan bisa dibeli oleh customer.",
  },
];

// keuntungan menjadi penyelenggara, ditampilkan sebagai daftar centang
export const ORGANIZER_BENEFITS = [
  "Event gratis maupun berbayar dalam Rupiah (IDR)",
  "Kuota tiket otomatis ditutup saat penuh",
  "Buat voucher promo khusus untuk event Anda",
  "Kelola transaksi dan peserta dari dashboard",
];
