import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../providers/queryProviders";

export const metadata: Metadata = {
  title: "JOVLEN",
  description: "Platform Ticketing Event",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-theme="sportticketing" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white font-sans text-secondary">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
