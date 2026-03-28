import { SupabaseClient } from "@supabase/supabase-js";

export async function hasPersonRelationships(
  supabase: SupabaseClient,
  personId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("relationships")
    .select("id")
    .or(`person_a.eq.${personId},person_b.eq.${personId}`)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data && data.length > 0);
}

export async function deletePersonById(
  supabase: SupabaseClient,
  personId: string,
) {
  const { error } = await supabase.from("persons").delete().eq("id", personId);
  return error;
}
