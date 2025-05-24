import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";
import { Image } from "@/types/image.type";

interface ImageResponse {
  images: Image[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const imageApi = {
  getImages(
    page: number = 1,
    limit: number = 9,
    search: string = "",
    sortBy: "image_name" | "created_at" | "updated_at" = "created_at",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return adminHttp.get<SuccessResponse<ImageResponse>>(
      `${API_ENDPOINTS.IMAGE.IMAGES}?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    );
  },
  createImage(body: FormData) {
    return adminHttp.post<SuccessResponse<Image[]>>(
      API_ENDPOINTS.IMAGE.IMAGE_UPLOAD,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
  updateImage(id: string, body: Pick<Image, "image_name" | "image_alt">) {
    return adminHttp.put<SuccessResponse<Image>>(
      `${API_ENDPOINTS.IMAGE.IMAGES}/${id}`,
      body,
    );
  },
  deleteImage(id: string) {
    return adminHttp.delete<SuccessResponse<Image>>(
      `${API_ENDPOINTS.IMAGE.IMAGES}/${id}`,
    );
  },
};
