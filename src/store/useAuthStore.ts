import { create } from "zustand";

interface UseAuthStore {
  username: string,
  role: string,
  useAuth: (name: string, role: string) => void
}

export const useAuthStore = create<UseAuthStore>((set) => ({
  username: '',
  role: '',
  useAuth: (username,role) => set({username,role})
}))