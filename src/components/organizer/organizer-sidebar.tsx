"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Ticket,
  ScanLine,
  Wallet,
  LogOut,
} from "lucide-react";
import "./organizer-sidebar.css";

const navigation = [
  {
    label: "Dashboard",
    href: "/organizer",
    icon: LayoutDashboard,
  },
  {
    label: "Event Operations",
    href: "/organizer/events",
    icon: CalendarDays,
  },
  {
    label: "Athlete Rosters",
    href: "/organizer/athletes",
    icon: ClipboardList,
  },
  {
    label: "Tiers & Passes",
    href: "/organizer/tiers",
    icon: Ticket,
  },
  {
    label: "Race Check-In",
    href: "/organizer/check-in",
    icon: ScanLine,
  },
  {
    label: "Settlements",
    href: "/organizer/settlements",
    icon: Wallet,
  },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="organizer-sidebar">
      <div className="organizer-sidebar__main">
        <Link
          href="/organizer"
          className="organizer-sidebar__brand"
        >
          <Image
            src="/images/jovlen-sporty-logo.png"
            alt="Jövlen logo"
            width={32}
            height={32}
            className="organizer-sidebar__logo"
          />

          <div className="organizer-sidebar__brand-text">
            <span className="organizer-sidebar__brand-name">
              Jövlen
            </span>
            <span className="organizer-sidebar__brand-subtitle">
              ORGANIZER HQ
            </span>
          </div>
        </Link>

        <div className="organizer-sidebar__mode">
          <span className="organizer-sidebar__mode-dot" />

          <div className="organizer-sidebar__mode-content">
            <span className="organizer-sidebar__mode-title">
              ORGANIZER MODE
            </span>
            <span className="organizer-sidebar__mode-description">
              Athletics Council EO
            </span>
          </div>
        </div>

        <nav
          className="organizer-sidebar__nav"
          aria-label="Organizer navigation"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/organizer"
                ? pathname === "/organizer"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`organizer-sidebar__link ${
                  isActive
                    ? "organizer-sidebar__link--active"
                    : ""
                }`}
              >
                <span className="organizer-sidebar__icon">
                  <Icon size={16} strokeWidth={1.8} />
                </span>

                <span className="organizer-sidebar__label">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="organizer-sidebar__footer">
        <Link
          href="/events"
          className="organizer-sidebar__runner-link"
        >
          <LogOut size={14} strokeWidth={1.7} />
          <span>Switch to Runner View</span>
        </Link>

        <p className="organizer-sidebar__version">
          v2.4.1 Race-Ready
        </p>
      </div>
    </aside>
  );
}