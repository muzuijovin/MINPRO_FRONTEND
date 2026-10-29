import { Suspense } from "react";
import { GuardedCheckout } from "@/features/transaction/guardedPages";

// baca slug, qty & voucherId dari URL (useSearchParams) jadi perlu Suspense
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <GuardedCheckout />
    </Suspense>
  );
}
