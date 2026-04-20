export type User = {
  id: string;
  fullName: string;
  email: string;
};

export type Business = {
  id: string;
  name: string;
  country: string;
  industry: string;
  website: string;
};

export type ChecklistCategory = "tax" | "payments" | "shipping" | "legal";

export type ChecklistItem = {
  id: string;
  label: string;
  category: ChecklistCategory;
  done: boolean;
};

export type ExpansionPlan = {
  id: string;
  country: string;
  createdAt: string;
  checklist: ChecklistItem[];
};

export type PaymentProvider = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
};
