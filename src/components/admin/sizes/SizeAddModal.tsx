import React, { useState } from "react";
import { sizeApi } from "@/apis/admin/size.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notification } from "antd";

interface SizeAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeAdded: () => void;
}

const SizeAddModal: React.FC<SizeAddModalProps> = ({
  isOpen,
  onClose,
  onSizeAdded,
}) => {
  const [sizeCode, setSizeCode] = useState("");

  const sizeMutation = useMutation({
    mutationFn: () => sizeApi.createSize({ size_code: sizeCode }),
    onSuccess: () => {
      onSizeAdded();
      notification.success({
        message: "Thêm kích cỡ thành công",
      });
      resetForm();
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Thêm kích cỡ thất bại",
        description: error.response?.data?.message,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sizeCode) return;

    sizeMutation.mutate();
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setSizeCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Thêm kích cỡ mới
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="size_code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mã kích cỡ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="size_code"
              value={sizeCode}
              onChange={(e) => setSizeCode(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mã kích cỡ (VD: XL)"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={sizeMutation.isPending || !sizeCode}
            >
              {sizeMutation.isPending ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeAddModal;
