import { Suspense } from "react";
import { NavbarLanding } from "@/features/navbar/navbarLanding";
import { NavbarUser } from "@/features/navbar/navbarUser";

// usePathname() di dalam navbar butuh Suspense karena cacheComponents aktif
// dan ada route dinamis (mis. /events/[eventId]) yang pathname-nya baru diketahui saat request.
function NavbarFallback() {
  return <header className="sticky top-0 z-50 h-16 border-b border-gray-100 bg-white" />;
}

export default function NavbarSection () {
  return(
    <Suspense fallback={<NavbarFallback />}>
      <NavbarLanding/>
    </Suspense>
  )
}
