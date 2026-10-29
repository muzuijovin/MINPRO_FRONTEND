import { Suspense } from "react";
import { GuardedOrganizerTransactions } from "@/features/transaction/guardedPages";

// kelola transaksi EO (tanpa sidebar, akses dari dropdown akun navbar)
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedOrganizerTransactions />
    </Suspense>
  );
}
