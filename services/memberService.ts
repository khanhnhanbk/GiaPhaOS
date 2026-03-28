import { getProfile, getServerSupabase } from "@/services/authService";
import {
  deletePersonById,
  hasPersonRelationships,
} from "@/repositories/personsRepository";

export async function deleteMemberProfile(memberId: string) {
  const profile = await getProfile();
  if (profile?.role !== "admin" && profile?.role !== "editor") {
    return {
      error: "Từ chối truy cập. Chỉ Admin hoặc Editor mới có quyền xoá hồ sơ.",
    };
  }

  const supabase = await getServerSupabase();
  const hasRelationships = await hasPersonRelationships(supabase, memberId);

  if (hasRelationships) {
    return {
      error:
        "Không thể xoá. Vui lòng xoá hết các mối quan hệ gia đình của người này trước.",
    };
  }

  const error = await deletePersonById(supabase, memberId);
  if (error) {
    console.error("Error deleting person:", error);
    return { error: "Đã xảy ra lỗi khi xoá hồ sơ." };
  }

  return { success: true };
}
