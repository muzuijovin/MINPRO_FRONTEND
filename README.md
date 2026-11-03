# SportTicketing — Frontend

Platform tiket event olahraga (lari, sepak bola, esports). Customer bisa mencari event, membeli tiket, mengunggah bukti transfer, dan memberi ulasan. Event Organizer (EO) bisa membuat event, mengatur voucher, dan memverifikasi pembayaran.

Repo ini berisi frontend (Next.js). Backend ada di repo terpisah: **MINPRO_BACKEND** (Express + Prisma).

## Tech Stack

| Kebutuhan | Library |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 + daisyUI 5 |
| Data fetching | TanStack Query v5 + Axios |
| State global | Zustand (session user) |
| Form & validasi | React Hook Form + Zod |
| Lainnya | date-fns, react-icons, react-toastify, use-debounce |

## Menjalankan Project

**Prasyarat:** Node.js 20+ dan backend MINPRO_BACKEND sudah berjalan (default di port `8000`).

1. Install dependency

   ```bash
   npm install
   ```

2. Buat file `.env` di root project

   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
   ```

3. Jalankan development server

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

### Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Cek ESLint |

## Fitur

### Publik (tanpa login)

- **Landing page**: hero carousel, kategori olahraga, event pilihan (kuota terbanyak per kategori), event mendatang, dan keunggulan platform.
- **Jelajahi event**: pencarian dengan debounce, filter kategori & subkategori, kota, tipe harga, urutan, dan pagination. Semua filter tersimpan di URL sehingga bisa dibagikan.
- **Detail event**: info event, voucher aktif, profil penyelenggara, serta rating & ulasan peserta.

### Customer

- **Checkout**: pilih jumlah tiket, rekening tujuan, voucher event, dan potong harga pakai poin. Satu customer hanya bisa punya satu transaksi aktif per event.
- **Pembayaran**: countdown batas bayar dan upload bukti transfer.
- **Riwayat transaksi** dan **Tiket Saya** (e-ticket dari transaksi yang sudah lunas).
- **Ulasan**: hanya untuk peserta dengan transaksi lunas setelah event selesai.
- **Notifikasi** di navbar (pembayaran diterima, ditolak, kedaluwarsa).

### Event Organizer

- **Event Saya**: daftar event milik EO beserta vouchernya. Bisa lihat, edit (selama event belum selesai), dan hapus.
- **Buat event** dan **buat voucher**.
- **Kelola transaksi**: terima atau tolak bukti transfer customer.
- **Notifikasi** saat ada bukti transfer baru.

## Struktur Folder

```
src/
├── app/                      # Routing (App Router), page.tsx dibuat setipis mungkin
│   ├── (public)/             # /, /events, /events/[slug]
│   ├── (auth)/               # /login, /register, /forgot-password, /reset-password
│   ├── (costumer)/           # /checkout, /transaction, /transaction/[id], /my-ticket, /profile
│   └── organizer/            # /organizer/dashboard, /events, /transactions, /voucher
├── features/                 # Komponen, hooks, dan konstanta per fitur
│   ├── (public)/             # landing, events, eventDetail
│   ├── (auth)/ · auth/       # login, registrasi, session
│   ├── transaction/          # checkout, pembayaran, riwayat, tiket, kelola transaksi EO
│   ├── organizer/            # event saya, buat/edit event, voucher
│   ├── navbar/ · notification/ · categories/
│   └── validation/           # schema Zod untuk form
├── components/layout/        # Navbar & footer
├── hoc/withAuthGuard.tsx     # Proteksi halaman berdasarkan role
├── store/useAuthStore.ts     # Session user (Zustand)
├── providers/                # React Query, sinkronisasi session, toast
├── lib/                      # Axios instance & helper tanggal
└── types/                    # Tipe data response API
```

## Konvensi

- **Halaman yang butuh login** dibungkus `withAuthGuard(Component, ["CUSTOMER"] | ["EO"])` di file `"use client"`, lalu dirender dari `page.tsx` di dalam `<Suspense>`.
- **Warna** memakai token semantik di `globals.css` (`text-ink`, `text-ink-muted`, `bg-page`, `bg-surface-muted`, `text-accent-text`, dst), bukan hex langsung.
- **Aksesibilitas**: elemen interaktif punya focus ring, `aria-label` untuk tombol ikon, dan target sentuh minimal 40–44px.
- **Branch**: `feat/<nama-fitur>` untuk fitur baru, `fix/<nama>` untuk perbaikan, lalu merge ke `main` lewat Pull Request.
- **Commit**: format [Conventional Commits](https://www.conventionalcommits.org/) dalam Bahasa Indonesia, contoh `feat: halaman tiket saya untuk customer`.
