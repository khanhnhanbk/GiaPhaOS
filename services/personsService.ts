import { Person, PersonDetailsPrivate } from "@/types";
import { getProfile, getServerSupabase } from "@/services/authService";
import {
  getPersonById,
  getPersonDetailsPrivateById,
} from "@/repositories/membersRepository";

export async function getPersonOptions(): Promise<Person[]> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("persons")
    .select("id, full_name, birth_year, gender, avatar_url, generation")
    .order("birth_year", { ascending: true, nullsFirst: false });

  return (data as Person[]) ?? [];
}

export async function getMemberDetailById(
  memberId: string,
): Promise<{ person: Person | null; privateData: PersonDetailsPrivate | null }> {
  const [person, profile] = await Promise.all([
    getPersonById(memberId),
    getProfile(),
  ]);

  if (!person) {
    return { person: null, privateData: null };
  }

  let privateData: PersonDetailsPrivate | null = null;
  if (profile?.role === "admin") {
    privateData = await getPersonDetailsPrivateById(memberId);
  }

  return { person, privateData };
}
