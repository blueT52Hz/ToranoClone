import React, { useState } from "react";
import { colorApi } from "@/apis/admin/color.api";
import { notification } from "antd";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

interface ColorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorAdded: () => void;
}

const ColorAddModal: React.FC<ColorAddModalProps> = ({
  isOpen,
  onClose,
  onColorAdded,
}) => {
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("");

  const colorMutation = useMutation({
    mutationFn: () =>
      colorApi.createColor({ color_name: colorName, color_code: colorCode }),
    onSuccess: () => {
      onColorAdded();
      resetForm();
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Thêm màu sắc thất bại",
        description: error.response?.data?.message,
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorName || !colorCode) return;
    colorMutation.mutate();
  };

  const resetForm = () => {
    setColorName("");
    setColorCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Thêm màu sắc mới
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="color_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tên màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="color_name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập tên màu sắc"
              required
            />
          </div>

          <div>
            <label
              htmlFor="color_code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mã màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="color_code"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value.toUpperCase())}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mã màu (VD: MR)"
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
              className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={colorMutation.isPending || !colorName || !colorCode}
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
                  Đang thêm...
                </>
              ) : (
                "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorAddModal;
