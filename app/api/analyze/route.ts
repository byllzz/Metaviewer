import { NextRequest, NextResponse } from "next/server";
import { extractMeta, FetchError } from "@/lib/extract";
import { analyze } from "@/lib/analyzer";
import { generateId } from "@/lib/id";

// This route only fetches + parses + scores a URL server-side (required to
// avoid browser CORS restrictions when reading another site's HTML). It does
// NOT persist anything - the client is responsible for storing the result
// (see lib/localHistory.ts, which uses localStorage today and can be swapped
// for Supabase later without changing this route).
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
