import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";

export type SessionUser = {
  email: string;
  role: string;
};

// GET /auth/me -> cookie token ikut terkirim otomatis (withCredentials), BE balikin email & role
// 401 = belum login / token expired
export function useSession() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<SessionUser | null>>(
        "/auth/me",
      );
      return res?.data?.data;
    },
    retry: false,
  });
}
