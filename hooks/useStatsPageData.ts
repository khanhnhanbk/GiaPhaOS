import { Person, Relationship } from "@/types";
import { getPersonAndRelationships } from "@/services/membersService";

export interface StatsPageData {
  persons: Person[];
  relationships: Relationship[];
}

export async function useStatsPageData(): Promise<StatsPageData> {
  return getPersonAndRelationships();
}
