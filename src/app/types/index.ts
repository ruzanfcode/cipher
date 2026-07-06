export type Role = "system_admin" | "sbu_admin" | "sbu_user";
export type HeaderTab = "dashboard" | "product-catalog" | "collection" | "sbu";
export type SearchMode = "keyword" | "url";
export type ThemeMode = "light" | "dark" | "system";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  reviews: number;
  rating: number;
  sentiment: { positive: number; neutral: number; negative: number };
  image: string;
}

export interface SavedCollection {
  id: number;
  name: string;
  owner: string;
  created: string;
  productIds: number[];
}

export type SBUUserStatus = "Active" | "Pending" | "Disabled";

export interface SBUUser {
  id: number;
  name: string;
  email: string;
  role: "SBU Admin" | "SBU User";
  status: SBUUserStatus;
  sbu: string;
  lastActive: string;
}

export interface SBU {
  id: number;
  name: string;
  admin: string;
  users: number;
  allowedUsers: number;
  status: "Active" | "Inactive";
  products: number;
  collections: number;
}
