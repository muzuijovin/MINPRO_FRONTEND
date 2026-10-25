export type HeroSlide = {
  id: number;
  badge: string;
  category: string;
  slotLeft: number;
  title: string;
  description: string;
  date: string; // ISO string
  location: string;
  startPrice: number;
  image: string;
  imageAlt: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    badge: "RACE PILIHAN 2025",
    category: "Running (10K)",
    slotLeft: 45,
    title: "Jakarta Night 10K Run 2025",
    description:
      "Rasakan sensasi lari malam spektakuler mengelilingi ikon Gelora Bung Karno dengan iringan musik & fasilitas timing chip resmi.",
    date: "2025-06-28T19:00:00+07:00",
    location: "GBK Senayan, Jakarta",
    startPrice: 250000,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pelari di event lari malam",
  },
  {
    id: 2,
    badge: "TURNAMEN POPULER",
    category: "Mini Soccer",
    slotLeft: 12,
    title: "Liga Mini Soccer Nusantara Cup",
    description:
      "Kumpulkan timmu dan bertanding di liga mini soccer terbesar akhir tahun dengan hadiah jutaan rupiah.",
    date: "2025-07-12T08:00:00+07:00",
    location: "Lapangan Sport Center, Bandung",
    startPrice: 500000,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pertandingan sepak bola",
  },
  {
    id: 3,
    badge: "BARU DIBUKA",
    category: "Esports",
    slotLeft: 30,
    title: "Valorant Champions Series",
    description:
      "Buktikan skill tim kamu di turnamen esports Valorant dengan sistem bracket resmi dan live broadcast.",
    date: "2025-08-02T10:00:00+07:00",
    location: "Hall Esports Arena, Jakarta",
    startPrice: 150000,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Turnamen esports",
  },
];

export const POPULAR_PILLS = [
  { id: 1, label: "10K Running", emoji: "🏃" },
  { id: 2, label: "Half Marathon", emoji: "🏅" },
  { id: 3, label: "Mini Soccer", emoji: "⚽" },
  { id: 4, label: "Futsal Cup", emoji: "🥅" },
  { id: 5, label: "Valorant Champions", emoji: "🎮" },
];

export const CITY_OPTIONS = [
  { value: "", label: "Semua Kota" },
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "bali", label: "Bali" },
];