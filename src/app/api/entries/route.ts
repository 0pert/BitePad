import { NextResponse } from "next/server";
import { loadEntries } from "@/lib/content/loadEntries";
import { saveEntry } from "@/lib/content/saveEntry";

export async function GET() {
  const entries = await loadEntries();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = await saveEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create entry" },
      { status: 400 }
    );
  }
}