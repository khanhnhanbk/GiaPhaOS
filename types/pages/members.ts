import { Person, Profile, Relationship } from "../entities";

export interface MembersPageData {
  persons: Person[];
  relationships: Relationship[];
  profile: Profile | null;
}
