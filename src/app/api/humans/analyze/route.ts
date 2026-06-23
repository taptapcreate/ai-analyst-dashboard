import { NextResponse } from "next/server";
import { analyzeHuman } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, profile } = body;
    
    if (!image || !profile) {
      return NextResponse.json({ error: "Image and profile are required" }, { status: 400 });
    }

    const result = await analyzeHuman(image, profile);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
