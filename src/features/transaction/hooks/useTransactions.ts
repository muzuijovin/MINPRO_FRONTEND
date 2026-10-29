import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import {
  BankAccount,
  OrganizerTransactionListItem,
  PaymentDecision,
  Transaction,
  TransactionDetail,
  TransactionListItem,
  TransactionListMeta,
  TransactionStatus,
} from "@/types/transaction.type";
import { ACTIVE_TRANSACTION_STATUSES } from "../constants/transactionStatus";

export const TRANSACTIONS_PER_PAGE = 10;

export type TransactionListFilters = {
  page: number;
  search: string;
  status: TransactionStatus | "";
};

type ListResponse<T> = ApiResponse<T[]> & { meta: TransactionListMeta };

const listParams = (filters: TransactionListFilters) => ({
  page: filters.page,
  limit: TRANSACTIONS_PER_PAGE,
  search: filters.search || undefined,
  status: filters.status || undefined,
});

// rekening tujuan transfer milik EO event ini (dipilih customer di checkout)
export function useBankAccountsByEvent(eventId?: string) {
  return useQuery({
    queryKey: ["bank-accounts", "event", eventId],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<BankAccount[]>>(
        `/bank-accounts/events/${eventId}`,
      );
      return res?.data?.data;
    },
    enabled: !!eventId,
  });
}

export type CheckoutPayload = {
  eventId: string;
  bankAccountId: string;
  quantity: number;
  eventVoucherId: string | null;
  pointUsed: number;
};

// POST /transactions -> harga final dihitung ulang di BE
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const res = await axiosInstance.post<ApiResponse<Transaction>>("/transactions", payload);
      return res?.data?.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// transaksi aktif customer di 1 event (GET /transactions?eventId=), null = belum punya transaksi aktif
export function useActiveEventTransaction(eventId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["transactions", "mine", "event", eventId],
    queryFn: async () => {
      const res = await axiosInstance.get<ListResponse<TransactionListItem>>("/transactions", {
        params: { eventId, limit: 20 },
      });
      return (
        res?.data?.data?.find((trx) => ACTIVE_TRANSACTION_STATUSES.includes(trx.status)) ?? null
      );
    },
    enabled: !!eventId && enabled,
  });
}

// GET /transactions -> riwayat transaksi customer
export function useMyTransactions(filters: TransactionListFilters) {
  return useQuery({
    queryKey: ["transactions", "mine", filters],
    queryFn: async () => {
      const res = await axiosInstance.get<ListResponse<TransactionListItem>>("/transactions", {
        params: listParams(filters),
      });
      return { transactions: res?.data?.data, meta: res?.data?.meta };
    },
    placeholderData: keepPreviousData,
  });
}

// GET /transactions/organizer -> transaksi dari semua event milik EO
export function useOrganizerTransactions(filters: TransactionListFilters) {
  return useQuery({
    queryKey: ["transactions", "organizer", filters],
    queryFn: async () => {
      const res = await axiosInstance.get<ListResponse<OrganizerTransactionListItem>>(
        "/transactions/organizer",
        { params: listParams(filters) },
      );
      return { transactions: res?.data?.data, meta: res?.data?.meta };
    },
    placeholderData: keepPreviousData,
  });
}

// GET /transactions/:id -> dipakai customer (halaman bayar) & EO (halaman verifikasi)
export function useTransactionDetail(id: string) {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<TransactionDetail>>(`/transactions/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
    retry: false,
  });
}

// PATCH /transactions/:id/payment-proof (multipart, field "paymentProof")
export function useUploadPaymentProof(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("paymentProof", file);
      await axiosInstance.patch(`/transactions/${id}/payment-proof`, formData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// PATCH /transactions/:id/confirm -> EO terima (PAID) / tolak (REJECTED)
export function useConfirmPayment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decision: PaymentDecision) => {
      await axiosInstance.patch(`/transactions/${id}/confirm`, { decision });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
