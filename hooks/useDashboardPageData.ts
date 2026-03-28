import { Person, CustomEvent } from "@/types";
import { getPersonAndCustomEvents } from "@/services/membersService";

export interface DashboardPageData {
  persons: Person[];
  customEvents: CustomEvent[];
}

export async function useDashboardPageData(): Promise<DashboardPageData> {
  return getPersonAndCustomEvents();
}
