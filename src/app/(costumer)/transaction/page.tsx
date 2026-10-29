import { Suspense } from "react";
import { GuardedTransactionHistory } from "@/features/transaction/guardedPages";

// riwayat transaksi customer
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedTransactionHistory />
    </Suspense>
  );
}
