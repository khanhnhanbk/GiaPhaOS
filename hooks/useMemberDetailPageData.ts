import { Person } from "@/types";
import { getMemberPageData } from "@/services/membersService";

export interface MemberDetailPageData {
  person: Person | null;
  privateData: Record<string, unknown> | null;
  isAdmin: boolean;
  canEdit: boolean;
}

export interface EditMemberPageData {
  person: Person | null;
  initialData: Person | undefined;
  isAdmin: boolean;
  isEditor: boolean;
}

export async function useMemberDetailPageData(
  paramsPromise: Promise<{ id: string }>,
): Promise<MemberDetailPageData> {
  const { id } = await paramsPromise;
  const { person, privateData, profile } = await getMemberPageData(id);

  const isAdmin = profile?.role === "admin";
  const canEdit = isAdmin || profile?.role === "editor";

  return {
    person,
    privateData: privateData as Record<string, unknown> | null,
    isAdmin,
    canEdit,
  };
}

export async function useEditMemberPageData(
  paramsPromise: Promise<{ id: string }>,
): Promise<EditMemberPageData> {
  const { id } = await paramsPromise;
  const { person, privateData, profile } = await getMemberPageData(id);

  const isAdmin = profile?.role === "admin";
  const isEditor = profile?.role === "editor";
  const initialData = person
    ? isAdmin
      ? { ...person, ...(privateData ?? {}) }
      : person
    : undefined;

  return {
    person,
    initialData,
    isAdmin,
    isEditor,
  };
}
