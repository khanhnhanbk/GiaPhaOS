import { Person, Relationship } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";

export async function getAllPersons(): Promise<Person[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("persons")
    .select("*")
    .order("birth_year", { ascending: true, nullsFirst: false });

  return (data as Person[]) ?? [];
}

export async function getAllRelationships(): Promise<Relationship[]> {
  const supabase = await getSupabase();
  const { data } = await supabase.from("relationships").select("*");
  return (data as Relationship[]) ?? [];
}
