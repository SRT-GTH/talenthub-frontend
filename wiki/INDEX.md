# TalentHub Wiki — Index

> Living knowledge base for the TalentHub frontend. Maintained by Claude Code.
> Follows the [Karpathy LLM Wiki Pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): a persistent, compounding artifact with confidence tags.

## Confidence Tags

Every claim in this wiki carries a tag:

| Tag                      | Meaning                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `✅ VERIFIED`            | Confirmed by reading current source code or authoritative docs           |
| `🔶 LIKELY`              | Inferred from code patterns or adjacent evidence, not directly confirmed |
| `❓ NEEDS-CLARIFICATION` | Ambiguous — could go either way, needs human input                       |
| `⚠️ ASSUMPTION`          | Educated guess, may be wrong                                             |
| `🪦 STALE`               | Was true at one point, may no longer be accurate                         |
| `🔗 EXTERNAL`            | Depends on external system (API, Figma, etc.) — verify before acting     |

## Pages

### Architecture

- [architecture.md](architecture.md) — Stack, directory tree, entry points, state conventions (NB: Redux store is unwired scaffold; state lives in route-level contexts)
- [routing.md](routing.md) — Full route map (talent / institution / parent A+B / engagement / avatar), 4 layout shells, auth-CTA helpers
- [api.md](api.md) — axios client, dev proxy, service modules, endpoint table, env vars (login, talent onboarding, institution bulk upload wired to staging)

### Components & Styling

- [components.md](components.md) — Component catalog (grows as components ship)
- [design-tokens.md](design-tokens.md) — Tailwind v4 theme tokens (colors, typography, spacing, radii)

### Workflow

- [debugging-workflow.md](debugging-workflow.md) — Console-log convention + Playwright verification
- [figma-fidelity.md](figma-fidelity.md) — Pixel-perfect implementation rules (`clamp()`, `get_design_context`)
- [pre-commit-workflow.md](pre-commit-workflow.md) — Lint, format, build, husky hooks
- [onboarding-redesign.md](onboarding-redesign.md) — Recruiter onboarding flow (R01-R09, mock), shared responsive `OnboardingPanel`, talent/entry corrections to the 8027 frames, Figma-export asset rule, demo triggers, **open items** (read this first when resuming)
- [responsive-plan.md](responsive-plan.md) — Master plan to make every page responsive down to 320px (audit findings, patterns, phases) — EXECUTED 2026-10-10
- [playful-mode.md](playful-mode.md) — Playful visual theme layer (Career Buddy + talent home): plumbing, rules, ownership, final Figma audit, accepted differences
- [talent-home.md](talent-home.md) — Talent home `/home` (Focused + Playful): state→URL→Figma table, file ownership, status, decisions, a11y
- [talent-my-learning.md](talent-my-learning.md) — Talent My Learning `/learning` (Focused + Playful): frame↔URL table, Figma cache + helper scripts, flow, status, gaps
- [talent-notifications.md](talent-notifications.md) — Talent notifications `/notifications` + bell pop-up + Help overlay: frame→URL table, Focused/Playful diff, known gaps
- [talent-jobs.md](talent-jobs.md) — Talent Job Postings `/job-postings`: lists (matched/browse/saved/applied/empty/loading), frame→URL table, decisions
- [talent-streak.md](talent-streak.md) — Talent Streaks: `/streak` page, 15-day milestone modal, nav streak pop-up states, frame→URL table
- [talent-skills-lab.md](talent-skills-lab.md) — Talent Skills Lab `/skills-lab`: hub, lab details, 8 lab flows, games, dialogs; per-frame checklist with diff %, known gaps
- [talent-assessment.md](talent-assessment.md) — Talent My Assessment `/my-assessment`: overview + states, personality / skill-evidence details, library, full TypeScript assessment flow; per-frame checklist, known gaps
- [talent-community.md](talent-community.md) — Talent Community v2 `/community`: browse, community page (feed / about / members), post + comments, dialogs; replaces the cancelled recruiter-chrome Community
- [talent-messages.md](talent-messages.md) — Talent Messages `/messages`: inbox, requests, job/interview cards, pre-apply, Help me reply, accessibility, languages; 49-frame URL checklist + **recovery list** (what still needs Figma REST)
- [talent-engagement-revamp.md](talent-engagement-revamp.md) — Engagement revamp (manual profile filling, canvas `3125:10352`): 155 screens x 2 styles inventoried, proposed URLs, resume plan. **blocked: no Figma data (rate-limited)**
- [career-buddy-chat-history.md](career-buddy-chat-history.md) — Career Buddy history drawer, thinking states, new chat, settings (21 Oct 2026)
- [talent-wallet.md](talent-wallet.md) — Talent Wallet `/wallet`: 33 screens (phased), frame→URL table with diff % for all five phases, REST-verified provenance, prototype flows, per-style differences
- [landing-site.md](landing-site.md) — New Landing Page: `/` + six inner pages + `/coming-soon`, shared nav/footer/CTA/PageHero, frame→URL table, known gaps

- [talent-emails.md](talent-emails.md) — Talent transactional emails `emails/talent/`: 12 static HTML emails × Playful/Focused (TE-01..TE-12), frame table with diff %, conventions, known gaps

- [talent-community-create.md](talent-community-create.md) — Create your own community `/community/create` + `/community/:id/manage`: 19 frames × 2 styles (CC-02 … CC-17b), URL table, owner lifecycle, known gaps
- [talent-my-circle.md](talent-my-circle.md) — My circle networking `/community?view=circle` + `/community/people/:id`: NW-01 … NW-11 × 2 styles, navigation from the flow section, URL contract, known gaps
- [public-data.md](public-data.md) — Theme 8 public dashboards `/data/*` (Public, Investor & Government audiences): architecture, URL contract, work packages, 107-frame checklist (in progress)
- [agency.md](agency.md) — Theme 11 agency portal `/agency/*` (signed-in MoU analysts, mock session): chrome, URL contract, package ownership, shared components, 114-frame checklist (foundation done, pages in progress)
- [institution.md](institution.md) — Theme 11 institution portal `/institution/*` (signed-in registrars of schools / universities, mock session): chrome, accreditation gate (`?verify=`), URL contract, package ownership, shared components, 87-frame checklist (foundation built, pages are stubs).
- [parent-emails.md](parent-emails.md) — Parent transactional emails `emails/parent/focused/`: 7 static HTML emails (PE-01..PE-07, Focused only), frame table with diff %, known gaps

### External

- [figma-node-map.md](figma-node-map.md) — Figma frame → node-ID mapping (placeholder until file lands)

### Operations

- [log.md](log.md) — Chronological record of wiki updates and notable changes

---

_Last updated: 2026-10-16 (recruiter onboarding + talent/entry corrections; backend wiring for login / talent onboarding / institution; responsive pass executed)_

- [parent-dashboard.md](parent-dashboard.md) — Parent dashboard `/parent/*` (Figma Parents file, canvas 01 Home and dashboard): chrome, 7 home states by `?state=`, files, assumptions
- [admin.md](admin.md) — Theme 7 Platform Admin `/admin/*` (GTH staff back office, 5 roles, mock session): chrome reused from agency, URL contract, frame checklist (95 frames), fidelity notes
- [parent-flags.md](parent-flags.md) — Parent flags and corrections: ward Profile + Flags tabs, flag/re-review dialogs, To review `/parent/review`; frame→URL table with diff %, consolidation candidates, gaps
- [parent-link-ward.md](parent-link-ward.md) — Parent Link a ward `/parent/link-ward` (+ `/parent?modal=ward-linked`): search, no match, request sent, link-code dialogs (entry / error / expired), 100+ children dialog; frame→URL table with diff %, My wards hand-off, consolidation candidates, gaps
- [parent-opt-out.md](parent-opt-out.md) — Parent opt out and restore on `/parent/wards/:id`: opt-out / restore dialogs, the paused ward page, "access is back" toast, report-a-concern dialogs; frame→URL table with diff %, consolidation notes, gaps
- [parent-review.md](parent-review.md) — Parent To review `/parent/review`: five tabs, certificate approve/decline, teacher evaluation, assessment results + flag, all caught up, collapsed sidebar rail (`?rail=collapsed`); 14-frame URL table with diff %, what changed for the Flags session, consolidation candidates, gaps
- [parent-testing-a11y.md](parent-testing-a11y.md) — Parent dashboard Playwright specs (flows, accessibility), the 40 visual baselines and responsive gate, how to run them, the accessibility pass (axe + accessibility tree + keyboard): found, fixed, open (colour contrast, toast timing)
