// Placeholder service layer — ready to swap to Lovable Cloud / Supabase later.
// All functions return Promises so the API surface won't change.

import type { User, Business, ExpansionPlan, ChecklistItem, PaymentProvider } from "@/utils/types";
import { COUNTRY_CHECKLIST_TEMPLATE } from "@/utils/countries";

const STORAGE_KEYS = {
  user: "globenest:user",
  business: "globenest:business",
  plans: "globenest:plans",
  payments: "globenest:payments",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ---------- Auth ----------
export async function signUp(input: {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  country: string;
}): Promise<User> {
  await wait();
  const user: User = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    email: input.email,
  };
  const business: Business = {
    id: crypto.randomUUID(),
    name: input.businessName,
    country: input.country,
    industry: "",
    website: "",
  };
  write(STORAGE_KEYS.user, user);
  write(STORAGE_KEYS.business, business);
  return user;
}

export async function signIn(email: string, _password: string): Promise<User> {
  await wait();
  const existing = read<User | null>(STORAGE_KEYS.user, null);
  if (existing && existing.email === email) return existing;
  // Demo fallback — create a session for any creds
  const user: User = { id: crypto.randomUUID(), fullName: "Demo Founder", email };
  write(STORAGE_KEYS.user, user);
  if (!read<Business | null>(STORAGE_KEYS.business, null)) {
    write(STORAGE_KEYS.business, {
      id: crypto.randomUUID(),
      name: "Demo Co.",
      country: "United States",
      industry: "",
      website: "",
    } as Business);
  }
  return user;
}

export async function signOut() {
  await wait(50);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function getCurrentUser(): User | null {
  return read<User | null>(STORAGE_KEYS.user, null);
}

// ---------- Business ----------
export function getBusiness(): Business | null {
  return read<Business | null>(STORAGE_KEYS.business, null);
}

export async function updateBusiness(patch: Partial<Business>): Promise<Business> {
  await wait();
  const current = getBusiness();
  const updated = { ...(current ?? { id: crypto.randomUUID(), name: "", country: "", industry: "", website: "" }), ...patch } as Business;
  write(STORAGE_KEYS.business, updated);
  return updated;
}

// ---------- Expansion Plans ----------
export function getPlans(): ExpansionPlan[] {
  return read<ExpansionPlan[]>(STORAGE_KEYS.plans, []);
}

export async function createPlan(country: string): Promise<ExpansionPlan> {
  await wait();
  const checklist: ChecklistItem[] = COUNTRY_CHECKLIST_TEMPLATE.map((c) => ({
    id: crypto.randomUUID(),
    label: c.label,
    category: c.category,
    done: false,
  }));
  const plan: ExpansionPlan = {
    id: crypto.randomUUID(),
    country,
    createdAt: new Date().toISOString(),
    checklist,
  };
  const all = [...getPlans(), plan];
  write(STORAGE_KEYS.plans, all);
  return plan;
}

export async function deletePlan(id: string) {
  await wait(50);
  write(STORAGE_KEYS.plans, getPlans().filter((p) => p.id !== id));
}

export async function toggleChecklistItem(planId: string, itemId: string) {
  await wait(50);
  const updated = getPlans().map((p) =>
    p.id === planId
      ? { ...p, checklist: p.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
      : p,
  );
  write(STORAGE_KEYS.plans, updated);
  return updated;
}

// ---------- Payments ----------
const DEFAULT_PROVIDERS: PaymentProvider[] = [
  { id: "stripe", name: "Stripe", connected: false, description: "Accept cards in 135+ currencies." },
  { id: "paypal", name: "PayPal", connected: false, description: "Trusted checkout in 200+ markets." },
  { id: "wise", name: "Wise Business", connected: false, description: "Multi-currency accounts & FX." },
];

export function getPaymentProviders(): PaymentProvider[] {
  const stored = read<PaymentProvider[] | null>(STORAGE_KEYS.payments, null);
  return stored ?? DEFAULT_PROVIDERS;
}

export async function togglePaymentProvider(id: string) {
  await wait(80);
  const next = getPaymentProviders().map((p) => (p.id === id ? { ...p, connected: !p.connected } : p));
  write(STORAGE_KEYS.payments, next);
  return next;
}
