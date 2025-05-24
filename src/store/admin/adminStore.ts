import { create } from "zustand";

export interface Admin {
  admin_id: string;
  admin_username: string;
  admin_name: string;
  roles: string[];
}

interface AdminState {
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  logout: () => set({ admin: null }),
}));
