# AI Adoption Simulator

A production-ready MVP that helps users discover their AI work style through a 12-question workplace assessment. Built with Next.js 14, Tailwind CSS, and Framer Motion.

---

## Quick Start

```bash
# 1. Clone or copy the project
cd ai-adoption-simulator

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs entirely on localStorage for MVP.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main app — screen orchestration
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── globals.css           # Tailwind + base styles
│   ├── print.css             # Print/PDF styles
│   ├── dashboard/
│   │   └── page.tsx          # Organisation dashboard (/dashboard)
│   └── api/
│       ├── leads/route.ts    # POST /api/leads — lead capture
│       ├── results/route.ts  # GET /api/results — aggregated data
│       └── og/route.tsx      # GET /api/og — dynamic OG images
├── components/
│   ├── LandingScreen.tsx     # Hero + CTA
│   ├── ProgressBar.tsx       # Fixed top progress indicator
│   ├── AssessmentScreen.tsx  # Question cards + navigation
│   ├── LeadCaptureScreen.tsx # Name/email/role form
│   ├── ResultsScreen.v2.tsx  # Full results + share + PDF
│   └── ShareCard.tsx         # Social sharing component
├── config/
│   ├── questions.ts          # 12 questions + answer→profile mapping
│   └── profiles.ts           # 4 profiles with all content + colors
├── hooks/
│   └── useAssessment.v2.ts   # All assessment state + navigation
└── lib/
    ├── scoring.ts            # Pure scoring utilities
    ├── storage.ts            # localStorage persistence
    ├── analytics.ts          # Analytics abstraction layer
    └── export.ts             # PDF/print export utilities
```

---

## The 4 Profiles

| Profile | Theme | Color |
|---------|-------|-------|
| **Explorer** | Curious but early | Blue `#2D5BE3` |
| **Operator** | Active but tactical | Green `#0F6E56` |
| **Overwhelmed** | Interested but overloaded | Amber `#BA7517` |
| **Skeptic** | Resistant or unconvinced | Pink `#993556` |

### Scoring Logic

- Each of 12 questions has 4 answers, one per profile
- Selecting an answer adds **2 points** to that profile
- **Tie-break order**: Overwhelmed → Operator → Explorer → Skeptic

---

## Deployment

### Vercel (recommended)

```bash
# Option A: CLI
npm i -g vercel
vercel

# Option B: Git integration
# Push to GitHub → connect repo at vercel.com/new → auto-deploys
```

### Environment Variables on Vercel

Add these in your Vercel project settings → Environment Variables:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DASHBOARD_API_KEY` | Recommended | Protects `/api/results` |
| `DATABASE_URL` | For persistence | Your DB connection string |
| `MAILCHIMP_API_KEY` | For email | Newsletter integration |
| `NEXT_PUBLIC_POSTHOG_KEY` | For analytics | Event tracking |

See `.env.example` for the full list.

---

## Extension Guide

### 1. Add a database (Supabase)

```bash
npm install @supabase/supabase-js
```

In `src/app/api/leads/route.ts`, uncomment and fill in the Supabase block. The schema:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  role text not null,
  profile text not null,
  scores jsonb not null,
  answers jsonb not null,
  completed_at timestamptz not null,
  org text,
  created_at timestamptz default now()
);
```

### 2. Add email capture (Mailchimp)

```bash
npm install @mailchimp/mailchimp_marketing
```

In `src/app/api/leads/route.ts`:

```typescript
import mailchimp from '@mailchimp/mailchimp_marketing'
mailchimp.setConfig({ apiKey: process.env.MAILCHIMP_API_KEY, server: process.env.MAILCHIMP_SERVER_PREFIX })

await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
  email_address: email,
  status: 'subscribed',
  merge_fields: { FNAME: name, ROLE: role, PROFILE: profile }
})
```

### 3. Add analytics (PostHog)

```bash
npm install posthog-js
```

In `src/app/layout.tsx`:

```typescript
import posthog from 'posthog-js'
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, { api_host: 'https://app.posthog.com' })
```

Then in `src/lib/analytics.ts`, uncomment the PostHog block. Events fired automatically:
- `assessment_started`
- `question_answered` (with questionId + profile)
- `assessment_completed` (with all scores)
- `lead_captured` (with role)
- `result_viewed` (with profile)
- `cta_clicked` (with profile)
- `assessment_restarted`

### 4. Add PDF export (rich formatting)

```bash
npm install jspdf html2canvas
```

In `src/lib/export.ts`, uncomment the jsPDF block in `exportToPDF()`.

Wire up the button in `ResultsScreen.v2.tsx`:

```typescript
import { exportToPDF } from '@/lib/export'
// ...
<button onClick={() => exportToPDF({ profile, scores, name, role, completedAt })}>
  Export PDF
</button>
```

### 5. Add a 5th profile

1. Add to the `ProfileType` union in `config/questions.ts`
2. Add the profile object in `config/profiles.ts`
3. Map relevant question answers to the new profile
4. Update the tie-break order in `lib/scoring.ts`

### 6. White-label / multi-tenant

Add an `org` query param (`/?org=acme`) and:
1. Read it in `page.tsx` and pass to `useAssessment`
2. Store it with leads in the DB
3. Filter by `org` in `GET /api/results`

---

## Adding the Organisation Dashboard

Visit `/dashboard` — it pulls from `GET /api/results`.

To protect it:
```typescript
// In src/app/dashboard/page.tsx, add middleware or an auth check:
import { redirect } from 'next/navigation'
if (!isAuthed) redirect('/login')
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Full-stack, edge-ready |
| Styling | Tailwind CSS | Rapid, consistent |
| Animation | Framer Motion | Smooth, declarative |
| State | React hooks (local) | Zero setup for MVP |
| Persistence | localStorage → API route | Works offline, upgradeable |
| Fonts | DM Sans + DM Serif Display | Modern, editorial feel |
| Deploy | Vercel | Zero-config, edge functions |

---

## Licence

MIT — use freely, extend commercially.
