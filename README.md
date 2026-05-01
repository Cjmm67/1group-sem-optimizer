# 1-Group SEM Optimizer

Multi-agent Google Ads analysis and Singapore-policy-aware optimisation co-pilot for 1-Group Singapore.

## Stack

- Next.js 15 (App Router)
- React 18
- Tailwind CSS 3
- Recharts 2
- Lucide React

## Local dev

Requires Node 20+.

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
```

## Deploy

Push to GitHub, import to Vercel. Framework preset: Next.js.

## Architecture (target, Phase 3+)

- `/app/page.jsx` - main React dashboard (the SEM Optimizer)
- `/app/api/gads/*` - Google Ads server-side adapter (Phase 3)
- `/app/api/agents/*` - server-side Anthropic agent calls (Phase 4)
- `/app/api/auth/*` - NextAuth + Google Workspace SSO (Phase 4)

## Status

- v0.1 - Vite scaffold, demo mode (`main` branch)
- v0.2 - Next.js migration (this branch, `next-migration`)
- v1.0 - Live Google Ads MCC integration, NextAuth, audit log (post Google API approval)
