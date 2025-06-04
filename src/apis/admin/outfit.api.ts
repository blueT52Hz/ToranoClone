import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import {
  OutfitPreview,
  OutfitFormData,
  OutfitDetail,
} from "@/types/outfit.type";
import { API_ENDPOINTS } from "@/apis/admin/endpoint";

interface OutfitPreviewResponse {
  outfits: OutfitPreview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const outfitApi = {
  getOutfits(
    page: number = 1,
    limit: number = 9,
    search: string = "",
    status: "publish" | "draft" | "archived" | "all" = "all",
    sortBy:
      | "outfit_name"
      | "created_at"
      | "published_at"
      | "updated_at" = "published_at",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return adminHttp.get<SuccessResponse<OutfitPreviewResponse>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}?page=${page}&limit=${limit}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    );
  },
  getOutfitById(id: string) {
    return adminHttp.get<SuccessResponse<OutfitDetail>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}/${id}`,
    );
  },
  createOutfit(body: OutfitFormData) {
    return adminHttp.post<SuccessResponse<OutfitDetail>>(
      API_ENDPOINTS.OUTFIT.OUTFITS,
      body,
    );
  },
  updateOutfit(id: string, body: OutfitFormData) {
    return adminHttp.put<SuccessResponse<OutfitDetail>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}/${id}`,
      body,
    );
  },
  deleteOutfit(id: string) {
    return adminHttp.delete<SuccessResponse<OutfitDetail>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}/${id}`,
    );
  },
};
