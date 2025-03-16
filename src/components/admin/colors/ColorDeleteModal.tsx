import React, { useState } from "react";
import { deleteColor } from "@/services/admin/color";
import { Color } from "@/types/product";

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
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !color) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteColor(color.color_id);
      onColorDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete color:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa</h3>
        <p className="text-sm text-gray-500 mb-6">
          Bạn có chắc chắn muốn xóa màu sắc "{color.color_name}" không? Hành
          động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorDeleteModal;
