"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthStore } from "@/store/useAuthStore";
import { axiosInstance } from "@/lib/axios-instance.lib";

// dipasang sekali di root layout: hasil GET /auth/me disalin ke useAuthStore
// supaya withAuthGuard (dan komponen lain) cukup baca store
export default function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isSuccess, isError } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (isSuccess && data)
      setAuth({
        // fallback ke bagian depan email selama BE belum kirim username
        username: data.username ?? data.email.split("@")[0],
        email: data.email,
        role: data.role,
      });
    else if (isError && useAuthStore.getState().role) {
      // sebelumnya login, sekarang /auth/me 401 -> token expired, paksa logout
      clearAuth();
      toast.info("Sesi kamu sudah habis, silakan login ulang", {
        toastId: "session-expired",
      });
      router.replace("/login");
    } else if (isSuccess || isError) clearAuth();
  }, [data, isSuccess, isError, setAuth, clearAuth, router]);

  // request lain yang kena 401 -> cek ulang /auth/me, kalau memang expired efek di atas yang logout
  // (tidak langsung logout karena BE juga pakai 401 untuk role yang tidak diizinkan)
  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error?.response?.status === 401 &&
          !error?.config?.url?.startsWith("/auth/me")
        ) {
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        }
        return Promise.reject(error);
      },
    );

    return () => axiosInstance.interceptors.response.eject(interceptorId);
  }, [queryClient]);

  return null;
}
