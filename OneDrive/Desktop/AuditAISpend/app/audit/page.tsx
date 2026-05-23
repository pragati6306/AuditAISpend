"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditStore } from "@/store/auditStore";
import { analyzeSpend } from "@/lib/audit-engine";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { PRICING } from "@/lib/pricing";

const TOOLS = Object.keys(PRICING);

export default function AuditPage() {
  const router = useRouter();
  const store = useAuditStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (step === 1) {
      if (!store.email || !store.company || !store.role) {
        setError("Please fill in all fields");
        return;
      }
      setStep(2);
      setError("");
    } else {
      if (store.tools.length === 0) {
        setError("Please add at least one tool");
        return;
      }
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const { recommendations, totalSavings } = analyzeSpend(
        store.tools,
        store.teamSize,
        store.useCase
      );

      // Get AI summary
      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendations,
          teamSize: store.teamSize,
          useCase: store.useCase,
          totalSavings,
        }),
      });

      const { summary } = await summaryRes.json();

      // Save to Supabase
      const auditRes = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: store.email,
          company: store.company,
          role: store.role,
          tools: store.tools,
          teamSize: store.teamSize,
          useCase: store.useCase,
          totalSavings,
          recommendations,
          summary,
        }),
      });

      const { id } = await auditRes.json();
      router.push(`/results?id=${id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete audit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">AI Spend Audit</h1>
          <p className="text-slate-400">
            Step {step} of 2 • Let's analyze your AI spend
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {step === 1 ? "Your Information" : "Your AI Tools"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Help us understand your organization"
                : "List the AI tools your team uses"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={store.email}
                    onChange={(e) => store.setEmail(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Company Name</Label>
                  <Input
                    placeholder="Acme Corp"
                    value={store.company}
                    onChange={(e) => store.setCompany(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Your Role</Label>
                  <Select value={store.role} onValueChange={store.setRole}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">Founder / CEO</SelectItem>
                      <SelectItem value="cto">CTO / VP Engineering</SelectItem>
                      <SelectItem value="finance">Finance / Operations</SelectItem>
                      <SelectItem value="manager">Team Lead / Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Team Size</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={store.teamSize}
                    onChange={(e) =>
                      store.setTeamSize(parseInt(e.target.value) || 1)
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Primary Use Case</Label>
                  <Select value={store.useCase} onValueChange={store.setUseCase}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coding">Coding / Development</SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                      <SelectItem value="analysis">Data Analysis</SelectItem>
                      <SelectItem value="mixed">Mixed / General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {store.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Select
                            value={tool.tool}
                            onValueChange={(val) =>
                              store.updateTool(tool.id, { tool: val })
                            }
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOOLS.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={tool.plan}
                            onValueChange={(val) =>
                              store.updateTool(tool.id, { plan: val })
                            }
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PRICING[tool.tool]
                                ? Object.keys(PRICING[tool.tool]).map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {PRICING[tool.tool][p].label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-slate-400">
                              Monthly Cost
                            </label>
                            <Input
                              type="number"
                              min="0"
                              value={tool.monthlyCost}
                              onChange={(e) =>
                                store.updateTool(tool.id, {
                                  monthlyCost: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="bg-slate-700 border-slate-600 text-white h-8"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-slate-400">
                              Seats
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={tool.seats}
                              onChange={(e) =>
                                store.updateTool(tool.id, {
                                  seats: parseInt(e.target.value) || 1,
                                })
                              }
                              className="bg-slate-700 border-slate-600 text-white h-8"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => store.removeTool(tool.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => store.addTool()}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={step === 1 || loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : step === 1 ? (
                  "Next"
                ) : (
                  "Complete Audit"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
