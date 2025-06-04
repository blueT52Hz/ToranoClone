import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Check, Archive } from "lucide-react";
import { useForm } from "react-hook-form";
import { OutfitFormData } from "@/types/outfit.type";
import { useMutation } from "@tanstack/react-query";
import { outfitApi } from "@/apis/admin/outfit.api";
import { notification } from "antd";
import { AxiosError } from "axios";
import { OutfitImage } from "@/components/admin/outfits/OutfitImage";
import { OutfitProducts } from "@/components/admin/outfits/OutfitProducts";

export default function OutfitCreate() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<OutfitFormData>();

  const createMutation = useMutation({
    mutationFn: (data: OutfitFormData) => outfitApi.createOutfit(data),
    onSuccess: () => {
      notification.success({
        message: "Tạo outfit thành công",
        description: "Đã tạo outfit mới thành công",
      });
      navigate("/admin/outfits");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notification.error({
        message: "Lỗi tạo outfit",
        description: error.response?.data.message,
      });
      console.error(error);
    },
  });

  const onSubmit = (data: OutfitFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/outfits")}
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
                setValue("status", "draft");
                handleSubmit(onSubmit)();
              }}
              disabled={createMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? (
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
              disabled={createMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? (
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
              disabled={createMutation.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? (
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

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-800">Tạo outfit mới</h1>

        <div className="space-y-6">
          {/* Tên outfit */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên outfit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("outfit_name", {
                required: "Tên outfit là bắt buộc",
              })}
              className={`w-full border px-3 py-2 ${
                errors.outfit_name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
              placeholder="Nhập tên outfit"
            />
            {errors.outfit_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.outfit_name.message}
              </p>
            )}
          </div>

          {/* Hình ảnh */}
          <OutfitImage
            outfit={null}
            register={register}
            setValue={setValue}
            setError={setError}
            errors={errors}
          />

          {/* Danh sách sản phẩm */}
          <OutfitProducts outfit={null} setValue={setValue} />
        </div>
      </div>
    </div>
  );
}
