import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { EventListMeta } from "@/types/event.type";
import { OrganizerEvent, OrganizerEventTime, UpdateEventBody } from "@/types/organizerEvent.type";

export const ORGANIZER_EVENTS_PER_PAGE = 6;

export type OrganizerEventFilters = {
  page: number;
  search: string;
  time: OrganizerEventTime;
};

type OrganizerEventListResponse = ApiResponse<OrganizerEvent[]> & { meta: EventListMeta };

// GET /events/organizer/me -> event milik EO yang login + voucher nya
export function useOrganizerEvents(filters: OrganizerEventFilters) {
  return useQuery({
    queryKey: ["events", "organizer", "list", filters],
    queryFn: async () => {
      const res = await axiosInstance.get<OrganizerEventListResponse>("/events/organizer/me", {
        params: {
          page: filters.page,
          limit: ORGANIZER_EVENTS_PER_PAGE,
          search: filters.search || undefined,
          time: filters.time,
        },
      });
      return { events: res?.data?.data ?? [], meta: res?.data?.meta };
    },
    placeholderData: keepPreviousData,
  });
}

// GET /events/organizer/me/:id -> data awal form edit
export function useOrganizerEventDetail(id: string) {
  return useQuery({
    queryKey: ["events", "organizer", "detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<OrganizerEvent>>(`/events/organizer/me/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
    retry: false,
  });
}

// semua query event (publik & organizer) di-refresh supaya list, landing & detail ikut berubah
export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateEventBody) => {
      const res = await axiosInstance.put<ApiResponse<OrganizerEvent>>(`/events/${id}`, body);
      return res?.data?.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

// DELETE /events/:id (soft delete di BE)
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/events/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}
