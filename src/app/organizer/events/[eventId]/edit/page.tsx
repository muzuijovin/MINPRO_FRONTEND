import { Suspense } from "react";
import Footer from "@/components/layout/auth-footer";
import NavbarSection from "@/components/layout/navbar";
import { GuardedEditEvent } from "@/features/organizer/events/guardedPages";

export default function EditEventPage() {
  return (
    <>
      <NavbarSection />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-page" />}>
          <GuardedEditEvent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
