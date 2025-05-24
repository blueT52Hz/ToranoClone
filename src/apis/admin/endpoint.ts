export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  ADMIN: {
    PROFILE: "/profile",
  },
  COLOR: {
    COLORS: "/color",
  },
  SIZE: {
    SIZES: "/size",
  },
  OUTFIT: {
    OUTFITS: "/outfit",
  },
  IMAGE: {
    IMAGES: "/images",
    IMAGE_UPLOAD: "/images/upload",
  },
  USER: {
    USERS: "/user",
    USER_ID: "/user/:id",
  },
  PRODUCT: {
    PRODUCTS: "/product",
    PRODUCT_ID: "/product/:id",
  },
} as const;
