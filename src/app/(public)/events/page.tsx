import { Suspense } from "react";
import { EvenListSection } from "@/features/(public)/events/eventList";

// EvenListSection pakai useSearchParams (filter di URL), jadi wajib dibungkus Suspense
export default function EventListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <EvenListSection />
    </Suspense>
  );
}
