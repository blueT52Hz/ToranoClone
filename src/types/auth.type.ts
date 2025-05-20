import { SuccessResponse } from "@/types/utils.type";
import { User } from "@/types/user";

export type AuthResponse = SuccessResponse<{
  user: User;
  accessToken: string;
}>;
