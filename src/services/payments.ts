import { supabase } from "@/lib/supabase";
import type { PaymentProvider } from "@/lib/database.types";

export async function listProviders(): Promise<PaymentProvider[]> {
  const { data, error } = await supabase
    .from("payment_providers")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addProvider(input: {
  provider: string;
  display_name: string;
  description?: string;
  connected?: boolean;
}): Promise<PaymentProvider> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("payment_providers")
    .insert({
      user_id: userId,
      provider: input.provider,
      display_name: input.display_name,
      description: input.description ?? null,
      connected: input.connected ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleProvider(id: string, connected: boolean) {
  const { error } = await supabase
    .from("payment_providers")
    .update({ connected })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProvider(id: string) {
  const { error } = await supabase.from("payment_providers").delete().eq("id", id);
  if (error) throw error;
}
