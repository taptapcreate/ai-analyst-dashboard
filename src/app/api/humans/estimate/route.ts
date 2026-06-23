import { NextResponse } from "next/server";
import { estimateHumanMetrics } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;
    
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const result = await estimateHumanMetrics(image);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
