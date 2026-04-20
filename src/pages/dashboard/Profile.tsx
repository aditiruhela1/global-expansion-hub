import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getMyBusiness, upsertMyBusiness } from "@/services/business";
import { COUNTRIES } from "@/utils/countries";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? "";
  const qc = useQueryClient();

  const { data: business } = useQuery({ queryKey: ["business"], queryFn: getMyBusiness });

  const [form, setForm] = useState({
    name: "",
    country: COUNTRIES[0].name,
    industry: "",
    website: "",
  });

  useEffect(() => { document.title = "Profile — GlobeNest"; }, []);
  useEffect(() => {
    if (business) {
      setForm({
        name: business.name ?? "",
        country: business.country ?? COUNTRIES[0].name,
        industry: business.industry ?? "",
        website: business.website ?? "",
      });
    }
  }, [business]);

  const save = useMutation({
    mutationFn: () =>
      upsertMyBusiness({
        name: form.name,
        country: form.country,
        industry: form.industry || null,
        website: form.website || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business"] });
      toast.success("Business details saved.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
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
            <Input value={fullName} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
        </div>
      </section>

      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
      >
        <h2 className="font-display text-lg font-semibold">Business</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bname">Business name</Label>
            <Input id="bname" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bcountry">Home country</Label>
            <select
              id="bcountry"
              value={form.country}
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
            <Input id="bindustry" value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. D2C apparel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bweb">Website</Label>
            <Input id="bweb" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" />
          </div>
        </div>
        <Button type="submit" variant="hero" className="mt-6" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
