import { SupabaseClient } from "@supabase/supabase-js";
import { Person, Relationship, PersonDetailsPrivate, CustomEvent } from "@/types";

export async function getAllPersons(
  supabase: SupabaseClient,
): Promise<Person[]> {
  const { data } = await supabase
    .from("persons")
    .select(
      "id, full_name, gender, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased, is_in_law, birth_order, generation, other_names, avatar_url, note, created_at, updated_at",
    )
    .order("created_at", { ascending: true });

  return (data as Person[]) ?? [];
}

export async function getAllRelationships(
  supabase: SupabaseClient,
): Promise<Relationship[]> {
  const { data } = await supabase
    .from("relationships")
    .select("id, type, person_a, person_b, note, created_at, updated_at")
    .order("created_at", { ascending: true });

  return (data as Relationship[]) ?? [];
}

export async function getAllPrivateDetails(
  supabase: SupabaseClient,
): Promise<PersonDetailsPrivate[]> {
  const { data } = await supabase
    .from("person_details_private")
    .select("person_id, phone_number, occupation, current_residence");

  return (data as PersonDetailsPrivate[]) ?? [];
}

export async function getAllCustomEvents(
  supabase: SupabaseClient,
): Promise<CustomEvent[]> {
  const { data } = await supabase
    .from("custom_events")
    .select("id, name, content, event_date, location, created_by")
    .order("event_date", { ascending: true });

  return (data as CustomEvent[]) ?? [];
}

export async function deleteAllCustomEvents(
  supabase: SupabaseClient,
) {
  return supabase
    .from("custom_events")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function deleteAllRelationships(supabase: SupabaseClient) {
  return supabase
    .from("relationships")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function deleteAllPrivateDetails(supabase: SupabaseClient) {
  return supabase
    .from("person_details_private")
    .delete()
    .neq("person_id", "00000000-0000-0000-0000-000000000000");
}

export async function deleteAllPersons(supabase: SupabaseClient) {
  return supabase
    .from("persons")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function insertPersons(
  supabase: SupabaseClient,
  rows: Partial<Person>[],
) {
  return supabase.from("persons").insert(rows);
}

export async function insertRelationships(
  supabase: SupabaseClient,
  rows: Partial<Relationship>[],
) {
  return supabase.from("relationships").insert(rows);
}

export async function insertPrivateDetails(
  supabase: SupabaseClient,
  rows: Partial<PersonDetailsPrivate>[],
) {
  return supabase.from("person_details_private").insert(rows);
}

export async function insertCustomEvents(
  supabase: SupabaseClient,
  rows: Partial<CustomEvent>[],
) {
  return supabase.from("custom_events").insert(rows);
}
