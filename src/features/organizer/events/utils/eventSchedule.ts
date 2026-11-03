import { OrganizerEvent } from "@/types/organizerEvent.type";

// event dianggap selesai setelah endsAt (kalau endsAt kosong pakai startsAt), sama dengan aturan BE
export function isEventFinished(event: Pick<OrganizerEvent, "startsAt" | "endsAt">) {
  const finishedAt = event.endsAt ?? event.startsAt;
  return !!finishedAt && new Date(finishedAt) < new Date();
}
