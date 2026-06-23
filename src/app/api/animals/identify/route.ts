import { NextResponse } from "next/server";
import { identifyAnimalBreed } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, animalType } = body;
    
    if (!image || !animalType) {
      return NextResponse.json({ error: "Image and animalType are required" }, { status: 400 });
    }

    const result = await identifyAnimalBreed(image, animalType);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
