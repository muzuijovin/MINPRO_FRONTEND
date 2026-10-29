import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventItem, EventListMeta } from "@/types/event.type";
import { EventFilters } from "./useEventFilters";

type EventListResponse = ApiResponse<EventItem[]> & { meta: EventListMeta };

export const EVENTS_PER_PAGE = 8;

// GET /events dengan filter + pagination
export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: ["events", "list", filters],
    queryFn: async () => {
      const res = await axiosInstance.get<EventListResponse>("/events", {
        params: {
          page: filters.page,
          limit: EVENTS_PER_PAGE,
          time: "upcoming",
          search: filters.search || undefined,
          location: filters.location || undefined,
          category: filters.category || undefined,
          typePrice: filters.typePrice || undefined,
          sortBy: filters.sortBy,
          order: filters.order,
        },
      });
      return { events: res?.data?.data, meta: res?.data?.meta };
    },
    // data page sebelumnya tetap tampil selama page baru loading (grid tidak kedip)
    placeholderData: keepPreviousData,
  });
}

// total semua event yang akan datang (tanpa filter) untuk badge "xxx Event Olahraga Aktif"
export function useActiveEventsCount() {
  return useQuery({
    queryKey: ["events", "active-count"],
    queryFn: async () => {
      const res = await axiosInstance.get<EventListResponse>("/events", {
        params: { page: 1, limit: 1, time: "upcoming" },
      });
      return res?.data?.meta?.totalEvents ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// lokasi event bisa berisi venue + kota ("Stadion X, Surabaya"), kota = bagian setelah koma terakhir
const toCity = (location: string) => location.split(",").pop()?.trim() ?? "";

// list kota unik dari GET /events/locations untuk dropdown kota.
// filter location di backend pakai "contains", jadi kirim nama kota tetap kena semua venue di kota itu
export function useEventLocations() {
  return useQuery({
    queryKey: ["events", "locations"],
    queryFn: async () => {
      const res =
        await axiosInstance.get<ApiResponse<string[]>>("/events/locations");
      const cities = new Map<string, string>();
      for (const location of res?.data?.data ?? []) {
        const city = toCity(location);
        if (city && !cities.has(city.toLowerCase())) cities.set(city.toLowerCase(), city);
      }
      return [...cities.values()].sort((a, b) => a.localeCompare(b, "id"));
    },
    staleTime: 5 * 60 * 1000,
  });
}
