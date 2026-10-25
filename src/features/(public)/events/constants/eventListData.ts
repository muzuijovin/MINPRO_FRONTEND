import { EventSortBy, SortOrder } from "@/types/event.type";

// value = "sortBy:order", dipecah lagi waktu dipilih
export const SORT_OPTIONS: { value: `${EventSortBy}:${SortOrder}`; label: string }[] = [
  { value: "startsAt:asc", label: "Event Terdekat" },
  { value: "createdAt:desc", label: "Baru Ditambahkan" },
  { value: "price:asc", label: "Harga Terendah" },
  { value: "price:desc", label: "Harga Tertinggi" },
];
