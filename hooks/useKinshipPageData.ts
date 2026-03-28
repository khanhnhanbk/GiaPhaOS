import { Person, Relationship } from "@/types";
import { getKinshipPageData } from "@/services/membersService";

export interface KinshipPageData {
  persons: Person[];
  relationships: Relationship[];
}

export async function useKinshipPageData(): Promise<KinshipPageData> {
  return getKinshipPageData();
}
