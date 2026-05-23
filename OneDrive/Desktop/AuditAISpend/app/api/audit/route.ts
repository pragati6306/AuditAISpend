import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import type { ToolEntry, Recommendation } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const body: {
      email: string;
      company: string;
      role: string;
      tools: ToolEntry[];
      teamSize: number;
      useCase: string;
      totalSavings: number;
      recommendations: Recommendation[];
      summary: string;
    } = await req.json();

    const id = nanoid(8);

    const { error } = await supabase.from("audits").insert({
      id,
      email: body.email,
      company: body.company,
      role: body.role,
      tools: body.tools,
      team_size: body.teamSize,
      use_case: body.useCase,
      total_savings: body.totalSavings,
      recommendations: body.recommendations,
      summary: body.summary,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return Response.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return Response.json({ id, url: `/audit/${id}` });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to save audit: ${errorMessage}` },
      { status: 500 }
    );
  }
}
