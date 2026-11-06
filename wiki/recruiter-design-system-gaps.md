# Recruiter design system — gap audit (2026-11-04)

> Source: Figma file `OHG2xsfCCskT8xEn356njv` ("Gh Design system · Recruiter"), canvas `1:2` "Design system" (67 children). This page is a **components-page audit**, not a flow inventory: the canvas holds foundations, components and patterns, no recruiter flow screens. Compared by name against `src/components` (a name search, not a variant-by-variant diff). `🔗 EXTERNAL`

## Canvas map `✅ VERIFIED`

| Section (node)                                                                                | What it holds                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation Elements `50:5944`                                                                 | Typography (Paragraph, Headline), Spacing, Radius, Shadow/Elevation, Colours (Primary brand, Semantics), logo                                                                                                                                                           |
| Foundation components `50:5959`                                                               | Drop Downs, Cards, Upload, Check Box, Verification Code, Text Area, Loaders, Tags, mini cards, Alerts/toast, Interest cards, Interest selector, Proficiency cards, Skill lab cards, Progress bars, Other components (Watch tutorial, Breadcrumbs), Buttons, Forms Input |
| Patterns `50:8407`                                                                            | Icons (16 / 20 px, file icons, circles), Process log `3061:75237`                                                                                                                                                                                                       |
| Theme 3 dashboard comps (`6xxx`, `5xxx`)                                                      | GTH-DASH-001…019 widgets, Notification Centre `6375:85`, Global Search overlay `6378:147`, customise row / add-cards tray                                                                                                                                               |
| Newer shared comps (`8132`…`8311`)                                                            | Search field `8132:394839`, Chip `8158:2202`, Select `8158:2218`, Icon button `8158:2236`, Kbd `8232:9376`, Callout `8232:9405`, Help row `8232:9474`, Streak mark `8264:9474`, Top bar `8311:138169`, Journey components `8381:530`, Journey card `7824:95399`         |
| Persona colours `7445:14240`, Recruiter colour options `7448:7166`                            | The persona colour decision (below)                                                                                                                                                                                                                                     |
| A11Y spec `7824:95546`, Widget states board `7749:42265`, Game Arcade body comps `7958:72235` | Shared with the Talent file                                                                                                                                                                                                                                             |

## Decision: recruiter persona colour `✅ VERIFIED`

Three options were shown (A Evergreen Teal `#1D5C57`, B Forest Green `#1F4A2B`, C Olive `#4D6A2E`). The "✓ Chosen" badge sits on **B · Forest Green `#1F4A2B`** (10.1:1 on white), and the Persona colours frame lists Recruiter as Forest Green. Talent `#387440`, Parent/Guardian gold `#C8951A`. Rule from the frame: persona colour is for "this is your space" surfaces (onboarding visual panels, active nav, persona badges, headers); primary buttons, success states and links stay Brand Green on every persona; never use red for a persona.

**Gap:** `#1F4A2B` is not a token in `src/index.css` (only the brand-green ramp up to `--color-brand-green-darker: #142916`). Needs `--color-persona-recruiter*` tokens. The Light/Normal/Dark/Darker ramp values are drawn as sub-frames and were not extracted (the fills are on child layers): `⚠️ ASSUMPTION` until read. `RecruiterOnboardingPanel` already uses `#1F4A2B` (checked 2026-11-05 against R03 `8047:23826`).

## Component gaps

### Exists in `src/components/ui` (no work expected, variants not re-diffed)

Button, Card, Loader (+ gthLoader), Tag, MiniCard, ProgressBar, Toast / StatusToast / SavedToast, Modal, Breadcrumbs, Captions, WatchTutorial, PreviewField, and `ui/form/*` (Field, TextInput, Textarea, Select, Checkbox, Radio, Upload, VerificationCode, PhoneInput, PasswordInput, DatePicker).

### Missing as a shared component (name search found nothing reusable)

| #     | Figma component                                                                                  | Node                                 | Variants seen                                               | Notes                                                    |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| 1     | GTH · Search field                                                                               | `8132:394839`                        | Shortcut=On/Off, "⌘K" badge                                 | Also used inside Top bar                                 |
| 2     | GTH · Icon button                                                                                | `8158:2236`                          | Style=Outline/Ghost/Soft/Filled, 40×40                      |                                                          |
| ~~3~~ | ~~GTH · Chip~~ built 2026-11-04, `src/components/ui/Chip.jsx` (status + action variants)         | State=Default/Selected/Soft, 32 high | Only admin-specific chips exist; `ChoiceChips` is different |
| 4     | GTH · Kbd                                                                                        | `8232:9376`                          |                                                             |                                                          |
| ~~5~~ | ~~GTH · Callout~~ built 2026-11-04, `src/components/ui/Callout.jsx` (warning / danger / success) | Tone=Danger/Warning/Success (+1)     | Only `publicData/.../ReportCallout` exists                  |
| 6     | GTH · Help row                                                                                   | `8232:9474`                          | Type=Link/…, State=Default/Hover/…                          |                                                          |
| 7     | GTH · Streak mark                                                                                | `8264:9474`                          | Style=Playful/Focused × Active/Milestone/At risk/… (15)     | Talent-leaning, low recruiter priority                   |
| 8     | Proficiency cards                                                                                | `4137:23235`                         | 8 variants                                                  | Talent-leaning                                           |
| 9     | Skill lab cards                                                                                  | `3673:29304`                         |                                                             | Talent-leaning (Skills Lab has its own)                  |
| 10    | Interest category selector                                                                       | `3567:72824`                         | 2 variants                                                  | `engagementV2/interests/InterestCard` exists, not shared |
| 11    | Process log                                                                                      | `3061:75237`                         | 5 variants, scrollable list                                 |                                                          |
| 12    | Inline alert                                                                                     | `2171:24689`                         | frame "Alerts and toast messages"                           | Toast exists; inline alert not found                     |

### Exists only as per-portal copies (candidate to consolidate)

- **Top bar** `8311:138169` (App × Playful/Focused …): separate Admin / Agency / Institution / Engagement top bars, no shared one. Recruiter pages need one.
- **Notification Centre** `6375:85`: only `parent/notifications/NotificationsPanel`.
- **Global Search overlay** `6378:147`: only `talentHome/GlobalSearchOverlay`.
- **Pagination, data table, empty state, skeleton**: each portal has its own (admin, agency, publicData). Not in this Figma page, but every recruiter list screen needs them.

## Not checked (honest list)

- Drop Downs `50:6275` and Upload `3014:57097`: the Figma REST call returned 503 on every retry, so not inspected.
- No variant-by-variant diff of the "exists" components against the component sets (e.g. Button 24 variants, Forms Input 23).
- Foundation tokens (spacing, radius, shadow, typography) were not diffed against `design-tokens.md`.
- The recruiter pages already in the repo (`/recruiter/home`, talent-search, job-templates, job-postings, job-screening, application-pipeline, messages, onboarding R01–R09) have **no wiki page** except onboarding; their Figma frames live in the Talent file, not this one.

## How to use this list (for any session building a recruiter flow)

Nobody is assigned these. When a flow you are building needs one of the components above:

1. Check this page, then `src/components/ui/` and `components.md`, so you do not build a second copy another session just added.
2. **Missing** (table above): build it in `src/components/ui/` from the Figma node listed, and add a row to `components.md`.
3. **Exists but the Figma variant or state is not covered**: add the variant to the existing component (additive props, do not change existing callers), do not make an in-file duplicate.
4. **Per-portal copies** (Top bar, Notification Centre, Global Search, tables): reuse or extend the closest existing one rather than writing a fifth; consolidating them is optional and only worth doing if your flow needs it.
5. Recruiter colour: use the Forest Green `#1F4A2B` persona token for "your space" surfaces. If it is still not in `src/index.css` when you need it, add it there (and tick it off below).
6. When you add or extend something, strike its row here (`~~name~~ built <date>, <path>`) so the next session sees it.

## Built from the Recruiter dashboard canvas (2026-11-04, see [recruiter-dashboard.md](recruiter-dashboard.md))

- ~~Chip~~ → `ui/Chip.jsx` · ~~Callout~~ → `ui/Callout.jsx` · Select (`8158:2218`, as drawn in the widget headers) → `ui/FilterSelect.jsx` · widget shell → `ui/WidgetCard.jsx` ·
  inline empty / error / blocked state → `ui/InlineState.jsx` · light two-line toast with an action (`Component 31/32`) → `ui/BannerToast.jsx` (variant of `StatusToast`) · loading block → `ui/SkeletonBlock.jsx`.
- **Top bar**: `DashboardTopNav` got add-only `orgSlot` and `panels` props (org switcher, notifications, language, shared accessibility menu); still one top bar, not a fifth copy.
- **Notification Centre** (`6375:85`): the recruiter pop-up is `recruiterDashboard/TopBarPanels.jsx` (`RecruiterNotificationsPanel`), a sibling of the parent and talent ones; the three are still not consolidated.
- **Persona colour**: Forest Green `#1F4A2B` appears in none of the 51 dashboard frames (they use Brand Green `#387440` throughout), so no `--color-persona-recruiter` token was added.
- The global search overlay (`SearchPanel`, D13–D15) is built as a recruiter-specific panel; still missing from the list above: the shared Search field, Icon button, Kbd, Help row, Streak mark, Process log, Inline alert.

## Built for the Talent Search profile (2026-11-06)

- Icon-tile dialog (Figma `10102:42398`) -> `ui/IconTileDialog.jsx`; Textarea with the counter inside the box -> `form/Textarea` `counterInside`.

## Built for the Talent Search list (2026-11-06)

- ~~Dropdown / popover menu card~~ built, `ui/MenuPanel.jsx` (Figma `10102:37457` …); ~~multi-select pill~~ built, `ui/TogglePill.jsx`; escape / outside-press hook `hooks/useDismissableLayer.js`. Skeleton / empty state reused `SkeletonBlock`, `Chip`, `Button`.

- 2026-11-06 (job flows): confirm dialog with icon tile (centred) -> `recruiterJobs/jobFlowDialogs.jsx` `CenterDialog`; context banner with action -> `jobFlowParts.jsx` `FlowBanner`; dropdown field with description rows / footer rows -> `jobFormControls.jsx` `Select`. Still local, not in `ui/`.
