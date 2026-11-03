import { RefObject, useEffect } from "react";

// semua dropdown navbar pakai <details>, yang defaultnya buka-tutup sendiri-sendiri.
// hook ini bikin perilakunya seperti dropdown biasa:
// - buka satu dropdown -> dropdown lain otomatis tertutup (tidak numpuk)
// - klik di luar dropdown / tekan Esc / klik link di dalamnya -> dropdown tertutup
export function useNavbarDropdowns(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const openDropdowns = () => [...container.querySelectorAll<HTMLDetailsElement>("details[open]")];

    const closeAll = (except?: HTMLDetailsElement) => {
      openDropdowns().forEach((details) => {
        if (details !== except) details.open = false;
      });
    };

    // event toggle tidak bubble, jadi didengar lewat fase capture di container
    const handleToggle = (e: Event) => {
      const details = e.target as HTMLDetailsElement;
      if (details.open) closeAll(details);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const insideOpenDropdown = openDropdowns().some((details) => details.contains(target));
      if (!insideOpenDropdown) closeAll();
    };

    // link di dropdown bisa ke halaman yang sama (mis. /events?category=), jadi tutup manual saat diklik
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (link?.closest("details[open]")) closeAll();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const [opened] = openDropdowns();
      if (!opened) return;
      closeAll();
      // fokus balik ke tombol dropdown supaya pengguna keyboard tidak kehilangan posisi
      opened.querySelector("summary")?.focus();
    };

    container.addEventListener("toggle", handleToggle, true);
    container.addEventListener("click", handleClick);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("toggle", handleToggle, true);
      container.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef]);
}
