import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Check, Archive, Trash } from "lucide-react";
import { CategoryDetail, CategoryFormData } from "@/types/category.type";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/apis/admin/category.api";
import { notification } from "antd";
import { AxiosError } from "axios";
import { CategoryImage } from "@/components/admin/categories/Categoryimage";
import { CategoryProducts } from "@/components/admin/categories/CategoryProducts";
import { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import { QueryClient } from "@tanstack/react-query";

export default function CategoryEdit() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const { category_id } = useParams();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["category", category_id],
    queryFn: () => categoryApi.getCategoryById(category_id as string),
    enabled: !!category_id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      category_name: "",
      category_slug: "",
    },
  });

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData.data.data);
      setValue("category_name", categoryData.data.data.category_name);
      setValue("category_slug", categoryData.data.data.category_slug);
      setValue("status", categoryData.data.data.status);
      if (categoryData.data.data.image) {
        setValue("image_id", categoryData.data.data.image.image_id);
      }
      setValue(
        "product_ids",
        categoryData.data.data.products.map((product) => product.product_id),
      );
    }
  }, [categoryData, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      categoryApi.updateCategory(category_id as string, data),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật danh mục thành công",
        description: "Đã cập nhật danh mục thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["category", category_id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/categories");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Lỗi cập nhật danh mục",
        description: error.response?.data.message,
      });
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.deleteCategory(category_id as string),
    onSuccess: () => {
      notification.success({
        message: "Xóa danh mục thành công",
      });
      navigate("/admin/categories");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Lỗi xóa danh mục",
        description: error.response?.data.message,
      });
      console.error(error);
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    console.log(data);
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/categories")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <Trash className="mr-2 inline-block h-4 w-4" />
                  Xóa
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("status", "draft");
                handleSubmit(onSubmit)();
              }}
              disabled={updateMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <Save className="mr-2 inline-block h-4 w-4" />
                  Lưu nháp
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("status", "archived");
                handleSubmit(onSubmit)();
              }}
              disabled={updateMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <Archive className="mr-2 inline-block h-4 w-4" />
                  Lưu trữ
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("status", "publish");
                handleSubmit(onSubmit)();
              }}
              disabled={updateMutation.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-blue-200" />
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <Check className="mr-2 inline-block h-4 w-4" />
                  Đăng bán
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Thông tin chung</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  {...register("category_name", {
                    required: "Tên danh mục không được để trống",
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nhập tên danh mục"
                />
                {errors.category_name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category_name.message}
                  </p>
                )}
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
                  {...register("category_slug", {
                    validate: (value) => {
                      if (value.includes(" ")) {
                        return "Đường dẫn không được chứa khoảng trắng";
                      }
                      return true;
                    },
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="summer-collection"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Được sử dụng trên URL, để trống để tự động tạo.
                </p>
              </div>
            </div>

            <CategoryImage category={category} setValue={setValue} />
          </div>

          <CategoryProducts category={category} setValue={setValue} />
        </div>
      )}
    </div>
  );
}
