import { Profile } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfileById(
  supabase: SupabaseClient,
  id: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Profile | null;
}
