import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy",
});

const DEFAULT_MODEL = "google/gemini-1.5-flash"; // A fast vision-capable model on OpenRouter

export async function estimateHumanMetrics(imageBase64: string) {
  const prompt = `
    Analyze this image of a human and estimate their:
    - Age (years)
    - Weight (kg)
    - Height (cm)

    IMPORTANT: If no human is present, respond with 'ERROR: No human detected'.
    Otherwise, respond ONLY in the following format:
    AGE: [number]
    WEIGHT: [number]
    HEIGHT: [number]
  `;

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    
    if (text.includes("ERROR")) {
      return { error: text };
    }

    let age, weight, height;
    text.split('\n').forEach(line => {
      if (line.includes("AGE:")) age = parseInt(line.replace(/\D/g, ''));
      if (line.includes("WEIGHT:")) weight = parseFloat(line.replace(/[^\d.]/g, ''));
      if (line.includes("HEIGHT:")) height = parseInt(line.replace(/\D/g, ''));
    });

    return { age, weight, height };
  } catch (error: any) {
    console.error("estimateHumanMetrics error:", error);
    return { error: error.message };
  }
}

export async function analyzeHuman(imageBase64: string, profile: { age: number, weight: number, height: number, bmi: number, goal: string }) {
  const prompt = `
    You are a strict Health & Vision Analyst.
    1. VALIDATE: If no human is present, respond ONLY with 'ERROR: No human detected'.
    2. ANALYZE: cross-reference physique with Weight: ${profile.weight}kg, Height: ${profile.height}cm, BMI: ${profile.bmi.toFixed(1)}.
    3. PLAN: Based on GOAL: ${profile.goal}, provide 3 meal tips and 3 exercises.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    return { plan: text };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function identifyAnimalBreed(imageBase64: string, animalType: string) {
  const prompt = `Identify the specific breed or variety of this ${animalType}. Respond ONLY with the name (e.g., Golden Retriever). If unsure, respond 'Unknown'.`;

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    if (text.includes("ERROR")) return { breed: "Unknown" };
    return { breed: text.trim() };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function analyzeAnimal(imageBase64: string, profile: { type: string, breed: string, age: number, weight: number, goal: string }) {
  const prompt = `
    You are a professional Veterinary & Animal Nutrition Analyst.
    1. VALIDATE: If image is NOT an animal (e.g., human, object), respond ONLY with 'ERROR: No ${profile.type} detected'.
    2. ANALYZE: cross-reference appearance with Animal: ${profile.type}, Breed: ${profile.breed}, Age: ${profile.age}, Weight: ${profile.weight}kg.
    3. PLAN: provide 3 meal recommendations and 3 routine/exercise suggestions for the goal: ${profile.goal}.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    return { plan: text };
  } catch (error: any) {
    return { error: error.message };
  }
}
