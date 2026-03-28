import { Person, PersonDetailsPrivate } from "@/types";

export async function getMemberDetail(
  memberId: string,
): Promise<{ person: Person | null; privateData: PersonDetailsPrivate | null }> {
  const response = await fetch(`/api/persons/${encodeURIComponent(memberId)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Không thể tải thông tin thành viên.");
  }

  return (await response.json()) as {
    person: Person | null;
    privateData: PersonDetailsPrivate | null;
  };
}
