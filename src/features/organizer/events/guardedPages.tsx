"use client";

import withAuthGuard from "@/hoc/withAuthGuard";
import { EditEventSection } from "./components/edit/editEvent";
import { OrganizerEventListSection } from "./components/list/organizerEventList";

// withAuthGuard tidak bisa dipanggil dari server component (page.tsx), jadi dibungkus di file client ini
export const GuardedOrganizerEvents = withAuthGuard(OrganizerEventListSection, ["EO"]);
export const GuardedEditEvent = withAuthGuard(EditEventSection, ["EO"]);
