import AuthNavbar from "../../components/layout/auth-navbar";
import Footer from "../../components/layout/auth-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
