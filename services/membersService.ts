import { getProfile } from "@/utils/supabase/queries";
import {
  MembersPageData,
  Person,
  PersonDetailsPrivate,
  Profile,
  Relationship,
  CustomEvent,
} from "@/types";
import {
  getAllPersons,
  getAllRelationships,
  getAllCustomEvents,
  getPersonById,
  getPersonDetailsPrivateById,
} from "@/repositories/membersRepository";

export async function getMembersPageData(): Promise<MembersPageData> {
  const [persons, relationships, profile] = await Promise.all([
    getAllPersons(),
    getAllRelationships(),
    getProfile(),
  ]);

  return { persons, relationships, profile };
}

export async function getPersonAndRelationships(): Promise<{
  persons: Person[];
  relationships: Relationship[];
}> {
  const [persons, relationships] = await Promise.all([
    getAllPersons(),
    getAllRelationships(),
  ]);

  return { persons, relationships };
}

export async function getPersonAndCustomEvents(): Promise<{
  persons: Person[];
  customEvents: CustomEvent[];
}> {
  const [persons, customEvents] = await Promise.all([
    getAllPersons(),
    getAllCustomEvents(),
  ]);

  return { persons, customEvents };
}

export async function getKinshipPageData(): Promise<{
  persons: Person[];
  relationships: Relationship[];
}> {
  const [persons, relationships] = await Promise.all([
    getAllPersons(),
    getAllRelationships(),
  ]);

  return { persons, relationships };
}

export async function getMemberPageData(
  memberId: string,
): Promise<{
  person: Person | null;
  privateData: PersonDetailsPrivate | null;
  profile: Profile | null;
}> {
  const [person, profile] = await Promise.all([
    getPersonById(memberId),
    getProfile(),
  ]);

  let privateData: PersonDetailsPrivate | null = null;
  if (profile?.role === "admin" && person) {
    privateData = await getPersonDetailsPrivateById(memberId);
  }

  return {
    person,
    privateData,
    profile,
  };
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
