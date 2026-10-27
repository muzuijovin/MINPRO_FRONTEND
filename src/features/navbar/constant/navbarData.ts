import { IconType } from "react-icons";
import { FiCalendar, FiGrid, FiShoppingBag, FiTag, FiUser } from "react-icons/fi";
import { MdOutlineConfirmationNumber } from "react-icons/md";

export type UserRole = "CUSTOMER" | "EO";

export type AccountLink = { label: string; href: string; icon: IconType };

export const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  EO: "Event Organizer",
};

// menu di dropdown akun, beda per role (CUSTOMER tidak punya menu kelola event)
export const ACCOUNT_LINKS: Record<UserRole, AccountLink[]> = {
  CUSTOMER: [
    { label: "Profil Saya", href: "/profile", icon: FiUser },
    { label: "Tiket Saya", href: "/my-ticket", icon: MdOutlineConfirmationNumber },
    { label: "Riwayat Transaksi", href: "/transaction", icon: FiShoppingBag },
  ],
  EO: [
    { label: "Dashboard", href: "/organizer/dashboard", icon: FiGrid },
    { label: "Event Saya", href: "/organizer/events", icon: FiCalendar },
    { label: "Voucher", href: "/organizer/voucher", icon: FiTag },
  ],
};

// tombol "Buat Event" di navbar -> halaman sambutan EO (bebas diakses),
// withAuthGuard(["EO"]) baru jalan di halaman berikutnya: /organizer/events/create
export const CREATE_EVENT_HREF = "/organizer/events";

export const isUserRole = (role: string): role is UserRole =>
  role === "CUSTOMER" || role === "EO";
