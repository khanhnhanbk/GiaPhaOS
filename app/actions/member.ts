"use server";

import { deleteMemberProfile as deleteMemberProfileService } from "@/services/memberService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteMemberProfile(memberId: string) {
  const result = await deleteMemberProfileService(memberId);
  if (result?.error) {
    return result;
  }

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}
