import { useEffect, useState } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";
import { CategoryPreview } from "@/types/category.type";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/apis/admin/category.api";
import { notification } from "antd";
import { AxiosError } from "axios";
import Loading from "@/components/common/Loading";
type StatusFilter = "all" | "publish" | "draft" | "archived";
type SortBy =
  | "category_name"
  | "category_slug"
  | "created_at"
  | "published_at"
  | "updated_at";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryPreview[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryPreview | null>(null);

  const {
    data: categoriesData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["categories", page, search, statusFilter, sortBy, sortOrder],
    queryFn: () =>
      categoryApi.getCategories(
        page,
        10,
        search,
        statusFilter,
        sortBy,
        sortOrder,
      ),
  });

  useEffect(() => {
    if (categoriesData?.data?.data) {
      setCategories(categoriesData.data.data.categories);
      setTotalPages(categoriesData.data.data.pagination.totalPages);
    }
  }, [categoriesData]);

  // Get status background color
  const getStatusSelectColor = (status: string): string => {
    switch (status) {
      case "publish":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "publish":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      case "archived":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Danh mục</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/categories/new")}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm danh mục..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sắp xếp theo:</label>
                <select
                  title="Sắp xếp theo"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="category_name">Tên danh mục</option>
                  <option value="created_at">Ngày tạo</option>
                  <option value="updated_at">Ngày cập nhật</option>
                  <option value="published_at">Ngày đăng</option>
                  <option value="category_slug">Đường dẫn</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Thứ tự:</label>
                <select
                  title="Thứ tự"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
                </label>
                <div
                  className={`${getStatusSelectColor(statusFilter)} cursor-pointer rounded-md px-2 py-1`}
                >
                  <select
                    aria-label="Lọc theo trạng thái"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as StatusFilter)
                    }
                    className={`cursor-pointer rounded-md text-sm shadow-sm transition-all focus:outline-none ${getStatusSelectColor(statusFilter)}`}
                  >
                    <option value="all" className="bg-white text-[#000]">
                      Tất cả
                    </option>
                    <option
                      value="publish"
                      className="bg-green-100 text-green-700"
                    >
                      Đã xuất bản
                    </option>
                    <option
                      value="draft"
                      className="bg-yellow-100 text-yellow-700"
                    >
                      Bản nháp
                    </option>
                    <option
                      value="archived"
                      className="bg-red-100 text-red-700"
                    >
                      Đã lưu trữ
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => setSortBy("category_name")}
                >
                  <div className="flex items-center">
                    Tên danh mục
                    {sortBy === "category_name" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => setSortBy("category_slug")}
                >
                  <div className="flex items-center">
                    Đường dẫn
                    {sortBy === "category_slug" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => setSortBy("published_at")}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortBy === "published_at" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => setSortBy("created_at")}
                >
                  <div className="flex items-center">
                    Ngày tạo
                    {sortBy === "created_at" &&
                      (sortOrder === "asc" ? (
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
              {categories.map((category) => (
                <tr key={category.category_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <button
                      onClick={() =>
                        navigate(`/admin/categories/${category.category_id}`)
                      }
                      className="hover:text-blue-600"
                    >
                      {category.category_name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {category.category_slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusSelectColor(
                        category.status,
                      )}`}
                    >
                      {getStatusText(category.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(category.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        className="rounded-full p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() =>
                          navigate(`/admin/categories/${category.category_id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-full p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && categories.length === 0 && <Loading />}

        {categories.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Không tìm thấy danh mục nào</p>
          </div>
        )}

        {categories.length > 0 && totalPages > 1 && (
          <div className="pb-5 pt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => refetch()}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  selectedCategory: CategoryPreview | null;
  setSelectedCategory: (category: CategoryPreview | null) => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  selectedCategory,
  onDelete,
  setSelectedCategory,
}: DeleteModalProps) => {
  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.deleteCategory(selectedCategory!.category_id),
    onSuccess: () => {
      onDelete();
      setSelectedCategory(null);
      notification.success({
        message: "Xóa danh mục thành công",
      });
      onClose();
    },
    onError: (error: AxiosError<{ data: { message: string } }>) => {
      notification.error({
        message: "Xóa danh mục thất bại",
        description: error.response?.data.data.message,
      });
    },
  });

  if (!selectedCategory || !isOpen) return null;

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
        <p className="mb-6 text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa danh mục "{selectedCategory.category_name}"
          không? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
