import { Suspense } from "react";
import Footer from "@/components/layout/auth-footer";
import NavbarSection from "@/components/layout/navbar";
import { GuardedOrganizerEvents } from "@/features/organizer/events/guardedPages";

// Event Saya: daftar event milik EO + voucher, bisa lihat / edit / hapus
export default function OrganizerEventsPage() {
  return (
    <>
      <NavbarSection />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-page" />}>
          <GuardedOrganizerEvents />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
