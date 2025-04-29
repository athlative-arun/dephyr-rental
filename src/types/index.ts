
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  pincode: string;
  phone: string;
  email: string;
  description: string;
  openingTime: string;
  closingTime: string;
  images: string[];
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  cc: number;
  gearType: "manual" | "automatic";
  pricePerHour: number;
  pricePerDay: number;
  deposit: number;
  description: string;
  images: string[];
  features: string[];
  shopId: string;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  bikeId: string;
  shopId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  bikeId: string;
  bikeName: string;
  bikeImage: string;
  shopId: string;
  shopName: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalAmount: number;
  deposit: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentId?: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface DateTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface SearchFilters {
  location?: string;
  dateRange?: DateTimeRange;
  priceRange?: [number, number];
  brands?: string[];
  gearTypes?: ("manual" | "automatic")[];
  shops?: string[];
  sortBy?: "price-low-to-high" | "price-high-to-low" | "rating";
  type?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  totalBikes: number;
  revenueByMonth: { month: string; amount: number }[];
  topBikes: { bikeId: string; bikeName: string; totalBookings: number }[];
  topShops: { shopId: string; shopName: string; totalRevenue: number }[];
}
