import React, { useState } from "react";
import { addSize } from "@/services/admin/size";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sizeCode) return;

    try {
      setIsSubmitting(true);
      await addSize(sizeCode);
      onSizeAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to add size:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSizeCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thêm kích cỡ mới
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="size_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mã kích cỡ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="size_code"
              value={sizeCode}
              onChange={(e) => setSizeCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mã kích cỡ (VD: XL)"
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
              disabled={isSubmitting || !sizeCode}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeAddModal;
