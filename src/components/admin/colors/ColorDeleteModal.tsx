import React from "react";
import { Color } from "@/types/product.type";
import { useMutation } from "@tanstack/react-query";
import { colorApi } from "@/apis/admin/color.api";
import { notification } from "antd";
import { AxiosError } from "axios";

interface ColorDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorDeleted: () => void;
  color: Color | null;
}

const ColorDeleteModal: React.FC<ColorDeleteModalProps> = ({
  isOpen,
  onClose,
  onColorDeleted,
  color,
}) => {
  const colorMutation = useMutation({
    mutationFn: () => colorApi.deleteColor(color!.color_id),
    onSuccess: () => {
      onColorDeleted();
      notification.success({
        message: "Xóa màu sắc thành công",
      });
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Xóa màu sắc thất bại",
        description: error.response?.data?.message,
      });
      console.error("Failed to delete color:", error);
    },
  });

  if (!isOpen || !color) return null;

  const handleDelete = () => {
    colorMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
        <p className="mb-6 text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa màu sắc "{color.color_name}" không? Hành
          động này không thể hoàn tác.
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
            className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
            disabled={colorMutation.isPending}
          >
            {colorMutation.isPending ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorDeleteModal;
