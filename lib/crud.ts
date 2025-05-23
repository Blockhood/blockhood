import { supabase } from "./supabase";

export async function getAll<T>(
  table: string,
  relations?: string
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select(relations || "*");

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No data returned from query");
  }

  return data as T[];
}

export async function getById<T>(table: string, id: string): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getBySlug<T>(
  table: string,
  column: string,
  value: string,
  relations?: string
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .select(relations || "*")
    .eq(column, value)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No data returned from query");
  }

  return data as T;
}

export async function create<T>(table: string, payload: T): Promise<void> {
  const { error } = await supabase.from(table).insert(payload);
  if (error) throw error;
}

export async function update<T>(
  table: string,
  id: string,
  payload: Partial<T>
): Promise<void> {
  const { error } = await supabase.from(table).update(payload).eq("id", id);
  if (error) throw error;
}

export async function remove(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
