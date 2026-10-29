import { Suspense } from "react";
import { EventDetailSection } from "@/features/(public)/eventDetail/eventDetail";

// EventDetailSection baca slug pakai useParams, dibungkus Suspense seperti halaman list event
export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <EventDetailSection />
    </Suspense>
  );
}
