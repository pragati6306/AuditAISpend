import { PRICING } from "./pricing";

export type ToolEntry = {
  tool: string;
  plan: string;
  monthlyCost: number;
  seats: number;
};

export type Recommendation = {
  tool: string;
  currentPlan: string;
  currentCost: number;
  suggestion: string | null;
  suggestedCost: number;
  savings: number;
  reason: string;
  severity: "high" | "medium" | "ok";
};

export function analyzeSpend(
  tools: ToolEntry[],
  teamSize: number,
  useCase: string
): {
  recommendations: Recommendation[];
  totalSavings: number;
  totalCurrent: number;
} {
  const recommendations: Recommendation[] = [];
  let totalSavings = 0;
  const totalCurrent = tools.reduce((s, t) => s + t.monthlyCost, 0);

  for (const row of tools) {
    let suggestion: string | null = null;
    let savingsAmt = 0;
    let reason = "";
    let severity: Recommendation["severity"] = "ok";

    if (row.tool === "chatgpt") {
      if (row.plan === "team" && row.seats <= 2) {
        suggestion = "ChatGPT Plus ($20/seat)";
        savingsAmt = row.seats * (30 - 20);
        reason = `Team plan requires minimum 2 seats but adds little value at small scale.`;
        severity = "high";
      } else if (row.plan === "enterprise" && teamSize < 50) {
        suggestion = "ChatGPT Team";
        savingsAmt = row.seats * (60 - 30);
        reason =
          "Enterprise plan is designed for 150+ seat orgs with compliance needs.";
        severity = "high";
      }
    }

    if (row.tool === "cursor") {
      if (useCase === "coding" && row.seats >= 3) {
        const copilotCost = 19 * row.seats;
        savingsAmt = row.monthlyCost - copilotCost;
        suggestion = `GitHub Copilot Business ($${copilotCost}/mo)`;
        reason =
          "Copilot integrates natively with VS Code and covers most coding needs at lower cost.";
        severity = savingsAmt > 50 ? "high" : "medium";
      } else if (row.plan === "business" && row.seats <= 2) {
        savingsAmt = row.seats * (40 - 20);
        suggestion = "Cursor Pro ($20/seat)";
        reason = "Business plan features (SSO, audit logs) only matter at scale.";
        severity = "medium";
      }
    }

    if (row.tool === "claude" && row.plan === "team" && row.seats <= 2) {
      savingsAmt = row.seats * (30 - 20);
      suggestion = "Claude Pro ($20/seat)";
      reason = "Team plan adds admin features not needed below 3 users.";
      severity = "medium";
    }

    if (
      row.tool === "github-copilot" &&
      row.plan === "enterprise" &&
      teamSize < 100
    ) {
      savingsAmt = row.seats * (39 - 19);
      suggestion = "Copilot Business ($19/seat)";
      reason =
        "Enterprise features (policies, audit logs) require 100+ seats to justify.";
      severity = "high";
    }

    if (
      (row.tool === "anthropic-api" || row.tool === "openai-api") &&
      row.monthlyCost > 500
    ) {
      savingsAmt = Math.round(row.monthlyCost * 0.2);
      suggestion = "Credex discounted credits (save 20%)";
      reason =
        "You're paying retail API rates. Volume-discounted credits available via Credex.";
      severity = "high";
    }

    totalSavings += Math.max(0, savingsAmt);
    recommendations.push({
      tool: row.tool,
      currentPlan: row.plan,
      currentCost: row.monthlyCost,
      suggestion,
      suggestedCost: row.monthlyCost - Math.max(0, savingsAmt),
      savings: Math.max(0, savingsAmt),
      reason,
      severity: savingsAmt > 0 ? severity : "ok",
    });
  }

  return { recommendations, totalSavings, totalCurrent };
}
