import { create } from "zustand";

interface AuthState {
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AuthState>((set) => ({
  adminToken: localStorage.getItem("adminToken") || null,
  setAdminToken: (token) => {
    set({ adminToken: token });
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  },
  logout: () => {
    set({ adminToken: null });
    localStorage.removeItem("adminToken");
  },
}));
