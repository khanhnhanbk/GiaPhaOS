import { NextResponse } from "next/server";
import { getPersonOptions } from "@/services/personsService";

export async function GET() {
  const persons = await getPersonOptions();
  return NextResponse.json(persons);
}
