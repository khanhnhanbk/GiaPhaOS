import {
  deleteRelationship,
  getChildrenMarriageRelationships,
  getPersonGenerationAndInLaw,
  getRelationshipsForPerson,
  getRecentPersons,
  insertPerson,
  insertRelationship,
  searchPersons,
  updatePersonFields,
} from "@/repositories/relationshipRepository";

export async function fetchPersonRelationships(personId: string) {
  return getRelationshipsForPerson(personId);
}

export async function fetchChildrenMarriageRelationships(childrenIds: string[]) {
  return getChildrenMarriageRelationships(childrenIds);
}

export async function searchPersonOptions(
  query: string,
  excludeId: string,
  limit = 5,
) {
  return searchPersons(query, excludeId, limit);
}

export async function fetchRecentPersonOptions(excludeId: string, limit = 10) {
  return getRecentPersons(excludeId, limit);
}

export async function addRelationship(
  personA: string,
  personB: string,
  type: string,
  note: string | null,
) {
  return insertRelationship(personA, personB, type as any, note);
}

export async function getPersonGenerationInfo(personId: string) {
  return getPersonGenerationAndInLaw(personId);
}

export async function updatePersonAttributes(
  personId: string,
  updates: Partial<{ generation: number | null; is_in_law: boolean }>,
) {
  return updatePersonFields(personId, updates);
}

export async function addPerson(personPayload: Partial<any>) {
  return insertPerson(personPayload);
}

export async function removeRelationship(relId: string) {
  return deleteRelationship(relId);
}
