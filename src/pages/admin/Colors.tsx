import { useState } from "react";
import { Edit, Plus, Search, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Color = {
  color_id: string;
  color_name: string;
  color_code: string;
};

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([
    { color_id: "1", color_name: "Đen", color_code: "BL" },
    { color_id: "2", color_name: "Trắng", color_code: "WH" },
    { color_id: "3", color_name: "Đỏ", color_code: "RD" },
    { color_id: "4", color_name: "Xanh dương", color_code: "BL" },
    { color_id: "5", color_name: "Xanh lá", color_code: "GR" },
    { color_id: "6", color_name: "Vàng", color_code: "YL" },
    { color_id: "7", color_name: "Cam", color_code: "OR" },
    { color_id: "8", color_name: "Hồng", color_code: "PK" },
    { color_id: "9", color_name: "Tím", color_code: "PU" },
    { color_id: "10", color_name: "Xám", color_code: "GY" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [newColor, setNewColor] = useState({
    color_name: "",
    color_code: "#000000",
  });

  // Thêm state cho sắp xếp
  const [sortField, setSortField] = useState<keyof Color | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Thêm hàm xử lý sắp xếp
  const handleSort = (field: keyof Color) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Thay đổi filteredColors để bao gồm sắp xếp
  const filteredColors = colors
    .filter((color) =>
      color.color_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openEditModal = (color: Color) => {
    setSelectedColor(color);
    setNewColor({ color_name: color.color_name, color_code: color.color_code });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteModalOpen(true);
  };

  const handleAddColor = () => {
    const newColorId = (colors.length + 1).toString();
    const newColorObj = {
      color_id: newColorId,
      color_name: newColor.color_name,
      color_code: newColor.color_code,
    };

    setColors([...colors, newColorObj]);
    setNewColor({ color_name: "", color_code: "#000000" });
    setIsAddModalOpen(false);
  };

  const handleEditColor = () => {
    if (selectedColor) {
      setColors(
        colors.map((color) =>
          color.color_id === selectedColor.color_id
            ? {
                ...color,
                color_name: newColor.color_name,
                color_code: newColor.color_code,
              }
            : color
        )
      );
      setIsEditModalOpen(false);
      setSelectedColor(null);
    }
  };

  const handleDeleteColor = () => {
    if (selectedColor) {
      setColors(
        colors.filter((color) => color.color_id !== selectedColor.color_id)
      );
      setIsDeleteModalOpen(false);
      setSelectedColor(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewColor({ ...newColor, [name]: value });
  };

  return (
    <div className="space-y-6">
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
                    {sortField === "color_name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => handleSort("color_code")}
                >
                  <div className="flex items-center">
                    Code
                    {sortField === "color_code" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredColors.map((color) => (
                <tr key={color.color_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{color.color_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {color.color_name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {color.color_code}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
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
        </div>

        {filteredColors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy màu sắc nào</p>
          </div>
        )}
      </div>

      {/* Add Color Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thêm màu sắc mới
            </h3>

            <div className="space-y-4">
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
                  name="color_name"
                  value={newColor.color_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nhập tên màu sắc"
                />
              </div>

              <div>
                <label
                  htmlFor="color_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã màu <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color_code"
                    name="color_code"
                    value={newColor.color_code}
                    onChange={handleInputChange}
                    className="w-10 h-10 p-0 border-0"
                  />
                  <input
                    type="text"
                    name="color_code"
                    value={newColor.color_code}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="#000000"
                  />
                </div>
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
                onClick={handleAddColor}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!newColor.color_name}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Color Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chỉnh sửa màu sắc
            </h3>

            <div className="space-y-4">
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
                  name="color_name"
                  value={newColor.color_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_color_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã màu <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="edit_color_code"
                    name="color_code"
                    value={newColor.color_code}
                    onChange={handleInputChange}
                    className="w-10 h-10 p-0 border-0"
                  />
                  <input
                    type="text"
                    name="color_code"
                    value={newColor.color_code}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
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
                onClick={handleEditColor}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!newColor.color_name}
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
              Bạn có chắc chắn muốn xóa màu sắc "{selectedColor?.color_name}"
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
                onClick={handleDeleteColor}
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
