import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Edit, Plus, Search, Trash2 } from "lucide-react";
import { getAllSizes } from "@/services/admin/size";
import SizeAddModal from "@/components/admin/sizes/SizeAddModal";
import SizeEditModal from "@/components/admin/sizes/SizeEditModal";
import SizeDeleteModal from "@/components/admin/sizes/SizeDeleteModal";
import { Size } from "@/types/product";
import Loading from "@/components/common/Loading";

const SizesPage: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  // Sorting states
  const [sortField, setSortField] = useState<keyof Size | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch sizes
  const fetchSizes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllSizes();
      setSizes(data);
    } catch (err) {
      console.error("Error fetching sizes:", err);
      setError("Không thể tải danh sách kích cỡ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Sorting function
  const handleSort = (field: keyof Size) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort sizes
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

  // Modal handlers
  const openEditModal = (size: Size) => {
    setSelectedSize(size);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (size: Size) => {
    setSelectedSize(size);
    setIsDeleteModalOpen(true);
  };

  // Render helper functions
  const renderSortIndicator = (field: keyof Size) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
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

        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchSizes}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer"
                    onClick={() => handleSort("size_code")}
                  >
                    <div className="flex items-center">
                      Mã kích cỡ
                      {renderSortIndicator("size_code")}
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSizes.map((size) => (
                  <tr key={size.size_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">
                      {size.size_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {size.size_code}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
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

            {filteredSizes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy kích cỡ nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <SizeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSizeAdded={fetchSizes}
      />

      <SizeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSizeUpdated={fetchSizes}
        size={selectedSize}
      />

      <SizeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSizeDeleted={fetchSizes}
        size={selectedSize}
      />
    </div>
  );
};

export default SizesPage;
