export interface User {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'owner' | 'manager' | 'staff' | 'customer';
  email_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  subscription_status: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  postcode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Venue {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  address: Address;
  capacity: number;
  price_per_hour: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  venue_id: string;
  customer_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  stripe_payment_intent_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  venue_name?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_email?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role?: 'owner' | 'manager' | 'staff' | 'customer';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VenueFilters {
  city?: string;
  capacity_min?: number;
  capacity_max?: number;
  price_max?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface CreateVenueData {
  name: string;
  description?: string;
  address: Address;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  images: string[];
}

export interface UpdateVenueData extends Partial<CreateVenueData> {
  isActive?: boolean;
}
