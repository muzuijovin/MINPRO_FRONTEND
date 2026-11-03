import { Suspense } from "react";
import { GuardedMyTickets } from "@/features/transaction/guardedPages";

// Tiket Saya: e-ticket dari transaksi customer yang sudah PAID
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedMyTickets />
    </Suspense>
  );
}
