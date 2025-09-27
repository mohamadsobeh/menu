// Banner type
export interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Offer type
export interface Offer {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price_syp: number;
  price_usd: number;
  is_recommended: boolean;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    id: number;
    name: string;
    type: string;
    subscriptionTier?: string | null;
    subscriptionActiveUntil?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  products?: Product[];
}

// Product image type
export interface ProductImage {
  id: string;
  image_url: string;
  created_at: string;
  image_path: string;
}

// Product Addition type
export interface ProductAddition {
  id: number;
  name: string;
  priceSyp: string;
  priceUsd: string;
  isAvailable: boolean;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

// Category type for products
export interface ProductCategory {
  id: number;
  name: string;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Restaurant type for products
export interface ProductRestaurant {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Created By type for products
export interface ProductCreatedBy {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  password: string;
  blocked: boolean;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

// Product type
export interface Product {
  id: number;
  name: string;
  calories: number;
  description: string;
  isAvailable: boolean;
  ingredients: string[];
  images: string[];
  priceSyp: string;
  priceUsd: string | null;
  createdById: number;
  isFav: boolean;
  categoryId: number;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  restaurant: ProductRestaurant;
  createdBy: ProductCreatedBy;
  additions: ProductAddition[];
}

// Category type
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

// White label config type
export interface WhiteLabelConfig {
  id: number;
  restaurantId: number;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
  isActive: boolean;
  accentColor: string;
  usdPrice: number;
  instagramAccount: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Main home screen response type
export interface HomeScreenResponse {
  featured_products: never[];
  banners: Banner[];
  categories: Category[];
  label: WhiteLabelConfig;
}

// Phone number form type
export interface PhoneNumberForm {
  phoneNumber: string;
  countryCode?: string;
}

// API error type
export interface ApiError {
  message: string;
  status?: number;
}
