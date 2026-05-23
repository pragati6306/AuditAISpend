"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ToolEntry = {
  id: string;
  tool: string;
  plan: string;
  monthlyCost: number;
  seats: number;
};

type AuditStore = {
  tools: ToolEntry[];
  teamSize: number;
  useCase: string;
  email: string;
  company: string;
  role: string;
  setTools: (t: ToolEntry[]) => void;
  setTeamSize: (n: number) => void;
  setUseCase: (s: string) => void;
  setEmail: (e: string) => void;
  setCompany: (c: string) => void;
  setRole: (r: string) => void;
  addTool: () => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, updates: Partial<ToolEntry>) => void;
  reset: () => void;
};

const initialState = {
  tools: [
    {
      id: "1",
      tool: "chatgpt",
      plan: "team",
      monthlyCost: 300,
      seats: 5,
    },
    {
      id: "2",
      tool: "cursor",
      plan: "business",
      monthlyCost: 200,
      seats: 5,
    },
  ],
  teamSize: 10,
  useCase: "mixed",
  email: "",
  company: "",
  role: "",
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      ...initialState,
      setTools: (tools) => set({ tools }),
      setTeamSize: (teamSize) => set({ teamSize }),
      setUseCase: (useCase) => set({ useCase }),
      setEmail: (email) => set({ email }),
      setCompany: (company) => set({ company }),
      setRole: (role) => set({ role }),
      addTool: () =>
        set((s) => ({
          tools: [
            ...s.tools,
            {
              id: Date.now().toString(),
              tool: "chatgpt",
              plan: "plus",
              monthlyCost: 20,
              seats: 1,
            },
          ],
        })),
      removeTool: (id) =>
        set((s) => ({
          tools: s.tools.filter((t) => t.id !== id),
        })),
      updateTool: (id, updates) =>
        set((s) => ({
          tools: s.tools.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      reset: () => set(initialState),
    }),
    { name: "credex-audit" }
  )
);
