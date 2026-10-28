"use client";
import { Suspense } from "react";
import { CreateVoucherSection } from "@/features/organizer/voucher/createVoucher/createVoucher";
import withAuthGuard from "@/hoc/withAuthGuard";

// CreateVoucherSection pakai useSearchParams (slug event dari URL), jadi wajib dibungkus Suspense
function CreateVoucher() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CreateVoucherSection />
    </Suspense>
  );
}

export default withAuthGuard(CreateVoucher, ["EO"]);
