import Anthropic from "@anthropic-ai/sdk";
import type { Recommendation } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      recommendations,
      teamSize,
      useCase,
      totalSavings,
    }: {
      recommendations: Recommendation[];
      teamSize: number;
      useCase: string;
      totalSavings: number;
    } = await req.json();

    const prompt = `You are a financial advisor for AI tool subscriptions.
A ${useCase}-focused startup with ${teamSize} people currently overspends on AI tools.
Potential savings: $${totalSavings}/month.
Recommendations: ${JSON.stringify(recommendations, null, 2)}

Write a 2-3 sentence personalized summary for their founder/CTO explaining:
1. Their biggest cost driver
2. Top 1-2 actions to take
3. Expected outcome

Be specific, direct, and startup-friendly. No fluff.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return Response.json({ summary: text });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to generate summary: ${errorMessage}` },
      { status: 500 }
    );
  }
}
