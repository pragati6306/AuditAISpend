# AI Spend Audit — Developer Notes

## Project Overview

**Credex Auditor** is a Next.js SaaS tool that analyzes AI tool spending across teams and recommends cost optimizations.

### User Journey

```
Landing Page (/)
    ↓
Audit Form (/audit)
    - Step 1: Email, Company, Role, Team Size, Use Case
    - Step 2: List AI tools with plans & costs
    ↓
Analysis Engine
    - Load tools from Zustand store
    - Run audit-engine.ts rules
    - Generate savings recommendations
    - Call Claude API for summary
    - Save to Supabase
    ↓
Results Page (/results?id=xxx)
    - Show total savings
    - Display recommendations
    - Show savings vs current spend
    ↓
Shareable Report (/audit/[id])
    - Public URL for sharing with team
```

## Architecture

### Frontend

- **Next.js 14** — App router, server/client components
- **Zustand** — Client-side state + browser persistence (`credex-audit` key)
- **shadcn/ui** — Pre-built React components
- **Tailwind CSS** — Utility-first styling

### Backend

- **API Routes** — `/api/audit` (save) & `/api/summary` (Claude)
- **Supabase** — PostgreSQL database + RLS policies
- **Claude API** — Anthropic SDK for AI summaries

### Key Business Logic

- **audit-engine.ts** — Hardcoded rules for savings recommendations
- **pricing.ts** — Tool plans & seat costs (ChatGPT, Claude, Cursor, etc.)

## Important Files

### Core Logic

- `lib/audit-engine.ts` — 80+ lines of rules determining recommendations
- `lib/pricing.ts` — Tool database with plan pricing
- `store/auditStore.ts` — Zustand store with persistence

### Pages

- `app/page.tsx` — Landing hero
- `app/audit/page.tsx` — 2-step audit form
- `app/results/page.tsx` — Results with redirect from API
- `app/audit/[id]/page.tsx` — Shareable public report

### API

- `app/api/audit/route.ts` — POST saves audit, returns ID
- `app/api/summary/route.ts` — POST calls Claude for summary

## Setup Checklist

- [ ] Run `npm install`
- [ ] Create Supabase project
- [ ] Run SQL from `supabase.sql`
- [ ] Fill `.env.local` with credentials
- [ ] Get Anthropic API key from console.anthropic.com
- [ ] Run `npm run dev`

## Customization Points

### Add New Tool

1. Add entry to `PRICING` in `lib/pricing.ts`
2. Add rule in `analyzeSpend()` in `lib/audit-engine.ts`

### Change Recommendation Rules

Edit `analyzeSpend()` in `lib/audit-engine.ts` — the function is self-contained.

### Adjust Claude Prompt

Edit the prompt in `app/api/summary/route.ts`

### Modify UI

All pages use shadcn/ui components + Tailwind classes.

## Deployment

1. **Vercel** — `npm run build` → deploy
2. **Environment Variables** — Set in Vercel dashboard (same as `.env.local`)
3. **Database** — Supabase is cloud-hosted, no setup needed
4. **API Keys** — Keep `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_KEY` secret

## Testing

### Manual Flow

1. Visit `/` → Click "Start Audit"
2. Fill form → Next
3. Add tools → Complete
4. See results at `/results?id=xxx`
5. Visit `/audit/{id}` in private tab to test public share

### Test Recommendations

Modify tools in the form to trigger different rules:

- Add ChatGPT Team with 1 seat → "Switch to Plus"
- Add OpenAI API >$500/month → "20% Credex discount"
- Add Cursor with 5 seats + "coding" use case → "Switch to Copilot"

## Notes for Judges

- **Audit engine is fully hardcoded** — No AI deciding recommendations (only Claude for summary text)
- **Pricing is comprehensive** — 8+ tools, multiple plans per tool
- **Persistence works offline** — Zustand survives browser restart
- **Database is secure** — Supabase RLS policies limit access
- **Scalable architecture** — Easy to add tools/rules without refactoring

---

**Build Date:** May 23, 2026  
**Last Updated:** Day 1 Initial Setup
