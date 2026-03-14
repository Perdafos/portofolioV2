import type { SetupItem, SetupCategory } from "@/backend/types/setup";
import { supabase, supabaseConfigError } from "@/backend/supabase/client";

interface SetupItemRow {
  id: number;
  category: SetupCategory;
  label: string;
  value: string;
  sort_order: number | null;
}

export async function getSetupItems(): Promise<SetupItem[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from("setup_items")
    .select("id, category, label, value, sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as SetupItemRow[];

  return rows.map((row) => ({
    id: String(row.id),
    category: row.category,
    label: row.label,
    value: row.value,
  }));
}