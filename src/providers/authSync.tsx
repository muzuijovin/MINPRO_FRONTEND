"use client";

import { useEffect } from "react";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAuthStore } from "@/store/useAuthStore";

// dipasang sekali di root layout: hasil GET /auth/me disalin ke useAuthStore
// supaya withAuthGuard (dan komponen lain) cukup baca store
export default function AuthSync() {
  const { data, isSuccess, isError } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (isSuccess && data) setAuth(data.email, data.role);
    else if (isSuccess || isError) clearAuth();
  }, [data, isSuccess, isError, setAuth, clearAuth]);

  return null;
}
