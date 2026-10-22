
import NavbarSection from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CustomerLayout({
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
