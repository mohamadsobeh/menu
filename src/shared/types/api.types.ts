// Banner type
export interface Banner {
  id: string;
  image_url: string;
  image_path: string;
  text: string | null;
  redirect_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  banner_type: string;
  title: string;
  price: number;
  description: string;
}

// Offer type
export interface Offer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  price_syp: number;
  price_usd: number;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
  offer_products: Array<{
    product: Product;
  }>;
  featured_products: Product[];
}

// Product image type
export interface ProductImage {
  id: string;
  image_url: string;
  created_at: string;
  image_path: string;
}

// Product addition type
export interface ProductAddition {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  price_in_syp: number;
  price_in_usd: number | null;
}

// Product type
export interface Product {
  id: string;
  name: string;
  isfav: boolean;
  calories: number;
  created_at: string;
  updated_at: string;
  description: string;
  ingredients: string[];
  is_available: boolean;
  price_in_syp: number;
  price_in_usd: number;
  product_images: ProductImage[];
  images: ProductImage[];
  additions?: ProductAddition[];
}

// Category type
export interface Category {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  image_path: string;
  display_order: number;
  products: Product[];
}

// White label config type
export interface WhiteLabelConfig {
  id: string;
  user_id: string;
  customer_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  text_color: string;
  accent_color: string;
}

// Main home screen response type
export interface HomeScreenResponse {
  banners: Banner[];
  offers: Offer[];
  featured_products: Offer[];
  categories: Category[];
  white_label_config: WhiteLabelConfig | null;
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
