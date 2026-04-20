import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getBusiness, updateBusiness } from "@/services/api";
import { COUNTRIES } from "@/utils/countries";
import { toast } from "sonner";
import type { Business } from "@/utils/types";

export default function Profile() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business>(() =>
    getBusiness() ?? { id: "", name: "", country: COUNTRIES[0].name, industry: "", website: "" },
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Profile — GlobeNest"; }, []);

  function update<K extends keyof Business>(k: K, v: Business[K]) {
    setBusiness((b) => ({ ...b, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateBusiness(business);
      setBusiness(updated);
      toast.success("Business details saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and business information.</p>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={user?.fullName ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Account changes will be available once Lovable Cloud is enabled.
        </p>
      </section>

      <form onSubmit={handleSave} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Business</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bname">Business name</Label>
            <Input id="bname" value={business.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bcountry">Home country</Label>
            <select
              id="bcountry"
              value={business.country}
              onChange={(e) => update("country", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bindustry">Industry</Label>
            <Input id="bindustry" value={business.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. D2C apparel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bweb">Website</Label>
            <Input id="bweb" value={business.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" />
          </div>
        </div>
        <Button type="submit" variant="hero" className="mt-6" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
