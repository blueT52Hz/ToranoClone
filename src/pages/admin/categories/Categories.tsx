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
import { Category } from "@/types/category.type";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import Loading from "@/components/common/Loading";

type StatusFilter = "all" | "published" | "draft" | "archived";
type SortBy = "category_name" | "created_at" | "published_at" | "updated_at";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<keyof Collection | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Collection) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort collections
  const filteredCollections = collections
    .filter((collection) => {
      // Filter by status
      if (statusFilter === "published" && !collection.published_at) {
        return false;
      }
      if (statusFilter === "draft" && collection.published_at) {
        return false;
      }

      // Filter by search term
      return collection.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === "asc" ? -1 : 1;
      if (bValue === null) return sortDirection === "asc" ? 1 : -1;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as unknown as number) - (bValue as unknown as number)
        : (bValue as unknown as number) - (aValue as unknown as number);
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const openDeleteModal = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCollection) {
      setIsLoading(true);
      setCollections(
        collections.filter(
          (c) => c.collection_id !== selectedCollection.collection_id,
        ),
      );
      await deleteCollectionById(selectedCollection.collection_id);
      setSelectedCollection(null);
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddCollection = () => {
    const newCollectionId = (collections.length + 1).toString();
    const newCollectionObj: Collection = {
      collection_id: newCollectionId,
      name: newCollection.name,
      slug:
        newCollection.slug ||
        newCollection.name.toLowerCase().replace(/\s+/g, "-"),
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      image: {
        image_url: "",
        image_id: "",
        created_at: new Date(),
        image_name: "",
        published_at: new Date(),
        updated_at: new Date(),
      },
    };

    setCollections([...collections, newCollectionObj]);
    setNewCollection({ name: "", slug: "" });
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  // Get status background color
  const getStatusSelectColor = (status: string): string => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Bộ sưu tập</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/collections/new")}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm bộ sưu tập
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
                placeholder="Tìm kiếm bộ sưu tập..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Filter className="mr-1 h-4 w-4" /> Lọc theo trạng thái:
              </label>
              <div
                className={`${getStatusSelectColor(statusFilter)} cursor-pointer rounded-md px-2 py-1`}
              >
                <select
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
                    value="published"
                    className="bg-green-100 text-green-700"
                  >
                    Đã xuất bản
                  </option>
                  <option value="draft" className="bg-gray-100 text-gray-700">
                    Bản nháp
                  </option>
                </select>
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
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Tên bộ sưu tập
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => handleSort("slug")}
                >
                  <div className="flex items-center">
                    Đường dẫn
                    {sortField === "slug" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => handleSort("published_at")}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === "published_at" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-medium"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Ngày tạo
                    {sortField === "created_at" &&
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
              {paginatedCollections.map((collection) => (
                <tr key={collection.collection_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/collections/${collection.collection_id}`,
                        )
                      }
                      className="hover:text-blue-600"
                    >
                      {collection.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{collection.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        collection.published_at
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {collection.published_at ? "Đã đăng" : "Bản nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(collection.created_at).toLocaleDateString(
                      "vi-VN",
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        className="rounded-full p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() =>
                          navigate(
                            `/admin/collections/${collection.collection_id}/edit`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(collection)}
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

        {paginatedCollections.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Không tìm thấy bộ sưu tập nào</p>
          </div>
        )}

        {paginatedCollections.length > 0 && totalPages > 1 && (
          <div className="pb-5 pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add Collection Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Thêm bộ sưu tập mới
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Tên bộ sưu tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCollection.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nhập tên bộ sưu tập"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Đường dẫn
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={newCollection.slug}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="summer-collection"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Để trống để tự động tạo từ tên.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCollection}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                disabled={!newCollection.name}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Xác nhận xóa
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa bộ sưu tập "{selectedCollection?.name}"
              không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
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
      )}
    </div>
  );
}

const DeleteModal = () => {
  return <></>;
};
