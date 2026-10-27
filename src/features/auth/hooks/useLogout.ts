import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { useAuthStore } from "@/store/useAuthStore";

// POST /auth/logout -> BE hapus cookie token (httpOnly, FE tidak bisa hapus sendiri)
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      // session di cache dijadikan null supaya AuthSync tidak mengisi store lagi dengan data lama
      queryClient.setQueryData(["auth", "me"], null);
      clearAuth();
      router.replace("/");
    },
  });
}
