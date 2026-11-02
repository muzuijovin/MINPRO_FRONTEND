import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventReview, ReviewListMeta } from "@/types/review.type";
import { TransactionListItem } from "@/types/transaction.type";

export const REVIEWS_PER_PAGE = 5;

type ReviewListResponse = ApiResponse<EventReview[]> & { meta: ReviewListMeta };

// GET /reviews?eventId= -> list ulasan event, "Muat lebih banyak" ambil page berikutnya
export function useEventReviews(eventId: string) {
  return useInfiniteQuery({
    queryKey: ["reviews", "event", eventId],
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<ReviewListResponse>("/reviews", {
        params: { eventId, page: pageParam, limit: REVIEWS_PER_PAGE },
      });
      return { reviews: res?.data?.data ?? [], meta: res?.data?.meta };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta && last.meta.page < last.meta.totalPage ? last.meta.page + 1 : undefined,
  });
}

// BE cuma terima review dari customer yang punya transaksi PAID di event ini
export function useHasPaidTransaction(eventId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["transactions", "mine", "event", eventId, "paid"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<TransactionListItem[]>>("/transactions", {
        params: { eventId, status: "PAID", limit: 1 },
      });
      return (res?.data?.data?.length ?? 0) > 0;
    },
    enabled,
  });
}

type CreateReviewBody = { eventId: string; rating: number; comment: string };

// POST /reviews, setelah berhasil list ulasan & ringkasan rating di detail event di-refresh
export function useCreateReview(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateReviewBody) => {
      const res = await axiosInstance.post<ApiResponse<EventReview>>("/reviews", body);
      return res?.data?.data;
    },
    onSuccess: (_, body) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "event", body.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", slug] });
    },
  });
}
