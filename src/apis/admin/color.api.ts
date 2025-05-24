import { SuccessResponse } from "@/types/utils.type";
import adminHttp from "@/utils/adminHttp";
import { Color } from "@/types/color.type";
import { API_ENDPOINTS } from "./endpoint";

interface ColorResponse {
  colors: Color[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const colorApi = {
  getColors() {
    return adminHttp.get<SuccessResponse<ColorResponse>>(
      API_ENDPOINTS.COLOR.COLORS,
    );
  },
  createColor(body: Pick<Color, "color_name" | "color_code">) {
    return adminHttp.post<SuccessResponse<Color>>(
      API_ENDPOINTS.COLOR.COLORS,
      body,
    );
  },
  updateColor(id: string, body: Pick<Color, "color_name" | "color_code">) {
    return adminHttp.put<SuccessResponse<Color>>(
      `${API_ENDPOINTS.COLOR.COLORS}/${id}`,
      body,
    );
  },
  deleteColor(id: string) {
    return adminHttp.delete<SuccessResponse<Color>>(
      `${API_ENDPOINTS.COLOR.COLORS}/${id}`,
    );
  },
};
