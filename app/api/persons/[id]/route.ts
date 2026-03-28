import { NextResponse } from "next/server";
import { getMemberDetailById } from "@/services/personsService";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const memberId = params.id;
  const result = await getMemberDetailById(memberId);

  if (!result.person) {
    return NextResponse.json(
      { error: "Thành viên không tồn tại." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
