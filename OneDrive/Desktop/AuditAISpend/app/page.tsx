"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, TrendingDown, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            Credex <span className="text-emerald-400">Auditor</span>
          </div>
          <Link href="/audit">
            <Button variant="outline">Start Audit</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="mb-6 inline-block rounded-lg bg-emerald-500/10 px-4 py-2 text-emerald-400 text-sm font-semibold">
          AI Spend Optimization
        </div>

        <h1 className="mb-6 text-5xl font-bold text-white leading-tight">
          Stop Overspending on AI Tools
        </h1>

        <p className="mb-12 text-xl text-slate-300 max-w-2xl mx-auto">
          Analyze your team's AI subscriptions and discover hidden savings.
          Credex Auditor finds opportunities you're missing.
        </p>

        <Link href="/audit">
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Start Your Free Audit <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
            <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Quick Analysis</h3>
            <p className="text-slate-400">
              Get results in seconds, not hours
            </p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
            <TrendingDown className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Real Savings</h3>
            <p className="text-slate-400">
              Average team saves $300-$500/month
            </p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
            <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Shareable Reports</h3>
            <p className="text-slate-400">
              Share findings with your team instantly
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50 mt-24">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-slate-400 text-sm">
          <p>
            Credex Auditor • Powered by Claude AI • Built for startups that care
            about costs
          </p>
        </div>
      </div>
    </div>
  );
}
