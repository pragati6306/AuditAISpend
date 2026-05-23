# Credex Auditor

Full Next.js AI spend optimization tool.

## Project Structure

```
/app
  /api
    /audit/route.ts       ← Save audit to Supabase
    /summary/route.ts     ← Claude API summary generator
  /audit/page.tsx         ← Form (Step 2)
  /audit/[id]/page.tsx    ← Shareable public report
  /results/page.tsx       ← Results (Step 4)
  page.tsx                ← Landing page
  layout.tsx              ← Root layout

/lib
  audit-engine.ts         ← Core business logic
  pricing.ts              ← Pricing database
  supabase.ts             ← DB client
  utils.ts                ← Utility functions

/store
  auditStore.ts           ← Zustand store with persistence

/components/ui
  button.tsx
  card.tsx
  input.tsx
  label.tsx
  select.tsx

/types
  index.ts                ← Type definitions

/public                   ← Static assets
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

- Go to [supabase.com](https://supabase.com)
- Create a new project
- Run the SQL from `supabase.sql` in the SQL editor
- Get your credentials from project settings

### 3. Configure Environment

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## How It Works

1. **Landing Page** — Hero + CTA
2. **Audit Form** — Step 1: User info | Step 2: Add tools
3. **Analysis** — Zustand processes tools, audit-engine calculates savings
4. **Claude Summary** — API generates personalized insight
5. **Save to Supabase** — Audit persisted with unique ID
6. **Results Page** — Recommendations + metrics
7. **Public Share** — `/audit/{id}` shareable URL

## Key Features

- ✅ Zustand persistence (survives page refresh)
- ✅ 8+ AI tools with plans (ChatGPT, Claude, Cursor, GitHub Copilot, etc.)
- ✅ Hardcoded business logic rules for recommendations
- ✅ Claude API integration for AI-generated summaries
- ✅ Supabase database for audit storage
- ✅ Shareable public reports
- ✅ Responsive Tailwind CSS + shadcn/ui design

## API Routes

- `POST /api/audit` — Save audit + return shareable URL
- `POST /api/summary` — Generate Claude summary

## Types

All types defined in `/types/index.ts`:

- `ToolEntry` — Single tool with plan/cost
- `Recommendation` — Saving opportunity
- `Audit` — Complete audit record

## Deployment

Ready for Vercel:

```bash
npm run build
npm start
```

Set environment variables in Vercel dashboard.

---

Built with Next.js 14 + Tailwind + shadcn/ui + Supabase + Claude AI
