import { Person, Relationship } from "@/types";
import { getPersonAndRelationships } from "@/services/membersService";

export interface LineagePageData {
  persons: Person[];
  relationships: Relationship[];
}

export async function useLineagePageData(): Promise<LineagePageData> {
  return getPersonAndRelationships();
}
