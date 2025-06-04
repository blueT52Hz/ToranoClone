import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { productApi } from "@/apis/admin/product.api";
import { ProductForm } from "@/types/product.type";
import { notification } from "antd";
import { AxiosError } from "axios";
import { VariantForm } from "@/components/admin/variants/VariantForm";
import { CategoriesCheckBox } from "@/components/admin/categories/CategoriesCheckBox";
import { ProductBasicInformation } from "@/components/admin/products/ProductBasicInformation";
import { ProductPricing } from "@/components/admin/products/ProductPricing";
import { ProductImages } from "@/components/admin/products/ProductImages";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProductForm>();

  const createProductMutation = useMutation({
    mutationFn: (data: ProductForm) => productApi.createProduct(data),
    onSuccess: () => {
      notification.success({
        message: "Thêm sản phẩm thành công",
      });
      navigate("/admin/products");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Thêm sản phẩm thất bại",
        description: error.response?.data.message,
      });
    },
  });

  const onSubmit = (data: ProductForm) => {
    // Xử lý các trường không có giá trị
    const formData = {
      ...data,
      discount: data.discount ? Number(data.discount) : null,
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      product_slug: data.product_slug || null,
      base_price: Number(data.base_price),
    };
    console.log(formData);
    createProductMutation.mutate(formData);
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
            <h1 className="text-2xl font-bold text-gray-800">
              Thêm sản phẩm mới
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
              disabled={createProductMutation.isPending}
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
              product={null}
            />

            {/* Images */}
            <ProductImages
              register={register}
              errors={errors}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              product={null}
            />

            {/* Pricing */}
            <ProductPricing
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              product={null}
            />

            {/* Variants */}
            <VariantForm variantsProp={[]} setValue={setValue} />
          </div>

          {/* Categories */}
          <CategoriesCheckBox setValue={setValue} product={null} />
        </div>
      </div>
    </div>
  );
}
