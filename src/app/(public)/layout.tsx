import NavbarSection from "@/components/layout/navbar";

export default function UserLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div>
        <NavbarSection />
        <div>{children}</div>
      </div>
    </>
  );
}
