
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../providers/queryProviders";
import AuthSync from "../providers/authSync";

export const metadata: Metadata = {
  title: "JOVLEN",
  description: "Platform Ticketing Event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <AuthSync />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
