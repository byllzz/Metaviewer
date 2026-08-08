import { NextRequest, NextResponse } from "next/server";
import { extractMeta, FetchError } from "@/lib/extract";
import { analyze } from "@/lib/analyzer";
import { generateId, saveResult } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json({ error: "Please provide a URL to analyze." }, { status: 400 });
  }

  try {
    const meta = await extractMeta(url);
    const id = generateId();
    const result = analyze(meta, id);
    saveResult(result);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof FetchError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    if (err instanceof TypeError) {
      return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong analyzing that URL. Please try again." },
      { status: 500 }
    );
  }
}
