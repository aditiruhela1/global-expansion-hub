import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPaymentProviders, togglePaymentProvider } from "@/services/api";
import type { PaymentProvider } from "@/utils/types";
import { toast } from "sonner";

export default function Payments() {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);

  useEffect(() => {
    setProviders(getPaymentProviders());
    document.title = "Payments — GlobeNest";
  }, []);

  async function handleToggle(id: string, currentlyConnected: boolean) {
    const next = await togglePaymentProvider(id);
    setProviders(next);
    toast.success(currentlyConnected ? "Provider disconnected." : "Provider connected (placeholder).");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Payments setup</h1>
        <p className="mt-1 text-muted-foreground">
          Connect international payment providers. (Real OAuth coming after Lovable Cloud is enabled.)
        </p>
      </div>

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
                <Badge className="gap-1 bg-success/15 text-success hover:bg-success/15"><CheckCircle2 className="h-3 w-3" /> Connected</Badge>
              ) : (
                <Badge variant="outline">Not connected</Badge>
              )}
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.description}</p>
            <Button
              variant={p.connected ? "outline" : "hero"}
              className="mt-5"
              onClick={() => handleToggle(p.id, p.connected)}
            >
              {p.connected ? "Disconnect" : "Connect"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
