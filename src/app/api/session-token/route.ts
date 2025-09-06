import { NextRequest, NextResponse } from 'next/server';
import { generateSystemPrompt } from '@/lib/promptGenerator';
import carbonaraRecipe from '@/data/recipes/carbonara.json';

export async function POST(request: NextRequest) {
  try {
    // Generate dynamic system prompt from recipe data
    const recipe = carbonaraRecipe[0]; // Get the carbonara recipe
    const systemPrompt = generateSystemPrompt(recipe);

    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: {
          name: "Alex",
          avatarId: "30fa96d0-26c4-4e55-94a0-517025942e18",
          voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
          llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
          systemPrompt: systemPrompt,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Anam API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Failed to create session token:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
