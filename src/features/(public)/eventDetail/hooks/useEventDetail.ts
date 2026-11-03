import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
    // 404 = slug memang tidak ada, tidak perlu dicoba ulang.
    // error lain (server baru bangun / koneksi putus) dicoba ulang maksimal 2x
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 2,
  });
}

export const isNotFoundError = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 404;
