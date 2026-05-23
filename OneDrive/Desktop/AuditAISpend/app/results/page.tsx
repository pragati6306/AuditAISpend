"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingDown,
  Share2,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import type { Audit, Recommendation } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAudit = async () => {
      if (!id) {
        setError("No audit ID provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("audits")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError || !data) {
          setError("Audit not found");
          return;
        }

        setAudit({
          id: data.id,
          email: data.email,
          company: data.company,
          role: data.role,
          tools: data.tools,
          teamSize: data.team_size,
          useCase: data.use_case,
          totalSavings: data.total_savings,
          recommendations: data.recommendations,
          summary: data.summary,
          createdAt: data.created_at,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch audit"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 flex items-center justify-center">
        <div className="text-white">Loading audit results...</div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-red-400">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{error || "Audit not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const highSeverityCount = audit.recommendations.filter(
    (r) => r.severity === "high"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Audit Results
              </h1>
              <p className="text-slate-400">
                {audit.company} • {new Date(audit.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
          </div>
        </div>

        {/* Savings Hero */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-700/30 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">
                  Potential Monthly Savings
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-emerald-400">
                    ${audit.totalSavings.toLocaleString()}
                  </span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-emerald-300 text-sm mt-2">
                  ${(audit.totalSavings * 12).toLocaleString()}/year
                </p>
              </div>
              <TrendingDown className="w-16 h-16 text-emerald-500/20" />
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">AI-Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{audit.summary}</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">
              Detailed Recommendations ({audit.recommendations.length})
            </CardTitle>
            {highSeverityCount > 0 && (
              <CardDescription className="text-amber-400">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {highSeverityCount} high-priority recommendation
                {highSeverityCount !== 1 ? "s" : ""}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {audit.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  rec.severity === "high"
                    ? "bg-red-900/10 border-red-700/30"
                    : rec.severity === "medium"
                      ? "bg-amber-900/10 border-amber-700/30"
                      : "bg-slate-700/30 border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white capitalize">
                      {rec.tool} • {rec.currentPlan}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">
                      ${rec.savings}
                    </div>
                    <div className="text-xs text-slate-400">monthly savings</div>
                  </div>
                </div>

                {rec.suggestion && (
                  <div className="mt-3 p-2 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-white">
                        Suggestion:
                      </span>{" "}
                      Switch to {rec.suggestion}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      New cost: ${rec.suggestedCost}/month (from $
                      {rec.currentCost})
                    </p>
                  </div>
                )}

                <div className="mt-2 flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      rec.severity === "high"
                        ? "bg-red-700/30 text-red-300"
                        : rec.severity === "medium"
                          ? "bg-amber-700/30 text-amber-300"
                          : "bg-green-700/30 text-green-300"
                    }`}
                  >
                    {rec.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Current Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                $
                {audit.recommendations
                  .reduce((sum, r) => sum + r.currentCost, 0)
                  .toLocaleString()}
                <span className="text-lg text-slate-400">/month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">
                Optimized Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">
                $
                {audit.recommendations
                  .reduce((sum, r) => sum + r.suggestedCost, 0)
                  .toLocaleString()}
                <span className="text-lg text-slate-400">/month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
