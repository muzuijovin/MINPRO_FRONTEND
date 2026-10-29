import { Suspense } from "react";
import { GuardedTransactionPayment } from "@/features/transaction/guardedPages";

// halaman bayar & upload bukti, id dibaca pakai useParams jadi perlu Suspense
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedTransactionPayment />
    </Suspense>
  );
}
