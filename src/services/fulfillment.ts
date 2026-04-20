import { supabase } from "@/lib/supabase";
import type { FulfillmentCarrier } from "@/lib/database.types";

export async function listCarriers(): Promise<FulfillmentCarrier[]> {
  const { data, error } = await supabase
    .from("fulfillment_carriers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addCarrier(input: {
  country: string;
  name: string;
  cost: number;
  delivery_days: number;
}): Promise<FulfillmentCarrier> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("fulfillment_carriers")
    .insert({ ...input, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCarrier(id: string) {
  const { error } = await supabase.from("fulfillment_carriers").delete().eq("id", id);
  if (error) throw error;
}
