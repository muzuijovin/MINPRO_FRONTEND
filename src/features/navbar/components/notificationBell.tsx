"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FiBell, FiCheckCircle, FiClock, FiUpload, FiXCircle } from "react-icons/fi";
import { IconType } from "react-icons";
import {
  NotificationItem,
  NotificationType,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
  useUnreadCount,
} from "@/features/notification/hooks/useNotifications";
import { UserRole } from "../constant/navbarData";

// ikon + warna per tipe notifikasi
const TYPE_STYLE: Record<NotificationType, { icon: IconType; className: string }> = {
  PAYMENT_PROOF_UPLOADED: { icon: FiUpload, className: "bg-info-soft text-blue-900" },
  PAYMENT_ACCEPTED: { icon: FiCheckCircle, className: "bg-success-soft/50 text-success-text" },
  PAYMENT_REJECTED: { icon: FiXCircle, className: "bg-danger-soft text-danger-text" },
  TRANSACTION_EXPIRED: { icon: FiClock, className: "bg-surface-sunken text-ink-muted" },
  TRANSACTION_CANCELLED: { icon: FiXCircle, className: "bg-surface-sunken text-ink-muted" },
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

// customer -> halaman bayar, EO -> halaman verifikasi bukti transfer
const TRANSACTION_HREF: Record<UserRole, (id: string) => string> = {
  CUSTOMER: (id) => `/transaction/${id}`,
  EO: (id) => `/organizer/transactions/${id}`,
};

// lonceng notifikasi di navbar untuk user yang sudah login (customer & EO)
export function NotificationBell({ role }: { role: UserRole }) {
  const router = useRouter();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadCount(true);
  const { data: notifications = [], isLoading } = useNotificationList(isOpen);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  // <details> tidak otomatis menutup waktu pindah halaman (navbar tidak ikut re-mount)
  const closeMenu = () => detailsRef.current?.removeAttribute("open");

  const openNotification = (notification: NotificationItem) => {
    if (!notification.isRead) markRead(notification.id);
    closeMenu();
    if (notification.transactionId) router.push(TRANSACTION_HREF[role](notification.transactionId));
  };

  return (
    <details
      ref={detailsRef}
      className="dropdown dropdown-end"
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary
        aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"}
        className={`relative flex size-10 cursor-pointer list-none items-center justify-center rounded-full text-secondary hover:bg-gray-100 [&::-webkit-details-marker]:hidden ${focusRing}`}
      >
        <FiBell size={19} aria-hidden />
        {unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute right-1 top-1 flex min-w-4.5 items-center justify-center rounded-full bg-danger-text px-1 text-[10px] font-bold leading-4.5 text-white tabular-nums"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </summary>

      <div className="dropdown-content z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          <p className="text-sm font-bold text-ink">Notifikasi</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={isMarkingAll}
              className={`min-h-8 cursor-pointer rounded px-1 text-xs font-semibold text-accent-text hover:underline disabled:opacity-60 ${focusRing}`}
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-6">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-muted">Belum ada notifikasi.</p>
        ) : (
          <ul className="max-h-96 divide-y divide-line overflow-y-auto">
            {notifications.map((notification) => {
              const { icon: Icon, className } = TYPE_STYLE[notification.type];
              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className={`flex w-full cursor-pointer gap-3 px-4 py-3 text-left hover:bg-surface-muted ${focusRing} ${
                      notification.isRead ? "" : "bg-accent-soft/15"
                    }`}
                  >
                    <span aria-hidden className={`flex size-9 shrink-0 items-center justify-center rounded-full ${className}`}>
                      <Icon size={16} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-start justify-between gap-2">
                        <span className={`text-sm text-ink ${notification.isRead ? "font-medium" : "font-bold"}`}>
                          {notification.title}
                        </span>
                        {!notification.isRead && (
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent-text">
                            <span className="sr-only">Belum dibaca</span>
                          </span>
                        )}
                      </span>
                      <span className="line-clamp-2 text-xs text-ink-muted">{notification.message}</span>
                      <span className="text-xs text-ink-muted">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </details>
  );
}
