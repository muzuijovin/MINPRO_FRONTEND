"use client";
import { CreateEventTemplate } from "@/features/organizer/events/components/create/createEvent";
import withAuthGuard from "@/hoc/withAuthGuard";

export function CreateEvent() {
  return (
    <>
      <CreateEventTemplate />
    </>
  );
}

export default withAuthGuard(CreateEvent, ["EO"]);
