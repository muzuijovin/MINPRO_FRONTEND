import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem } from "@/types/event.type";

// event terdekat yang belum mulai, dipakai untuk carousel hero
// param ditulis eksplisit supaya tidak bergantung ke default validator di BE
export function useUpcomingEvents(limit = 3) {
  return useQuery({
    queryKey: ["events", "upcoming", limit],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<EventItem[]>>("/events", {
        params: { limit, time: "upcoming", sortBy: "startsAt", order: "asc" },
      });
      return res?.data?.data;
    },
  });
}
