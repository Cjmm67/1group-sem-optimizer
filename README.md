# 1-Group SEM Optimizer

Multi-agent Google Ads analysis and Singapore-policy-aware optimisation co-pilot for 1-Group Singapore.

## What it is

A single-page React app implementing the `1group-sem-optimizer` skill:

- **8 specialist agents** — Audit, Diagnostic, Research, Strategy, Compliance, Creative, Execution, Reporting
- **6 workflows** — Full Audit, Weekly Review, Anomaly Investigation, Creative Refresh, Quarterly Plan, Compliance Sweep
- **3 access modes** — MCP (Mode 1), Python google-ads (Mode 2), CSV upload (Mode 3)
- **10 chart types** rendered with Recharts
- **Singapore alcohol policy** enforced inline by the Compliance Agent on every creative asset
- **Demo mode** with seeded 1-Arden data including alcohol violations, fatigued ads, and a detectable conversion anomaly

## Local dev (optional)

Requires Node 18+.

```bash
npm install
npm run build
npm run dev
```

## Deploy

Push this folder to GitHub, import to Vercel. Framework preset: Vite.

No env vars are required for demo mode. Users paste an Anthropic API key in the running app if they want live agent calls — otherwise deterministic local fallbacks produce the same output schema.

## Stack

- React 18, Vite 5
- Tailwind CSS 3
- Recharts 2
- Lucide React icons
