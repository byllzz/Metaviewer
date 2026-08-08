import { NextRequest, NextResponse } from "next/server";
import { getResult } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = getResult(params.id);
  if (!result) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }
  return NextResponse.json(result, { status: 200 });
}
