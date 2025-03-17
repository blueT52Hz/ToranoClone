import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { ShippingAddress } from "@/types/user";
import AddressForm from "@/components/user/AddressForm";
import { Navigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";

const AddressManagement = () => {
  const { addresses, deleteAddress, setDefaultAddress, user } = useUser();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleDelete = (addressId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteAddress(addressId);
    }
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
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
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
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
          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">
                Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
              </p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.address_id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {address.full_name}
                      </h3>
                      {address.is_default && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
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
                      onClick={() => handleDelete(address.address_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p>{address.address_detail}</p>
                  <p>
                    {address.ward}, {address.district}, {address.city},{" "}
                    {address.country}
                  </p>
                </div>
                {!address.is_default && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleSetDefault(address.address_id)}
                      className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
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
    </AccountLayout>
  );
};

export default AddressManagement;
