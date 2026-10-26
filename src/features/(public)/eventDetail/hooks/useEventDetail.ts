import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventDetail } from "@/types/event.type";

// GET /events/:slug -> detail event + organizer + voucher aktif + rating
export function useEventDetail(slug: string) {
  return useQuery({
    queryKey: ["events", "detail", slug],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<EventDetail>>(
        `/events/${slug}`,
      );
      return res?.data?.data;
    },
    // slug kosong (belum kebaca dari URL) -> jangan request dulu
    enabled: !!slug,
    retry: false,
  });
}
