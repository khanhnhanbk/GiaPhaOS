import { MembersPageData } from "@/types";
import { ViewMode } from "@/components/ViewToggle";
import {
  canEditProfile,
  getMembersPageData,
  selectDefaultRootId,
} from "@/services/membersService";

export interface MembersPageDataWithView extends Omit<MembersPageData, "profile"> {
  canEdit: boolean;
  initialView?: ViewMode;
  initialShowAvatar: boolean;
  initialRootId: string | null;
}

export async function useMembersPageData(
  searchParamsPromise: Promise<{
    view?: string;
    rootId?: string;
    avatar?: string;
  }>,
): Promise<MembersPageDataWithView> {
  const searchParams = await searchParamsPromise;
  const { view, rootId, avatar } = searchParams;

  const initialView = view as ViewMode | undefined;
  const initialShowAvatar = avatar !== "hide";

  const { persons, relationships, profile } = await getMembersPageData();
  const initialRootId = selectDefaultRootId(persons, relationships, rootId);
  const canEdit = canEditProfile(profile);

  return {
    persons,
    relationships,
    canEdit,
    initialView,
    initialShowAvatar,
    initialRootId,
  };
}
