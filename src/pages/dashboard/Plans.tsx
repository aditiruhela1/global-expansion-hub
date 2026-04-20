import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, Search } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/utils/countries";
import {
  createPlan,
  deletePlan,
  listPlans,
  toggleChecklistItem,
  type PlanWithItems,
} from "@/services/plans";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categoryColor: Record<string, string> = {
  tax: "bg-warning/15 text-warning",
  payments: "bg-primary/15 text-primary",
  shipping: "bg-success/15 text-success",
  legal: "bg-accent/15 text-accent",
};

export default function Plans() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [search, setSearch] = useState("");

  useEffect(() => { document.title = "Expansion Plans — GlobeNest"; }, []);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: listPlans,
  });

  const filtered = useMemo(
    () =>
      search
        ? plans.filter((p) => p.country.toLowerCase().includes(search.toLowerCase()))
        : plans,
    [plans, search],
  );

  const create = useMutation({
    mutationFn: (c: string) => createPlan(c),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      setOpen(false);
      toast.success(`Plan created for ${country}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan removed.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: ({ itemId, done }: { itemId: string; done: boolean }) =>
      toggleChecklistItem(itemId, done),
    onMutate: async ({ itemId, done }) => {
      await qc.cancelQueries({ queryKey: ["plans"] });
      const prev = qc.getQueryData<PlanWithItems[]>(["plans"]);
      qc.setQueryData<PlanWithItems[]>(["plans"], (old) =>
        old?.map((p) => ({
          ...p,
          checklist_items: p.checklist_items.map((i) =>
            i.id === itemId ? { ...i, done } : i,
          ),
        })),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["plans"], ctx.prev);
      toast.error("Failed to update item.");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });

  function handleCreate() {
    if (plans.some((p) => p.country === country)) {
      toast.error("You already have a plan for this country.");
      return;
    }
    create.mutate(country);
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
              <Button variant="hero" onClick={handleCreate} disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by country…"
            className="pl-9"
          />
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-12 text-center text-sm text-muted-foreground">
          Loading plans…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onClick={() => setOpen(true)} hasPlans={plans.length > 0} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatePresence>
            {filtered.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onToggle={(itemId, done) => toggle.mutate({ itemId, done })}
                onDelete={(id) => remove.mutate(id)}
              />
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
  plan: PlanWithItems;
  onToggle: (itemId: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const country = COUNTRIES.find((c) => c.name === plan.country);
  const items = plan.checklist_items;
  const completed = items.filter((i) => i.done).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

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
          <p className="mt-1 text-sm text-muted-foreground">{completed}/{items.length} tasks complete</p>
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
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onToggle(item.id, !item.done)}
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

function EmptyState({ onClick, hasPlans }: { onClick: () => void; hasPlans: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
        <Plus className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">
        {hasPlans ? "No matches" : "No plans yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasPlans ? "Try a different search." : "Pick your first target market to start your launch checklist."}
      </p>
      {!hasPlans && (
        <Button variant="hero" className="mt-6" onClick={onClick}>Create your first plan</Button>
      )}
    </div>
  );
}
