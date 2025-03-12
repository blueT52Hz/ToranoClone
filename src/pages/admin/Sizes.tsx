import { useState } from "react";
import { Edit, Plus, Search, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Size = {
  size_id: string;
  size_code: string;
};

export default function Sizes() {
  const [sizes, setSizes] = useState<Size[]>([
    { size_id: "1", size_code: "S" },
    { size_id: "2", size_code: "M" },
    { size_id: "3", size_code: "L" },
    { size_id: "4", size_code: "XL" },
    { size_id: "5", size_code: "2XL" },
    { size_id: "6", size_code: "3XL" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [newSize, setNewSize] = useState({ size_code: "" });

  // Thêm state cho sắp xếp
  const [sortField, setSortField] = useState<keyof Size | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Thêm hàm xử lý sắp xếp
  const handleSort = (field: keyof Size) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Thay đổi filteredSizes để bao gồm sắp xếp
  const filteredSizes = sizes
    .filter((size) =>
      size.size_code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const openEditModal = (size: Size) => {
    setSelectedSize(size);
    setNewSize({ size_code: size.size_code });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (size: Size) => {
    setSelectedSize(size);
    setIsDeleteModalOpen(true);
  };

  const handleAddSize = () => {
    const newSizeId = (sizes.length + 1).toString();
    const newSizeObj = {
      size_id: newSizeId,
      size_code: newSize.size_code,
    };

    setSizes([...sizes, newSizeObj]);
    setNewSize({ size_code: "" });
    setIsAddModalOpen(false);
  };

  const handleEditSize = () => {
    if (selectedSize) {
      setSizes(
        sizes.map((size) =>
          size.size_id === selectedSize.size_id
            ? { ...size, size_code: newSize.size_code }
            : size
        )
      );
      setIsEditModalOpen(false);
      setSelectedSize(null);
    }
  };

  const handleDeleteSize = () => {
    if (selectedSize) {
      setSizes(sizes.filter((size) => size.size_id !== selectedSize.size_id));
      setIsDeleteModalOpen(false);
      setSelectedSize(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Kích cỡ</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Kích cỡ
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Tìm kiếm kích cỡ..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("size_code")}
                >
                  <div className="flex items-center">
                    Mã kích cỡ
                    {sortField === "size_code" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSizes.map((size) => (
                <tr key={size.size_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {size.size_code}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(size)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Sửa</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(size)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSizes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy kích cỡ nào</p>
          </div>
        )}
      </div>

      {/* Add Size Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thêm kích cỡ mới
            </h3>

            <div className="space-y-4">
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
                  name="size_code"
                  value={newSize.size_code}
                  onChange={(e) => setNewSize({ size_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nhập mã kích cỡ"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddSize}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!newSize.size_code}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Size Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chỉnh sửa kích cỡ
            </h3>

            <div className="space-y-4">
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
                  name="size_code"
                  value={newSize.size_code}
                  onChange={(e) => setNewSize({ size_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSize}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!newSize.size_code}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa kích cỡ "{selectedSize?.size_code}"
              không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSize}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
