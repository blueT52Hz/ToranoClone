import React, { useState, useEffect } from "react";
import { updateSize } from "@/services/admin/size";
import { Size } from "@/types/product";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (size) {
      setSizeCode(size.size_code);
    }
  }, [size]);

  if (!isOpen || !size) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sizeCode) return;

    try {
      setIsSubmitting(true);
      await updateSize(size.size_id, sizeCode);
      onSizeUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update size:", error);
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
          Chỉnh sửa kích cỡ
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit_size_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mã kích cỡ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_size_code"
              value={sizeCode}
              onChange={(e) => setSizeCode(e.target.value)}
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
              disabled={isSubmitting || !sizeCode}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeEditModal;
