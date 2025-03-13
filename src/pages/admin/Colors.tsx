import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { getAllColors } from "@/services/admin/color";
import ColorAddModal from "@/components/admin/colors/ColorAddModal";
import ColorEditModal from "@/components/admin/colors/ColorEditModal";
import ColorDeleteModal from "@/components/admin/colors/ColorDeleteModal";
import { Color } from "@/types/product";

const ColorsPage: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  // Sorting states
  const [sortField, setSortField] = useState<keyof Color | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch colors
  const fetchColors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllColors();
      setColors(data);
    } catch (err) {
      console.error("Error fetching colors:", err);
      setError("Không thể tải danh sách màu sắc. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Sorting function
  const handleSort = (field: keyof Color) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort colors
  const filteredColors = colors
    .filter(
      (color) =>
        color.color_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.color_code.toLowerCase().includes(searchTerm.toLowerCase())
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
  const openEditModal = (color: Color) => {
    setSelectedColor(color);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteModalOpen(true);
  };

  // Render helper functions
  const renderSortIndicator = (field: keyof Color) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-3 w-3"></ArrowUpDown>;

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Màu sắc</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Màu sắc
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Tìm kiếm màu sắc..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchColors}
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
                    onClick={() => handleSort("color_name")}
                  >
                    <div className="flex items-center">
                      Tên
                      {renderSortIndicator("color_name")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer"
                    onClick={() => handleSort("color_code")}
                  >
                    <div className="flex items-center">
                      Mã màu
                      {renderSortIndicator("color_code")}
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredColors.map((color) => (
                  <tr key={color.color_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">
                      {color.color_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {color.color_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {color.color_code}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(color)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Sửa</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(color)}
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

            {filteredColors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy màu sắc nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ColorAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onColorAdded={fetchColors}
      />

      <ColorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onColorUpdated={fetchColors}
        color={selectedColor}
      />

      <ColorDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onColorDeleted={fetchColors}
        color={selectedColor}
      />
    </div>
  );
};

export default ColorsPage;
