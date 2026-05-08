# TalentHub Frontend

Frontend for the TalentHub platform.

## Quick start

```bash
npm install
cp .env.example .env   # fill in VITE_API_BASE_URL
npm run dev            # http://localhost:5173
```

## Scripts

| Command                | Purpose                      |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Vite dev server on port 5173 |
| `npm run build`        | Production build to `dist/`  |
| `npm run preview`      | Serve `dist/` locally        |
| `npm run lint`         | ESLint                       |
| `npm run lint:fix`     | ESLint with auto-fix         |
| `npm run format`       | Prettier write               |
| `npm run format:check` | Prettier check (CI-safe)     |
| `npm run test:e2e`     | Playwright e2e tests         |
| `npm run test:e2e:ui`  | Playwright in UI mode        |

## Stack

Vite 7 · React 19 · Tailwind v4 · React Router v6 · Redux Toolkit · axios · react-hook-form + zod · Playwright

## Conventions

See [`CLAUDE.md`](CLAUDE.md) for engineering rules and [`wiki/INDEX.md`](wiki/INDEX.md) for the codebase knowledge base.

## MCP

`.mcp.json` configures Playwright + Figma MCP servers for Claude Code sessions. See [`CLAUDE.md`](CLAUDE.md) §7.
