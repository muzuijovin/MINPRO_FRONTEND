export const LOCATION_OPTIONS = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
];

export const FORMAT_OPTIONS = [
  { value: "SPECTATOR", label: "Penonton (Spectator)" },
  { value: "PARTICIPANT", label: "Peserta (Participant)" },
] as const;

export const TYPE_PRICE_OPTIONS = [
  {
    value: "PAID",
    label: "Event Berbayar",
    description: "Penonton dikenakan biaya tiket masuk",
  },
  {
    value: "FREE",
    label: "Event Gratis",
    description: "Registrasi publik tanpa pungutan biaya",
  },
] as const;
