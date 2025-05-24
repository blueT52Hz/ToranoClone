import React from "react";
import { sizeApi } from "@/apis/admin/size.api";
import { Size } from "@/types/product";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notification } from "antd";

interface SizeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeDeleted: () => void;
  size: Size | null;
}

const SizeDeleteModal: React.FC<SizeDeleteModalProps> = ({
  isOpen,
  onClose,
  onSizeDeleted,
  size,
}) => {
  const sizeMutation = useMutation({
    mutationFn: () => sizeApi.deleteSize(size?.size_id || ""),
    onSuccess: () => {
      onSizeDeleted();
      notification.success({
        message: "Xóa kích cỡ thành công",
      });
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Xóa kích cỡ thất bại",
        description: error.response?.data?.message,
      });
      onClose();
    },
  });

  if (!isOpen || !size) return null;

  const handleDelete = async () => {
    sizeMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
        <p className="mb-6 text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa kích cỡ "{size.size_code}" không? Hành động
          này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
            disabled={sizeMutation.isPending}
          >
            {sizeMutation.isPending ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeDeleteModal;
