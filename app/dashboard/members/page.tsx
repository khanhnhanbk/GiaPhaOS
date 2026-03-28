import { DashboardProvider } from "@/components";
import { DashboardViews } from "@/components";
import { MemberDetailModal } from "@/components";
import { ViewToggle } from "@/components";
import { useMembersPageData } from "@/hooks/useMembersPageData";

interface PageProps {
  searchParams: Promise<{ view?: string; rootId?: string; avatar?: string }>;
}

export default async function FamilyTreePage({ searchParams }: PageProps) {
  const {
    persons,
    relationships,
    canEdit,
    initialView,
    initialRootId,
    initialShowAvatar,
  } = await useMembersPageData(searchParams);

  return (
    <DashboardProvider
      initialView={initialView}
      initialRootId={initialRootId}
      initialShowAvatar={initialShowAvatar}
    >
      <ViewToggle />
      <DashboardViews
        persons={persons}
        relationships={relationships}
        canEdit={canEdit}
      />

      <MemberDetailModal />
    </DashboardProvider>
  );
}
