# Career Buddy Chat Shell + Talent Profile Panel — Design Spec

> Status: Approved by user 2026-07-20. First build slice of the "AI Engagement" flow.
> Figma source: file `Bin8roWL8sloyc36IgFMuT`, node range `4830:169704`–`4830:194488` (12 frames — see `wiki/figma-node-map.md` once populated for the full per-node breakdown).

## 1. What this is

A new full-page, two-column screen where a talent builds their profile through a scripted conversational UI ("Career Buddy") instead of (or alongside) the manual profileFilling wizard (Interests/Skills Intro+Stage2 already shipped). This is the frontend implementation of Engagement Epic 2.3.1 (US-2.3.1-02 multi-modal profile entry — "chat" mode) and Epic 2.3.9 (Career Buddy Chat), scoped down to a backend-free, scripted-demo slice since `careerBuddy.service.js` does not exist yet.

**Explicitly out of scope for this slice** (deferred to follow-up tasks, tracked so nothing is silently dropped):

- The right panel's "+" expand/edit cards (Modify/Confirm per-section detail — will reuse the field data documented in `wiki/figma-node-map.md` once recorded from node `4830:169848`).
- The Personality "Game Store" (7 games) and MCQ assessment sub-flows.
- Real persistence (localStorage/backend) of chat/profile state — everything lives in local component state and resets on reload.
- Toast wiring for `Error, No internet connection` / `Warning, Unsaved changes` (nothing real to fail against yet).
- The parent-viewing-ward variant ("My Profile / [Ward]'s Profile" tabs, Figma node `4830:194488`).

## 2. Route & files

| Path                            | File                                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/profile/filling/career-buddy` | `src/pages/profileFilling/CareerBuddyPage.jsx` (thin wrapper)                                      |
| —                               | `src/components/sections/profileFilling/CareerBuddySection.jsx` (page composition + state machine) |
| —                               | `src/components/sections/profileFilling/careerBuddyScript.js` (canned conversation data)           |
| —                               | `src/components/sections/profileFilling/TalentProfilePanel.jsx` (right-panel checklist)            |
| —                               | `src/components/ui/ChatThread.jsx` (new reusable chat primitive)                                   |

Route registered in `src/App.jsx` alongside the existing `/profile/filling/*` routes.

## 3. Header/chrome

Reuse `EngagementTopNav` (`bgClass="bg-neutral"`, `showSwitchModes={false}`) for logo/Save&Exit/help/user-chip, matching the rest of profileFilling. No `EngagementTopBar` stage trail (this screen isn't a single stage). Add a status line reproducing Figma's `· X% profile complete · auto-saved` copy, where X = average `completionPct` across all `PROFILE_STAGES` entries.

## 4. Data model — `src/constants/profileStages.js`

Extend the existing `PROFILE_STAGES` array (currently 9 entries) with two new entries at the front, and add a `completionPct` field to every entry:

- `personal-info` (title "Personal Info", trailLabel "Personal Info")
- `educational-background` (title "Educational Background", trailLabel "Educational Background")

Resulting order (matches Figma's Talent Profile Panel exactly): Personal Info → Educational Background → Personal Areas of Interest → Personality → Skills (Competencies) → Work Experience → Project Portfolio → Certifications → Desired Career Options → Talent Pitch.

Keep the existing `title`/`trailLabel` wording already in the file ("Desired Career Options", "Talent Pitch") rather than the Figma chat panel's shorter labels ("Career Options", "Career Pitch") — same underlying stage, reconciling a copy drift between the two Figma passes; the panel row can display the existing longer label.

`completionPct: number` (0–100) sits alongside the existing `status` enum (`done`/`in-progress`/`not-started`). Both the profileFilling intro panels and this new `TalentProfilePanel` read from the same constant — no fork.

## 5. Components

### `ChatThread` (`src/components/ui/ChatThread.jsx`)

Presentational, reusable, no Career-Buddy-specific knowledge.

- Props: `messages: {id, sender: 'bot'|'user', text}[]`, `onSend(text)`, `suggestedReplies?: string[]`, `disabled?: boolean`.
- Renders a scrollable bubble list (bot bubbles left-aligned with an avatar mark, user bubbles right-aligned) and a bottom input bar (text field + send button, disabled when input is empty/whitespace).
- Suggested replies render as clickable chips above the input bar when present; clicking one calls `onSend(chipText)`.
- Follows the existing UI-primitive pattern (`forwardRef` not needed here since it's not a form control, but `classNames()` for conditional classes, `debug('ChatThread')` logging on render and on send).

### `careerBuddyScript.js`

An ordered array of step objects, verbatim Figma copy:

```js
{
  id: 'welcome',
  bot: ['Ghana Talent AI — AI-powered talent guidance and mentorship hub.', 'Your lifelong digital mentor — from SHS to career success'],
  // ...
}
```

Each step: `{ id, botMessages: string[], confirmsStageId?: string, confirmToast?: string, suggestedReplies?: string[], branchOn?: { keyword: string, gotoStepId: string } }`.

Captures, in order: welcome state → returning-user greeting (`What are we working on today, {name}?`) → per-section confirmations (Educational Background, Personal Area of Interest, Personality, Work Experience, Career Options, each with its `Success, X saved` toast text stored for later toast wiring) → the guidance branch (`I think I need some guidance` → _"That's alright brother..."_ → area selection → _"Got it ✅ — I'll include tailored upskilling options..."_ → _"Perfect, Emma — I've recorded that..."_).

### `CareerBuddySection.jsx`

- Local state: `stepIndex`, `messages` (grows as the script advances), `talentStages` (cloned from `PROFILE_STAGES`, mutated as steps confirm sections).
- `handleSend(text)`: appends a user message, looks up the next script step (by `branchOn` keyword match against `text.toLowerCase()`, falling back to linear `stepIndex + 1`), appends the bot's message(s), and if that step has `confirmsStageId`, updates the matching entry in `talentStages` (`status: 'done'`, `completionPct` per Figma's observed values — e.g. Skills shows 48% mid-flow, not 100%, so pull the actual number documented for each stage rather than defaulting everything to 100).
- Renders the two-column layout: header row (title/subtitle when `messages` is empty, else nothing) + `ChatThread` on the left, `TalentProfilePanel` on the right.
- `debug('CareerBuddySection')` logs: mount, each send (branch taken + resulting step id), each stage confirmation (stage id + new completionPct).

### `TalentProfilePanel.jsx`

- Props: `stages` (the `talentStages` array).
- Header: "Talent Profile Panel" / "Every section you confirm brings the right job one step closer" (verbatim).
- One row per stage: icon (reuse the existing `*StepIcon` set from `components/shared/assets.jsx` used by `SkillsIntroSection`, adding two new icons for Personal Info and Educational Background if not already present — check `assets.jsx` first per Rule 10 component reuse), title, `Completion: {completionPct}%` or `Completion: Not Started` when `completionPct === 0 && status === 'not-started'`, and a `+` icon-button rendered but wired to a no-op handler this slice (`aria-label="Expand {title}"`, `disabled` is NOT set — it's visually active but functionally inert, matching "checklist only, expand cards later" scope).

## 6. Data flow

All state lives in `CareerBuddySection`'s `useState` — no Redux, no Context, matching the wiki's confirmed "Redux store is unwired scaffold" state and the existing profileFilling pattern (Interests/Skills sections are local-state only). Nothing persists across reloads.

## 7. Error handling

No real network calls exist yet. Only real validation: `ChatThread`'s send button/Enter-key handler is disabled when input is empty or whitespace-only. The Figma-documented `Error`/`Warning` toast variants are noted above as deferred — not wired against nothing real.

## 8. Testing

No unit-test framework exists in this repo (Playwright e2e only, confirmed via `package.json`). Add `tests/e2e/career-buddy.spec.js`:

- Navigates to `/profile/filling/career-buddy`.
- Asserts the empty-state headline and all 10 `TalentProfilePanel` rows render.
- Types a message, sends it, asserts a new user bubble appears and the script advances (a new bot bubble appears).
- Clicks a suggested-reply chip (once the script reaches one) and asserts the same.

Plus standard verification before calling the slice done: `npm run lint`, `npm run build`, and a Playwright MCP visual check at 390/768/1440 against the Figma screenshots already captured in this session.

## 9. Wiki updates required on delivery (per CLAUDE.md Rule 16)

- `wiki/components.md`: add `ChatThread`, `TalentProfilePanel`, `CareerBuddySection` entries.
- `wiki/figma-node-map.md`: record the 12 node IDs read this session with their purpose (chat states, right-panel variants, game store, component sheet).
- `wiki/routing.md`: add the new route row.
- `wiki/log.md`: append a `## [2026-07-20] create | Career Buddy chat shell` entry.
