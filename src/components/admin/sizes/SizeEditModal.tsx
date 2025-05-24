import React, { useState, useEffect } from "react";
import { sizeApi } from "@/apis/admin/size.api";
import { Size } from "@/types/product.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notification } from "antd";

interface SizeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeUpdated: () => void;
  size: Size | null;
}

const SizeEditModal: React.FC<SizeEditModalProps> = ({
  isOpen,
  onClose,
  onSizeUpdated,
  size,
}) => {
  const [sizeCode, setSizeCode] = useState("");

  useEffect(() => {
    if (size) {
      setSizeCode(size.size_code);
    }
  }, [size]);

  const sizeMutation = useMutation({
    mutationFn: () =>
      sizeApi.updateSize(size?.size_id || "", { size_code: sizeCode }),
    onSuccess: () => {
      onSizeUpdated();
      notification.success({
        message: "Cập nhật kích cỡ thành công",
      });
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Cập nhật kích cỡ thất bại",
        description: error.response?.data?.message,
      });
    },
  });

  if (!isOpen || !size) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sizeCode) return;

    sizeMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Chỉnh sửa kích cỡ
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit_size_code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mã kích cỡ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_size_code"
              value={sizeCode}
              onChange={(e) => setSizeCode(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={sizeMutation.isPending || !sizeCode}
            >
              {sizeMutation.isPending ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeEditModal;
