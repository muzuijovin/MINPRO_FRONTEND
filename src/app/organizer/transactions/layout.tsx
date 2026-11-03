import NavbarSection from "@/components/layout/navbar";
import Footer from "@/components/layout/auth-footer";

// halaman organizer lain belum punya layout, jadi navbar + footer cukup dipasang di route transaksi
export default function OrganizerTransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarSection />
      <main>{children}</main>
      <Footer />
    </>
  );
}
