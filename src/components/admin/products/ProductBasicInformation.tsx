import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { ProductForm } from "@/types/product.type";
import { UseFormRegister } from "react-hook-form";
import { ProductDetailAdmin } from "@/types/product.type";
import { useEffect } from "react";
interface ProductBasicInformationProps {
  product: ProductDetailAdmin | null;
  register: UseFormRegister<ProductForm>;
  errors: FieldErrors<ProductForm>;
  setValue: UseFormSetValue<ProductForm>;
}

export const ProductBasicInformation = ({
  register,
  errors,
  product,
  setValue,
}: ProductBasicInformationProps) => {
  useEffect(() => {
    if (product) {
      setValue("product_name", product.product_name);
      setValue("product_description", product.product_description);
      setValue("product_code", product.product_code);
      setValue("brand_name", product.brand_name);
      setValue("product_slug", product.product_slug);
    }
  }, [product, setValue]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Thông tin cơ bản</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("product_name", {
              required: "Tên sản phẩm là bắt buộc",
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập tên sản phẩm"
          />
          <p className="mt-1 text-sm text-red-500">
            {errors.product_name?.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            {...register("product_slug")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập slug sản phẩm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="product_code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mã sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="product_code"
              {...register("product_code", {
                required: "Mã sản phẩm là bắt buộc",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="TS001"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.product_code?.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="brand_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Thương hiệu
            </label>
            <input
              type="text"
              id="brand_name"
              {...register("brand_name", {
                required: "Thương hiệu là bắt buộc",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Torano"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.brand_name?.message}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            {...register("product_description", {
              required: "Mô tả sản phẩm là bắt buộc",
            })}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập mô tả chi tiết về sản phẩm"
          ></textarea>
          <p className="mt-1 text-sm text-red-500">
            {errors.product_description?.message}
          </p>
        </div>
      </div>
    </div>
  );
};
