import React, { useState, useEffect } from "react";
import { updateColor } from "@/services/admin/color";
import { Color } from "@/types/product";

interface ColorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorUpdated: () => void;
  color: Color | null;
}

const ColorEditModal: React.FC<ColorEditModalProps> = ({
  isOpen,
  onClose,
  onColorUpdated,
  color,
}) => {
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (color) {
      setColorName(color.color_name);
      setColorCode(color.color_code);
    }
  }, [color]);

  if (!isOpen || !color) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!colorName || !colorCode) return;

    try {
      setIsSubmitting(true);
      await updateColor(color.color_id, colorName, colorCode);
      onColorUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update color:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Chỉnh sửa màu sắc
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit_color_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_color_name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit_color_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mã màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_color_code"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting || !colorName || !colorCode}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorEditModal;
