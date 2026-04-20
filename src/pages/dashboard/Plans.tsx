import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/utils/countries";
import { createPlan, deletePlan, getPlans, toggleChecklistItem } from "@/services/api";
import type { ExpansionPlan } from "@/utils/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categoryColor: Record<string, string> = {
  tax: "bg-warning/15 text-warning",
  payments: "bg-primary/15 text-primary",
  shipping: "bg-success/15 text-success",
  legal: "bg-accent/15 text-accent",
};

export default function Plans() {
  const [plans, setPlans] = useState<ExpansionPlan[]>([]);
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0].name);

  useEffect(() => {
    setPlans(getPlans());
    document.title = "Expansion Plans — GlobeNest";
  }, []);

  async function handleCreate() {
    if (plans.some((p) => p.country === country)) {
      toast.error("You already have a plan for this country.");
      return;
    }
    await createPlan(country);
    setPlans(getPlans());
    setOpen(false);
    toast.success(`Plan created for ${country}`);
  }

  async function handleDelete(id: string) {
    await deletePlan(id);
    setPlans(getPlans());
    toast.success("Plan removed.");
  }

  async function handleToggle(planId: string, itemId: string) {
    const next = await toggleChecklistItem(planId, itemId);
    setPlans(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Expansion plans</h1>
          <p className="mt-1 text-muted-foreground">Create a country plan and tick off your launch checklist.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus /> New plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add expansion plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="country-select">Target country</Label>
              <select
                id="country-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button variant="hero" onClick={handleCreate}>Create plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <EmptyState onClick={() => setOpen(true)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatePresence>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  onToggle,
  onDelete,
}: {
  plan: ExpansionPlan;
  onToggle: (planId: string, itemId: string) => void;
  onDelete: (id: string) => void;
}) {
  const country = COUNTRIES.find((c) => c.name === plan.country);
  const completed = plan.checklist.filter((i) => i.done).length;
  const progress = useMemo(
    () => Math.round((completed / plan.checklist.length) * 100),
    [completed, plan.checklist.length],
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-bold">
            <span className="mr-2">{country?.flag}</span>{plan.country}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{completed}/{plan.checklist.length} tasks complete</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)} aria-label="Delete plan">
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <ul className="mt-5 space-y-2">
        {plan.checklist.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onToggle(plan.id, item.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-muted/50",
                item.done && "opacity-60",
              )}
            >
              {item.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className={cn("flex-1 text-sm", item.done && "line-through")}>{item.label}</span>
              <Badge variant="outline" className={cn("text-[10px] uppercase", categoryColor[item.category])}>
                {item.category}
              </Badge>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
        <Plus className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">No plans yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pick your first target market to start your launch checklist.</p>
      <Button variant="hero" className="mt-6" onClick={onClick}>Create your first plan</Button>
    </div>
  );
}
