import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { ShippingAddress } from "@/types/user";
import AddressForm from "@/components/user/AddressForm";
import { Navigate } from "react-router-dom";
import AccountLayout from "@/layouts/Home/AccountLayout";
import { Modal } from "antd";

const AddressManagement = () => {
  const { addresses, deleteAddress, setDefaultAddress, user } = useUser();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [addressState, setAddressState] = useState(addresses);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleDelete = () => {
    if (!selectedAddressId) return;
    deleteAddress(selectedAddressId);
    setAddressState((prev) =>
      prev.filter((address) => address.address_id !== selectedAddressId)
    );
    setIsModalOpen(false);
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
    setAddressState((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addressId === addr.address_id,
      }))
    );
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
          setAddressState={setAddressState}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addressState.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">
                Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
              </p>
            </div>
          ) : (
            addressState.map((address) => (
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
                      onClick={() => {
                        setSelectedAddressId(address.address_id);
                        setIsModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                    <Modal
                      title={<div className="mb-8">Xác nhận xóa địa chỉ ?</div>}
                      open={isModalOpen}
                      onOk={handleDelete}
                      centered
                      onCancel={() => {
                        setIsModalOpen(false), setSelectedAddressId("");
                      }}
                    >
                      {/* <div>Xác nhận xóa địa chỉ</div> */}
                    </Modal>
                  </div>
                </div>
                <div className="mt-2">
                  <p>{address.address_detail}</p>
                  <p>
                    {address.ward}, {address.district}, {address.city},{" "}
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
