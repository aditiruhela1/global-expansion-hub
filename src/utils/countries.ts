import type { ChecklistCategory } from "./types";

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", vat: "0–10% sales tax (varies by state)", carriers: ["USPS", "FedEx", "UPS"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", vat: "20% VAT", carriers: ["Royal Mail", "DPD", "Evri"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", vat: "19% VAT", carriers: ["DHL", "Hermes", "DPD"] },
  { code: "FR", name: "France", flag: "🇫🇷", vat: "20% VAT", carriers: ["Colissimo", "Chronopost", "Mondial Relay"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", vat: "5% GST + provincial", carriers: ["Canada Post", "Purolator"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", vat: "10% GST", carriers: ["Australia Post", "Sendle"] },
  { code: "IN", name: "India", flag: "🇮🇳", vat: "18% GST (typical)", carriers: ["Delhivery", "Bluedart", "Shiprocket"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", vat: "10% Consumption Tax", carriers: ["Japan Post", "Yamato", "Sagawa"] },
  { code: "BR", name: "Brazil", flag: "🇧🇷", vat: "ICMS varies by state", carriers: ["Correios", "Loggi"] },
  { code: "AE", name: "UAE", flag: "🇦🇪", vat: "5% VAT", carriers: ["Aramex", "DHL"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", vat: "9% GST", carriers: ["SingPost", "Ninja Van"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", vat: "16% IVA", carriers: ["Estafeta", "DHL"] },
];

export const COUNTRY_CHECKLIST_TEMPLATE: { label: string; category: ChecklistCategory }[] = [
  { label: "Register local business entity (or verify cross-border eligibility)", category: "legal" },
  { label: "Obtain tax/VAT/GST registration number", category: "tax" },
  { label: "Configure tax rates in your storefront", category: "tax" },
  { label: "Connect a local-friendly payment processor", category: "payments" },
  { label: "Enable local currency display & checkout", category: "payments" },
  { label: "Choose a fulfillment & shipping partner", category: "shipping" },
  { label: "Define returns & customer support policy", category: "shipping" },
  { label: "Translate key product pages & checkout flow", category: "legal" },
];
