"use server";

import { exportData as exportBackupData, importData as importBackupData } from "@/services/dataService";
import { revalidatePath } from "next/cache";

export async function exportData(exportRootId?: string) {
  return exportBackupData(exportRootId);
}

export async function importData(payload: Parameters<typeof importBackupData>[0]) {
  const result = await importBackupData(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/data");
  return result;
}
