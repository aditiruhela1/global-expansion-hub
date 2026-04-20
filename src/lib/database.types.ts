// Hand-written types matching the SQL schema in /supabase/migrations.
// Shape mirrors what `supabase gen types typescript` produces.

export type AppRole = "admin" | "user";
export type ChecklistCategory = "tax" | "payments" | "shipping" | "legal";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  country: string;
  industry: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpansionPlan {
  id: string;
  user_id: string;
  country: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  plan_id: string;
  label: string;
  category: ChecklistCategory;
  done: boolean;
  position: number;
  created_at: string;
}

export interface PaymentProvider {
  id: string;
  user_id: string;
  provider: string;
  display_name: string;
  description: string | null;
  connected: boolean;
  created_at: string;
}

export interface FulfillmentCarrier {
  id: string;
  user_id: string;
  country: string;
  name: string;
  cost: number;
  delivery_days: number;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      businesses: {
        Row: Business;
        Insert: Omit<Business, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Business>;
        Relationships: [];
      };
      expansion_plans: {
        Row: ExpansionPlan;
        Insert: Omit<ExpansionPlan, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ExpansionPlan>;
        Relationships: [];
      };
      checklist_items: {
        Row: ChecklistItem;
        Insert: Omit<ChecklistItem, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ChecklistItem>;
        Relationships: [];
      };
      payment_providers: {
        Row: PaymentProvider;
        Insert: Omit<PaymentProvider, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<PaymentProvider>;
        Relationships: [];
      };
      fulfillment_carriers: {
        Row: FulfillmentCarrier;
        Insert: Omit<FulfillmentCarrier, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<FulfillmentCarrier>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, "id"> & { id?: string };
        Update: Partial<UserRole>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      checklist_category: ChecklistCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};
