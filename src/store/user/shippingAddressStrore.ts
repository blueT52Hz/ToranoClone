import { create } from "zustand";
import { ShippingAddress } from "@/types/user.type";

interface ShippingAddressState {
  shippingAddress: ShippingAddress[];
  setShippingAddresses: (shippingAddresses: ShippingAddress[]) => void;
}

export const useShippingAddressStore = create<ShippingAddressState>((set) => ({
  shippingAddress: [],
  setShippingAddresses: (shippingAddresses: ShippingAddress[]) =>
    set({ shippingAddress: [...shippingAddresses] }),
}));
