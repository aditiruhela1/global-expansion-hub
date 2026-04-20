import { motion } from "framer-motion";
import { ArrowRight, Globe2, ListChecks, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getBusiness, getPaymentProviders, getPlans } from "@/services/api";
import type { ExpansionPlan, PaymentProvider } from "@/utils/types";

export default function Overview() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<ExpansionPlan[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const business = getBusiness();

  useEffect(() => {
    setPlans(getPlans());
    setProviders(getPaymentProviders());
    document.title = "Dashboard — GlobeNest";
  }, []);

  const totalItems = plans.reduce((sum, p) => sum + p.checklist.length, 0);
  const doneItems = plans.reduce((sum, p) => sum + p.checklist.filter((i) => i.done).length, 0);
  const completion = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
  const connected = providers.filter((p) => p.connected).length;

  const stats = [
    { label: "Active markets", value: plans.length, icon: Globe2 },
    { label: "Tasks completed", value: `${doneItems}/${totalItems}`, icon: ListChecks },
    { label: "Payment connections", value: `${connected}/${providers.length}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, {user?.fullName?.split(" ")[0] ?? "founder"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          {business ? `Operating ${business.name} from ${business.country}.` : "Set up your business to get started."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-8 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Overall progress</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{completion}% to launch-ready</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep ticking off your checklist across markets to go live faster.
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/dashboard/plans">
              Manage plans <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickLink to="/dashboard/payments" title="Connect payments" desc="Stripe, PayPal, Wise — all in one place." />
        <QuickLink to="/dashboard/fulfillment" title="Plan fulfillment & tax" desc="Calculate margins and learn local rules." />
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
