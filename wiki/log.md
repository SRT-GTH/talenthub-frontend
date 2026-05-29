# Wiki Log

Append-only chronological record. Each entry: `## [YYYY-MM-DD] action | subject`.
Actions: `create`, `update`, `verify`, `fix`, `ingest`, `deprecate`.

## [2026-05-22] create | Institution Confirm step (step 7 of 8)

**New files:**

- `src/components/sections/institutionOnboarding/ConfirmSection.jsx` — step-7 pre-submission review; `ConfirmStatCard` sub-component (stacked value+sub-label in inner box, colour-coded outer fills: green/neutral/blue/amber per card); `ChecklistItem` sub-component (numbered green circle 20×20 + text, h=42px); `ExclamWarningIcon` (10×10 exclamation for warning box); bordered checklist box (stroke #000000@1 r=16, gray header strip "What happens when you click Submit"); amber warning box (rgba(200,149,26,0.1) bg, stroke #eedeb8 r=10, 22×22 amber circle icon); CTAs: Back (128×56 white) + Submit (flex-1 green "Submit And Create N Accounts"); footer link
- `src/pages/onboarding/institution/InstitutionConfirmPage.jsx` — thin route wrapper

**Modified files:**

- `src/App.jsx` — added `InstitutionConfirmPage` import + route `/onboarding/institution/confirm` inside `InstitutionOnboardingLayout` group
- `src/layout/InstitutionOnboardingLayout.jsx` — added `/confirm` to `showRightPanel` exclusion (was: activate / template / validate)

**ConfirmStatCard design tokens (Figma 3040:71928–3040:71940):**
Outer container: 194×98 py-[9px] gap-[4px] r=10 border-black — same shell as ValidateSection StatCard
Inner box: 177×60 bg-white border-black/40 r=10 — now contains Frame 376 (stacked):
Value: fs=32 fw=400 lh=22 — colour varies per card
Sub-label: fs=10 fw=400 lh=16 — colour varies per card
Outer label: fs=10 fw=500 lh=16 — colour varies per card
Card configs:
Accounts To Create: outer rgba(235,241,236,0.5) value #387440 sub+label #2a5730
Rows Skipped: outer #f8f8f4 value #387440 sub+label #2a5730
Opt-Out SMS Will Be Sent: outer rgba(234,239,251,0.5) value #3062d3 sub+label #244a9f
Minors No Parent Contact: outer #faf4e8 value #967014 sub+label #967014

**Checklist box (Figma 3046:73914):** stroke #000000@1 r=16; header bg=#f8f8f4 h=35px; 4 items h=42px circle+text; no inter-row dividers
**Warning box (Figma 3046:73933):** rgba(200,149,26,0.1) bg; stroke #eedeb8; circle 22×22 #c8951a; text fs=12 fw=400 #967014
**Headline styleOverrides:** "submit?" (indices 9–15) → italic #387440 (styleTable key 73 verified via REST API)

**Build:** ✅ 0 errors (`npm run build`)
**Visual:** ✅ Playwright verified — confirm page renders at `/onboarding/institution/confirm`; no right panel; breadcrumb shows "Confirm" active at 75%; all 4 stat cards correct colour-coding; checklist box + warning box correct; both CTAs render; 0 console errors

---

## [2026-05-22] update | Institution Validate step — collapsible cards, download banner, error stat cards

**Modified files:**

- `src/components/sections/institutionOnboarding/ValidationCheckCard.jsx` — added expand/collapse behaviour; `rows` + `howToFix` props; row count pill badge on right (variant-tinted bg, r=100, fs=10 fw=700); ChevronIcon (12×12, stroke #babab7@1.3) rotates 180° when expanded; `TableHeader` (col headers: Row/Name/DOB/Reason, fs=10 fw=700 #70706e ls=0.5); `TableRow` (hover: rgba(235,241,236,0.5), default: transparent, h=34); `MoreRowsRow` ("+ N more rows in download file", fs=11 fw=400 #babab7); `HowToFixRow` (fill=#fefcf5, top border, fs=10 info icon + tip text); grid-template-columns: 60px 1fr 110px 1fr; PREVIEW_ROWS=10; VARIANT config extended with `badgeBg`, `badgeText`, `tableBorder`, `reasonColor`
- `src/components/sections/institutionOnboarding/ValidateSection.jsx` — download banner (3034:71143: 897×63, rgba(249,235,234,0.5) bg, #ebc2bd border, r=10; red download icon 18×18; heading fs=14 fw=600 #922b21; body fs=12 fw=400 #c0392b; "Download .csv" button: fill #c0392b stroke #902b20@2px r=10 h=36 px-18); failed-tab stat cards (Total Failed/Missing Contact/Duplicates/Format Errors — all value+label #c0392b; Figma 3028:67662/67669/67668/67670/67674); `visibleStats` derived from `activeTab`; `StatCard` accepts `labelColor` prop (default #2a5730); mock data extended with `rows[]` + `howToFix` per failed/warning check; `rows`+`howToFix` forwarded to `ValidationCheckCard`; `missingContact`/`duplicates`/`formatErrors` added to MOCK

**Download banner tokens (Figma 3034:71143):**
Container: 897×63 rgba(249,235,234,0.5) border #ebc2bd r=10
Icon SVG: 18×18 two vectors (arrow 8×12 + base 14×0) stroke #c0392b@1.5
Heading: fs=14 fw=600 #922b21
Subtext: fs=12 fw=400 #c0392b
Button: h=36 r=10 fill #c0392b stroke #902b20@2px pad L18R18 gap=8
Text: "Download .csv" fs=12 fw=700 #ffffff

**Failed-tab stat cards (Figma 3028:67662/67669/67670/67674):**
Total Failed: 26 | Missing Contact: 14 | Duplicates: 8 | Format Errors: 4
All: valueColor=#c0392b labelColor=#c0392b (both red vs green on normal tab)

**Build:** ✅ 0 errors (`npm run build`)
**Visual:** ✅ Playwright verified — collapsed cards show row count badge + chevron; clicking failed card expands row table (columns: Row/Name/DOB/Reason, How to fix row, + N more); failed rows tab shows download banner + all-red stat cards; 0 console errors

---

## [2026-05-22] create | Institution Report step (step 8 of 8)

**New files:**

- `src/components/sections/institutionOnboarding/ReportSection.jsx` — step-8 two-phase report; sub-components: `LoadingStatCard` (flex-1 colored bg, inner white box with pulsing progress bar), `ReportStatCard` (194×98, stacked value+sub-label in inner box), `ProcessingLog` (scrollable 130px log box, 6px colored dots, 900ms per-entry animation), `InfoBanner` (blue #eaeffb banner with `InfoCircleIcon`), `DownloadButton` (40px, r=10, colored text+border), `ReportCheckCard` (expandable, dark badge for created / red badge for failed, grid table with status pills, footer variants), `ReportTableRow`, `ReportTableFooter`, `ConcentricRings` (decorative 80×80 three-ring motif with inner spinning arc); hand-crafted SVG icons: `DownloadArrowIcon`, `CheckCardUsersIcon`, `ChevronIcon`, `InfoCircleIcon`
- `src/pages/onboarding/institution/InstitutionReportPage.jsx` — thin route wrapper

**Modified files:**

- `src/App.jsx` — added `InstitutionReportPage` import + route `/onboarding/institution/report` inside `InstitutionOnboardingLayout` group
- `src/layout/InstitutionOnboardingLayout.jsx` — added `/report` to `showRightPanel` exclusion (now: activate / template / validate / confirm / report)

**Two-phase state machine:**
`phase: 'loading'` → animated counters (3 LoadingStatCards) + ProcessingLog (5 entries, 900ms each) + InfoBanner + disabled "View Upload Report" CTA → activates after animation
`phase: 'complete'` → 4 ReportStatCards + download buttons + 2 ReportCheckCards (expandable) + active CTAs

**Loading stat cards (Figma 3052:74433 / 75000 / 75007):**
Outer: flex-1 h=98 colored bg border-black r=10 py=9
Inner: h=60 bg=#fefefe border-black/0.4 r=10; relative for absolute pulsing progress bar (h=4 animate-pulse)
Cards: 821 Accounts To Create (#ebf1ec/0.5, green), 198 SMS Queued (#faf4e8, amber), 26 Skipped (#f8f8f4, neutral)

**Report stat cards (Figma 3065:7371 frame, 194×98 each, gap=35):**
Identical shell to ConfirmStatCard but with a sub-label inside the 177×60 inner box
847 Accounts To Create (green), 26 Failed rows (green), 198 Parent SMS sent (blue), 114 Minors — no parent (amber)

**ProcessingLog (Figma 3061:75343):** h=130 bg=#f8f8f4 border-black r=10 pad=12×16; 5 entries; amber dot #c8951a (first+last), green dot #1d7c4d (rows 1-50, 51-100, 651-821)

**ReportCheckCard:** w-full r=16 border-black overflow-hidden; header bg=#f8f8f4 minH=44 px=16; created badge bg=#000000 white text; failed badge bg=#f9ebea text=#c0392b; grid-template-columns: 48px 1fr 90px 1fr 90px; status pills: "✓ Created" (bg rgba(235,241,236,0.5) text #387440) / "Skipped" (bg #f9ebea text #c0392b); footer info: bg=#fefcf5 border-top-black fs=10 fw=600 #70706e; footer more: bg=white fs=11 fw=400 #babab7

**Headlines (characterStyleOverrides verified via REST API):**
Loading: "Creating " + italic #387440 "accounts.." (styleTable key 73, chars 9–18)
Complete: "821 students are " + italic #387440 "live" (styleTable key 75, chars 17–20)

**Build:** ✅ 0 errors (`npm run build`, 1m 36s)
**Visual:** ✅ Playwright verified — loading phase: caption "Processing Report", headline "Creating accounts.." with italic green span, 3 stat cards (821/198/26), all 5 log entries animate in, blue InfoBanner, CTA transitions to green after animation; complete phase: caption "Upload Complete", headline "821 students are live" with italic green span, 4 report stat cards (847/26/198/114), 2 download buttons, 2 expandable check cards (821 rows dark badge / 4 rows red badge), CTAs "Upload another batch" + "Go to Institution Dashboard"; no right panel; breadcrumb step 8 "Report" active at 88%; 0 console errors

---

## [2026-05-22] create | Institution Validate step (step 6 of 8)

**New files:**

- `src/components/sections/institutionOnboarding/ValidationCheckCard.jsx` — reusable check result card with 3 variants: `passed` (green, checkmark), `failed` (red, X cross), `warning` (amber, exclamation bar); icon circle 26×26 rounded-full; hand-crafted SVG icons in 12×12 viewBox matching Figma vector bounding boxes (check 8×5, X 6×6, exclamation 0×6); title fs=13 fw=700 lh=15.5; body fs=12 fw=400 lh=15.9
- `src/components/sections/institutionOnboarding/ValidateSection.jsx` — step-6 validation report page; no right panel; caption "06 | Validate File" via `Captions` component; headline "File scanned N issues found." (italic green "N issues found."); WavyDivider; 4 stat cards (Valid/Failed/Minors/Adults) in HORIZONTAL gap-[38px]; tab switcher (Validation checks / N failed rows) with useState; 7 ValidationCheckCard rows; two CTAs (Re-Upload File + Proceed With N Valid Rows); mock data via MOCK constant (replace with API)
- `src/pages/onboarding/institution/InstitutionValidatePage.jsx` — thin route wrapper for `/onboarding/institution/validate`

**Modified files:**

- `src/App.jsx` — added `InstitutionValidatePage` import + route `/onboarding/institution/validate` inside `InstitutionOnboardingLayout` group
- `src/layout/InstitutionOnboardingLayout.jsx` — added `/validate` to `showRightPanel` exclusion condition (was only `/activate` and `/template`)

**ValidationCheckCard variants:**
passed: bg-[#ebf1ec] border-[#c1d4c4] circle-[#387440] title-[#2a5730] body-[#70706e]
failed: bg-[#f9ebea] border-[#ebc2bd] circle-[#c0392b] title-[#c0392b] body-[#c0392b]
warning: bg-[#fef3c7] border-[#eedeb8] circle-[#a07715] title-[#a07715] body-[#a07715]

**Headline italic portion:** "N issues found." (indices 14–29) — verified via Figma REST API `characterStyleOverrides` styleOverrideTable key 71 → italic #387440

**Stat card design tokens (all verified):**
Outer: 194×98 bg-[#f8f8f4] border-black r=10 py-[9px] gap-[4px]
Inner: 177×60 bg-white border-black/40 r=10
Numbers: green(#387440)/red(#c0392b)/amber(#c8951a)/grey(#595959) fs=32 fw=400 lh=22
Labels: #2a5730 fs=10 fw=500 lh=16

**Tab switcher:** second tab shows `failedChecks` (filtered variant==='failed'||'warning')

**CTAs:** Re-Upload → `/onboarding/institution/upload`; Proceed → `/onboarding/institution/confirm`

**Build:** ✅ 0 errors (`npm run build`, 209 modules)
**Visual:** ✅ Playwright verified — validate page renders at `/onboarding/institution/validate`; no right panel; all 7 check cards render with correct colour coding (3 green / 3 red / 1 amber); stat cards correct; tab switcher works; CTAs render correctly; 0 console errors

---

## [2026-05-22] create | Institution Upload step (step 5 of 8) + TemplateSection revert to read-only

**New files:**

- `src/components/sections/institutionOnboarding/UploadSection.jsx` — step-5 file-upload page; 3 visual states for the upload drop zone (default / hover / uploaded); drag-and-drop via `dragCounter` ref pattern (prevents false exits on nested children); FilePill component shown after file selected; InfoSmallIcon row; CTA "Run Pre-Fight Check" (disabled until file selected); footer "Already Have an account?" + "Log in Instead" → `/login`; navigates to `/onboarding/institution/validate`; Figma main frame 3010:42286
- `src/pages/onboarding/institution/InstitutionUploadPage.jsx` — thin route wrapper for `/onboarding/institution/upload`

**Modified files:**

- `src/App.jsx` — added `InstitutionUploadPage` import + route `/onboarding/institution/upload` inside `InstitutionOnboardingLayout` group (after `/template`)
- `src/components/sections/institutionOnboarding/TemplateSection.jsx` — **reverted to read-only static display** (was incorrectly made editable in a previous session); removed `useState`, `<input>` cells, Add Row button, Delete Row column; `DataCell` (with `<input>`) → `ReadCell` (plain `<td>` + `<span>`); uses `INITIAL_ROWS` directly (no state); TABLE_W no longer includes `DEL_COL_W`

**Navigation flow:**
template → **upload** (new, right panel visible) → validate (pending)

**Caption badge — non-standard (Figma 3010:43788):**
Combined single pill with amber "Coming soon" indicator + green "05 | Bulk Upload" step label. Does NOT use the `Captions` component (different structure / mixed colour scheme). Built inline in UploadSection.

**Upload zone states:**
default: fill `#fefef3`, stroke `#c1d4c4`, white icon box, upload-arrow icon, file-type pills (.csv/.xlsx/.xls)
hover: fill `#ebf1ec`, stroke `#387440`, white icon box, upload-arrow icon (isDragging && !file)
uploaded: fill `#ebf1ec`, stroke `#387440`, **green** icon box, check-large icon, "File Received" + filename

**Headline italic portion:**
"student file." (indices 12–24) — verified via Figma REST API `characterStyleOverrides`, styleOverrideTable key 69 → italic + #387440

**Design tokens (all verified via Figma REST API with PAT):**
Upload zone: 698×173 cornerRadius:16 border:2
FilePill: 698×63 fill:#ebf1ec stroke:#ddebe4 r:6; green circle 32×32 r:8
InfoSmallIcon: 11×11 stroke #387440 1.1px
Info text: Instrument Sans 400 11px #70706e lh:13.42
File type pills: rounded-full border:#e6e6e6 bg-white h-[21px]; Bold 10px #70706e

**Build:** ✅ 0 errors (`npm run build`, 207 modules)
**Visual:** ✅ Playwright verified — upload page renders at `/onboarding/institution/upload` with right panel visible; caption badge, headline (italic green "student file."), upload zone default state (cream bg, "Drag Your File Here", .csv/.xlsx/.xls pills), CTA gray/disabled (correct — no file selected); 0 console errors (2 pre-existing React Router v6 future-flag warnings, unrelated)

---

## [2026-05-22] create | Template Guide section (Phase 4) + breadcrumb progress bar fix

**New files:**

- `src/components/sections/institutionOnboarding/TemplateGuideSection.jsx` — column reference guide for GTH_Bulk_Upload_Template.csv; shows a 2×2 grid of four sections (Student identity, Contact, Education, Parent/Guardian); required (green dot) vs optional (grey dot) field indicators; download button + primary CTA navigating to /template; Figma frame 3007:39760
- `src/pages/onboarding/institution/InstitutionTemplateGuidePage.jsx` — thin route wrapper for `/onboarding/institution/template-guide`

**Modified files:**

- `src/App.jsx` — added `InstitutionTemplateGuidePage` import + route `/onboarding/institution/template-guide` (between activate and template)
- `src/components/sections/institutionOnboarding/ActivateSection.jsx` — `handleModalConfirm` now navigates to `/onboarding/institution/template-guide` (was `/template`)
- `src/components/shared/InstitutionOnboardingBreadcrumb.jsx` — **fixed progress bar layout**: changed from a single horizontal row (COMPLETE + % + bar side by side) to the correct Figma two-row stacked layout (Row 1: "COMPLETE" left / "XX%" right; Row 2: full-width progress bar); container now `flex-col w-[clamp(120px,14vw,180px)]`

**Navigation flow:**
activate → **template-guide** (new, right panel visible) → template (editable, no right panel) → upload

**Breadcrumb step mapping:**
Both `/template-guide` and `/template` map to step 3 "Template" via `STEP_PATHS.findIndex(p => pathname.startsWith(p))` — `/template-guide` starts with `/template` so no STEP_PATHS change was needed.

**No right-panel override needed:**
`showRightPanel = !pathname.endsWith('/activate') && !pathname.endsWith('/template')` — `/template-guide` ends with `-guide` so right panel remains visible automatically.

**⚠️ ASSUMPTION — button labels (Figma MCP rate-limited):**
Download button: "Download GTH_Bulk_Upload_Template.csv" (matching header file name)
Primary CTA: "I'm ready to fill the template" — verify against Figma node 3007:40296

**Build:** ✅ 0 errors (`npm run build`)
**Visual:** ✅ Playwright verified — template-guide shows right panel, currentStep=3, 38%; template page unchanged (full-width, no right panel)

---

## [2026-05-22] update | Template step editable spreadsheet + Activate step legal document modals

**Modified files:**

- `src/layout/InstitutionOnboardingLayout.jsx` — added `/template` to no-right-panel condition (alongside `/activate`)
- `src/components/sections/institutionOnboarding/TemplateSection.jsx` — converted read-only mock to editable spreadsheet; `DataCell` now renders `<input>`; rows managed with `useState`; Add Row button + per-row hover-delete column added
- `src/components/sections/institutionOnboarding/ActivateSection.jsx` — imported `LegalDocModal`; moved checkbox label JSX inside component to close over modal state setters; wired "Terms & Conditions" → TC modal, "Privacy Policy." → PP modal, "Learn more about data processing." → DP modal; each modal's `onAccept` auto-checks the corresponding checkbox; uncommented third checkbox with authorisation confirmation label
- `src/components/sections/institutionOnboarding/LegalDocModal.jsx` (**new**) — shared shell for three legal document overlays (`variant`: `'tc'` | `'privacy'` | `'data-processing'`); desktop: centered card, max-w-680, max-h-80vh, scrollable body; mobile: bottom-sheet 80vh, drag-handle pill, pointer drag-to-close (threshold 120px); all copy verbatim from Figma MCP; `onAccept` prop auto-checks caller's checkbox

**Build:** ✅ 203 modules, 0 errors (`npm run build`)
**Visual:** ✅ Playwright verified — template page full-width + editable cells; T&C + Data Consent modals open correctly; accept auto-checks checkbox

## [2026-05-21] create | Institution onboarding shared layout + YourInstitution form (step 1)

Extracted the shared chrome into a new route layout and built the first form step:

**New files:**

- `src/constants/ghanaDistricts.js` — 16 Ghana regions + all MMDAS as `GHANA_REGIONS` array and `DISTRICTS_BY_REGION` record for cascading selects
- `src/components/sections/institutionOnboarding/InstitutionRightPanel.jsx` — extracted from GuidelinesSection; fixed `PhotoCard` (removed outer `overflow-hidden`, CSS rgba corner ellipses); added `showWatchTutorial` prop (Figma 2972:70224)
- `src/components/shared/InstitutionOnboardingBreadcrumb.jsx` — 8-step horizontal progress bar (Figma 2968:24850); `currentStep` + `completionPercent` props; uses `ProgressBar` primitive
- `src/layout/InstitutionOnboardingLayout.jsx` — shared shell for all `/onboarding/institution/*` routes; renders bg ellipses + `<Outlet>` + `InstitutionRightPanel`; `useLocation` gates breadcrumb on non-guidelines routes
- `src/components/sections/institutionOnboarding/YourInstitutionSection.jsx` — step-1 form (react-hook-form + zod); 5 fields (legal name, trading name, institution type, region, district); cascading district select; triggers `IdentityCapturedModal` on success
- `src/components/sections/institutionOnboarding/IdentityCapturedModal.jsx` — success modal showing captured identity data; navigates to `/onboarding/institution/contact`
- `src/pages/onboarding/institution/InstitutionYourInstitutionPage.jsx` — thin page wrapper

**Modified files:**

- `src/components/sections/institutionOnboarding/GuidelinesSection.jsx` — refactored to left-content-only (no section wrapper, no right panel, no bg ellipses, removed all unused imports)
- `src/App.jsx` — institution routes now nested under `<InstitutionOnboardingLayout>`

## [2026-05-21] fix | GuidelinesSection card ellipses + page background ellipses

Added two previously missing decoration layers to `src/components/sections/institutionOnboarding/GuidelinesSection.jsx`:

**Card corner ellipses (2971:68895 medium / 2971:68898 small):**

- Both nodes export as `<circle fill="none"/>` (Figma fill effect not exported to SVG); recreated with CSS `rgba(255,255,255,0.3)` rounded-full div
- Restructured `PhotoCard`: outer wrapper has no `overflow-hidden`; inner wrapper (new) is `absolute inset-0 overflow-hidden` for photo clipping; ellipse sits on outer wrapper at `left:-86.4px, top:-103.42px` (photo-container offset factored in)
- `showEllipse` prop defaults false; passed as true only to small + medium cards
- Assets downloaded: `card-ellipse.svg` (223px `fill="none"` circle, for reference)

**Page background glow ellipses (2971:65357 TL / 2971:65356 BR / 2971:65358 center):**

- SVGs have real blurred gradient content (green, red, gold-orange) with `feGaussianBlur stdDeviation="100"`
- Downloaded to `src/assets/hero/`: `page-ellipse-tl.svg`, `page-ellipse-br.svg`, `page-ellipse-center.svg`
- Added `relative` to `<section>`; each ellipse uses `zIndex:-1` to sit behind in-flow content
- Container sizes: TL+BR 571×571 (inset -35.03%), Center 473×473 (inset -42.28%) — inner img at native SVG resolution via negative inset trick
- Positions (Figma frame 2971:65353, section-relative): TL `left:-95px, top:-178px`; BR `left:calc(83.33%-16px), top:610px`; Center `left:calc(33.33%+100px), top:calc(50%-200px) translateY(-50%)`

## [2026-05-21] fix | GuidelinesSection complete correction (fresh start)

Full rewrite of `src/components/sections/institutionOnboarding/GuidelinesSection.jsx` from Figma MCP re-extraction (node `2971:68519`):

- **Sub-copy text:** corrected to "Just a few questions. We'll use your answers to build a profile that works hard for you."
- **Time badge:** replaced SVG glow icon with 8px div dot (`#e1eae2`, border `#1d7c4d`, shadow `#006b3f`); text corrected to "About 4 minutes to complete"
- **Right panel BG decorations:** replaced `background grid.svg` placeholder with 4 real assets downloaded from Figma MCP: `institution-panel-ellipse-tr.svg`, `institution-panel-ellipse-bl.svg`, `institution-panel-bg-grid.png`, `institution-panel-bg-lines.svg` (opacity-30)
- **Photo cards — positions:** converted to center-based % (`left/top` = card center) + `translate(-50%,-50%)` so cards scale with panel without drifting
- **Photo cards — rotations corrected:** Small was `-6deg` → `-167deg scaleY(-1)`; Medium was `-3deg` → `-13deg`
- **Photo cards — sizes:** all via `clamp(min, pct%, max)` so they scale at every viewport
- **Two distinct photos:** Large card = `Students using GTH on phone.jpg` (group); Medium+Small = `institution-solo-student.png` (downloaded from Figma MCP)
- **Card ellipse decorations:** `institution-card-ellipse-lg.svg` / `institution-card-ellipse-sm.svg` positioned correctly inside each card
- **Wiki updated:** `figma-node-map.md` right panel section fully corrected (rotation angles, center positions, asset paths, two-photo note)

## [2026-05-21] fix | GuidelinesSection right panel + step list

Corrected `src/components/sections/institutionOnboarding/GuidelinesSection.jsx`:

- **Right panel bg:** changed `bg-neutral` (#f8f8f4) → `backgroundColor: '#387440'` (brand-green). Removed `border-l` divider (green bg provides natural separation).
- **Panel width:** changed `style={{ width: 739 }}` (hardcoded px) → `clamp(360px, 42vw, 739px)` (responsive).
- **BG grid texture:** added `background grid.svg` at `opacity-[0.08]` as placeholder for Figma nodes `2971:68528–68888` (pending Figma MCP extraction).
- **Photo cards:** all `top`/`left` values converted to percentages (px / panel dimension); all widths changed to `clamp()`; added `aspect-ratio: 1/1`; border width and radius converted to `clamp()`.
- **Step list:** removed `h-[70px]` fixed height + absolute positioning → `flex items-start gap-4 py-4`; replaced conditional `border-b` per item → `divide-y divide-[#E6E6E6]` on `<ol>`.
- **Wiki updated:** `figma-node-map.md` (right panel section with % positions and clamp notes).

## [2026-05-21] create | Institution bulk-onboarding guidelines screen

Built the "Bulk Onboarding Sign Up Guidelines Screen for Institutions/Schools" (Figma main frame `2971:65353`).

**Files created:**

- `src/components/sections/institutionOnboarding/GuidelinesSection.jsx` — full two-column section with InstitutionTag, headline, WavyDivider, sub-copy, time badge, 3-step list, primary CTA, and three rotated photo-card right panel.
- `src/pages/onboarding/institution/InstitutionGuidelinesPage.jsx` — thin page wrapper.

**Files modified:**

- `src/index.css` — added `--color-content-helper: #737373` (Figma "Neutrals/White/Dark :active").
- `src/App.jsx` — registered route `/onboarding/institution/guidelines`.

**Wiki updated:** `components.md`, `figma-node-map.md`, `routing.md`, this log.

**Notes:**

- Headline copy and sub-copy are ⚠️ ASSUMPTION — not captured in Figma MCP session. Verify against node `2971:65523` before shipping.
- Photo card rotation angles (4deg / -6deg / -3deg) are ⚠️ ASSUMPTION — estimated from screenshot. Verify with Playwright visual check.
- `Let's Begin` CTA navigates to `/onboarding/institution/your-institution` (placeholder — update when institution step pages are built).

## [2026-05-22] create | Institution onboarding Template step (step 4 of 8)

Built the Template section (step 4 of 8 in the institution bulk-onboarding wizard).

**New files:**

- `src/components/sections/institutionOnboarding/TemplateSection.jsx` — step-4 page; right panel visible; Captions "04 / Bulk Upload"; Instrument Serif headline "Start with the _template._"; SF Pro Rounded subtitle (verbatim Figma copy); WavyDivider; legend row (Required/Optional/Minors only/★ Must fill at least one); full spreadsheet mock (title bar, ribbon, formula bar, 12-column header row, 5 sample data rows + 2 empty rows, sheet tabs, tips row); download link row; primary CTA "I have my file ready →" → `/onboarding/institution/upload`; footer login link
- `src/pages/onboarding/institution/InstitutionTemplatePage.jsx` — thin page wrapper

**Modified files:**

- `src/App.jsx` — added `import InstitutionTemplatePage`; added route `/onboarding/institution/template` inside `InstitutionOnboardingLayout` group
- `src/components/sections/institutionOnboarding/ActivateSection.jsx` — updated `handleModalConfirm` navigation target from `/onboarding/institution/programme` → `/onboarding/institution/template`

**Figma nodes:**

- Main frame: `2977:85777`
- Headline: `3002:39084` (Instrument Serif 64px tracking -0.64px)
- Subtitle: `3002:39086` (SF Pro Rounded Regular 16px #737373 tracking 0.2px)
- Legend: `3003:39103`
- Title bar: `3003:39106` (bg-[#387440], SF Pro Rounded Semibold 12px white)
- Download link: `3010:40860` (border-b #387440, rounded-[8px], shadow)
- CTA: `3002:39051` (bg-[#387440], rounded-[14px], drop-shadow)

**Spreadsheet column types (12 cols):**

- Required (green bg-[#ebf1ec]): First Name ★, Last Name ★, Date of Birth ★, Gender ★, Email ★ (or Phone), Level ★, Grade ★
- Optional (light bg-[#f9f9f9]): Phone (or Email), Relationship
- Minors only (amber bg-[#fff8e6]): Parent First Name, Parent Last Name, Parent Email/Phone

**Verified (Playwright):**

- ✅ Page renders at `/onboarding/institution/template` — 0 console errors
- ✅ Right panel visible (InstitutionRightPanel)
- ✅ Headline, subtitle, WavyDivider, legend all render correctly
- ✅ Spreadsheet mock: title bar, ribbon, formula bar, all 12 columns with correct header colors + star/sub-tag overlays, 5 data rows (Kofi/Ama/Kwame/Adwoa/Yaw), 2 empty rows, sheet tabs, tips row
- ✅ Adwoa's "leave blank if unknown" parent cells render as italic gray hints
- ✅ Download link and CTA button render correctly
- ✅ Production build passes (202 modules, 0 errors)

## [2026-05-22] create | Institution onboarding Activate Account step (step 3 of 8)

Built the Activate Account section including the TermsAcceptedModal and layout changes to hide the right panel.

**New files:**

- `src/components/sections/institutionOnboarding/ActivateSection.jsx` — step-3 full-width page; no right panel; Captions 03/Activate Account; Instrument Serif headline "Review, accept & _go live._"; WavyDivider; review card with two sections (Institution Setup 3+2-col fields / Contact Details 2-col fields with dash placeholders); 3 agreement checkboxes with inline ReactNode labels (T&C/Privacy links, Learn More link, red asterisks); info notice; disabled `DisabledCTA` when not all agreed, brand-green Button when all agreed; opens `TermsAcceptedModal` on click; navigates to `/onboarding/institution/programme` on confirm
- `src/components/sections/institutionOnboarding/TermsAcceptedModal.jsx` — post-agreement confirmation modal; ✕ close button absolutely positioned top-right (28×28, bg-[#ebf1ec], rounded-[20px]); Instrument Serif "Terms Accepted" title; consent record table (3 rows: T&C / Privacy Policy / Data Consent & Use Policy); green progress divider; "I'm Ready →" CTA; trust badge; ESC + backdrop dismiss supported
- `src/pages/onboarding/institution/InstitutionActivatePage.jsx` — thin page wrapper

**Modified files:**

- `src/layout/InstitutionOnboardingLayout.jsx` — added `showRightPanel` toggle (`!pathname.endsWith('/activate')`); `InstitutionRightPanel` now conditionally rendered
- `src/components/sections/institutionOnboarding/ContactVerificationModal.jsx` — fixed navigation: changed `navigate('/onboarding/institution/programme')` → `navigate('/onboarding/institution/activate')`; changed button label "Continue to Programme Setup" → "Continue to Activate Account"
- `src/App.jsx` — added `/onboarding/institution/activate` route inside `InstitutionOnboardingLayout` group

**Verified (Playwright):**

- ✅ Page renders at `/onboarding/institution/activate` — 0 console errors
- ✅ No right panel — full-width layout confirmed
- ✅ Breadcrumb shows step 3 "Activate" active, 25% completion
- ✅ Review card: Institution Setup (3-col + 2-col) and Contact Details (2-col) sections with EDIT links
- ✅ CTA is grey/disabled when checkboxes unchecked
- ✅ All 3 checkboxes checked → CTA switches to brand-green "Activate Institution →"
- ✅ CTA click → TermsAcceptedModal opens with ✕ top-right close button
- ✅ Modal ✕ button dismisses modal (checkboxes + CTA stay in checked/enabled state)
- ✅ Modal "I'm Ready →" navigates to `/onboarding/institution/programme`
- ✅ ESLint: 0 errors

## [2026-05-22] create | Institution onboarding Contact Details step (step 2 of 8)

Built the full Contact Information section including dual-channel OTP verification modal.

**New files:**

- `src/components/ui/form/PhoneInput.jsx` — Ghana +233 prefix phone input; read-only flag+code prefix, hairline divider, numeric input; Field-compatible (label, required, labelTrailing, error); mirrors TextInput shelf-shadow states (default/focus-within/error/disabled)
- `src/components/ui/form/PasswordInput.jsx` — TextInput wrapper with LockIcon leftIcon (brand-green) and EyeIcon/EyeOffIcon toggle button as rightIcon; controlled show/hide state; uses `rightIconInteractive` prop to keep toggle accessible
- `src/components/sections/institutionOnboarding/ContactInfoSection.jsx` — step-2 form (react-hook-form + zod); 6 fields in 3 two-column rows (Full Name, Role/Title, Phone, Email, Password, Confirm Password); email field shows DiamondIcon green helper text when no error; "Passwords match" successText on confirm field; 600ms submit delay → ContactVerificationModal
- `src/components/sections/institutionOnboarding/ContactVerificationModal.jsx` — dual-channel OTP modal; stages: 'otp' → 'success'; SMS/Email tab switcher with per-tab verified checkmarks; 10-min countdown + 59s resend delay; auto-switches to email tab after SMS verified; any 6-digit code accepted (mock); success stage shows masked data summary; navigates to `/onboarding/institution/programme`
- `src/pages/onboarding/institution/InstitutionContactPage.jsx` — thin page wrapper

**Modified files:**

- `src/components/shared/assets.jsx` — added `BriefcaseIcon` (16px briefcase, Role/Title field), `DiamondIcon` (8px filled diamond, email helper bullet)
- `src/components/ui/form/TextInput.jsx` — added `rightIconInteractive` prop; when true, removes `aria-hidden` from the rightIcon wrapper span so interactive children (toggle buttons) remain in the accessibility tree
- `src/App.jsx` — added `/onboarding/institution/contact` route inside `InstitutionOnboardingLayout` group

**Verified (Playwright):**

- ✅ Page renders at `/onboarding/institution/contact` — 0 console errors
- ✅ Ghana +233 prefix visible, phone input fills correctly
- ✅ Email diamond-icon helper text shows; hides on validation error
- ✅ Passwords match successText appears on Confirm field
- ✅ Submit → loading state → OTP modal opens (masked phone target)
- ✅ Entering SMS code → Verify → SMS tab gets ✓, auto-switches to Email tab
- ✅ Entering email code → Verify Email & Complete → success stage
- ✅ Success stage: masked contact data, "Continue to Programme Setup" CTA
- ✅ Production build passes (197 modules, 0 errors)

## [2026-05-19] create | Below-18 onboarding branch + route namespace refactor

User asked to extend the existing above-18 talent onboarding flow with the below-18 variant. Below-18 Figma frames were extracted from the Figma plugin and dropped in [`below 18 onboarding raw code/`](../below%2018%20onboarding%20raw%20code/). The user also asked for a route reorganisation to accommodate future entity types (recruiter, parent-as-user, school) and made two structural picks via the AskUserQuestion flow:

- **Routes**: namespace by entity type (`/onboarding/talent/*`); other types live alongside (`/onboarding/recruiter/*` etc.) when they ship.
- **State carrier**: lightweight `OnboardingContext` (no Redux slice yet — the flow tears down once the user lands on the dashboard, so persistent store buys nothing).

**Discovery — what changes between above- and below-18 talent flows**

Working from the Figma URL list + the raw HTML dumps:

| Screen                | Below-18 delta                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/get-started` (role) | No change — age branching is on DOB, not role                                                                                       |
| Welcome               | Identical (breadcrumb gains an extra "Parent" step)                                                                                 |
| DOB                   | Already detects `isUnder18` and shows the amber consent banner ✅ — only addition was persisting DOB to context                     |
| Personal Info         | Same fields; breadcrumb adds "Parent"                                                                                               |
| Contact               | Same; breadcrumb adds "Parent"                                                                                                      |
| Address               | Same; breadcrumb adds "Parent"                                                                                                      |
| Education             | Same form; submit routes to `/parent-info` for minors instead of `/review`                                                          |
| **Parent Info (NEW)** | Guardian Name + Relationship + Phone + Email; blue legal disclosure banner; "06b" amber eyebrow (Figma `2858:28725` / `2858:28726`) |
| Review                | Adds a parent-section summary; terms modal already has the "Under 18?" callout ✅                                                   |

The "Parent details popup" frames (`2849:58523`, `2858:32819`) reference a modal that introduces the parent step. Deferred — implementing it sensibly needs the surrounding success-modal copy resolved with product first.

**Changes**

- [`src/providers/OnboardingProvider.jsx`](../src/providers/OnboardingProvider.jsx) — new ephemeral context holding `dob`, `age`, `isMinor` (derived). `setDateOfBirth({dob, age})` is the only public setter; downstream pages call `useOnboarding()` to read.
- [`src/providers/OnboardingContext.js`](../src/providers/OnboardingContext.js) — split-out context object (kept separate from the provider component so `react-refresh/only-export-components` stays happy).
- [`src/hooks/useOnboarding.js`](../src/hooks/useOnboarding.js) — hook with a defensive throw when used outside the provider.
- [`src/components/shared/onboardingSteps.js`](../src/components/shared/onboardingSteps.js) — added `getTalentOnboardingSteps({ isMinor })`. Inserts the `parent` step between `education` and `review` when `isMinor` is true. Legacy `ONBOARDING_STEPS` export retained — same as the adult flow.
- [`src/components/shared/OnboardingHeader.jsx`](../src/components/shared/OnboardingHeader.jsx) — defaults its `steps` prop to whatever the talent context implies. Callers pass nothing → header auto-extends for minors. Recruiter/parent-as-user flows can still override with an explicit `steps` prop when they ship.
- [`src/constants/routes.js`](../src/constants/routes.js) — onboarding paths re-anchored under `/onboarding/talent/*`. Constant names kept short (`onboardingWelcome`, `onboardingDob`, …) to minimise churn; rename to `talentOnboarding*` only when a second entity type lands and the ambiguity actually bites.
- [`src/App.jsx`](../src/App.jsx) — talent flow now lives inside a nested `<Routes>` wrapped in `<OnboardingProvider>`. Added 7 legacy redirects from the old flat `/onboarding/*` paths to the new namespace so in-progress sessions / external links keep working.
- [`src/pages/OnboardingDobPage.jsx`](../src/pages/OnboardingDobPage.jsx) — captures DOB + age into the context on submit.
- [`src/pages/OnboardingEducationPage.jsx`](../src/pages/OnboardingEducationPage.jsx) — branches the success-modal continue handler to `/parent-info` for minors, `/review` for adults.
- [`src/pages/OnboardingParentInfoPage.jsx`](../src/pages/OnboardingParentInfoPage.jsx) — new page. Mirrors the contact-step structure: composite Ghana-prefix phone input, Field-wrapped relationship select with Father/Mother/Stepfather/.../Other-relative options, email input, blue legal disclosure banner. Defensive `useEffect` redirect: if a non-minor lands here via direct URL, it bounces to `/review` via `Navigate replace`. Amber eyebrow + cream-amber right-panel summary card mirror Figma `2858:28741` and the floating guardian preview at `2858:28903`.

**Validation rule subtlety**

The Figma banner reads "phone OR email" — the page enforces _at least one_ contact method. Both can be filled. When the user starts filling one channel, the other field's trailing label flips from "SMS/Email verification" to "Optional". After a submit attempt with neither filled, both phone and email get the same `"Phone OR email is required"` error so the eye can't miss it.

**Verification** ✅ VERIFIED (lint + build + route smoke); 🔶 LIKELY (visual fidelity not Playwright-confirmed this session)

- `npm run lint` — clean.
- `npx vite build` — clean (86 modules, no warnings, +1 page → 564.97 kB → 564.97 kB index bundle).
- Vite dev server probed for all 11 onboarding paths → 200 across the board (talent namespace + legacy redirects + `/get-started`).
- E2E suite: `tests/e2e/home.spec.js`'s `/components` test passes; the `/` (landing hero) test failure is pre-existing — the hero was removed in commit `06b553c chore(landing): drop HeroSection while it's being rebuilt` and the test wasn't updated.
- Playwright MCP visual check was attempted but the MCP's chrome profile was locked by an in-flight session (7 chrome.exe processes — likely overlapping with the user's own browser, so the lockfile wasn't force-removed). Pixel-level fidelity vs Figma `2858:28725` family will be confirmed in the next session once the profile clears.

**Route-shape decision rationale**

Picked entity-type namespacing over flat-with-in-page-branching because:

- Future flows (recruiter, school, parent-as-user) will diverge in layout shells, not just copy. Forcing them into a single `/onboarding/welcome` page would push role detection into every primitive.
- Each entity's route subtree can own its own provider + step catalogue without leaking into talent state.
- The legacy redirects mean nothing breaks today.

If/when a second entity type lands, the next step is to rename the constants to `talentOnboarding*` and add a sibling `recruiterOnboarding*` block; this session deliberately deferred the rename to keep the diff focused.

**Known follow-ups**

- "Parent details popup" frames (`2849:58523`, `2858:32819`) — not yet built. Likely an introductory/confirmation modal for the parent step; needs product copy resolution.
- The legacy redirects in `App.jsx` should sunset on a defined timeline (probably ~90 days after this lands in production); add a removal TODO once analytics shows zero traffic to the flat paths.
- The Education-step `EditChip` in `OnboardingReviewPage.jsx` still falls back to `ROUTES.onboardingAddress` instead of pointing at `/education` — pre-existing, unrelated to this session's scope.
- Pixel-perfect verification of the new Parent Info page against Figma `2858:28725` family needs a follow-up Playwright pass.

## [2026-05-19] fix | Wire role-selection + onboarding routes end-to-end

User provided 11 Figma frame URLs for the "Gth Role Selection — Onboarding student (18+) edge case states" along with `above 18 onboarding raw code/raw Gth Role Selection- Onbaording student (student 18 years and above code.html`, asking to follow the same workflow as the prior "Build contact us form" / "Build onboarding form" sessions but skip steps already performed.

**Discovery:** every frame was already implemented in earlier sessions. The page-level docblocks cite the exact node IDs the user supplied:

- [`OnboardingWelcomePage.jsx:13`](../src/pages/OnboardingWelcomePage.jsx#L13) covers `2858:23640 / 2858:23867 / 2858:24094` (Student-Selected flow + 3s toast + Loader).
- [`OnboardingDobPage.jsx:23`](../src/pages/OnboardingDobPage.jsx#L23) covers `2236:830 / 2282:7563 / 8435 / 8944 / 9846 / 9302 / 10259 / 10628` (default / 4 age-verified filled variants / 2 loader overlays / under-18 parental-consent notice). The `isVerified` and `isUnder18` branches in the page already render every age-state variant in the Figma list.

So no extraction or page-build work was redone. What had been left undone in those earlier sessions was the route wiring — [`src/constants/routes.js`](../src/constants/routes.js) only exported `home / components / onboardingAddress`, and [`src/App.jsx`](../src/App.jsx) only registered `/` + `/onboarding/address` + `/components`. Every `navigate(ROUTES.onboardingWelcome)` / `navigate(ROUTES.onboardingDob)` / etc. in the existing pages was navigating to `undefined`, and `/get-started`, `/login`, `/onboarding/welcome`, `/onboarding/dob`, `/onboarding/personal-info`, `/onboarding/contact`, `/onboarding/education`, `/onboarding/review` all 404'd.

**Changes**

- [`src/constants/routes.js`](../src/constants/routes.js) — added 8 missing constants (`login`, `getStarted`, `onboardingWelcome`, `onboardingDob`, `onboardingPersonalInfo`, `onboardingContact`, `onboardingEducation`, `onboardingReview`). Each carries a one-line `// Maps to US-1.1.1-NN` comment so the user-story mapping stays discoverable.
- [`src/App.jsx`](../src/App.jsx) — imported the 7 pages that weren't already imported and registered 8 new `<Route>` entries inside the existing `MainLayout` shell. Order mirrors `ONBOARDING_STEPS` from [`onboardingSteps.js`](../src/components/shared/onboardingSteps.js) so the route file reads like the user flow.
- [`temp-outputs/role-selection/FRAME_COVERAGE.md`](../temp-outputs/role-selection/FRAME_COVERAGE.md) — new archival map from each of the user's 11 Figma frame URLs → the existing page that already implements it, plus a "why no new EXTRACTION_PROTOCOL was written" note so future sessions don't redo the extraction.

**Verification** ✅ VERIFIED

- `npx eslint src/App.jsx src/constants/routes.js` — clean.
- `npx vite build` — clean (82 modules, 8.82s).
- Playwright MCP @ 1440×900, 0 console errors across all four screens:
  - `/get-started` — 3 role cards (Talent / Parent-Guardian / Company-Recruiter), CTA disabled until selection.
  - `/onboarding/welcome` — two-column layout, toast auto-hides at 3s, right-panel cards render.
  - `/onboarding/dob` with DOB=15-03-2003 → "23 years old" badge, Continue CTA active, no consent banner.
  - `/onboarding/dob` with DOB=15-03-2010 → "16 years old" badge, amber "Parent or guardian contact needed" banner appears.

Screenshots saved at repo root: `role-1-get-started.png`, `role-2-welcome.png`, `role-3-dob-default.png`, `role-4-dob-above-18-verified.png`, `role-5-dob-under-18-consent.png`.

**Known follow-ups** (not in this session's scope)

- `OnboardingWelcomePage` renders behind the floating Navbar pill — the headline is partially overlapped by the navbar shelf at 1440 width. Pre-existing; the welcome screen pre-dated this routing fix.
- No commit was created — pages were already on `main` from prior sessions; only the route wiring is new on the working tree. Hand off to the user for the conventional commit.

## [2026-05-15] create | Profile Engagement page (`/profile/engagement`) `✅ VERIFIED`

Implemented the "9 profile stages" Profile Engagement page from Figma frame `3384:81927` ("Gh Design system — engagement side"). This is the candidate-side engagement hub where users build out their profile (avatar, interests, personality, skills, work, portfolio, certs, career goals, talent pitch). It's a self-contained route — mounted outside `MainLayout` because it owns its own top-bar and footer chrome — listing nine non-blocking stages with an AI "Career Buddy" promo and a "How this works" explainer in a right rail.

> Note on naming: the Figma file is titled "Gh Design system - onboading" but these are engagement / profile-build screens, not literal first-time-only onboarding. Files, routes, and exports all use `Engagement*` / `ProfileEngagement*` accordingly.

**Files added:**

- [`src/pages/ProfileEngagementPage.jsx`](../src/pages/ProfileEngagementPage.jsx) — top-level page; derives counts/current-stage from `PROFILE_STAGES` via `useMemo`.
- [`src/constants/profileStages.js`](../src/constants/profileStages.js) — `PROFILE_STAGES` (9 items, each `{id, emoji, title, subtitle, metaPrimary, durationLabel, status}`), `STAGE_STATUS` enum, `ENGAGEMENT_HERO_TAGS`.
- [`src/components/sections/engagement/`](../src/components/sections/engagement/) — `EngagementTopBar`, `EngagementHero`, `ProfileStandingCard`, `ProfileStagesList`, `CareerBuddyPromoCard`, `HowItWorksCard`, `EngagementFooter`.
- [`src/components/cards/ProfileStageCard.jsx`](../src/components/cards/ProfileStageCard.jsx) — repeating stage row (Figma instance 3384:81946).
- [`src/components/ui/ProgressRing.jsx`](../src/components/ui/ProgressRing.jsx), [`ChatBubble.jsx`](../src/components/ui/ChatBubble.jsx), [`StatusDot.jsx`](../src/components/ui/StatusDot.jsx), [`EngagementProgressIndicator.jsx`](../src/components/ui/EngagementProgressIndicator.jsx) — new design-system primitives reusable beyond the engagement area.

**Files modified:**

- [`src/App.jsx`](../src/App.jsx) — registered `/profile/engagement` route outside `MainLayout`; switched existing routes to use `ROUTES` constants.
- [`src/constants/routes.js`](../src/constants/routes.js) — added `profileEngagement: '/profile/engagement'`.
- [`src/components/sections/landing/HeroSection.jsx`](../src/components/sections/landing/HeroSection.jsx) — added a minimal placeholder default export. The file was empty in committed source on `main` (pre-existing scaffold gap), which broke the build and blocked dev-server bundling of every route. The stub is purely a build unblocker; landing hero rebuild remains a separate task.

**Verification:**

- `npm run lint` → clean (no errors, no warnings).
- Prettier-formatted all new and touched files.
- Browser smoke via Playwright MCP at `localhost:5173/profile/engagement` → 0 console errors, only React-Router v7 future-flag warnings.
- Full-page screenshot saved to [`onboarding-hub-full.png`](../onboarding-hub-full.png) — visual parity with Figma frame 3384:81927 confirmed.

**Notes / follow-ups:**

- Penguin mascot in `CareerBuddyPromoCard` is a placeholder "CB" badge — swap in the real illustration when the asset lands.
- Per-stage routing wiring is a no-op hook today (`onStageSelect` logs); per-stage screens are a follow-up under the same `/profile/engagement/*` umbrella.
- Production `npm run build` still fails on an unrelated `LandingPage → HeroSection` mismatch from `main`; the dev server (and therefore visual verification of this page) is unblocked by the placeholder stub described above.

## [2026-05-07] update | Hero rebuilt around composed Figma vectors

Rebuilt [`HeroSection.jsx`](../src/components/sections/landing/HeroSection.jsx) and [`HeroPhotoCard.jsx`](../src/components/sections/landing/HeroPhotoCard.jsx) around a fresh export of hero SVGs in [`src/assets/hero/`](../src/assets/hero/). The old asset set (with hand-extracted sparkle rays, scribble, spirals, and small sub-icons) was replaced by composed full-card SVGs — one vector per floating UI element — so positioning is layout-only rather than per-child reconstruction.

**Why:** Figma MCP's `get_design_context` flattens free-floating decoration into auto-layout relationships and drops rotation / SVG path data, which made nested vectors painful to position. Exporting each floating UI element as one composed SVG sidesteps the problem — the LLM only needs parent-relative coordinates, not internal structure. Documented the workflow in [`wiki/figma-fidelity.md` → "Nested decoration extraction"](figma-fidelity.md#nested-decoration-extraction).

**Changes:**

- Added [`src/utils/figmaPosition.js`](../src/utils/figmaPosition.js) — `relativeTo`, `rotationFromMatrix`, `relativePercent`, `toStyle` helpers for converting `get_metadata` XML into Tailwind / inline-style values.
- New background composition: `background grid.svg` (full-bleed) + `hero-orb1.svg` (TL green) + `hero-orb2.svg` (BR gold) + `Ellipse 5.svg` (gold blurred orb) + two `Large G-form.svg` instances (top-right and bottom-left). Old inline `radial-gradient` orbs and spiral SVGs deleted.
- Headline copy updated to match latest metadata: "Level Up / your career / in Ghana." (was "Know yourself. Own your Future."). Italic gold on "Level Up", italic cream + wavy underline on "Ghana." preserved from the old motif.
- Sub-paragraph updated to "AI assessments. Skill badges. Smart job matches. / GTH is your career game — and you're Player 1."
- Stats row now uses two `·` separators between the rating and partner count (per metadata at `2524:29123` / `2524:29124`).
- Scroll indicator pill swapped from inline divs to `scroll-pill.svg`.
- Highlight scribble swapped from `highlight-scribble.svg` to `highlight vector.svg` (38×45).
- All 6 floating UI cards in `HeroPhotoCard` are now `<img>` references to composed SVGs (`Your next adventure`, `power your career`, `quiz complete`, `my experience`, `XP earned today`, `Lift your talent`). The 5-piece sparkle composition collapsed to a single `sparkle vector.svg`.
- Photo composition (rotated dual cards + JPG + Ghana flag stripe) kept as React because the JPG layers inside the front card.
- Removed the bottom feature marquee — not present in the new hero metadata.

**Wiki:**

- [`wiki/figma-fidelity.md`](figma-fidelity.md) gained a "Nested decoration extraction" section with sources cited.
- [`wiki/figma-node-map.md`](figma-node-map.md) gained "Landing — Hero" sections cataloguing the four sub-frames (`2520:28985`, `2527:29175`, `2532:30146`, `2519:28921`), background decorations, and floating UI card node IDs.

**Verification:**

- `npm run lint` — clean.
- `npm run build` — clean (16 assets bundled, including composed-card SVGs and the JPG).
- Playwright @ 1440×1024 — visual confirms layered composition matches Figma. Console: 0 errors, 2 unrelated React Router future-flag warnings.

**Known follow-ups:**

- "My Experience" card SVG extends ~6% past the right edge of `HeroPhotoCard` — its drop-shadow padding overruns the container. Likely fix: nudge `left` from 74.77% to ~70% or re-export a tighter SVG.
- "+350 XP earned today" pill sits behind the "Power your career" pill at the current percentages — needs a small position retune.
- The two Large G-forms are at `opacity: 0.02` per the SVG file — verify the design intent before tuning visibility.

## [2026-05-07] fix | Hero copy + alignment after Figma cross-check

Caught and reverted four fidelity issues introduced during the rebuild after pulling `get_design_context` for [`2520:28983`](https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2520-28983), [`2517:28763`](https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2517-28763), and [`2527:29169`](https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2527-29169) instead of trusting the layer names from `get_metadata`.

- **Headline copy**: reverted from "Level Up your career in Ghana." to "Know Yourself. Own Your Future." Layer names in `get_metadata` are _designer notes_ describing intent ("Heading 1 - Headline: bold, direct, gamified → Level up..."), NOT the rendered text. Lesson: always pull `get_design_context` for textual content, never read it from layer names. Same correction applied to the sub-paragraph.
- **Ghana flag stripe**: removed entirely from `HeroPhotoCard`. Figma metadata shows the 3-rect Ghana flag (`2520:28928`, `2519:28923`) at y=722–845, which actually overflows below the front photo card and was rendering as an unintended cropped band at the bottom of the card. User confirmed it shouldn't appear.
- **Photo positioning**: replaced naive `object-cover object-center` with Figma's exact CSS — outer container with `inset: -9.27px -6.24px -5.29px -5.44px` (extends past card edges) wrapping an image at `width: 108.68%; height: 113.06%; left: -8.89%; top: -8.94%`. The photo (560×764) has the same aspect as the card (559×764), so this overflow mostly affects bleeds rather than crops, but matches Figma exactly.
- **Highlight scribble**: re-anchored from `left: 165px` to `right: -22px`. Figma's 181px button width doesn't survive font-render rasterization in React, so anchoring by `left` placed the strokes too far right. Anchoring by `right` (with the `-22px` offset that Figma's metadata implies) keeps the strokes overlapping the button's upper-right corner regardless of rendered button width.
- **Vertical alignment**: switched the left column from `pt-6` + `gap-6` + `mt-2` (30/24/8 mismatched) to per-Figma values: container `pt-[132px]` (right col Figma y), left col `lg:pt-[105px]` extra (places left col at hero-y=237), pill→headline `mt-4` (16px), CTA→stats `mt-6` (24px). Right column drops its `pt-8` since the container now matches its Figma y directly.

**Verification:** `npm run lint` clean, `npm run build` clean, Playwright @ 1440 confirms layered composition matches Figma intent. Console: 0 errors.

## [2026-05-06] create | Landing-page HeroSection + LandingPage route

Built the landing-page hero per Figma frame `2513:27809` ("HERO", 1729×1084). Created two new section components under `src/components/sections/landing/` and wired up a new `LandingPage.jsx` route at `/`. Moved the design-system playground (HomePage) to `/components`.

**`HeroSection.jsx`** — Full-width hero with `bg-brand-green-darker` (#142916) and decorative radial-gradient "orb" washes at TL / TR / BR + a soft center wash. Foreground content sits in a 1300px container split into two columns (`grid-cols-[1fr_640px]`):

_Left column_ contains:

- **Career level pill** (Figma `2520:28988`) — translucent cream pill with a glowing `#eedeb8` dot (1.5px brand-green border + `0 0 4px #c8951a` glow), 30%-fill green progress bar, "Career Level 1 / LVL 2" labels.
- **Headline** (Figma `2520:28940`) — 120px Instrument Serif, `letter-spacing -2.58px`, `line-height 110px`, mixed italic / regular per Figma:
  - "Know" → italic gold `#c8951a`
  - " yourself." → regular off-white `#ebf1ec`
  - "Own your " → regular off-white
  - "Future." → italic cream `#eedeb8` with a wavy SVG underline (path-based instead of `text-decoration-style: wavy` so the wave amplitude is consistent across browsers)
- **Sub-copy** — 16px `#e6e6e6`, max 636px wide, AI-companion pitch.
- **Get Started CTA** — white pill with `border-t border-l-2 border-r-2 border-b-2 border-black/30` + `drop-shadow(0 4px 0 rgba(17,17,17,0.25))` for the shelf, with the exact Figma `41:1537` arrow-up-right SVG path inlined (viewBox `0 0 12 12`, fill `#111111`). Plus a hand-drawn scribble accent (`6268c822...svg`, fetched from Figma) rotated -20° next to the button.
- **Stats row** — dashed top border, ★★★★★ in `#c8951a` accent + "5.0" + "·" separators + "**250+** partner companies" + 1px brand-green-light-active divider + "🇬🇭 Built in Ghana".

_Right column_ renders **`HeroPhotoCard.jsx`** — two stacked rotated photo cards (Figma `2517:28762`):

- Behind: 5px brand-green-light-active border, `transparent` fill, rotated −13.97°
- Front: 5px `#c8951a` gold border, holds the `students.png` PNG (downloaded from Figma node `2517:28764`) + a 12px-tall Ghana flag stripe (green `#006b3f` / yellow `#fcd116` / red `#ce1126`) flush at the bottom, rotated +6.99°

Plus 6 floating UI cards positioned at percent-based offsets across the photo:

1. White stat card "1,580 / Your next Career adventure awaits" (36px Instrument Serif number)
2. Green pill "♥ Power your career!" with 4px `#2a5730` shelf shadow
3. Small white pill "✓ Quiz Complete" with brand-green text
4. White "My Experience" mini-form with three skeleton bars + green Submit button
5. Small green pill "⚡ +350 XP earned today"
6. Gold card "Lift your talent. Land the role." + "Find your match today" search field

_Bottom row_ contains:

- **`ScrollIndicator`** (Figma `2519:28921`) — 35×58 mouse-pill outline + animate-pulse ball + "SCROLL" caption, 30% opacity
- **`TrustedBy`** (Figma `2532:30146`) — "TRUSTED BY" label + infinite marquee of 7 partner logos (MTN, GCB, Unilever, KNUST, Univ. of Ghana, Vodafone, Ghana Edu. Service) using a custom `@keyframes heroMarquee` defined in `src/index.css`.

**Hero asset bundle** under `src/assets/hero/`: `students.png` (the main photo, 2 MB), `get-started-arrow.svg`, `highlight-scribble.svg`, `heart.svg`, `check-circle.svg`, `pencil.svg`, `search.svg` — all downloaded from Figma's local Dev Mode MCP server so the build is self-contained.

**Routing changes**:

- `/` now renders `LandingPage` (currently composes only `HeroSection`; subsequent landing sections will be added as their Figma frames ship).
- `/components` now hosts the original design-system playground (`HomePage.jsx`) so the primitive showcase is still accessible.
- `ROUTES.components` added to `src/constants/routes.js`.

**Test updates**: `tests/e2e/home.spec.js` now has two specs — one asserting the landing hero's H1 contains "Know" + "Future." at `/`, and one asserting the playground's "TalentHub" heading is reachable at `/components`. Both pass.

**Verification**: lint, format:check, build (CSS 59.05 → ~60 kB; bundles students.png ~2 MB), e2e all green. Playwright MCP at `/`: hero bg `rgb(20,41,22)` = `#142916` ✓, headline 120px Instrument Serif ✓, "Know" italic color `rgb(200,149,26)` = `#c8951a` ✓ (Figma exact), photo loaded ✓, CTA present ✓, 0 console errors.

## [2026-05-06] create | Landing-page Navbar + Footer + Logo

Replaced the placeholder `Navbar.jsx` and `Footer.jsx` (originally just brand text + copyright stub) with full landing-page implementations matching Figma exactly.

**`Logo.jsx`** (new, under `src/components/shared/`) — Brand mark + wordmark composite. Source: Figma `GTHLogo 1` (instances `2517:28662` in the navbar and `2638:4807` in the footer). PNG assets `gth-mark.png` (the colorful Ghana-flag figure with circuit nodes) and `gth-wordmark.png` ("GHANA TALENT HUB" in white) bundled under `src/assets/brand/` so the build is self-contained.

Key implementation detail: Figma renders both PNGs at 128–131% of their bounding box with negative offsets (`left=-1%`, `top=4%`) inside `overflow:hidden` cropping containers — the visible mark is the centred portion of a slightly oversized PNG. A naive `<img>` stretching to fit throws off the visual centre, so `Logo.jsx` mirrors Figma's absolute-positioned layout exactly. Three sizes (`sm` / `md` / `lg`); `invert` filter flips the white wordmark to dark for light backgrounds; `showWordmark={false}` for icon-only contexts.

**`Navbar.jsx`** — Source: Figma `nav.navbar` at `2513:28586`. Visual signature: a 1107×88 floating pill with translucent dark fill (`rgba(17,17,17,0.6)` + 20px backdrop-blur), 0.8px brand-green border, 24px radius, soft drop shadow. Sticky-positioned 20px from the top of the viewport.

Layout L→R: Logo + 30px white/10 divider + 4 nav items (For Talents / Recruiters / Schools / How It Works, 14px text in `text-neutral-dark` becoming `text-white` on hover) + 30px divider + Sign In ghost button (102×48, 2px `rgba(193,212,196,0.7)` border, white/80 text) + Get Started primary button (Button `size="sm"` for the exact Figma `px-18 py-12 r-10`, with the 16px gradient text and the `41:1545` arrow icon — viewBox `0 0 14 10`, `#EBF1EC` fill, positioned with 25%/15% insets inside a 20×20 wrapper to match Figma exactly).

The Sign In (48px) and Get Started (~50px) heights differ slightly per Figma; the parent's `items-center` keeps them centre-aligned (verified delta < 0.001px).

**`Footer.jsx`** — Source: Figma frame `2638:4802`. Brand-green-darker (#142916) full-width panel with a top hairline accent and a subtle radial-gradient wash behind the content. 1300px content column.

Top row (above a `rgba(255,255,255,0.07)` hairline): brand block on the left (Logo + 30px divider + tagline "Connecting every Ghanaian student with the opportunities they deserve. Built in Accra." in white/60 + "Made with pride in Ghana 🇬🇭" in yellow italic) and 3 link columns on the right (Platform / Company / Legal — uppercase 10px headings in white, 14px links in yellow-hover becoming white on hover).

Bottom row (below the hairline): copyright on the left, contact line on the right (with `mailto:` link).

**Visual fidelity fixes during implementation** (per user feedback in the same session):

1. _Logo center alignment_ — Initial naive `<img className="w-[64px] h-[58px]">` squashed the whole PNG into the box and threw the visual centre off. Fixed by mirroring Figma's absolute-positioned image inside a cropping container. Verified centre delta in the navbar < 0.005px.
2. _Get Started arrow icon mismatch_ — Initial implementation used a hand-drawn 20×20 stroke arrow. Replaced with the exact Figma `41:1545` path (viewBox `0 0 14 10`) with `fill="var(--color-brand-green-light)"` directly (avoiding `currentColor` which gets lost inside the gradient-text variant).
3. _Get Started button size_ — Initial `Button size="md"` (`px-28 py-14`) didn't match Figma's `px-18 py-12 r-10`. Switched to `size="sm"` to match.

**Verification**: lint, format:check, build (CSS 51.59 → 59.05 kB; bundles two PNG brand assets totalling ~480 kB), e2e all green. Playwright MCP: 0 console errors; computed styles confirm Figma-exact (`navbar bg rgba(17,17,17,0.6)`, `footer bg #142916`, `arrow fill #EBF1EC`, `Get Started bg #387440`); Sign In + Get Started centre-aligned to ~0.000002px.

## [2026-05-06] create | MiniCard + Upload + Tag + ProgressBar + WatchTutorial + Breadcrumbs + Captions

Final design-system batch. Closed out every Figma component frame catalogued in [`figma-node-map.md`](figma-node-map.md).

**`Tag.jsx`** (Figma frame `3167:29034`, plus chips at `3179:29793` / `3179:29795`) — Two visual variants. `pill` (default) matches the standalone `3167:22477` symbol exactly: rounded-full, 1.5px shadow, white bg + green-light-hover border + brand-green text. `chip` matches the meta-tags inside MiniCard: flat 4px corners, denser px-8 py-3px padding, semibold weight, brand-green-light bg + brand-green-light-active border + brand-green-dark text. Five colour families across both variants. The split was driven by user feedback after the initial implementation used the pill shape inside MiniCard — Figma uses different shapes for standalone vs in-card tags.

**`MiniCard.jsx`** (Figma frame `3384:76788`) — Horizontal step / task card. Default = grey border + 4px grey shelf; selected = brand-green border + 3px green shelf. Renders as a `<div>` (the action button is a separate `<button>`); wrap in a button/anchor at the consumer level for whole-row clickability. Uses the exact Figma `user-star-01` icon (node `3176:29383`) inlined as JSX paths after a separate user request. Icon is rendered inside a 21×21 inner span (Figma exact) inside the 40×40 brand-green-light icon block.

**`Upload.jsx`** (Figma frame `3014:57097`) — Drop-zone uploader with five derived states: default / hover (drag-over) / loading / received / error / disabled. Native `<input type="file">` is `sr-only`; the dashed dropzone listens to dragOver / dragLeave / drop. Loading + received are _consumer-managed_ — the component just paints the visual that matches the props you set (`progress={Number}` for loading, `filename={string}` for received). Forced state derivation priority: `state` → `disabled` → `error` → received → loading → drag-over → default.

**`ProgressBar.jsx`** (Figma frame `2282:23906`) — Horizontal indicator. Figma's four fill-percentage variants (`2282:23891` / `2282:23893` / `2282:23897` / `2282:23895`) collapse into a single `value`-driven primitive. Brand-green fill on brand-green-light track. Two sizes (`sm` 4px / `md` 6px). `indeterminate` falls back to a full-width pulsing bar via Tailwind's `animate-pulse`. Renders `role="progressbar"` with proper ARIA value attributes in determinate mode.

**`Loader.jsx`** (already exists from prior batch).

**`WatchTutorial.jsx`** (Figma frame `2255:1597`) — Floating "watch a tutorial" widget. 72×72 brand-green circular play button with optional cream-pill label that overlaps by 13px (Figma's `mr-[-13px]` trick). Same shelf DNA as Button — 4px shelf collapses on `:active` with `translate-y-1`. `showLabel={false}` for icon-only. Uses the exact Figma `20-play-circle` icon (node `41:1185`).

**`Breadcrumbs.jsx`** (Figma frame `2263:8179`) — Vertical step list. Despite the name, Figma's "Breadcrumbs" is a wizard sidebar, not horizontal site breadcrumbs. Three status variants: pending (grey check + grey medium label), active (brand-green filled check + brand-green semibold), completed (brand-green filled check + grey medium). Status auto-derives from `currentIndex` or can be overridden per item. Uses the exact Figma `20-check-circle-fill` icon (node `41:1451`).

**`Captions.jsx`** (Figma node `2374:15129`) — Horizontal "you are here" indicator. Soft green-tinted pill with a leading active-dot anchor and chevron-separated step labels. Active step text is brand-green; others are grey. Used as a header strip on onboarding screens.

**Cards section icon update**: replaced the hand-drawn `MortarboardIcon` in HomePage's Cards showcase with the exact Figma `mortarboard-02` (node `2153:11813`) — three SVG paths positioned by % inset to match Figma's nested-SVG layout exactly. `currentColor` strokes so the parent (Card) controls neutral grey vs brand-green tint per state.

**Showcase additions in HomePage**:

- Tags: 5-color pill grid + sizes (sm/md) + chip-variant grid + composition examples (structured ReactNode children)
- Mini cards: pinned-state grid (default + selected) + interactive 3-step onboarding checklist with Tag chips and the action-button selection pattern
- Upload: 4-state pinned grid (default / hover / loading / received) + interactive picker with simulated progress → received transition
- Progress bars: 4-fill grid (0/33/66/100) + sm/md sizes + indeterminate + interactive `<input type="range">` driver
- Watch tutorial: with-label vs icon-only side by side
- Breadcrumbs: 4-step list with buttons to advance the active marker
- Captions: 3 stacked instances showing each step as the active one

**Wiki updates**:

- `wiki/components.md` — added Tag / MiniCard / Upload / ProgressBar / WatchTutorial / Breadcrumbs / Captions entries + full "details" sub-sections with prop tables, state visuals, ARIA notes, and composition examples.
- `wiki/figma-node-map.md` — added internal symbol-ID sub-tables for every new component.

**Verification**: lint, format:check, build (CSS 47.69 kB → 54.06 kB; 51 → 58 modules), e2e all green. Console has 0 errors at runtime; computed styles confirmed Figma-exact colours throughout.

## [2026-05-06] create | Textarea + Loader primitives

Built two more primitives to round out the design-system second wave:

**`Textarea.jsx`** — Source: Figma frame `2021:950`. Multi-line cousin of TextInput. Same Field wrapper, same state-derivation priority (`state` → `disabled` → `error` → `verified` → interactive `:focus-within`), but with two visual differences pulled from Figma:

- Active / verified bg is a slight green tint `#eef7f2` (lifted directly from `2022:1118`) rather than TextInput's `bg-yellow-light`.
- Shelf shadow is 3px deep (matches VerificationCode) rather than TextInput's 2.5px.

`rows={4}` default → ~100px tall (matches Figma's 100px GTHInput dimension); `resize-y` so users can drag the bottom-right handle to grow it. The native textarea resize handle replaces Figma's painted `hugeicons:arrow-expand-01` glyph.

Built-in character counter ladder (Figma description: "turns gold near the limit, red when over"):

- `length < warnAt × maxLength` (default 90%) → neutral grey (#575755)
- `length >= warnAt × maxLength` → accent gold (#c8951a)
- `length > maxLength` → danger red (#c0392b)

The native `maxLength` attribute is intentionally _not_ set so the counter can show `503/500`; consumers apply their own validation. Counter row uses `aria-live="polite"`.

**`Loader.jsx`** — Source: Figma frame `2168:24062`. Brand-green circular spinner. The Figma uses a layered raster + 5 repeated keyframe symbols (`2168:23601` / `2168:23605`) to fake a dot orbiting a circle; the React implementation replaces that with a single SVG arc rotated via Tailwind's built-in `animate-spin` — visually equivalent, free of asset dependencies, no JS animation loop.

Three preset sizes match Figma's 32 / 60 references plus an extrapolated 96:

- `sm` 32×32 (matches `.base` symbol `2168:23609` — inline with text)
- `md` 60×60 (matches main `Loader` symbol `2168:23593` — default)
- `lg` 96×96 (full-page loading)

Stroke widths are 3 / 5 / 8 px (~10% of diameter) so the arc reads the same at every scale. SVG renders a faint `brand-green-light` track ring + a `brand-green` arc covering 75% of the circumference (the 25% gap visually leads the spin). A11y: wrapped in `<span role="status" aria-live="polite">` with a visually-hidden label (default "Loading…").

Goes flat in `src/components/ui/` (non-form primitive — no Field), unlike Textarea which lives in `src/components/ui/form/`.

**Showcase additions in HomePage**:

- Text area: 5-state pinned grid (Default / Focus-filled / Verified / Error / Disabled). Plus an interactive Bio textarea (max 200) demonstrating the gold-at-90% / red-when-over counter ladder.
- Loaders: three sizes side-by-side (sm 32 / md 60 / lg 96), each labeled. Plus inline-with-text + inside-disabled-button examples to show composition.

**Wiki updates**:

- `wiki/components.md` — added Textarea entry under Form primitives + Loader entry under UI Primitives + full "Textarea details" and "Loader details" sub-sections with prop tables, counter ladder table, and composition examples.
- `wiki/figma-node-map.md` — added "Textarea — internal symbol IDs" and "Loader — internal symbol IDs" sub-tables.

**Verification**: lint, format:check, build (CSS 46.51 kB → 47.69 kB; expected growth from two new primitives), e2e all green. Playwright MCP: 0 console errors at runtime; DOM confirms 6 textareas + 5 loader SVGs across the new sections; computed styles confirm counter starts neutral (`rgb(87,87,85)` = `#575755`) and loader stroke is brand-green (`rgb(56,116,64)` = `#387440`); Tailwind's `animate-spin` class applied to the SVG.

## [2026-05-06] create | Checkbox + VerificationCode form primitives

Built two more form primitives under `src/components/ui/form/`:

**`Checkbox.jsx`** — Source: Figma frame `2019:13564`. Variants `2019:14112` (default) and `2019:14111` (active = checked). 20×20 rounded-6 box with the same shelf DNA as Button — a 2px grey shelf at rest collapses to a 1.2px brand-green shelf when checked, so the box "presses down" on click. Native `<input type="checkbox">` is visually hidden (`sr-only peer`) inside a clickable `<label>` that wraps the visual proxy span; native focus / form-integration is preserved.

Field is _not_ used here — checkboxes don't need a label row above. Helper / error rows render below in the same alert-icon style. Label accepts ReactNode so consumers can embed inline links (T&C / Privacy Policy pattern from Figma). Error and disabled visuals are derived from the existing token ladder (Figma exposes only Default + Active).

State derivation priority: `state` → `disabled` → `error` → `checked` → default. Showcase `state` prop covers all six combinations: default / checked / error / error-checked / disabled / disabled-checked.

**`VerificationCode.jsx`** — Source: Figma frame `2021:911`. Per-box variants `2024:1305` (default), `2024:1303` (active), `2024:1304` (error), `2024:1357` (disabled). 62×62 boxes with a 3px shelf shadow (slightly deeper than TextInput's 2.5px). External API exposes a single string value and `onChange(code)` callback; internally the component keeps an array of digits mirrored to refs so it can move focus on input / backspace / paste.

Behaviour: typing → write digit + advance focus; backspace empty → move back + clear; ←/→ navigate; Home/End jump; paste distributes from current index. Mobile autofill works via `autoComplete="one-time-code"` on the first box. Wrapped in `Field` so label / helper / error / `required` / `optional` props all behave like TextInput.

`splitAfter={n}` reproduces Figma's example layout — a centered `·` separator after the Nth box (Figma renders the 6-digit code as 3 + dot + 3).

**Showcase additions in HomePage**:

- Checkboxes: 6-state pinned grid (Default / Checked / Error / Error-checked / Disabled / Disabled-checked) using the `state` prop. Plus an interactive 3-row group (T&C with rich-label inline links + required, consent, optional marketing) that demonstrates the rich-label pattern.
- Verification code: 4-state pinned grid (Default / Active / Error / Disabled) rendered as `length=1` boxes for documentation. Plus an interactive 6-digit code with `splitAfter={3}`, "Code sent to +233 XX XXX 4821" rich label, "Expires in 08:42 · Resend code" helper, and a Verify button that's disabled until all 6 digits are filled. Plus a 4-digit short-code example.

**Wiki updates**:

- `wiki/components.md` — added Checkbox + VerificationCode entries under Form primitives + full "Checkbox details" and "VerificationCode details" sub-sections with prop tables, state visuals, keyboard reference, and selection-group pattern example for Checkbox.
- `wiki/figma-node-map.md` — added "Checkbox — internal symbol IDs" and "Verification code — internal symbol IDs" sub-tables.

**Verification**: lint, format:check, build (CSS 42.54 kB → 46.51 kB; expected growth from two new primitives), e2e all green. Playwright MCP: 0 console errors at runtime; DOM confirms 9 checkbox inputs + 14 numeric inputs across the new sections; computed styles match Figma exactly (`bg #387440`, `border #19341d`, `shadow 0 1.2px 0 #19341d` on a checked box). DPR=0.333 made full-viewport screenshots scale awkwardly so visual inspection was done via fullPage capture + computed-style probes rather than scroll-and-screenshot.

## [2026-05-04] create | Initial scaffold

Created TalentHub frontend from scratch in `C:\Users\DELL PRECISION 5530\Documents\talenthub-frontend`.

Patterns mirrored from sibling projects:

- File structure, routing, layout shell, design-token shape → elysium tours frontend (`C:\Users\DELL PRECISION 5530\OneDrive\Desktop\js_files\elysium-clone\elysiumtours-frontend`)
- `.mcp.json`, `wiki/` layout (Karpathy pattern), debug-log convention, pre-commit workflow → mangotv (`C:\Users\DELL PRECISION 5530\OneDrive\Desktop\js_files\mangotv\mangotv-main`)

Stack: Vite 7 + React 19 + plain JS, Tailwind v4, React Router v6, Redux Toolkit, axios, react-hook-form + zod, Playwright (e2e + MCP), Prettier + Husky + lint-staged + commitlint.

Pages created: INDEX, log, architecture, routing, components, design-tokens, api, debugging-workflow, figma-fidelity, pre-commit-workflow, figma-node-map.

Open items:

- TalentHub-specific design tokens — Figma file pending (`❓ NEEDS-CLARIFICATION` in design-tokens.md)
- Figma file key + node IDs — pending (`figma-node-map.md` is a stub)
- Auth/RBAC — to be revisited when admin subsystem lands
- Domain pages/routes — pending product spec

## [2026-05-04] update | Figma MCP endpoint switched to `/mcp` (streamable HTTP)

`.mcp.json` now points the Figma server at `http://127.0.0.1:3845/mcp` with `type: "http"` (was `/sse`). Newer Figma Dev Mode MCP builds use streamable HTTP, not SSE. Updated cross-references in `CLAUDE.md` §7 and `wiki/figma-node-map.md`. Restart Claude Code for the new server to register.

## [2026-05-04] ingest | GTH UI/UX AND FRONTEND spreadsheet linked

Saved a reference memory pointing at the Google Sheet (`12Zjk-md8Y6PFt90-PW4RvOv4BQ3YfPJ3tYplRaKgmn4`, "GTH UI/UX AND FRONTEND") that holds the TalentHub product spec — 11 tabs covering Onboarding/Profile/Opportunity/Engagement/Guidance Models, Prototype Notes, Frontend Progress Tracker, Job Site Research, Tool Cost Breakdown. Access confirmed via the gsheets MCP. Tabs will be ingested into focused wiki pages on demand, not bulk-imported.

## [2026-05-04] create | Card — selection card (radio-style, three states)

Built `src/components/ui/Card.jsx`. Source: Figma frame `50:8153` ("Cards" → "Select student cards"). Three visual states pulled from symbols `2153:11577` (default), `2153:11576` (hover), `2153:11575` (active/selected). Implementation chose `selected` as the canonical prop name since this is conceptually a radio-style selection (the card is "chosen", not "pressed").

**Visual signature**

Same shelf-shadow language as Button. At rest the card sits on a subtle `bottom.200` elevation; on hover it lifts onto a 6px grey shelf (`0_6px_0_0_rgba(204,204,204,0.8)`); when `selected` it pins to a 6px brand-green shelf (`0_6px_0_0_rgba(34,70,38,0.8)`) with a 1.5px brand-green border. Sub-elements (icon block bg, tag pill, headline color) all swap to brand-green accents in the selected state.

**Layout** (Figma exact): 297×267 box, rounded-16, pl-24 pr-16 py-20, flex-col gap-16, with a 62×62 icon block (rounded-10) above a content stack. Component allows the consumer to drop the fixed width via className for grid layouts.

**API**

Renders as `<button type="button">` always — keyboard accessible by default. Props: `selected`, `disabled`, `state` (showcase-only), `onClick`, plus structured content props (`icon`, `tag`, `headline`, `description`) or `children` for full layout override. Sets `aria-pressed={selected}` for screen readers; the wiki recommends wrapping selection groups in `role="radiogroup"`.

**Showcase additions in HomePage**:

- 4-state grid (Default / Hover / Selected / Disabled) using the `state` prop.
- Interactive radio-style group with three role cards (Student/Graduate, Employer/Partner, Mentor) where clicking one selects it and unselects the others. Demonstrates the "no special API needed" pattern — selection state lives in the parent.

Added three SVG icons (Mortarboard, Briefcase, Sparkles) inline in HomePage.jsx for the showcase.

**Wiki updates**:

- `wiki/components.md` — Card entry under UI Primitives + full "Card details" section with prop table, state visuals, and selection-group pattern example.
- `wiki/figma-node-map.md` — added "Card — internal symbol IDs" sub-table.

**Verification**: lint, format:check, build (CSS 42.54 kB, was 39.41), e2e all green. Playwright MCP visual confirmed all 4 pinned states render and the selection group highlights correctly when clicked; 0 console errors.

## [2026-05-04] create | Select dropdown — closed states + open menu + searchable filter

Built `src/components/ui/form/Select.jsx`. Source: Figma frame `50:6275`. Closed-state visuals reuse TextInput's state ladder verbatim (default / open / verified / error / disabled — same border/shadow combos). Open state renders a popover menu 12px below the trigger:

- Menu container: `bg-white border-2 border-brand-green-light-active rounded-md p-3 shadow-[0_-4px_0_0_rgba(34,70,38,0.8)]` — note the **inverse Y shadow** (4px upward) which complements the trigger's downward 2.5px shadow, so the trigger + menu visually "hover" connected through the gap.
- Optional searchable filter at top of menu (`searchable` prop); auto-focuses on open, filters case-insensitively.
- Selected option is highlighted with `bg-brand-green-light`; hover applies the same.
- Click-outside / Escape closes; Enter / Space / ↓ on the trigger opens.
- ARIA: `role="combobox"` on the trigger with `aria-haspopup`/`aria-expanded`/`aria-controls`; `role="listbox"` on the menu; `role="option"` + `aria-selected` on each item.

**Hybrid pattern preserved** — Field is built in (label / required / optional / helperText / error props on the Select itself).

**Showcase additions in HomePage**:

- 5-state grid (Default / Open pinned / Verified / Error / Disabled) using the `state` prop.
- "Cascading" example demonstrating that we don't need a special prop — passing `disabled={!parentValue}` from the consumer is enough. Selecting a Level unlocks Grade with level-specific options; changing Level resets Grade.
- "Interactive (with search)" — type to filter through the country list; `verified` flips on as soon as you pick something.

**Out of scope for v1** (documented in components.md): grouped options with section headers (Figma "Grouped Options" section, node `2047:9056`); full keyboard navigation through options (Up/Down to highlight + Enter to select); multi-select. Cascading is solved at the parent level — no special prop needed.

**Wiki updates**:

- `wiki/components.md` — Select entry under Form primitives + "Select details" section with prop table, keyboard reference, and out-of-scope patterns.
- `wiki/figma-node-map.md` — added "Select / Dropdown — internal symbol IDs" sub-table covering closed states, open-menu containers, grouped-options menu, and the cascading example container.

**Verification**: lint, format:check, build (CSS 39.41 kB, was 37.71), e2e all green. Playwright MCP visual confirmed pinned-open menu renders, cascading example locks the second Select correctly, and the interactive search filters live; 0 console errors.

## [2026-05-04] create | Form primitives — Field + TextInput (hybrid pattern)

Built the first form primitives under a dedicated `src/components/ui/form/` subfolder with a barrel `index.js`. Hybrid Field pattern: form primitives accept Field props directly (built-in label/error/helper) and Field is also exposed for composition with non-text controls.

**`Field.jsx`** — generic wrapper rendering label row (label + green `*` for required + "optional" badge) above a control and a helper/error row with the design-system alert icon (`20-alert`) below. `error` prop takes precedence over `helperText`, switches the row colour to `text-danger`, and adds `role="alert"` + `aria-invalid` for accessibility.

**`TextInput.jsx`** — text input with built-in Field. Accepts standard native `<input>` props (`type`, `value`, `onChange`, `ref`, etc.) plus all Field props plus `verified` (boolean), `leftIcon`/`rightIcon` (ReactNode), and a showcase-only `state` prop. State derivation order: forced `state` → `disabled` → `error` → `verified` → interactive (`:focus-within`).

**Visual specs** pulled from Figma frame `50:6914`, symbols 2278:7339 (default), 2278:7337 (focus), 2282:8880 (filled), 2278:7341 (verified), 2278:7340 (error), 2278:7338 (disabled). Shared shape: 51px-tall input box, 10px radius, 2.5px shelf shadow (lighter than the button's 4px). State-specific colours:

- Default: `border-[#ccc]` + grey shelf
- Focus / verified: `border-brand-green-light-active` + green-tinted shelf, `bg-yellow-light` on focus
- Error: `border-danger-light-active` + red-tinted shelf
- Disabled: `bg-brand-green-light` + grey border + opacity 0.55, no shelf

**Showcase** added to HomePage:

- 5-state grid (Default / Focus / Verified / Error / Disabled) using the `state` prop to pin visuals
- Real-world examples: Email, Phone (+233), Password (with eye toggle), ID number
- Interactive form with email validation (verified/error swap on submit)

**Wiki updates**:

- `wiki/components.md` — added Form primitives section with Field + TextInput entries, hybrid-pattern explanation, state-derivation rules, prop tables.

**Verification**: lint, format:check, build, e2e all green. Playwright MCP visual check at 1440×900 confirmed all states render; 0 console errors.

**Folder convention** (decided this session): `ui/form/` subfolder for all form primitives that share the Field abstraction; flat `ui/` for non-form primitives (Button, Card, Modal, Tag, Loader, ProgressBar, MiniCard). Form primitives benefit from co-location because they share label / helper / error / RHF-integration patterns. Non-form primitives don't share that scaffolding so flat is fine.

## [2026-05-04] create | Button component + design-system playground

Built the first reusable UI primitive: `src/components/ui/Button.jsx`. Source: Figma frame `50:6295` ("Buttons"). Pulled design context for 12 variant/state symbols (per-symbol IDs catalogued in `figma-node-map.md` under "Button — internal symbol IDs").

**Component shape**

- 5 variants: `primary` (green, gradient text), `secondary` (gold), `tertiary` (white shelf), `tertiary-subtle` (light-green pill, no shelf), `tertiary-cream` (cream shelf).
- 3 sizes: `lg` (px-34 py-16 r-14), `md` (px-28 py-14 r-10), `sm` (px-18 py-12 r-10).
- States driven by `:hover`, `:active`, `:disabled` pseudo-classes for interactive use; a `state` prop forces a visual state for showcase/documentation.

**Distinctive visual: the "shelf"**

Buttons render a 4px coloured "shelf" beneath them via `drop-shadow-[0_4px_0_<dark>]`. On hover the shelf deepens 1px (4 → 5). On active (pressed) the shelf collapses entirely and the button `translate-y-1` (4px down) — visually sinking into the space the shelf occupied. Faithful to Figma. Drop-shadow filter doesn't affect layout box, so total reserved height stays constant (no jiggle).

**Primary text is a gradient**

Inline style `linear-gradient(188.377deg, rgb(254,241,231) 0%, rgb(232,242,237) 20.192%)` applied with `bg-clip-text text-transparent` on a span wrapping the children. Falls back to white text when disabled.

**Showcase**

`src/pages/HomePage.jsx` rewritten as a design-system playground rendering all 60 button permutations (5 × 3 × 4) plus interactive examples and icon-slot demos. The TalentHub h1 still uses `text-display-lg` so the existing e2e test continues to pass.

**Wiki updates**

- `wiki/figma-node-map.md` — added "Components" table (12 component frame URLs catalogued: Button, Forms input, Dropdowns, Cards, Checkbox, Verification code, Text area, Loaders, Upload, Progress bars, Mini cards, Tags) + "Button — internal symbol IDs" sub-table.
- `wiki/components.md` — added Button under UI Primitives with full prop table, variant matrix, state transitions, size table.

**Verification**: lint, format:check, build, e2e all green. Playwright MCP visual check confirmed all 60 variants render correctly at 1440×900; 0 console errors (only React Router v7 deprecation warnings — unrelated).

## [2026-05-04] fix | Font families corrected from Figma declarations (44:7372, 41:228)

Pulled the explicit font-family declarations from the design-system Figma file:

- **Display / headings** (Figma `44:7372`): `Instrument Serif for display & headings` — kept (already loaded as a Google Font).
- **Body / paragraphs** (Figma `41:228`): `SF Pro Rounded` — Apple's proprietary system font, **not available on Google Fonts**.

Resolved by switching the body font from Inter to a layered stack: `'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Nunito', system-ui, sans-serif`. SF Pro Rounded renders natively on Apple devices; non-Apple platforms get Nunito (variable, rounded geometric sans loaded from Google Fonts) as the closest visual equivalent. Tag `🔗 EXTERNAL` for Apple-side rendering.

Removed Inter and Raleway from `index.html`'s Google Fonts loader (no longer the body font; nothing references them). Renamed `--font-serif-display` → `--font-display` and dropped `--font-inter`/`--font-raleway` tokens from the theme.

Added a CSS rule that auto-applies `--font-display` to every `.text-display-*` utility so `<h1 class="text-display-xl">` uses Instrument Serif by default. The italic display row (`.text-display-italic`) also gets `font-style: italic` automatically.

Files updated: `index.html`, `src/index.css`, `wiki/design-tokens.md`.

## [2026-05-04] ingest | Full design-system foundations from Figma (semantic colors, typography, spacing, radius, shadows)

Pulled from 8 Figma frames in `Bin8roWL8sloyc36IgFMuT`:

- **Semantic colors** (`45:11090`): 4 new color families — Informative, Success, Warning, Danger — each with the same 10-step state ladder (Success has only 9 — no Darker).
- **Display / headline typography** (`44:7368`): 5 styles — Display XL/Large/Medium/Small + Italic accent. Inter SemiBold for the first four, Instrument Serif Regular for the italic accent.
- **Paragraph typography** (`41:224`): 27 styles in a clean grid — Strong / Medium / Normal weights × 9 sizes (25, 50, 75, 100, 200, 300, 400, 500, 600). Sizes range 10/16 → 48/64 px.
- **Paragraph underline variants** (`41:274`): same 27-style scale rendered with `text-decoration: underline`. No separate tokens — compose with Tailwind's `underline` utility.
- **Spacing scale** (`46:5715`): 16-step scale from 4px to 192px on a 4/8 grid. Tailwind v4's default `--spacing: 0.25rem` already matches.
- **Border radius** (`46:6461`): sm 6 / md 10 / lg 16 / xl 24 / pill 100 px. Replaced previous elysium placeholder values.
- **Shadows** (`46:6704`): general SM/MD/LG/Green + top.100–400 + bottom.100–400 elevation system.
- **Button shelf shadow** (`50:8233`): brand-green CTA grounding shadow.

Also pulled `Content/Primary` (#272E35), `Content/Secondary` (#555F6D), `Content/Tertiary` (#7E8B99), `Background/Default` (#FFFFFF), `Background/Subtle Neutral` (#F5F7F9), `Border/Default` (#E9ECEF), `Border/Neutral` (#555F6D) into dedicated `--color-content-*`, `--color-background-*`, `--color-border-*` semantic tokens.

**Font defaults updated**: body now uses Inter (was Raleway). Loaded Instrument Serif from Google Fonts. Inter switched to variable-weight (`wght@100..900`) so the design system's 450 weight resolves correctly.

Files updated: `src/index.css` (full theme rewrite), `index.html` (Google Fonts link), `src/layout/MainLayout.jsx` (removed `font-raleway`), `src/pages/HomePage.jsx` (uses new `text-display-md` / `text-medium-200` / `text-medium-75` + content/\* color tokens), `wiki/design-tokens.md`, `wiki/figma-node-map.md`.

Build still passes; CSS bundle 8.69 kB → 10.00 kB.

## [2026-05-04] ingest | Color tokens replaced with Figma values from "Gh Design system" frame 45:7799

Pulled all 5 color families (Brand-Green, Accent & Highlights, Grey-Neutrals, Black, Yellow-Background) from Figma file `Bin8roWL8sloyc36IgFMuT`, frame `45:7799`. Removed the elysium-derived placeholder palette (`primary/secondary/tertiary` × `light/normal/dark`) from `src/index.css` and replaced with 50 swatches across 5 families using flat Tailwind v4 names (e.g. `bg-brand-green`, `bg-brand-green-hover`, `bg-brand-green-darker`).

Migrated existing JSX usages of the old token names to the new ones:

- `text-tertiary-normal-default` → `text-black`
- `text-tertiary-normal-hover` → `text-black-hover`
- `text-tertiary-normal-active` / `bg-primary-light-default` / `border-tertiary-light-default` → matching neutral/black equivalents
- `text-secondary-normal-default` → `text-brand-green`

Files updated: `src/index.css`, `src/pages/HomePage.jsx`, `src/components/shared/Navbar.jsx`, `src/components/shared/Footer.jsx`, `wiki/design-tokens.md`, `wiki/figma-node-map.md`.

Open follow-ups:

- Promote `Content/Primary` (#272E35), `Content/Secondary` (#555F6D), `Background/Default` (#FFFFFF), `Border/Default` (#E9ECEF) from Figma variable defs into dedicated semantic tokens (`--color-content-*`, `--color-border-*`).
- Ingest the full typography ramp (Inter Strong/Medium/Regular at all sizes) into `--text-*` tokens.
- Verify radii/gaps/shadows/overlays against the Figma design system (currently still elysium placeholders).
- Identify the actual onboarding screen frames in this Figma file and add to `wiki/figma-node-map.md`.
