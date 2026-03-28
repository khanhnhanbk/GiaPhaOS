import { NextRequest, NextResponse } from "next/server";
import { getMemberDetailById } from "@/services/personsService";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const result = await getMemberDetailById(id);

  if (!result.person) {
    return NextResponse.json(
      { error: "Thành viên không tồn tại." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}