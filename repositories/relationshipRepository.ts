import { createClient } from "@/utils/supabase/client";
import { Person, RelationshipType } from "@/types";

export async function getRelationshipsForPerson(personId: string) {
  const supabase = createClient();

  const [{ data: relsA, error: errA }, { data: relsB, error: errB }] = await Promise.all([
    supabase
      .from("relationships")
      .select(`*, target:persons!person_b(*)`)
      .eq("person_a", personId),
    supabase
      .from("relationships")
      .select(`*, target:persons!person_a(*)`)
      .eq("person_b", personId),
  ]);

  if (errA || errB) {
    throw errA || errB;
  }

  return {
    relsA: relsA ?? [],
    relsB: relsB ?? [],
  };
}

export async function getChildrenMarriageRelationships(childrenIds: string[]) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("relationships")
    .select(`*, person_a_data:persons!person_a(*), person_b_data:persons!person_b(*)`)
    .eq("type", "marriage")
    .or(`person_a.in.(${childrenIds.join(",")}),person_b.in.(${childrenIds.join(",")})`);

  if (error) {
    throw error;
  }

  return (data ?? []) as any[];
}

export async function searchPersons(query: string, excludeId: string, limit = 5) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .ilike("full_name", `%${query}%"`)
    .neq("id", excludeId)
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as Person[]) ?? [];
}

export async function getRecentPersons(excludeId: string, limit = 10) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as Person[]) ?? [];
}

export async function insertRelationship(
  personA: string,
  personB: string,
  type: RelationshipType,
  note: string | null,
) {
  const supabase = createClient();
  const { error } = await supabase.from("relationships").insert({
    person_a: personA,
    person_b: personB,
    type,
    note,
  });

  if (error) {
    throw error;
  }
}

export async function getPersonGenerationAndInLaw(personId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("persons")
    .select("generation, is_in_law")
    .eq("id", personId)
    .single();

  if (error) {
    throw error;
  }

  return data as { generation: number | null; is_in_law: boolean | null } | null;
}

export async function updatePersonFields(
  personId: string,
  updates: Partial<{
    generation: number | null;
    is_in_law: boolean;
  }>,
) {
  const supabase = createClient();
  const { error } = await supabase.from("persons").update(updates).eq("id", personId);
  if (error) {
    throw error;
  }
}

export async function insertPerson(personPayload: Partial<Person>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("persons")
    .insert(personPayload)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data as { id: string };
}

export async function deleteRelationship(relId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("relationships").delete().eq("id", relId);
  if (error) {
    throw error;
  }
}
