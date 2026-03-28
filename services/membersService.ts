import { getProfile } from "@/utils/supabase/queries";
import { MembersPageData, Person, Profile, Relationship } from "@/types";
import { getAllPersons, getAllRelationships } from "@/repositories/membersRepository";

export async function getMembersPageData(): Promise<MembersPageData> {
  const [persons, relationships, profile] = await Promise.all([
    getAllPersons(),
    getAllRelationships(),
    getProfile(),
  ]);

  return { persons, relationships, profile };
}

export function canEditProfile(profile: Profile | null): boolean {
  return profile?.role === "admin" || profile?.role === "editor";
}

export function selectDefaultRootId(
  persons: Person[],
  relationships: Relationship[],
  requestedRootId?: string | null,
): string | null {
  const personMap = new Map(persons.map((person) => [person.id, person]));

  if (requestedRootId && personMap.has(requestedRootId)) {
    return requestedRootId;
  }

  const childIds = new Set(
    relationships
      .filter(
        (relationship) =>
          relationship.type === "biological_child" ||
          relationship.type === "adopted_child",
      )
      .map((relationship) => relationship.person_b),
  );

  const rootsFallback = persons.filter((person) => !childIds.has(person.id));

  if (rootsFallback.length > 0) {
    return rootsFallback[0].id;
  }

  return persons.length > 0 ? persons[0].id : null;
}
