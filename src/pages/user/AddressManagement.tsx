import { useState } from "react";
import { ShippingAddress } from "@/types/user";
import AddressForm from "@/components/user/AddressForm";
import { Navigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";
import { Modal, notification } from "antd";
import { useUserStore } from "@/store/userStore";
import { useShippingAddressStore } from "@/store/shippingAddressStrore";
import { shippingAddressApi } from "@/apis/shippingAddress.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const AddressManagement = () => {
  const { user } = useUserStore();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const { shippingAddress, setShippingAddresses } = useShippingAddressStore();

  // Fetch addresses
  useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await shippingAddressApi.getShippingAddresses();
      setShippingAddresses(response.data.data);
      return response.data.data;
    },
  });

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: (addressId: string) =>
      shippingAddressApi.deleteShippingAddress(addressId),
    onSuccess: async () => {
      notification.success({
        message: "Xóa địa chỉ thành công",
      });
      // Refetch addresses
      const response = await shippingAddressApi.getShippingAddresses();
      setShippingAddresses(response.data.data);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Xóa địa chỉ thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  // Update address mutation
  const updateMutation = useMutation({
    mutationFn: (data: {
      addressId: string;
      body: Omit<
        ShippingAddress,
        "user_id" | "address_id" | "created_at" | "updated_at"
      >;
    }) => shippingAddressApi.updateShippingAddress(data.addressId, data.body),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật địa chỉ thành công",
      });
      // Refetch addresses
      const fetchAddresses = async () => {
        const response = await shippingAddressApi.getShippingAddresses();
        setShippingAddresses(response.data.data);
      };
      fetchAddresses();
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message: string }>;
      notification.error({
        message: "Cập nhật địa chỉ thất bại",
        description: axiosError.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleDelete = () => {
    if (!selectedAddressId) return;
    deleteMutation.mutate(selectedAddressId);
    setIsModalOpen(false);
  };

  const handleSetDefault = async (addressId: string) => {
    updateMutation.mutate({
      addressId,
      body: {
        ...shippingAddress.find((addr) => addr.address_id === addressId)!,
        is_default: true,
      },
    });
  };

  const handleCloseForm = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  return (
    <AccountLayout title="Danh sách địa chỉ">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsAddingAddress(true);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      {isAddingAddress ? (
        <AddressForm
          existingAddress={editingAddress}
          onClose={handleCloseForm}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {!shippingAddress || shippingAddress.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <p className="text-gray-500">
                Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
              </p>
            </div>
          ) : (
            shippingAddress.map((address) => (
              <div
                key={address.address_id}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {address.full_name}
                      </h3>
                      {address.is_default && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500">{address.phone_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAddressId(address.address_id);
                        setIsModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p>{address.address_detail}</p>
                  <p>
                    {address.ward}, {address.district}, {address.city}
                  </p>
                </div>
                {!address.is_default && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleSetDefault(address.address_id)}
                      className="rounded border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50"
                    >
                      Đặt làm mặc định
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        title={<div className="mb-8">Xác nhận xóa địa chỉ?</div>}
        open={isModalOpen}
        onOk={handleDelete}
        centered
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAddressId("");
        }}
        okButtonProps={{ loading: deleteMutation.isPending }}
      />
    </AccountLayout>
  );
};

export default AddressManagement;
