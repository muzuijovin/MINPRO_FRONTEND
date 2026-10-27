"use client";
import { CreateEventTemplate } from "@/features/organizer/events/components/create/createEvent";
import withAuthGuard from "@/hoc/withAuthGuard";

// page.tsx cuma boleh export default (+ metadata dll), jadi komponen ini tidak di-export
function CreateEvent() {
  return (
    <>
      <CreateEventTemplate />
    </>
  );
}

export default withAuthGuard(CreateEvent, ["EO"]);
