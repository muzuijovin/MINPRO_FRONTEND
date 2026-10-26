import FooterPublic from "@/components/layout/footer-public";
import NavbarSection from "@/components/layout/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarSection />
      <div>{children}</div>
      <FooterPublic />
    </>
  );
}