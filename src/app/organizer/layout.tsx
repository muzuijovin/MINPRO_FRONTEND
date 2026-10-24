
import type { ReactNode } from "react";
import OrganizerSidebar from "@/components/organizer/organizer-sidebar";

export default function OrganizerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <OrganizerSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
