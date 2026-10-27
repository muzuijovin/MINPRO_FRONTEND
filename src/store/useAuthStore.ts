import { create } from "zustand";

interface UseAuthStore {
  email: string;
  role: string;
  // true kalau pengecekan session ke GET /auth/me sudah selesai (berhasil / gagal)
  isChecked: boolean;
  setAuth: (email: string, role: string) => void;
  clearAuth: () => void;
}

// diisi oleh AuthSync dari GET /auth/me, karena cookie token httpOnly tidak bisa dibaca FE
export const useAuthStore = create<UseAuthStore>((set) => ({
  email: "",
  role: "",
  isChecked: false,
  setAuth: (email, role) => set({ email, role, isChecked: true }),
  clearAuth: () => set({ email: "", role: "", isChecked: true }),
}));
