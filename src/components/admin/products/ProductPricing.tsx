import { Product, ProductForm } from "@/types/product.type";
import { useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

interface ProductPricingProps {
  product: Product | null;
  register: UseFormRegister<ProductForm>;
  errors: FieldErrors<ProductForm>;
  watch: UseFormWatch<ProductForm>;
  setValue: UseFormSetValue<ProductForm>;
}
export const ProductPricing = ({
  register,
  errors,
  watch,
  setValue,
  product,
}: ProductPricingProps) => {
  useEffect(() => {
    if (product) {
      setValue("base_price", product.base_price);
      setValue("sale_price", product.sale_price);
      setValue("discount", product.discount);
    }
  }, [product, setValue]);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Giá sản phẩm</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="base_price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Giá gốc (VND) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="base_price"
            {...register("base_price", {
              required: "Giá gốc là bắt buộc",
              min: {
                value: 1000,
                message: "Giá gốc phải lớn hơn 1000 VND",
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="299000"
          />
          <p className="mt-1 text-sm text-red-500">
            {errors.base_price?.message}
          </p>
        </div>
        <div>
          <label
            htmlFor="sale_price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Giá bán (VND)
          </label>
          <input
            type="number"
            id="sale_price"
            {...register("sale_price", {
              validate: (value) => {
                const basePrice = watch("base_price");
                if (value && Number(value) > Number(basePrice)) {
                  return "Giá bán không được lớn hơn giá gốc";
                }
                return true;
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="249000"
          />
          <p className="mt-1 text-sm text-red-500">
            {errors.sale_price?.message}
          </p>
        </div>
        <div>
          <label
            htmlFor="discount"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Giảm giá (%)
          </label>
          <input
            type="number"
            id="discount"
            {...register("discount", {
              min: {
                value: 0,
                message: "Giảm giá phải lớn hơn 0",
              },
              max: {
                value: 100,
                message: "Giảm giá phải nhỏ hơn 100",
              },
            })}
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
          />
          <p className="mt-1 text-sm text-red-500">
            {errors.discount?.message}
          </p>
        </div>
      </div>
    </div>
  );
};
