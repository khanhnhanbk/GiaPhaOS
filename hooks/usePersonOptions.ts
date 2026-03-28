import { Person } from "@/types";

export async function getPersonOptions(): Promise<Person[]> {
  const response = await fetch("/api/persons", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load person options.");
  }

  return (await response.json()) as Person[];
}
