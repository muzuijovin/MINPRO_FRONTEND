import { create } from "zustand";

type AuthUser = {
  username: string;
  email: string;
  role: string;
};

interface UseAuthStore extends AuthUser {
  // true kalau pengecekan session ke GET /auth/me sudah selesai (berhasil / gagal)
  isChecked: boolean;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

// diisi oleh AuthSync dari GET /auth/me, karena cookie token httpOnly tidak bisa dibaca FE
export const useAuthStore = create<UseAuthStore>((set) => ({
  username: "",
  email: "",
  role: "",
  isChecked: false,
  setAuth: (user) => set({ ...user, isChecked: true }),
  clearAuth: () => set({ username: "", email: "", role: "", isChecked: true }),
}));
