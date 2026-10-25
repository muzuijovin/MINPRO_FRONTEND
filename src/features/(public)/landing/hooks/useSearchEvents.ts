import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem } from "@/types/event.type";

export const MIN_SEARCH_LENGTH = 2;

// suggestion search bar hero: GET /events?search=&location=
// keyword nya sudah di-debounce dari komponen, jadi request baru jalan setelah user berhenti mengetik
export function useSearchEvents(keyword: string, location: string, limit = 5) {
  const search = keyword.trim();

  return useQuery({
    queryKey: ["events", "search", search, location, limit],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<EventItem[]>>("/events", {
        params: {
          search,
          location: location || undefined,
          limit,
          time: "upcoming",
        },
      });
      return res?.data?.data;
    },
    enabled: search.length >= MIN_SEARCH_LENGTH,
    // hasil keyword sebelumnya tetap tampil selama keyword baru masih loading
    placeholderData: (previous) => previous,
  });
}
