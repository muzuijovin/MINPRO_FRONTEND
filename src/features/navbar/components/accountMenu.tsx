"use client";

import Link from "next/link";
import { useRef } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ACCOUNT_LINKS, ROLE_LABEL, UserRole } from "../constant/navbarData";

type AccountMenuProps = {
  username: string;
  email: string;
  role: UserRole;
};

export function AccountMenu({ username, email, role }: AccountMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  // <details> tidak otomatis menutup waktu pindah halaman (navbar tidak ikut re-mount)
  const closeMenu = () => detailsRef.current?.removeAttribute("open");
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <details ref={detailsRef} className="dropdown dropdown-end">
      <summary
        aria-label="Menu akun"
        className="flex cursor-pointer list-none items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100 [&::-webkit-details-marker]:hidden"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase text-white">
          {username.slice(0, 2)}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium text-secondary md:block">
          {username}
        </span>
        <FiChevronDown size={14} className="hidden text-gray-400 md:block" />
      </summary>

      <ul className="menu dropdown-content z-50 mt-3 w-60 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
        <li className="pointer-events-none px-3 pb-2 pt-1">
          <div className="flex flex-col items-start gap-0 p-0">
            <span className="text-sm font-semibold text-secondary">{username}</span>
            <span className="text-xs text-gray-500">{email}</span>
            <span className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </li>
        <li className="my-1 h-px bg-gray-100" />
        {ACCOUNT_LINKS[role].map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link href={href} onClick={closeMenu} className="text-sm text-secondary hover:bg-slate-200">
              <Icon size={16} />
              {label}
            </Link>
          </li>
        ))}
        <li className="my-1 h-px bg-gray-100" />
        <li>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => logout(undefined, { onSettled: closeMenu })}
            className="text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <FiLogOut size={16} />
            {isLoggingOut ? "Keluar..." : "Keluar"}
          </button>
        </li>
      </ul>
    </details>
  );
}
