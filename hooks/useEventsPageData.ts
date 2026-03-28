import { Person, CustomEvent } from "@/types";
import { getPersonAndCustomEvents } from "@/services/membersService";

export interface EventsPageData {
  persons: Person[];
  customEvents: CustomEvent[];
}

export async function useEventsPageData(): Promise<EventsPageData> {
  return getPersonAndCustomEvents();
}
