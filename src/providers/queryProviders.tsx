"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Pastikan strukturnya persis seperti ini: client={queryClient} baru ditutup dengan >
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
