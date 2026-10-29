import { Suspense } from "react";
import { GuardedOrganizerTransactionDetail } from "@/features/transaction/guardedPages";

// verifikasi bukti transfer EO, id dibaca pakai useParams jadi perlu Suspense
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedOrganizerTransactionDetail />
    </Suspense>
  );
}
