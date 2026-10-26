import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string, pattern: string) =>
  format(new Date(value), pattern, { locale: idLocale });

// enum EventFormat dari BE -> label yang tampil ke user
export const EVENT_FORMAT_LABEL: Record<string, string> = {
  PARTICIPANT: "Untuk Peserta",
  SPECTATOR: "Untuk Penonton",
};

// "IndoRunners Athletic" -> "IA", dipakai untuk avatar EO & reviewer
export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
