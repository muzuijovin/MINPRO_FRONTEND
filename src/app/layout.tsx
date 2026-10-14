import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../providers/queryProviders";

export const metadata: Metadata = {
  title: "JOVLEN",
  description: "Platform Ticketing Event",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <QueryProvider>{children}</QueryProvider>
    </html>
  );
}
