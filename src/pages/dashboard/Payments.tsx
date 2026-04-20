import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plug, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addProvider,
  deleteProvider,
  listProviders,
  toggleProvider,
} from "@/services/payments";
import { toast } from "sonner";

const PROVIDER_OPTIONS = [
  { id: "stripe", name: "Stripe", description: "Accept cards in 135+ currencies." },
  { id: "paypal", name: "PayPal", description: "Trusted checkout in 200+ markets." },
  { id: "wise", name: "Wise Business", description: "Multi-currency accounts & FX." },
  { id: "razorpay", name: "Razorpay", description: "Payments for India & SEA." },
  { id: "custom", name: "Custom", description: "Enter a provider manually." },
];

export default function Payments() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [providerId, setProviderId] = useState("stripe");
  const [customName, setCustomName] = useState("");

  useEffect(() => { document.title = "Payments — GlobeNest"; }, []);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: listProviders,
  });

  const add = useMutation({
    mutationFn: () => {
      const opt = PROVIDER_OPTIONS.find((p) => p.id === providerId)!;
      return addProvider({
        provider: providerId === "custom" ? customName.toLowerCase().trim() : providerId,
        display_name: providerId === "custom" ? customName.trim() : opt.name,
        description: providerId === "custom" ? null : opt.description,
        connected: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providers"] });
      setOpen(false);
      setCustomName("");
      toast.success("Payment provider added.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: ({ id, connected }: { id: string; connected: boolean }) =>
      toggleProvider(id, connected),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Removed.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payments setup</h1>
          <p className="mt-1 text-muted-foreground">
            Track which international payment providers you've connected.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus /> Add provider</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add payment provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prov">Provider</Label>
                <select
                  id="prov"
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {PROVIDER_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {providerId === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="cname">Custom name</Label>
                  <Input
                    id="cname"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Mollie"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="hero"
                onClick={() => add.mutate()}
                disabled={add.isPending || (providerId === "custom" && !customName.trim())}
              >
                {add.isPending ? "Adding…" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : providers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <h3 className="font-display text-xl font-semibold">No providers yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add Stripe, PayPal, or any custom provider.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                  <Plug className="h-5 w-5" />
                </div>
                {p.connected ? (
                  <Badge className="gap-1 bg-success/15 text-success hover:bg-success/15">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline">Not connected</Badge>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.display_name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                {p.description ?? p.provider}
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  variant={p.connected ? "outline" : "hero"}
                  className="flex-1"
                  onClick={() => toggle.mutate({ id: p.id, connected: !p.connected })}
                >
                  {p.connected ? "Disconnect" : "Connect"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(p.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
