import { Person, Relationship, PersonDetailsPrivate, CustomEvent } from "@/types";
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

export async function getPersonById(personId: string): Promise<Person | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .eq("id", personId)
    .single();

  if (error) {
    return null;
  }

  return data as Person | null;
}

export async function getPersonDetailsPrivateById(
  personId: string,
): Promise<PersonDetailsPrivate | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("person_details_private")
    .select("*")
    .eq("person_id", personId)
    .single();

  if (error) {
    return null;
  }

  return data as PersonDetailsPrivate | null;
}

export async function getAllCustomEvents(): Promise<CustomEvent[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("custom_events")
    .select("id, name, content, event_date, location, created_by")
    .order("event_date", { ascending: true });

  return (data as CustomEvent[]) ?? [];
}
