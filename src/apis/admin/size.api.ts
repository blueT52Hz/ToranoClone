import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { Size } from "@/types/size.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";

interface SizeResponse {
  sizes: Size[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const sizeApi = {
  getSizes() {
    return adminHttp.get<SuccessResponse<SizeResponse>>(
      API_ENDPOINTS.SIZE.SIZES,
    );
  },
  createSize(body: Pick<Size, "size_code">) {
    return adminHttp.post<SuccessResponse<Size>>(
      API_ENDPOINTS.SIZE.SIZES,
      body,
    );
  },
  updateSize(id: string, body: Pick<Size, "size_code">) {
    return adminHttp.put<SuccessResponse<Size>>(
      `${API_ENDPOINTS.SIZE.SIZES}/${id}`,
      body,
    );
  },
  deleteSize(id: string) {
    return adminHttp.delete<SuccessResponse<Size>>(
      `${API_ENDPOINTS.SIZE.SIZES}/${id}`,
    );
  },
};
