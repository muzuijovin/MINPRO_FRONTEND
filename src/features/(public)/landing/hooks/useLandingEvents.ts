import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem } from "@/types/event.type";

// semua event yang akan datang (urut tanggal) dalam 1 request, dipakai section Event Pilihan & Event Mendatang
// BE belum bisa sortBy quota, jadi pengelompokan per kategori + urut kuota dilakukan di FE
export function useLandingEvents() {
  return useQuery({
    queryKey: ["events", "landing"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<EventItem[]>>("/events", {
        params: { limit: 100, time: "upcoming", sortBy: "startsAt", order: "asc" },
      });
      return res?.data?.data;
    },
    staleTime: 60 * 1000,
  });
}
