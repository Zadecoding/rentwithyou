export type PropertyCategory = 'rent' | 'buy' | 'commercial';

export type PropertyType =
  | 'Apartment'
  | 'Independent Floor'
  | 'Studio Room'
  | 'Villa'
  | 'Plot'
  | 'Shop'
  | 'Office'
  | 'Warehouse'
  | string;

export type BedroomType = 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4+ BHK' | '2, 3 BHK' | 'N/A' | string;

export type FurnishingType = 'Furnished' | 'Semi-furnished' | 'Unfurnished' | 'N/A';

export type PropertyBadge = 'Verified' | 'New' | 'New launch' | 'Ready' | 'Premium' | 'Plots' | null;

export type ListedByRole = 'Owner' | 'Dealer' | 'Admin';

export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  property_code: string;
  title: string;
  category: PropertyCategory;
  sub_category: string;
  property_type: PropertyType;
  bedrooms: BedroomType;
  furnishing: FurnishingType;
  price: number;
  price_label: string;
  area: string;
  city: string;
  landmark?: string;
  available_from: string;
  description: string;
  images: string[];
  badge?: PropertyBadge;
  listed_by_role: ListedByRole;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  user_id?: string | null;
  status: PropertyStatus;
  created_at?: string;
  updated_at?: string;
}

export type EnquiryType = 'general' | 'property' | 'packers_movers' | 'furniture';

export interface Enquiry {
  id?: string;
  enquiry_type: EnquiryType;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  pickup_location?: string;
  drop_location?: string;
  move_date?: string;
  household_size?: string;
  message: string;
  property_id?: string | null;
  status?: 'new' | 'contacted' | 'closed';
  created_at?: string;
}

export interface SiteStats {
  id?: number;
  key: string;
  visitor_count: number;
  updated_at?: string;
}

export interface FilterState {
  location: string;
  property_type: string;
  bedrooms: string;
  furnishing: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price_low' | 'price_high';
}
