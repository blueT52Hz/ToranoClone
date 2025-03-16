import React, { useState } from "react";
import { ShippingAddress } from "@/types/user";
import { supabase } from "@/services/supabaseClient";

interface AddressFormProps {
  userId: string;
  onClose: () => void;
  onAddressAdded: (newAddress: ShippingAddress) => void;
}

export default function AddressForm({
  userId,
  onClose,
  onAddressAdded,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address_detail: "",
    ward: "",
    district: "",
    city: "",
    is_default: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi API để thêm địa chỉ
    const newAddress = { ...formData, user_id: userId };
    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert([newAddress])
      .select()
      .single();

    if (!error) {
      onAddressAdded(data);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên người nhận</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <input
          type="text"
          name="address_detail"
          value={formData.address_detail}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phường/Xã</label>
        <input
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">Đặt làm mặc định</label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
