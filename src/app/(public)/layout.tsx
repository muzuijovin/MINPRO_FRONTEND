import { AnnouncementBar } from "@/components/layout/announcementBar";
import FooterPublic from "@/components/layout/footer-public";
import NavbarSection from "@/components/layout/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* bar pengumuman cuma di halaman publik (landing & event), ikut ter-scroll sementara navbar tetap sticky */}
      <AnnouncementBar />
      <NavbarSection />
      <div>{children}</div>
      <FooterPublic />
    </>
  );
}