import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { Outfit, OutfitPreview, OutfitWithProducts } from "@/types/outfit.type";
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

interface OutfitWithProductsResponse {
  outfits: OutfitWithProducts[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const outfitApi = {
  getOutfits(
    page: number = 1,
    limit: number = 9,
    search: string = "",
    status: "published" | "draft" | "archived" | "all" = "all",
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
  createOutfit(body: Pick<Outfit, "outfit_name">) {
    return adminHttp.post<SuccessResponse<Outfit>>(
      API_ENDPOINTS.OUTFIT.OUTFITS,
      body,
    );
  },
  updateOutfit(id: string, body: Pick<Outfit, "outfit_name">) {
    return adminHttp.put<SuccessResponse<Outfit>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}/${id}`,
      body,
    );
  },
  deleteOutfit(id: string) {
    return adminHttp.delete<SuccessResponse<Outfit>>(
      `${API_ENDPOINTS.OUTFIT.OUTFITS}/${id}`,
    );
  },
};
