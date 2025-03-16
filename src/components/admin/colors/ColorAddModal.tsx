import React, { useState } from "react";
import { addColor } from "@/services/admin/color";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!colorName || !colorCode) return;

    try {
      setIsSubmitting(true);
      await addColor(colorName, colorCode);
      onColorAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to add color:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setColorName("");
    setColorCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thêm màu sắc mới
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="color_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="color_name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập tên màu sắc"
              required
            />
          </div>

          <div>
            <label
              htmlFor="color_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mã màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="color_code"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mã màu (VD: MR)"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting || !colorName || !colorCode}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorAddModal;
