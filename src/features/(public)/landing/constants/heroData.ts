import {
  MdDirectionsRun,
  MdEmojiEvents,
  MdOutlineSportsSoccer,
  MdSportsEsports,
  MdSportsSoccer,
} from "react-icons/md";

// ikon SVG (bukan emoji) supaya tampilannya sama di semua OS / browser
export const POPULAR_PILLS = [
  { id: 1, label: "10K Running", icon: MdDirectionsRun },
  { id: 2, label: "Half Marathon", icon: MdEmojiEvents },
  { id: 3, label: "Mini Soccer", icon: MdSportsSoccer },
  { id: 4, label: "Futsal Cup", icon: MdOutlineSportsSoccer },
  { id: 5, label: "Valorant Champions", icon: MdSportsEsports },
];

export const CITY_OPTIONS = [
  { value: "", label: "Semua Kota" },
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "bali", label: "Bali" },
];