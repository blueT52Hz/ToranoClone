import React, { useState } from "react";
import AddressForm from "@/components/user/AddressForm";
import { ShippingAddress } from "@/types/user";
import { supabase } from "@/services/supabaseClient";

interface UserAddressTabProps {
  addresses: ShippingAddress[];
  userId: string;
  onAddressesUpdated: (updatedAddresses: ShippingAddress[]) => void;
}

export default function UserAddressTab({
  addresses,
  userId,
  onAddressesUpdated,
}: UserAddressTabProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (addressId: string) => {
    // Gọi API để xóa địa chỉ
    const { error } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("address_id", addressId);

    if (!error) {
      const updatedAddresses = addresses.filter(
        (addr) => addr.address_id !== addressId
      );
      onAddressesUpdated(updatedAddresses);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Địa chỉ</h3>
      <button
        onClick={() => setIsAdding(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
      >
        Thêm địa chỉ
      </button>

      {isAdding && (
        <AddressForm
          userId={userId}
          onClose={() => setIsAdding(false)}
          onAddressAdded={(newAddress) =>
            onAddressesUpdated([...addresses, newAddress])
          }
        />
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.address_id} className="border p-4 rounded-md">
            <p>{address.address_detail}</p>
            <p>
              {address.ward}, {address.district}, {address.city}
            </p>
            {address.is_default && (
              <span className="text-sm text-green-600">Mặc định</span>
            )}
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600">Sửa</button>
              <button
                onClick={() => handleDelete(address.address_id)}
                className="text-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
