import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { TransactionStatus } from "@/types/transaction.type";

export type NotificationType =
  | "PAYMENT_PROOF_UPLOADED"
  | "PAYMENT_ACCEPTED"
  | "PAYMENT_REJECTED"
  | "TRANSACTION_EXPIRED"
  | "TRANSACTION_CANCELLED";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  transactionId: string | null;
  transactions: {
    id: string;
    transactionCode: string;
    status: TransactionStatus;
    events: { title: string; slug: string };
  } | null;
};

export const NOTIFICATION_LIMIT = 8;

// angka di lonceng dicek ulang berkala supaya notifikasi baru (mis. pembayaran diterima) cepat muncul
const POLL_INTERVAL = 30 * 1000;

export function useUnreadCount(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<{ unreadCount: number }>>(
        "/notifications/unread-count",
      );
      return res?.data?.data?.unreadCount ?? 0;
    },
    enabled,
    refetchInterval: POLL_INTERVAL,
  });
}

// list notifikasi terbaru, baru diambil waktu dropdown lonceng dibuka
export function useNotificationList(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<NotificationItem[]>>("/notifications", {
        params: { limit: NOTIFICATION_LIMIT },
      });
      return res?.data?.data;
    },
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.patch("/notifications/read-all");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
