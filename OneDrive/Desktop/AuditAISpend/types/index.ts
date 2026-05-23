export type ToolEntry = {
  id: string;
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

export type Audit = {
  id: string;
  email: string;
  company: string;
  role: string;
  tools: ToolEntry[];
  teamSize: number;
  useCase: string;
  totalSavings: number;
  recommendations: Recommendation[];
  summary: string;
  createdAt: string;
};
