export type Plan = {
  label: string;
  costPerSeat: number;
  minSeats?: number;
};

export type ToolPricing = {
  [plan: string]: Plan;
};

export const PRICING: Record<string, ToolPricing> = {
  chatgpt: {
    plus:       { label: "ChatGPT Plus",       costPerSeat: 20 },
    team:       { label: "ChatGPT Team",       costPerSeat: 30, minSeats: 2 },
    enterprise: { label: "ChatGPT Enterprise", costPerSeat: 60, minSeats: 150 },
  },
  claude: {
    pro:  { label: "Claude Pro",  costPerSeat: 20 },
    team: { label: "Claude Team", costPerSeat: 30, minSeats: 5 },
  },
  "github-copilot": {
    individual: { label: "Copilot Individual", costPerSeat: 10 },
    business:   { label: "Copilot Business",   costPerSeat: 19 },
    enterprise: { label: "Copilot Enterprise", costPerSeat: 39 },
  },
  cursor: {
    pro:      { label: "Cursor Pro",      costPerSeat: 20 },
    business: { label: "Cursor Business", costPerSeat: 40 },
  },
  windsurf: {
    pro:  { label: "Windsurf Pro",  costPerSeat: 15 },
    team: { label: "Windsurf Team", costPerSeat: 30 },
  },
  gemini: {
    individual: { label: "Gemini Advanced",  costPerSeat: 20 },
    business:   { label: "Gemini Business",  costPerSeat: 30 },
  },
  "anthropic-api": { payg: { label: "Anthropic API",  costPerSeat: 0 } },
  "openai-api":    { payg: { label: "OpenAI API",     costPerSeat: 0 } },
};
