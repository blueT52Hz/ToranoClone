import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { productApi } from "@/apis/admin/product.api";
import { ProductForm } from "@/types/product.type";
import { notification, Modal } from "antd";
import { AxiosError } from "axios";
import { VariantForm } from "@/components/admin/variants/VariantForm";
import { CategoriesCheckBox } from "@/components/admin/categories/CategoriesCheckBox";
import { ProductBasicInformation } from "@/components/admin/products/ProductBasicInformation";
import { ProductPricing } from "@/components/admin/products/ProductPricing";
import { ProductImages } from "@/components/admin/products/ProductImages";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductEdit() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProductForm>();

  const { product_id } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: productResponse } = useQuery({
    queryKey: ["product", product_id],
    queryFn: () => productApi.getProduct(product_id as string),
    enabled: !!product_id,
  });

  const product = productResponse?.data.data || null;

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductForm) =>
      productApi.updateProduct(product_id as string, data),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật sản phẩm thành công",
      });
      navigate("/admin/products");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Cập nhật sản phẩm thất bại",
        description: error.response?.data.message,
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => productApi.deleteProduct(product_id as string),
    onSuccess: () => {
      notification.success({
        message: "Xóa sản phẩm thành công",
      });
      navigate("/admin/products");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Xóa sản phẩm thất bại",
        description: error.response?.data.message,
      });
    },
  });

  if (!product_id) {
    navigate("/admin/products");
    return null;
  }

  const onSubmit = (data: ProductForm) => {
    // Xử lý các trường không có giá trị
    const formData = {
      ...data,
      discount: data.discount || null,
      sale_price: data.sale_price || null,
      product_slug: data.product_slug || null,
    };
    console.log(formData);
    updateProductMutation.mutate(formData);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProductMutation.mutate();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Quay lại</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Sửa sản phẩm</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 inline-block h-4 w-4" />
              Xóa sản phẩm
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("product_status", "draft");
                handleSubmit(onSubmit)();
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("product_status", "published");
                handleSubmit(onSubmit)();
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              disabled={updateProductMutation.isPending}
            >
              <Save className="mr-2 inline-block h-4 w-4" />
              Xuất bản
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <ProductBasicInformation
              register={register}
              errors={errors}
              setValue={setValue}
              product={product}
            />

            {/* Images */}
            <ProductImages
              register={register}
              errors={errors}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              product={product}
            />

            {/* Pricing */}
            <ProductPricing
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              product={product}
            />

            {/* Variants */}
            <VariantForm
              variantsProp={product?.variants || []}
              setValue={setValue}
            />
          </div>

          {/* Categories */}
          <CategoriesCheckBox setValue={setValue} product={product} />
        </div>
      </div>

      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
        <p className="text-sm text-gray-500">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
}
