// Generic Supabase data-access layer.
import { supabase } from "@/lib/supabase";

type TableName = string;

export type ListOptions = {
  select?: string;
  filters?: Record<string, unknown>;
  search?: { column: string; query: string };
  order?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
};

function applyFilters<Q extends { eq: (c: string, v: unknown) => Q; ilike: (c: string, v: string) => Q }>(
  query: Q,
  filters?: Record<string, unknown>,
  search?: { column: string; query: string },
): Q {
  let q = query;
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== "") q = q.eq(k, v);
    }
  }
  if (search?.query) q = q.ilike(search.column, `%${search.query}%`);
  return q;
}

export async function getAll<T = unknown>(table: TableName, opts: ListOptions = {}) {
  const { select = "*", order, page, pageSize } = opts;
  let q = supabase.from(table).select(select, { count: "exact" });
  q = applyFilters(q as never, opts.filters, opts.search);
  if (order) q = q.order(order.column, { ascending: order.ascending ?? true });
  if (page !== undefined && pageSize) {
    const from = (page - 1) * pageSize;
    q = q.range(from, from + pageSize - 1);
  }
  const { data, error, count } = await q;
  if (error) {
    console.error(`[db.getAll:${table}]`, error);
    throw error;
  }
  return { data: (data ?? []) as T[], count: count ?? 0 };
}

export async function getById<T = unknown>(table: TableName, id: string, select = "*") {
  const { data, error } = await supabase.from(table).select(select).eq("id", id).maybeSingle();
  if (error) {
    console.error(`[db.getById:${table}]`, error);
    throw error;
  }
  return data as T | null;
}

export async function createRecord<T = unknown>(table: TableName, payload: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).insert(payload as never).select().single();
  if (error) {
    console.error(`[db.create:${table}]`, error);
    throw error;
  }
  return data as T;
}

export async function updateRecord<T = unknown>(
  table: TableName,
  id: string,
  patch: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from(table)
    .update(patch as never)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error(`[db.update:${table}]`, error);
    throw error;
  }
  return data as T;
}

export async function deleteRecord(table: TableName, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[db.delete:${table}]`, error);
    throw error;
  }
  return true;
}
