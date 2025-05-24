import { SuccessResponse } from "@/types/utils.type";
import { User } from "@/types/user.type";

export type AuthResponse = SuccessResponse<{
  user: User;
  accessToken: string;
}>;
