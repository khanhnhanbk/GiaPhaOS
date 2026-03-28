import { cache } from "react";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { getProfileById } from "@/repositories/profilesRepository";
import { Profile } from "@/types";

export const getServerSupabase = cache(async (): Promise<SupabaseClient> => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
});

export async function getUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId?: string): Promise<Profile | null> {
  let id = userId;
  if (!id) {
    const user = await getUser();
    if (!user) return null;
    id = user.id;
  }

  const supabase = await getServerSupabase();
  return getProfileById(supabase, id);
}

export async function getIsAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function getIsEditor(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "editor";
}
