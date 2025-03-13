import React, { useState } from "react";
import { deleteSize } from "@/services/admin/size";
import { Size } from "@/types/product";

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
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !size) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSize(size.size_id);
      onSizeDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete size:", error);
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
          Bạn có chắc chắn muốn xóa kích cỡ "{size.size_code}" không? Hành động
          này không thể hoàn tác.
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

export default SizeDeleteModal;
