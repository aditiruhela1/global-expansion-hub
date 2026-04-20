import { supabase } from "@/lib/supabase";
import type { ChecklistItem, ExpansionPlan } from "@/lib/database.types";
import { COUNTRY_CHECKLIST_TEMPLATE } from "@/utils/countries";

export type PlanWithItems = ExpansionPlan & { checklist_items: ChecklistItem[] };

export async function listPlans(): Promise<PlanWithItems[]> {
  const { data, error } = await supabase
    .from("expansion_plans")
    .select("*, checklist_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    checklist_items: [...(p.checklist_items ?? [])].sort(
      (a, b) => a.position - b.position,
    ),
  })) as PlanWithItems[];
}

export async function createPlan(country: string): Promise<PlanWithItems> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { data: plan, error } = await supabase
    .from("expansion_plans")
    .insert({ country, user_id: userId })
    .select()
    .single();
  if (error) throw error;

  const items = COUNTRY_CHECKLIST_TEMPLATE.map((c, i) => ({
    plan_id: plan.id,
    label: c.label,
    category: c.category,
    done: false,
    position: i,
  }));
  const { data: inserted, error: itemsErr } = await supabase
    .from("checklist_items")
    .insert(items)
    .select();
  if (itemsErr) throw itemsErr;

  return { ...plan, checklist_items: inserted ?? [] } as PlanWithItems;
}

export async function deletePlan(id: string) {
  const { error } = await supabase.from("expansion_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleChecklistItem(itemId: string, done: boolean) {
  const { error } = await supabase
    .from("checklist_items")
    .update({ done })
    .eq("id", itemId);
  if (error) throw error;
}
