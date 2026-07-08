# Figma Node Map

Maps Figma frames to their node IDs so prompts can reference exact specs.

## File information `✅ VERIFIED` (as of 2026-05-04)

| Field     | Value                                                                             |
| --------- | --------------------------------------------------------------------------------- |
| File name | Gh Design system - onboading                                                      |
| File key  | `Bin8roWL8sloyc36IgFMuT`                                                          |
| URL       | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading> |

## How to populate (when new frames are added)

1. Start the Figma official Dev Mode MCP server locally (HTTP on `http://127.0.0.1:3845/mcp` — Figma desktop → Preferences → Enable Dev Mode MCP Server).
2. Confirm `.mcp.json` lists the Figma server (it does).
3. Open Claude Code in this project — Figma MCP tools should appear.
4. Use `get_metadata` on the file root to discover top-level pages and their frames.
5. For each frame you'll be implementing, record its `node_id` and viewport (Desktop / Mobile).
6. Append to the table below.

## Design-system documentation pages `✅ VERIFIED`

### Colors — Primary Brand (frame `45:7799`)

Color swatch documentation, 1440×3279. Source for the brand color tokens in [design-tokens.md](design-tokens.md).

| Section name                          | Section frame | Header instance | Swatches container |
| ------------------------------------- | ------------- | --------------- | ------------------ |
| Brand-Green                           | `45:7802`     | `45:7803`       | `45:9698`          |
| Accent& Hightlights _(typo in Figma)_ | `45:7819`     | `45:7820`       | `45:9970`          |
| grey -Neutrals                        | `45:7836`     | `45:7837`       | `45:13500`         |
| Black                                 | `45:7853`     | `45:7854`       | `45:13622`         |
| Yellow -Background                    | `45:7870`     | `45:7871`       | `45:13744`         |

### Colors — Semantic colors (frame `45:11090`)

| Section name               | Section frame        | Header instance | Swatches container |
| -------------------------- | -------------------- | --------------- | ------------------ |
| Informative                | `45:11357`           | `45:11358`      | `45:14771`         |
| Success / Positive results | `45:11374`           | `45:11375`      | `45:14516`         |
| Warning                    | _(no Section frame)_ | `45:14378`      | `45:14254`         |
| Danger / Destructive       | _(no Section frame)_ | `45:14381`      | `45:13999`         |

### Foundations

| Frame name                       | Node ID   | Notes                                                                                                           |
| -------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| Headline / Text Styles - Default | `44:7368` | 5 display styles + italic accent. Source for `--text-display-*`.                                                |
| Paragraph (default)              | `41:224`  | 27 styles (Strong/Medium/Normal × 9 sizes). Source for `--text-strong-*`, `--text-medium-*`, `--text-normal-*`. |
| Paragraph (underline variant)    | `41:274`  | 27 underline styles — same scale, no separate tokens (compose with Tailwind `underline`).                       |
| Spacing Scale                    | `46:5715` | 16-step scale from 4px to 192px on a 4/8 grid. Maps to Tailwind `--spacing` 0.25rem base.                       |
| Border Radius                    | `46:6461` | sm/md/lg/xl/pill (6/10/16/24/100 px). Source for `--radius-*`.                                                  |
| Shadow / Elevation               | `46:6704` | General SM/MD/LG/Green + top.100–400 + bottom.100–400. Source for `--shadow-*`.                                 |
| Button Shadows                   | `50:8233` | Brand-green button shelf shadow. Source for `--shadow-button-shelf`.                                            |

### Components `🔗 EXTERNAL`

Component documentation frames. Pull `get_design_context` per frame when implementing each component. Implementation status tracked in [components.md](components.md).

| Component         | Node ID      | URL                                                                                                  |
| ----------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| Button            | `50:6295`    | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=50-6295>    |
| Forms input       | `50:6914`    | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=50-6914>    |
| Dropdowns         | `50:6275`    | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=50-6275>    |
| Cards             | `50:8153`    | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=50-8153>    |
| Checkbox          | `2019:13564` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2019-13564> |
| Verification code | `2021:911`   | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2021-911>   |
| Text area         | `2021:950`   | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2021-950>   |
| Loaders           | `2168:24062` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2168-24062> |
| Upload            | `3014:57097` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=3014-57097> |
| Progress bars     | `2282:23906` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=2282-23906> |
| Mini cards        | `3384:76788` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=3384-76788> |
| Tags              | `3167:29034` | <https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT/Gh-Design-system--onboading?node-id=3167-29034> |

### Card — internal symbol IDs (frame `50:8153`)

Variant symbols inside the "Select student cards" frame.

| State             | Symbol ID    |
| ----------------- | ------------ |
| Default           | `2153:11577` |
| Hover             | `2153:11576` |
| Active / Selected | `2153:11575` |

### Select / Dropdown — internal symbol IDs (frame `50:6275`)

| Variant                                    | Symbol ID                      |
| ------------------------------------------ | ------------------------------ |
| Closed default                             | `2418:40505`                   |
| Closed active / open                       | `2418:40504`                   |
| Closed verified                            | `2418:40503`                   |
| Closed error                               | `2418:40501`                   |
| Closed disabled                            | `2418:40502`                   |
| Closed variant 6 (extra)                   | `2418:40539`                   |
| Open menu container (with options)         | `2050:9209`                    |
| Open searchable + filter input             | `2043:8986`                    |
| Grouped-options menu (with section header) | `2047:9056`                    |
| Cascading example (Level + Grade)          | `2042:8776` (parent container) |

### Textarea — internal symbol IDs (frame `2021:950`)

Variant symbols inside the "Text Area" frame. Figma exposes only Default + Active/Filled — error and disabled visuals are derived from the existing token ladder (matches TextInput's state-derivation rules).

| Variant                  | Symbol ID   |
| ------------------------ | ----------- |
| Default                  | `2022:1074` |
| Active / Filled          | `2022:1118` |
| Default + optional       | `2022:1089` |
| Active/Filled + optional | `2023:1160` |

The four panels in the frame are the same component rendered with `optional` toggled and active/default — all four use `2022:1074`-style or `2022:1118`-style box visuals (one of two looks).

### Loader — internal symbol IDs (frame `2168:24062`)

The Figma uses a layered approach — a static raster background plus 5 copies of a 2-keyframe animation symbol — to fake a dot orbiting a circle. The React implementation replaces the asset stack with a single SVG arc + Tailwind's `animate-spin`, which is visually equivalent and free of asset dependencies.

| Symbol                 | Symbol ID    | Purpose                                                      |
| ---------------------- | ------------ | ------------------------------------------------------------ |
| `Loader` (60×60)       | `2168:23593` | Main spinner reference — sets the default `size="md"` 60px.  |
| `.base` (32×32)        | `2168:23609` | Smaller reference — sets `size="sm"` 32px.                   |
| Animation `Keyframe=1` | `2168:23601` | Keyframe symbol used to compose the orbit illusion in Figma. |
| Animation `Keyframe=2` | `2168:23605` | Same.                                                        |

### Checkbox — internal symbol IDs (frame `2019:13564`)

Variant symbols inside the "Check Box" frame.

| State              | Symbol ID    |
| ------------------ | ------------ |
| Default            | `2019:14112` |
| Active (= checked) | `2019:14111` |

Figma exposes only Default + Active. Error and disabled visuals are derived from the existing token ladder (danger-light-active border + 80%-alpha red shelf for error; opacity 0.55 + no shelf for disabled) — see `Checkbox.jsx` for the full state map.

Composition examples in the frame (also useful for label patterns):

| Symbol                                | Symbol ID    | Notes                                 |
| ------------------------------------- | ------------ | ------------------------------------- |
| `checkbox with label writing` (T&C)   | `2019:14126` | Inline links + required `*` example   |
| `label` (single-line consent)         | `2020:909`   | Required `*` after the label text     |
| `TEXT CHECK BOX` (optional marketing) | `2020:910`   | "(optional)" appended in lighter grey |

### Verification code — internal symbol IDs (frame `2021:911`)

Per-box variant symbols inside the "Verification Code" frame. Each box is 62×62.

| State    | Symbol ID   |
| -------- | ----------- |
| Default  | `2024:1305` |
| Active   | `2024:1303` |
| Error    | `2024:1304` |
| Disabled | `2024:1357` |

The "live" example in Figma demonstrates the 6-digit code rendered as `3 + dot + 3` (separator at `2024:1256`). The `splitAfter` prop on `VerificationCode.jsx` reproduces this — see `Container` instances `2024:1307` / `2024:1313` / `2024:1317` / `2024:1336` / `2024:1341` / `2024:1346` for the six box positions and the centered `·` separator at index 3.

### Button — internal symbol IDs (frame `50:6295`)

Variant/state symbols inside the Button frame. Useful for re-querying specific states.

| Variant                        | Size | State            | Symbol ID    |
| ------------------------------ | ---- | ---------------- | ------------ |
| Primary                        | Lg   | Default          | `57:6267`    |
| Primary                        | Md   | Default          | `57:6290`    |
| Primary                        | Sm   | Default          | `57:6328`    |
| Primary                        | Lg   | Hover            | `57:6271`    |
| Primary                        | Lg   | Active (pressed) | `57:6277`    |
| Primary                        | Lg   | Disabled         | `57:6284`    |
| Secondary                      | Lg   | Default          | `57:6356`    |
| Secondary                      | Lg   | Hover            | `57:6352`    |
| Secondary                      | Lg   | Active           | `57:6348`    |
| Tertiary 1 (white shelf)       | —    | Default          | `2018:12872` |
| Tertiary 2 (subtle green pill) | —    | Default          | `2018:12927` |
| Tertiary 3 (cream shelf)       | —    | Default          | `2757:20994` |

### ProgressBar — internal symbol IDs (frame `2282:23906`)

The Figma frame shows four fill-percentage examples; the React component collapses them into a single `value`-driven primitive (Default = empty 16% spec, Variant2/4 = mid-fill, Variant3 = full-fill with the rounded-6 track).

| Variant  | Symbol ID    | Fill                     |
| -------- | ------------ | ------------------------ |
| Default  | `2282:23891` | empty (16%) — track only |
| Variant2 | `2282:23893` | ~57%                     |
| Variant4 | `2282:23897` | ~83%                     |
| Variant3 | `2282:23895` | 100% (full track radius) |

### Watch Tutorial — internal symbol IDs (frame `2255:1597`)

Inside the "Other components" frame `2255:8014`. The React component collapses the variants into a single primitive with `showLabel` toggling the cream pill.

| Variant                                    | Symbol ID   |
| ------------------------------------------ | ----------- |
| Variant 2 — button only (semi-transparent) | `2255:1604` |
| Variant2 — label + button (full)           | `2255:1639` |
| Variant3 — label hidden, full button       | `2255:1658` |

### Breadcrumbs — internal symbol IDs (frame `2263:8179`)

Vertical step-list items. Three status variants drive the icon + label colour.

| Status                          | Symbol ID   |
| ------------------------------- | ----------- |
| Pending (grey check, grey)      | `2263:8178` |
| Active (green filled, semibold) | `2263:8180` |
| Completed (green filled, grey)  | `2263:8186` |

### Captions — internal symbol IDs

Horizontal "you are here" indicator inside frame `2255:8014`.

| Element            | Symbol ID    |
| ------------------ | ------------ |
| Captions container | `2374:15129` |

## Landing — Hero (frame `2513:27809`) `✅ VERIFIED`

Hero frame is 1729×1084. Query sub-frames individually to stay under MCP's 12K-token cap.

| Sub-frame             | Node ID      | Size      | Origin (hero-relative) | Notes                                                           |
| --------------------- | ------------ | --------- | ---------------------- | --------------------------------------------------------------- |
| Left column content   | `2520:28985` | 711 × 580 | (55, 237)              | Career level pill, headline, sub-copy, CTA, scribble, stats row |
| Right column photo    | `2527:29175` | 770 × 869 | (903, 132)             | Sparkle, dual rotated photo cards, 6 floating UI cards          |
| Trusted-by + flag bar | `2532:30146` | 931 × 67  | (54, 869)              | "TRUSTED BY" + scrolling partner strip                          |
| Scroll cue            | `2519:28921` | 65 × 78   | (832, 982)             | Mouse pill + "Scroll" caption                                   |

### Hero background decorations

All positions in hero-frame coordinates. SVGs ship with their own gradients/blur/opacity baked in.

| Element               | Node ID      | Hero-x | Hero-y | Size        | Asset                             |
| --------------------- | ------------ | ------ | ------ | ----------- | --------------------------------- |
| Background grid       | `2519:28917` | 1      | 0      | 1723 × 1082 | `background grid.svg`             |
| hero-orb1 (TL green)  | `2513:27811` | -86.5  | -121.9 | 540 × 609   | `hero-orb1.svg` (453×488 cropped) |
| hero-orb2 (BR gold)   | `2513:27812` | 1365.2 | 893.9  | 450 × 508   | `hero-orb2.svg` (364×191 cropped) |
| Ellipse 5 (gold blur) | `2517:28636` | 1464   | 50     | 529 × 529   | `Ellipse 5.svg` (465×779 w/ blur) |
| Large G-form (top-R)  | `2527:29181` | 1395   | 47     | 307 × 326   | `Large G-form.svg`                |
| Large G-form (bot-L)  | `2527:29176` | 26     | 868    | 374 × 389   | `Large G-form.svg`                |

### Hero floating UI cards (inside Group 7, `2527:29175`)

Each floating card is a composed Figma vector exported as a single SVG. The SVG viewport is wider/taller than the visible card to accommodate the drop shadow — left/top in JSX is offset accordingly.

| Card                 | Node ID      | Frame size    | SVG size  | Asset                            |
| -------------------- | ------------ | ------------- | --------- | -------------------------------- |
| Your next adventure  | `2517:28765` | 129 × 96      | 191 × 157 | `Your next adventure vector.svg` |
| Power your career    | `2517:28768` | 190 × 39      | 246 × 95  | `power your career vector.svg`   |
| Quiz Complete        | `2517:28773` | 128 × 38      | 192 × 102 | `quiz complete.svg`              |
| My Experience        | `2517:28779` | 178.6 × 148.6 | 239 × 209 | `my experience vector.svg`       |
| +350 XP earned today | `2527:29190` | 175 × 41      | 175 × 45  | `XP earned today vector.svg`     |
| Lift your talent     | `2517:28788` | 193 × 109     | 229 × 145 | `Lift your talent vector.svg`    |
| Sparkle decoration   | `2527:29150` | 181 × 180     | 182 × 181 | `sparkle vector.svg`             |

## Onboarding screens `✅ VERIFIED`

The file is named "onboading" (sic). Frames catalogued as implemented.

### Institution Bulk-Onboarding — Guidelines screen (frame `2971:65353`) `✅ VERIFIED`

Main frame: 1728 × 1084. Route: `/onboarding/institution/guidelines`.
Implemented in `src/components/sections/institutionOnboarding/GuidelinesSection.jsx`.

**Top-level sub-frames**

| Sub-frame               | Node ID      | Size / position in frame | Notes                                           |
| ----------------------- | ------------ | ------------------------ | ----------------------------------------------- |
| Nav bar                 | `2971:65405` | full-width top           | OnboardingNavbar — no new code needed           |
| Left content column     | `2971:65523` | x=0, y=143, ~989px wide  | Tag · headline · sub-copy · badge · steps · CTA |
| Right photo composition | `2971:68519` | x=989, y=143, 739×973    | Frame 150 — 3 rotated photo cards               |

**Left column inner nodes**

| Element           | Node ID      | Key tokens / values                                                                                 |
| ----------------- | ------------ | --------------------------------------------------------------------------------------------------- |
| "Institution" tag | `2971:65523` | bg brand-green-light, border brand-green, text 10px medium, rounded-[5px]                           |
| Headline block    | `2971:65523` | Instrument Serif 64px/70px, tracking -0.64px, text-black, "next." italic brand-green                |
| Sub-copy          | `2971:65523` | SF Pro Rounded 16px/24px, color #737373 (content-helper), max-w 482px                               |
| Time badge        | `2971:65537` | bg yellow-light (#fffefc), border black-light-hover (#dbdbdb), rounded-[8px], status-dot glow       |
| Step 1            | `2971:65547` | numeral color brand-green-dark (#2A5730), title semibold brand-green, desc neutral-darker (#575755) |
| Step 2            | `2971:65555` | same as Step 1                                                                                      |
| Step 3            | `2971:65563` | numeral color brand-green-darker (#142916), otherwise same                                          |
| CTA block         | `2971:65571` | primary Button full-width + "Already Have an account?" / "Log in Instead" link                      |

**Right photo composition panel** `✅ VERIFIED` (2026-05-21 — Figma MCP re-extracted)

Panel node: `2971:68519`. Figma dims: 739×973px. Background: `#387440` (brand-green).
Panel width in code: `clamp(360px, 42vw, 739px)`. `overflow-hidden` clips blobs and the intentionally overflowing small card.

**BG decoration layers (render order, back → front)**

| Layer                  | Node ID      | Asset file                         | Position / size                                                                        | Opacity |
| ---------------------- | ------------ | ---------------------------------- | -------------------------------------------------------------------------------------- | ------- |
| Ellipse blob top-right | `2971:68520` | `institution-panel-ellipse-tr.svg` | `left: 83.5%, top: -21.6%`, container `clamp(200px,64%,473px)²`, inner `inset:-42.28%` | 100%    |
| Ellipse blob bot-left  | `2971:68521` | `institution-panel-ellipse-bl.svg` | `left: -23.1%, bottom: -22.9%`, same container size, inner `inset:-63.42%`             | 100%    |
| Inverted grid          | `2971:68522` | `institution-panel-bg-grid.png`    | `right:-2px, top:58.8%, width:48.4%, height:41.6%`, `rotate(180deg) scaleY(-1)`        | 100%    |
| BG lines frame         | `2971:68526` | `institution-panel-bg-lines.svg`   | `inset: 0.05% -43.79% -9.64% 0.03%` (extends 43.79% past right edge)                   | 30%     |

**Right photo composition cards — center-based positioning with translate(-50%,-50%)**

All cards: `aspect-ratio:1/1`, `border: clamp(5px,0.9vw,10px)`, `border-radius: clamp(20px,3.2vw,40px)`, `shadow-bottom-400 overflow-hidden`. Card ellipse decoration inside each: `left:-75.84px, top:-85.44px, size:238px`, inner image `size:223px rotate(-4deg)`.

| Card   | Node ID      | Center left | Center top | Width (code)                 | Transform                    | Border    | Photo asset                               |
| ------ | ------------ | ----------- | ---------- | ---------------------------- | ---------------------------- | --------- | ----------------------------------------- |
| Large  | `2971:68890` | 48.7%       | 44.4%      | `clamp(250px, 76.3%, 564px)` | `rotate(4deg)`               | `#eedeb8` | `Students using GTH on phone.jpg` (group) |
| Small  | `2971:68896` | 77.6%       | 17.8%      | `clamp(100px, 26.5%, 196px)` | `rotate(-167deg) scaleY(-1)` | `#c1d4c4` | `institution-solo-student.png`            |
| Medium | `2971:68893` | 22.6%       | 72%        | `clamp(140px, 34.5%, 255px)` | `rotate(-13deg)`             | `#c1d4c4` | `institution-solo-student.png`            |

Center derivation: Large=(78+282)/739=48.7%, (150+282)/973=44.4% · Small=(739-48.21-117.39)/739=77.6%, (56+117.39)/973=17.8% · Medium=(14.003+152.767)/739=22.6%, (973-119.46-152.767)/973=72%.

Card ellipse assets: `institution-card-ellipse-lg.svg` (large card), `institution-card-ellipse-sm.svg` (medium+small).

**Tokens added / confirmed during this build**

| Token                    | Value     | Where used                                             |
| ------------------------ | --------- | ------------------------------------------------------ |
| `--color-content-helper` | `#737373` | sub-copy, time badge label, "Already Have an account?" |

## Institution onboarding — step 1 (Your Institution) `🔶 LIKELY`

_Figma MCP was unavailable during this build (Dev Mode server offline). Tokens from previous session pre-flight._

### Breadcrumb bar (2968:24850)

| Property         | Value                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Container height | 48px (`h-12`), `bg-white`, `border-b #e7e7e7`                                            |
| Step count       | 8 (Institution → Contact → Activate → Template → Upload → Validate → Confirm → Report)   |
| Step icon        | 16×16 check-circle; active `#387440`, pending `#babab7`                                  |
| Step text        | 14px, capitalize, tracking `0.14px`; active semibold `#387440`, pending medium `#babab7` |
| Separator        | 4×6px chevron in 24px-wide container                                                     |
| Progress label   | "COMPLETE" 12px uppercase `#bfbfbf` tracking `0.5px`                                     |
| Progress value   | 14px semibold `#387440`                                                                  |
| Progress bar     | `ProgressBar` md (6px), `w-[72px]`                                                       |
| Component        | `src/components/shared/InstitutionOnboardingBreadcrumb.jsx`                              |

### Form page outer container (2968:24734)

Same two-column shell as Guidelines; Chrome = OnboardingNavbar + InstitutionOnboardingBreadcrumb.

### Your Institution form (2972:71456 empty · 2972:72682 filled · 2972:74318 save-continue)

| Property       | Value                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Max-width      | 554px (same as Guidelines left column)                                                               |
| Captions badge | `items=['Institution Setup'] currentIndex=0`                                                         |
| Headline       | Instrument Serif `clamp(2rem, 4.4vw, 4rem)`, tracking `-0.64px`, "Tell us about your _institution._" |
| Field layout   | Row 1: 2-col (legal name + trading name); Row 2: full-width (type); Row 3: 2-col (region + district) |
| District       | Cascading: disabled until Region selected; resets on region change                                   |
| CTA            | "Save & Continue" primary lg, ArrowRight icon, loading spinner                                       |
| Component      | `src/components/sections/institutionOnboarding/YourInstitutionSection.jsx`                           |

### Identity Captured modal (2972:75943 and variants 75950 / 75953 / 75956 / 75957 / 75958 / 75990 / 75995 / 75996)

| Property   | Value                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Overlay    | `fixed inset-0 z-50 bg-black/50`                                                                                                        |
| Card       | `max-w-[600px] rounded-3xl bg-white p-10 shadow-xl`                                                                                     |
| Icon box   | `size-[62px] bg-brand-green-light rounded-2xl` + check SVG                                                                              |
| Title      | Instrument Serif `clamp(1.375rem, 2.2vw, 1.75rem)`, tracking `-0.28px`                                                                  |
| Data table | 5 rows (Institution Name, Trading Name, Institution Type, Region, District); label `#70706e`, value `#111 semibold`; `border-b #e6e6e6` |
| CTA        | "Continue To Contact Details" primary lg → `/onboarding/institution/contact`                                                            |
| Component  | `src/components/sections/institutionOnboarding/IdentityCapturedModal.jsx`                                                               |

### Additional field-state frames (2972:72229–72260, 2972:72454, 2972:72470)

These frames document individual TextInput/Select component states (default, active, filled, error, disabled). All covered by the existing `TextInput` and `Select` primitives — no new components needed.

## Institution Contact Details step (step 2 of 8) `✅ VERIFIED`

Main frames: **2972:76072** (form / empty), **2972:76088** (OTP modal open).

### ContactInfoSection form (2972:76072)

| Property      | Value                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route         | `/onboarding/institution/contact`                                                                                                                     |
| Step badge    | Captions `{ index: '02', label: 'Contact Details' }`                                                                                                  |
| Headline      | Instrument Serif `clamp(2rem, 4.4vw, 4rem)`, tracking `-0.64px`; "out to?" italic brand-green                                                         |
| Description   | None (form starts directly after WavyDivider)                                                                                                         |
| Row 1 (2-col) | Full Name (UserIcon) \| Role / Title (BriefcaseIcon)                                                                                                  |
| Row 2 (2-col) | Phone Number (PhoneInput, labelTrailing="SMS verification") \| Email Address (MailIcon, labelTrailing="Email verification", DiamondIcon green helper) |
| Row 3 (2-col) | Password (PasswordInput) \| Confirm Password (PasswordInput, "Passwords match" successText)                                                           |
| CTA           | "Save & Continue" primary lg with ArrowRightIcon; LoadingSpinner while submitting                                                                     |
| Component     | `src/components/sections/institutionOnboarding/ContactInfoSection.jsx`                                                                                |

### ContactVerificationModal — OTP stage (2972:76088)

| Property       | Value                                                                                   |
| -------------- | --------------------------------------------------------------------------------------- |
| Card size      | `max-w-[540px]`, `rounded-3xl`, `p-10`                                                  |
| Header icon    | 64×64 `rounded-2xl bg-brand-green-light`, `MessageBubbleIcon` (28×28, stroke `#387440`) |
| Headline       | Instrument Serif `clamp(1.375rem, 2.2vw, 1.875rem)`, "messages." italic brand-green     |
| Tabs           | SMS \| Email pill switcher; verified tab shows ✓ badge                                  |
| Target display | Masked phone (+233 XX ••• ••XX) or masked email (k••••e@domain.com)                     |
| OTP input      | `VerificationCode` length=6 splitAfter=3 autoFocus                                      |
| Timer          | ClockIcon + "Code expires in M:SS" (600s countdown)                                     |
| Resend         | "Resend in 0:XX" → "Resend" after 59s delay (resets on tab switch)                      |
| Verify CTA     | "Verify Phone Number" / "Verify Email & Complete" (disabled until 6 digits entered)     |
| Trust badge    | ShieldCheckIcon + "Your contact details are encrypted at rest"                          |

### ContactVerificationModal — success stage

| Property    | Value                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Card size   | `max-w-[440px]`, `rounded-3xl`, `p-10`                                                                                                  |
| Header icon | 62×62 `rounded-2xl bg-brand-green-light`, `SuccessCheckIcon` (32×32, stroke `#387440`)                                                  |
| Headline    | Instrument Serif `clamp(1.375rem, 2.2vw, 2rem)`, "verified." italic brand-green                                                         |
| Data table  | 4 rows (Contact Name, Role/Title, Phone Number, Email Address); bg `#EBF1EC/30`, `border border-brand-green-light-hover`, `rounded-2xl` |
| CTA         | "Continue to Activate Account" primary lg → `/onboarding/institution/activate`                                                          |
| Trust badge | ShieldCheckIcon + Ghana Data Protection Act note                                                                                        |
| Component   | `src/components/sections/institutionOnboarding/ContactVerificationModal.jsx`                                                            |

### New icons added to assets.jsx for this step

| Icon            | Size  | Purpose                                                |
| --------------- | ----- | ------------------------------------------------------ |
| `BriefcaseIcon` | 16×16 | Left icon on Role / Title field (outline briefcase)    |
| `DiamondIcon`   | 8×8   | Filled diamond bullet beside Email verification helper |

## Institution Activate Account step (step 3 of 8) `✅ VERIFIED`

Main frame: **2973:79786** (full-width, no right panel).
Modal frames: **2977:84878** (base), variants 84882 / 84886 / 84892 / 84893 / 84894 / 84920 / 84924.

### ActivateSection layout (2973:79786)

| Property          | Value                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route             | `/onboarding/institution/activate`                                                                                                                                                                                                                                                                     |
| Right panel       | **None** — `InstitutionOnboardingLayout` hides panel for this route                                                                                                                                                                                                                                    |
| Step badge        | Captions `{ index: '03', label: 'Activate Account' }`                                                                                                                                                                                                                                                  |
| Headline          | Instrument Serif `clamp(2rem, 4.4vw, 4rem)`, tracking `-0.64px`; "go live." italic brand-green                                                                                                                                                                                                         |
| Subtext           | SF Pro Rounded Regular `clamp(0.875rem, 1.1vw, 1rem)` #737373, centre, max-w 520px                                                                                                                                                                                                                     |
| Review card       | `bg-white border border-[rgba(0,0,0,0.08)] rounded-[24px] shadow-[0_4px_0_0_rgba(0,0,0,0.13)]`                                                                                                                                                                                                         |
| Card section 1    | "INSTITUTION SETUP": SmallPersonIcon (11px) + uppercase label + EDIT link (`border-[#c1d4c4] rounded-[6px] h-[19px] text-[10px] uppercase tracking-[1px] text-brand-green`). 3-col row (Legal Name, Trading Name, Type) + 2-col row (Region, District). Fields: `bg-[#f8f8f4] rounded-[10px] h-[49px]` |
| Card section 2    | "CONTACT DETAILS": MailIcon (11px, className override) + EDIT link. 2-col: Left (Full Name, Phone, Password ••••••••) / Right (Role/Title, Email)                                                                                                                                                      |
| Field values      | "—" italic placeholder until institution onboarding store is wired                                                                                                                                                                                                                                     |
| Agreements header | SF Pro Rounded Bold 10px #babab7 uppercase tracking-[1px] + right horizontal divider                                                                                                                                                                                                                   |
| Checkbox 1        | T&C + Privacy Policy inline ReactNode links (brand-green underline) + red `*` embedded in label                                                                                                                                                                                                        |
| Checkbox 2        | Data consent + "Learn more" inline link + red `*`                                                                                                                                                                                                                                                      |
| Checkbox 3        | Authorisation confirmation + red `*`                                                                                                                                                                                                                                                                   |
| Info notice       | `bg-[#ebf1ec] border border-[#e0e7f9] rounded-[12px] h-[47px]` InfoCircleIcon + 12px medium green text                                                                                                                                                                                                 |
| CTA disabled      | `bg-[#bfbfbf]` grey `rounded-[14px]` `shadow-[0_4px_0_rgba(191,191,191,0.8)]` — `DisabledCTA` component                                                                                                                                                                                                |
| CTA enabled       | Brand-green primary `Button` size="lg" "Activate Institution →"; gates on `allAgreed`                                                                                                                                                                                                                  |
| Component         | `src/components/sections/institutionOnboarding/ActivateSection.jsx`                                                                                                                                                                                                                                    |

### TermsAcceptedModal (2977:84878)

| Property       | Value                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overlay        | `fixed inset-0 z-50 bg-black/50`                                                                                                                                                                                                           |
| Card           | `max-w-[440px] rounded-[24px] border-[3px] border-[#c1d4c4] bg-white p-10`                                                                                                                                                                 |
| Close button ✕ | `absolute top-5 right-5` · 28×28 · `bg-[#ebf1ec] rounded-[20px]` · `CloseIcon` 16px inside                                                                                                                                                 |
| Icon badge     | 64×64 `bg-[#e1eae2] rounded-[10px]` drop-shadow · 28×28 checkmark SVG (`stroke="#387440"`)                                                                                                                                                 |
| Title          | Instrument Serif `clamp(1.5rem, 2.5vw, 2rem)` tracking `-1.2px`; "Accepted" italic brand-green                                                                                                                                             |
| Subtitle       | SF Pro Rounded Regular 12px #959592 centre, 2 lines                                                                                                                                                                                        |
| Consent table  | `bg-[rgba(235,241,236,0.3)] border-[rgba(0,0,0,0.07)] rounded-[16px]`; 3 rows (T&C / Privacy Policy / Data Consent & Use Policy); 14×14 green RowCheckIcon + 10px semibold text + "—" dash right; row dividers `border-[rgba(0,0,0,0.06)]` |
| Divider        | `bg-[#ebf1ec] h-[4px] rounded-[4px] w-full`                                                                                                                                                                                                |
| CTA            | "I'm Ready →" primary lg → `onConfirm` → navigate to `/onboarding/institution/template`                                                                                                                                                    |
| Trust badge    | ShieldCheckIcon + "Data encrypted at rest · Ghana Data Protection Act compliant" 10px #959592                                                                                                                                              |
| Dismiss        | ✕ button, backdrop click, ESC key all call `onClose`                                                                                                                                                                                       |
| Component      | `src/components/sections/institutionOnboarding/TermsAcceptedModal.jsx`                                                                                                                                                                     |

---

## Institution Template step (step 4 of 8) `✅ VERIFIED`

Main frame: **2977:85777**.

### TemplateSection layout (2977:85777)

| Property         | Value                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route            | `/onboarding/institution/template`                                                                                                                                                                                            |
| Right panel      | **Visible** — no pathname override needed                                                                                                                                                                                     |
| Step badge       | Captions `{ index: '04', label: 'Bulk Upload' }`                                                                                                                                                                              |
| Headline         | `3002:39084` — Instrument Serif `clamp(2rem, 4.4vw, 4rem)` tracking `-0.64px`; "template." italic brand-green                                                                                                                 |
| Subtitle         | `3002:39086` — SF Pro Rounded Regular 16px #737373 tracking 0.2px leading-[24px]; verbatim: `"Download the official GTH template, fill in students offline, then upload it. Don't create your own  column names must match."` |
| Legend           | `3003:39103` — Required (bg-[#ebf1ec] border-[#c1d4c4]), Optional (bg-[#f9f9f9] border-[#d0d0d0]), Minors only (bg-[#fff8e6] border-[rgba(0,0,0,0.1)]), ★ Must fill at least one (★ #c8951a bold)                             |
| Title bar        | `3003:39106` — bg-[#387440], "GTH_Student_Upload_Template.xlsx — Excel", SF Pro Rounded Semibold 12px white, window controls ─ □ ✕ rgba(255,255,255,0.8)                                                                      |
| Header cells     | All 12 cols: bg-[#387440] border-[rgba(255,255,255,0.2)]; ★ in #eedeb8; sub-tags ("or Phone"/"or Email" white overlay, "Minors" amber bg-[rgba(200,149,26,0.3)], "Optional" white overlay)                                    |
| Data cell colors | Required: bg-[#ebf1ec] border-[#c1d4c4] · Optional: bg-[#f9f9f9] border-[#d0d0d0] · Minors: bg-[#fff8e6] border-[rgba(0,0,0,0.1)]                                                                                             |
| Sample rows      | 5 rows verbatim from Figma: Kofi Mensah / Ama Boateng / Kwame Asante / Adwoa Frimpong / Yaw Darko                                                                                                                             |
| Empty rows       | Rows 7 & 8 — all cells rendered empty with type colour bg                                                                                                                                                                     |
| Sheet tabs       | Students▸ (active, white bg, bold #217346) · Instructions · Valid Values                                                                                                                                                      |
| Tips             | "Date format: **DD/MM/YYYY** — e.g. 14/09/2009" · "Level values: **JHS, SHS, University, Technical**" · "Max **10,000 rows** per batch · CSV or Excel accepted"                                                               |
| Download link    | `3010:40860` — border-b border-[#387440] rounded-[8px] shadow-[0px_2px_0px_0px_rgba(17,17,17,0.2)] px-[34px] py-[16px]; "Download GTH_Student_Upload_Template.xlsx" SF Pro Rounded Semibold 12px #387440                      |
| CTA              | `3002:39051` — "I have my file ready →" primary Button lg → `/onboarding/institution/upload`                                                                                                                                  |
| Component        | `src/components/sections/institutionOnboarding/TemplateSection.jsx`                                                                                                                                                           |

## Institution Template Guide step (Phase 4 — pre-template) `✅ VERIFIED`

Main frame: **3007:39760** ("Template guide(CSV)"), 1728×1117.

### TemplateGuideSection layout (3007:39760)

| Property        | Value                                                                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route           | `/onboarding/institution/template-guide`                                                                                                                                                                                                              |
| Right panel     | **Visible** — pathname ends with `-guide`, not `/template` or `/activate`                                                                                                                                                                             |
| Flow position   | activate → **template-guide** → template → upload                                                                                                                                                                                                     |
| Step badge      | Captions `{ index: '04', label: 'Bulk Upload' }` — same phase as TemplateSection                                                                                                                                                                      |
| Headline        | `3007:40284` — Instrument Serif `clamp(2rem, 4.4vw, 4rem)` tracking `-0.64px`; "Start with the _template._"                                                                                                                                           |
| Subtitle        | `3007:40286` — SF Pro Rounded Regular `clamp(0.875rem, 1vw, 1rem)` #737373 tracking 0.2px leading-[24px]; verbatim: `"Download the official GTH template, fill in students offline, then upload it. Don't create your own  column names must match."` |
| Legend          | `3007:40569` "Frame 338": Required (green dot `#387440`) + Optional (grey dot `#d0d0d0`) — no Minors item (guide only)                                                                                                                                |
| Guide table     | `3007:40576` — `rounded-[10px] border border-[#c1d4c4]`, `box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06)`                                                                                                                                                   |
| Header bar      | `3007:40577` — `bg-[#387440]`; file name "GTH_Bulk_Upload_Template.csv" + "Fixed format" badge                                                                                                                                                        |
| Grid structure  | 2×2 CSS Grid (`grid-cols-2 divide-x divide-[#c1d4c4]`); `border-b` divides top/bottom rows                                                                                                                                                            |
| Download button | `3010:40810` — `⚠️ ASSUMPTION` text "Download GTH_Bulk_Upload_Template.csv"; link style matching TemplateSection download link                                                                                                                        |
| Primary CTA     | `3007:40296` — `⚠️ ASSUMPTION` text "I'm ready to fill the template"; navigates to `/onboarding/institution/template`                                                                                                                                 |
| Component       | `src/components/sections/institutionOnboarding/TemplateGuideSection.jsx`                                                                                                                                                                              |
| Page wrapper    | `src/pages/onboarding/institution/InstitutionTemplateGuidePage.jsx`                                                                                                                                                                                   |

### Column guide quadrants

| Quadrant     | Node         | Section header                                   | Fields                                                                                                                     |
| ------------ | ------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Top-left     | `3007:40584` | "Student identity" (`3007:40585`)                | First Name (req) · Last Name (req) · Middle Name (opt) · Date of Birth + DD/MM/YYYY (req) · Gender + Male/Female (req)     |
| Top-right    | `3007:40598` | "Contact(at least one)" (`3007:40599`)           | Email Address (req) · Phone Number + +233… (req)                                                                           |
| Bottom-left  | `3007:40605` | "Education" (`3007:40606`)                       | Level + JHS/SHS/University (req) · Grade + JHS1,SHS2,Level 100… (req)                                                      |
| Bottom-right | `3007:40613` | "Parent / Guardian (minors only)" (`3007:40614`) | Guardian First Name (opt) · Guardian Last Name (opt) · Guardian Email or Phone (opt) · Relationship + Mother/Father… (opt) |

### Breadcrumb progress bar — fix `✅ VERIFIED`

Figma nodes: `3010:40727` (COMPLETE label), `3010:40729` (% value), `3010:40731` (progress bar track, w=245, h=6).

Previous implementation put COMPLETE + % + ProgressBar in a single horizontal row. Figma spec has two stacked rows:

- Row 1: "COMPLETE" left-aligned, "XX%" right-aligned (within `flex justify-between`)
- Row 2: full-width ProgressBar (h=6 track)

Fixed in `src/components/shared/InstitutionOnboardingBreadcrumb.jsx`: right section is now `flex flex-col gap-[4px] w-[clamp(120px,14vw,180px)]`.

---

## Institution Validate step (step 6 of 8) `✅ VERIFIED`

Main frame: **3016:60108** ("Validate File"), 1728×1363.

### ValidateSection layout (3016:60108)

| Property        | Value                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Route           | `/onboarding/institution/validate`                                                             |
| Right panel     | **Hidden** — added to `showRightPanel` exclusion list in `InstitutionOnboardingLayout`         |
| Flow position   | upload → **validate** → confirm                                                                |
| Content width   | `max-w-[897px]` centred; `Frame 265` in Figma = 897×979                                        |
| Outer structure | `flex flex-col gap-[40px]` (gap-40 between inner block and CTAs, matching `Frame 314` gap=40)  |
| Inner structure | `flex flex-col gap-[16px]` (gap-16 between header / stats / tabs+checks, matching `Frame 287`) |
| Caption badge   | `3028:67078` — uses `Captions` component `items={[{ index: '06', label: 'Validate File' }]}`   |
| Component       | `src/components/sections/institutionOnboarding/ValidateSection.jsx`                            |
| Page wrapper    | `src/pages/onboarding/institution/InstitutionValidatePage.jsx`                                 |

### Headline (3028:67087)

| Property       | Value                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Text           | "File scanned 26 issues found."                                                                             |
| Font           | Instrument Serif 64px fw=400 lh=70 ls=-0.64px CENTER                                                        |
| Italic portion | Indices 14–29: "26 issues found." → italic #387440 (styleOverrideTable key 71, verified via Figma REST API) |
| React          | `File scanned{' '}<span className="italic text-brand-green">{failedRows} issues found.</span>`              |

### Subtitle (3028:67089)

SF Pro Rounded 400 fs=16 lh=24 ls=0.2 fill=#737373 CENTER. max-w-[536px].

Verbatim: `"847 rows are valid and ready to submit. The 26 rows below have problems they'll be skipped but you can download and fix them separately."`

### WavyDivider (3028:67090)

"Line 1" 200×0, stroke 1.5px — sits after subtitle within header block. Rendered via `<WavyDivider />`.

### Stat cards — "File summary" (3028:67091)

Container: HORIZONTAL `gap-[38px]`, 897×98. Four identical-structure cards.

| Property        | Value                                               |
| --------------- | --------------------------------------------------- |
| Outer card      | 194×98, fill=`#f8f8f4`, stroke=#000000(1px), r=10   |
| Inner box       | 177×60, fill=`#fefefe`, stroke=#000000(0.4px), r=10 |
| Vertical rhythm | py-[9px] gap-[4px] → 9+60+4+16+9=98px ✓             |
| Number          | fs=32 fw=400 lh=22 — colour varies per card         |
| Label           | fs=10 fw=500 lh=16 fill=#2a5730                     |

| Card        | Node         | Number colour     |
| ----------- | ------------ | ----------------- |
| Valid Rows  | `3028:67092` | `#387440` (green) |
| Failed Rows | `3028:67096` | `#c0392b` (red)   |
| Minors      | `3028:67100` | `#c8951a` (amber) |
| Adults      | `3028:67104` | `#595959` (grey)  |

### Tab switcher (3028:67109)

HORIZONTAL, h-[32px] per tab.

| State    | Node         | Fill      | Border    | Text colour |
| -------- | ------------ | --------- | --------- | ----------- |
| Active   | `3028:67110` | `#ebf1ec` | `#c1d4c4` | `#387440`   |
| Inactive | `3028:67112` | `#ffffff` | `#cccccc` | `#70706e`   |

Text: fs=12 fw=600 lh=14.3px. "Validation checks" / "N failed rows".

### ValidationCheckCard component `✅ VERIFIED`

Path: `src/components/sections/institutionOnboarding/ValidationCheckCard.jsx`

Props: `{ variant: 'passed' | 'failed' | 'warning', title: string, description: string }`

Card dimensions: h-[57px] w-full, rounded-[10px], border, `flex items-center gap-[16px] px-[16px]`.

Icon circle: 26×26, rounded-full. SVG frame inside: 12×12 centred. All icons: white stroke 1.4px strokeLinecap=round.

| Variant | Node                                   | Container fill | Container border | Circle fill | Icon                | Title colour | Body colour |
| ------- | -------------------------------------- | -------------- | ---------------- | ----------- | ------------------- | ------------ | ----------- |
| passed  | `3028:67115 / 3028:67122 / 3028:67129` | `#ebf1ec`      | `#c1d4c4`        | `#387440`   | CheckIcon (8×5 bb)  | `#2a5730`    | `#70706e`   |
| failed  | `3028:67136 / 3028:67143 / 3028:67157` | `#f9ebea`      | `#ebc2bd`        | `#c0392b`   | XIcon (6×6 bb)      | `#c0392b`    | `#c0392b`   |
| warning | `3028:67150`                           | `#fef3c7`      | `#eedeb8`        | `#a07715`   | ExclamIcon (0×6 bb) | `#a07715`    | `#a07715`   |

Icon paths (hand-crafted in 12×12 viewBox, matching Figma vector bounding boxes):

- **CheckIcon**: `M2 6.5L5 9L10 3.5`
- **XIcon**: `M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5`
- **ExclamIcon**: bar `M6 3V7.5` + dot `<circle cx="6" cy="9.5" r="0.7" fill="#ffffff" />`

Title: fs=13 fw=700 lh=15.5. Body: fs=12 fw=400 lh=15.9. Text group: `flex flex-col gap-[2px]`.

### CTA row (3028:67164)

HORIZONTAL `gap-[19px]`, 897×56. Two buttons side by side.

| Button                    | Node         | Width           | Fill      | Border        | Text                                |
| ------------------------- | ------------ | --------------- | --------- | ------------- | ----------------------------------- |
| Re-Upload File            | `3028:67166` | 218px           | `#ffffff` | 2px `#111111` | `#111111` 16px bold + ArrowLeftIcon |
| Proceed With N Valid Rows | `3028:67175` | flex-1 (~660px) | `#387440` | 2px `#2a5730` | white 16px bold + ArrowRightIcon    |

Both: h-[56px], rounded-[14px], pad T16 R40 B16 L40.

### Mock data (MOCK constant in ValidateSection.jsx)

7 check cards matching the Figma: 3 passed + 3 failed + 1 warning. Replace with API results when backend is wired.

---

## Institution Upload step (step 5 of 8) `✅ VERIFIED`

Main frame: **3010:42286** ("Upload file"), 1728×1117.

### UploadSection layout (3010:42286)

| Property       | Value                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route          | `/onboarding/institution/upload`                                                                                                                                                                                                                              |
| Right panel    | **Visible** — pathname ends with `/upload`, not `/activate` or `/template`                                                                                                                                                                                    |
| Flow position  | template → **upload** → validate                                                                                                                                                                                                                              |
| Step badge     | `3010:43788` — custom combined pill: "Coming soon" (amber) + "05 \| Bulk Upload" (green). NOT using `Captions` component.                                                                                                                                     |
| Headline       | `3010:43797` — Instrument Serif `clamp(2rem, 4.4vw, 4rem)` tracking `-0.64px`; "Upload your _student file._" — indices 12–24 italic #387440 (verified via `characterStyleOverrides` styleOverrideTable key 69)                                                |
| Subtitle       | `3010:43799` — SF Pro Rounded Regular `clamp(0.875rem, 1vw, 1rem)` #737373 tracking 0.2px leading-[24px]; max-w 482px; verbatim: `"Drag and drop your filled-in template below or click to browse. We'll scan it for problems before creating any accounts."` |
| Upload zone    | `3014:50739` (default) / `3014:57783` (hover) / `3014:59183` (uploaded); 698×173, r:16, border-2                                                                                                                                                              |
| File name pill | `3016:59353` — 698×63, fill `#ebf1ec`, stroke `#ddebe4`, r:6; shown only after file selected                                                                                                                                                                  |
| Info row       | `3010:50554` — HORIZONTAL gap:6; info icon `3010:50555` (11×11, stroke #387440 1.1px) + text `3010:50558`                                                                                                                                                     |
| CTA            | `3010:43809` — "Run Pre-Fight Check"; disabled (gray) when no file, primary (green) when file selected; navigates to `/onboarding/institution/validate`                                                                                                       |
| Footer         | `3010:43810` — "Already Have an account?" + "Log in Instead" → `/login`                                                                                                                                                                                       |
| Component      | `src/components/sections/institutionOnboarding/UploadSection.jsx`                                                                                                                                                                                             |
| Page wrapper   | `src/pages/onboarding/institution/InstitutionUploadPage.jsx`                                                                                                                                                                                                  |

### Upload zone visual states

| State    | Node         | Fill      | Stroke    | Icon box                      | Icon                     | Primary label                           | Secondary label                              |
| -------- | ------------ | --------- | --------- | ----------------------------- | ------------------------ | --------------------------------------- | -------------------------------------------- |
| Default  | `3014:50739` | `#fefef3` | `#c1d4c4` | 40×40 white r:10 + shadow     | UploadArrow (green)      | "Drag Your File Here" (black bold 14px) | "Or browser to choose a file" (#959592 12px) |
| Hover    | `3014:57783` | `#ebf1ec` | `#387440` | 40×40 white r:10 + shadow     | UploadArrow (green)      | "Drag Your File Here" (black bold 14px) | "Or browser to choose a file" (#959592 12px) |
| Uploaded | `3014:59183` | `#ebf1ec` | `#387440` | 40×40 **green** r:10 + shadow | CheckLarge (green-light) | "File Received" (#387440 bold 14px)     | filename (#387440 12px)                      |

### File type pills (default/hover state only)

Figma frame 359, HORIZONTAL gap:6. Three pills: `.csv` / `.xlsx` / `.xls`. Each: `rounded-full border border-[#e6e6e6] bg-white h-[21px] px-[6px]`; Instrument Sans Bold 10px #70706e.

### Caption badge design tokens (3010:43788)

| Element       | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Container     | `rounded-[8px] py-1 px-4 gap-1` bg `rgba(255,254,252,1)` border `rgba(225,234,226,0.6)` |
| Amber dot     | 8×8 `#eedeb8` rounded-full                                                              |
| "Coming soon" | SF Pro Rounded Medium 12px `#c8951a` lh:20 ls:0.2                                       |
| Green dot     | 8×8 `#e1eae2` rounded-full, margin-left:4px                                             |
| "05"          | Instrument Serif Italic 16px `#b5b5b5` lh:20.8                                          |
| "Bulk Upload" | SF Pro Rounded Regular 12px `#387440` lh:18 ls:0.2                                      |

### Drag counter pattern

`dragCounter = useRef(0)` tracks nested `dragenter`/`dragleave` events. `dragenter` increments, sets `isDragging=true` on first (counter=1). `dragleave` decrements, sets `isDragging=false` when counter reaches 0. `drop` resets counter to 0. Prevents false `isDragging=false` when cursor moves between child elements.

### File validation

Accepted: `.csv`, `.xlsx`, `.xls`. Non-matching files silently ignored (no error state). Validation via `'.' + name.split('.').pop().toLowerCase()`. Remove button resets both state + `fileInputRef.current.value`.

---

---

## Institution Onboarding — Step 7: Confirm Accounts `✅ VERIFIED`

**Main frame:** `3040:71814` ("Confirm"), 1728×1119. Route `/onboarding/institution/confirm`.
No right panel (added to `showRightPanel` exclusion in `InstitutionOnboardingLayout`).

| Element                       | Node(s)                     | Notes                                                                                                                                                                                                                                      |
| ----------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Caption badge                 | `3040:71914`                | "07 \| Confirm Accounts" via `Captions` component                                                                                                                                                                                          |
| Headline                      | `3040:71923`                | "Ready to submit?" — styleTable[73] → indices 9–15 "submit?" italic #387440                                                                                                                                                                |
| Subtitle                      | `3040:71925`                | fs=16 fw=400 #737373 CENTER max-w=536px                                                                                                                                                                                                    |
| WavyDivider                   | `3040:71926`                | 200×0 Line 1                                                                                                                                                                                                                               |
| Stat cards container          | `3040:71814 > File summary` | 897×98, HORIZONTAL gap=38                                                                                                                                                                                                                  |
| Accounts To Create card       | `3040:71928` / `3040:71929` | outer rgba(235,241,236,0.5); inner Frame 376: value(#387440 fs=32) + sub-label(#2a5730 fs=10); outer-label "Accounts To Create" #2a5730 fs=10 fw=500                                                                                       |
| Rows Skipped card             | `3040:71932` / `3040:71933` | outer #f8f8f4; value #387440; sub-label "Download to fix & re-upload" #2a5730; outer-label "Rows Skipped" #2a5730                                                                                                                          |
| Opt-Out SMS Will Be Sent card | `3040:71936`                | outer rgba(234,239,251,0.5); value #3062d3; sub-label #244a9f; outer-label "Opt-Out SMS Will Be Sent" #244a9f                                                                                                                              |
| Minors No Parent Contact card | `3040:71940`                | outer #faf4e8; value #967014; sub-label #967014; outer-label "Minors No Parent Contact" #967014                                                                                                                                            |
| Checklist box                 | `3046:73914`                | "Border" 890×206, stroke #000000@1, r=16. Header strip: "What happens when you click Submit" bg=#f8f8f4 h=35px fs=10 fw=700 #70706e. 4 items h=42px each: circle 20×20 #387440 r=10 + number fs=10 fw=700 #fff + text fs=12 fw=400 #111111 |
| Warning amber box             | `3046:73933`                | "Overlay+Border" 890×46, rgba(200,149,26,0.1) bg, stroke #eedeb8 r=10. Circle 22×22 #c8951a r=11 + exclamation icon + text fs=12 fw=400 #967014                                                                                            |
| Back button                   | `3040:72002`                | 128×56, fill #fff, stroke #111111@2, r=14; "Back" fs=16 fw=700 #575755                                                                                                                                                                     |
| Submit button                 | `3040:72011`                | 734×56 (flex-1), fill #387440, stroke #2a5730@2, r=14; "Submit And Create N Accounts" white fs=16 fw=700                                                                                                                                   |

### Stat card inner structure (Frame 376 pattern — Confirm variant)

All four cards use a `ConfirmStatCard` pattern where the 177×60 inner box contains
a centered vertical stack (`Frame 376` 115×42 gap=4):

- Value: `fs=32 fw=400 lh=22` colour varies
- Sub-label: `fs=10 fw=400 lh=16` colour varies

This differs from `ValidateSection` `StatCard` (inner box shows only the number).

| Component    | Path                                                               |
| ------------ | ------------------------------------------------------------------ |
| Main section | `src/components/sections/institutionOnboarding/ConfirmSection.jsx` |
| Page wrapper | `src/pages/onboarding/institution/InstitutionConfirmPage.jsx`      |

---

## Institution Onboarding — Step 8: Upload Report `✅ VERIFIED`

**Main frames:** `3052:74319` (loading/processing state, 1728×1119), `3065:7371` (complete/report state, 1728×1119).
Route `/onboarding/institution/report`. No right panel (added to `showRightPanel` exclusion).

Design tokens extracted via Figma REST API (MCP rate-limited on this session).

| Element                  | Node(s)               | Notes                                                                                                                                                         |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Headline loading         | `3052:74428`          | "Creating accounts.." — styleTable[73] → indices 9–18 italic #387440                                                                                          |
| Headline complete        | `3065:7371` text node | "821 students are live" — styleTable[75] → indices 17–20 italic #387440                                                                                       |
| Loading subtitle         | `3052:74430`          | fs=16 fw=400 #737373 CENTER max-w≈536px                                                                                                                       |
| Loading stat card 1      | `3052:74433`          | 270×98 outer rgba(235,241,236,0.5), value #387440, "Accounts To Create"                                                                                       |
| Loading stat card 2      | `3052:75000`          | 281×98 outer #faf4e8, value #a07715, "SMS Queued"                                                                                                             |
| Loading stat card 3      | `3052:75007`          | 281×98 outer #f8f8f4, value #575755, "Skipped"                                                                                                                |
| Processing log           | `3061:75343`          | 890×154; "Processing log" label fs=11 fw=700 ls=0.6 #70706e; box h=130 bg=#f8f8f4 r=10; 5 entries; 6px dots; amber #c8951a (first/last), green #1d7c4d (rows) |
| Info banner              | `3052:74476`          | 890×46 bg=#eaeffb border=#bfcef2 r=10; InfoCircleIcon 22×22 fill #244a9f                                                                                      |
| Disabled CTA             | `3052:74493`          | "View Upload Report" 734×56 bg #bfbfbf border #cccccc@2 r=14                                                                                                  |
| Back button              | `3052:74484`          | 128×56 white border #111111@2 r=14                                                                                                                            |
| Report stat cards        | `3065:7371` frame     | 194×98 each, gap=35; inner 177×60; 4 cards: 847/26/198/114                                                                                                    |
| Check card 1 header      | `3069:20561`          | "In-file duplicates same name and date of birth"; 821 rows; dark badge bg #000000 white text                                                                  |
| Check card 2 header      | `3069:20606`          | "Invalid phone format not a valid Ghana number"; 4 rows; red badge bg #f9ebea text #c0392b                                                                    |
| Created rows (expanded)  | `3065:8002–8049`      | 6 sample rows: Kwabena Tawiah/Adwoa Kyei/Yaw Darko/Kofi Boateng/Abena Owusu/Adwoa Mensah                                                                      |
| Failed rows (expanded)   | `3069:20631–20652`    | 2 rows: Kofi Boateng/Yaw Darko; col4 "Email & phone missing"                                                                                                  |
| Upload another batch btn | `3065:8347`           | 220×56 white border #111111@2 r=14                                                                                                                            |
| Dashboard btn            | `3065:8356`           | flex-1 green #387440 border #2a5730@2 r=14; loading state: bg #2d5d33 border #224626@2                                                                        |
| ConcentricRings          | Figma Group 18        | 80×80; 3 rings: 80/64/48px diameter, 3px stroke #000000; inner 34×34 rgba(235,241,236,0.5); innermost 12×12 spinning arc                                      |

### Check card grid tokens

- Grid columns: `48px 1fr 90px 1fr 90px`
- Header: bg #f8f8f4, minH=44, px=16
- Data rows: h=34; alt row bg rgba(248,248,244,0.5); hover bg rgba(235,241,236,0.3)
- Status pill "✓ Created": bg rgba(235,241,236,0.5) text #387440
- Status pill "Skipped": bg #f9ebea text #c0392b
- Footer "info" type: bg #fefcf5 border-top-black fs=10 fw=600 #70706e
- Footer "more" type: bg white fs=11 fw=400 #babab7

### Subframes dived during build

`3052:74319`, `3065:7371`, `3052:74428`, `3052:74430`, `3052:74433`, `3052:75000`, `3052:75007`, `3061:75343`, `3052:74476`, `3052:74493`, `3052:74484`, `3065:7371` (report stats frame), `3069:20561`, `3069:20606`, `3065:8002`, `3065:8049`, `3069:20631`, `3069:20652`, `3065:8347`, `3065:8356`

---

---

## Parent Login Screen `✅ VERIFIED` (2026-06-16)

Main frame: `2884:64759` — 1728×1117, fill=#ffffff.

| Element                   | Node ID      | Notes                                                         |
| ------------------------- | ------------ | ------------------------------------------------------------- |
| Main frame                | `2884:64759` | 1728×1117                                                     |
| Navbar                    | `2884:64810` | 1728×90, full marketing Navbar (#f8f8f4 bg)                   |
| Left content frame        | `2884:64893` | 989×972                                                       |
| Right panel               | `2884:64826` | 739×973, fill=#967014 (accent-dark gold)                      |
| TL gold ellipse           | `2884:64763` | 571×571, GRADIENT_LINEAR #f5c451→#d6a243→#f5bd4f, op=0.6      |
| BR red ellipse            | `2884:64762` | 571×571, fill=#c0392b, op=0.15                                |
| "WELCOME BACK" badge      | `2884:64938` | fill=#f7efdd, stroke=#eedeb8, r=8, text #c8951a               |
| Headline                  | `2884:64946` | Instrument Serif 64px; chars 10–26 italic #c8951a             |
| Subtitle                  | `2884:64948` | SF Pro Rounded 16px #737373; "Create your account" in #387440 |
| WavyDivider               | `2884:64949` | LINE, op=0.5                                                  |
| Email/Phone field         | `2884:64952` | 698×80, label "Email or Phone Number", UserIcon left          |
| Password field            | `2884:64953` | 698×80, label "Password", "Forget Password" trailing link     |
| Checkbox row              | `2884:64954` | "Keep me logged in" 12px #70706e                              |
| CTA disabled              | `2884:64958` | 698×56, fill=#bfbfbf, r=14, "Enter Your Details To Continue"  |
| CTA active                | `2891:69513` | fill=#387440, stroke=#2a5730@2                                |
| CTA loading               | `2894:71597` | fill=#2d5d33, "Logging You In"                                |
| Divider area              | `2884:64959` | "New to Ghana Talent Hub?" text + two divider lines           |
| Register card             | `2884:64965` | 698×99, fill=#fefefd, r=16, "Your ward registered..."         |
| "Set up your account" btn | `2884:64968` | 203×38, fill=#ffffff, r=10, stroke=#c6c6c3, UserIcon + arrow  |

### Right panel sub-nodes

| Element                  | Node ID      | Notes                                                   |
| ------------------------ | ------------ | ------------------------------------------------------- |
| Cream ellipse TR         | `2884:64827` | 473×473, fill=#f7efdd, op=0.5, CSS-only                 |
| Pink ellipse BL          | `2884:64828` | 473×473, fill=#f9ebea, op=0.5, CSS-only                 |
| BG grid rect             | `2884:64829` | 414×473, IMAGE fill, rot=3.1°                           |
| BG lines overlay         | `2884:67315` | 739×973, fill=#ffffff op=0.10 (10%, not 30%)            |
| Sparkle composite        | `2884:64833` | 100×102 at rel=(579,22) — reuses panel-sparkle-\* SVGs  |
| Snow dots composite      | `2884:64834` | 447×359 at rel=(-388,-31) — reuses panel-snow-\* SVGs   |
| Photo group              | `2884:64835` | Group 670×876 at rel=(21,48), r=40                      |
| Large photo card         | `2884:64836` | 498×566, stroke=#ddebe4@10, IMAGE fill                  |
| Small photo card         | `2884:67288` | 425×478 at group rel=(246,398), stroke=#eedeb8@10       |
| Verified profile badge   | `2884:64849` | 133×40, white, r=10, stroke=#000000, green checkmark    |
| shapes-04 abstract       | `2884:67308` | 264×264 at rel=(-63,828), op=0.20 — SKIPPED (no export) |
| Flag corrections overlay | `2891:68611` | 242×71 at rel=(77,787), fill=#ebf1ec, r=10              |
| WatchTutorial            | `2884:64892` | 211×76 at rel=(471,872) — bottom-right                  |

### Subframes dived during build

`2884:64826`, `2884:64835`, `2884:64763`, `2891:68611`, `2884:64893`, `2884:64937`, `2884:64938`, `2884:64946`, `2884:64950`, `2884:64957`, `2884:64965`

---

## Parent Welcome Screen (frame `2865:44066`) `✅ VERIFIED`

Main frame: 1728×1117px. Route: `/onboarding/parent-welcome`.
Layout shell: `ParentOnboardingLayout` (same as login — path-aware panel switch added 2026-06-22).

### Left content column (`2865:44194`)

| Element                | Node ID      | Key tokens                                                                                                        |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Welcome Back badge     | `2900:76717` | bg #f7efdd, border #eedeb8, r=8, dot #eedeb8/#c8951a/glow #f5c451                                                 |
| Headline               | `2865:44246` | Instrument Serif 64px/-0.64px; "on the platform." italic #c8951a                                                  |
| Subtitle               | `2865:44248` | SF Pro Rounded 16px/24px #737373, max-w 482px                                                                     |
| WavyDivider            | `2865:44249` | standard WavyDivider component                                                                                    |
| "How This Works" badge | `2865:44250` | bg rgba(250,244,232,0.6), border #eedeb8, r=8, dot #faf4e8/#c8951a/glow #d6a243, text 12px semibold #967014       |
| 3-step list            | `2865:44258` | 514px, divide-y #e6e6e6; num badge 32×32 bg #ebf1ec border #eedeb8 r=30; num Instrument Serif italic 16px #c8951a |
| Step 1                 | `2865:44260` | title #c8951a semibold; desc #575755 14px                                                                         |
| Step 2                 | `2865:44268` | same structure                                                                                                    |
| Step 3                 | `2865:44276` | same structure                                                                                                    |
| CTA block              | `2865:44284` | max-w 542px, flex-col gap-4                                                                                       |
| Primary CTA            | `2865:44285` | bg #387440, border #2a5730, shelf #224626, gradient text (peach→mint)                                             |
| Secondary CTA          | `2900:76829` | bg #faf4e8, border rgba(17,17,17,0.3), shelf rgba(0,0,0,0.15), text #575755                                       |
| Footer link            | `2865:44286` | "Already Have an account?" #737373 + "Log in Instead" #387440 semibold                                            |

### Toast notification (`2900:76816`) `✅ VERIFIED`

Auto-shown on page mount (8 s duration). Implemented in `src/components/ui/Toast.jsx`.

| Property         | Value                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Container        | bg #ebf1ec, border 1px #c1d4c4, border-left 3px #387440, r=10                              |
| Shadow           | `0px 16px 24px -6px rgba(27,36,44,0.16), 0px 2px 2px -1px rgba(27,36,44,0.04)`             |
| Icon box         | 26×26 bg #387440 r=6, checkmark SVG, inner shadow                                          |
| Title            | "Your ward registered on Ghana Talent Hub" — 14px semibold #387440                         |
| Body (bold part) | "Kofi Mensah (16)" — 14px semibold #2a5730                                                 |
| Body (rest)      | "provided your contact. Your details have been pre-filled below..." — 12px regular #575755 |
| Close icon       | 20×20 X                                                                                    |

### Right panel (`2894:72002`) `✅ VERIFIED`

Same gold (#967014) background and BG decorations as `ParentLoginRightPanel`.
Implemented in `src/components/sections/parentLogin/ParentWelcomeRightPanel.jsx`.

**Key differences from login panel:**

| Element                 | Node ID      | Position in 739×973 panel       | Notes                                                                                                 |
| ----------------------- | ------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Main photo card (frame) | `2894:72733` | center 63.4%/53.0%, w=88%       | `Students using GTH on phone.png`; border #ddebe4@10px; r=40px                                        |
| Corner ellipse bleed    | —            | top=-85px, left=-76px from card | `Ellipse 5.svg`, 223×223, rotate(-4deg)                                                               |
| Active badge            | `2894:72793` | left=13.4%, top=14.4%           | small pill, bg #ebf1ec, "Active"                                                                      |
| Verified profile badge  | `2894:72739` | left=8.5%, top=76.9%            | 133×40, bg #f7efdd, border #eedeb8, amber star + "Verified profile"                                   |
| Ward Status card        | `2894:72783` | right≈7%, top=54.4%, 181×88     | bg white, r=12, shadow; amber icon; "WARD STATUS" 9px uppercase + "Active : Kofi Mensah" 12px #967014 |
| Flag corrections        | `2894:72748` | left=10.7%, top=80.9%           | identical to login panel overlay                                                                      |
| BL element (shapes-04)  | `2894:72747` | left=5.3%, top=85.1%, 264×264   | uses `PATENT_ONBOARDING _PANEL_BL_ELEMENT.svg`                                                        |
| WatchTutorial           | `2894:72746` | bottom-right                    | identical to login panel                                                                              |

---

## Parent Link Ward step (step 5 of 8) `✅ VERIFIED` (2026-06-25)

Main frame: **2939:48804** ("Link Ward "), 1728×1117. Route: `/onboarding/parent-link-ward`.
Left content column only — breadcrumb, BG glows, and gold right panel come from `ParentOnboardingLayout`.
Implemented in `src/components/sections/parentLogin/ParentLinkWardSection.jsx` (page wrapper `src/pages/parentLogin/ParentLinkWardPage.jsx`).

The ward was auto-linked because the child supplied this parent's contact details during their own
registration ("Path A"). A success Toast announces it on mount; the parent reviews and confirms.

### Left content column (Frame 148 `2939:49664` → Frame 22, width 702px)

| Element             | Node ID      | Key tokens / values                                                                                                                                    |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Caption badge       | `2939:49709` | shared `<Captions variant="amber" items={[{index:'05',label:'Link Ward'}]} />` — white pill, border #eedeb8, amber dot + grey "05" + amber "Link Ward" |
| Headline            | `2939:49718` | Instrument Serif 64px #111 tracking -0.64px lh-70, w-554 center; "Your ward is " + italic #c8951a "linked"                                             |
| Subtitle            | `2939:49720` | SF Pro Rounded Regular 16px #737373 tracking 0.2px lh-24, w-482 center                                                                                 |
| WavyDivider         | `2939:49721` | 200px line — `<WavyDivider />`                                                                                                                         |
| Ward header card    | `2941:52472` | bg-white border #c1d4c4 h-76 r-16; avatar 50px (border-2 #c1d4c4) + name + meta tag; right: green dot + "Active"                                       |
| — Name              | `2947:68508` | SF Pro Rounded Semibold 16px #575755 lh-24: "Abena Mensah"                                                                                             |
| — Meta tag          | `2947:68509` | bg #ebf1ec border #c1d4c4 px-10 py-3 r-4; 10px semibold #2a5730: "Age 16 · JHS 3 · Achimota School · Ghanaian"                                         |
| — Active status     | `2941:52488` | 7px #1d7c4d dot + "Active" bold 11px #1d7c4d                                                                                                           |
| Details header      | `2943:52523` | shared `MailIcon` (11px, #babab7 via currentColor) + "DETAILS" 9px bold #babab7 uppercase tracking-1px + 1px divider rgba(0,0,0,0.06)                  |
| Detail field box    | `2943:52553` | bg #f8f8f4 h-48 r-10; label 9px bold #babab7 uppercase tracking-0.6px; value 14px medium #111 lh-16.9                                                  |
| — Fields (verbatim) | —            | School=Achimota School · Curriculum=GES · Account created=Today, 09:42 AM · Account status=Active (#387440)                                            |
| Opt-out notice      | `2943:52571` | bg rgba(250,244,232,0.4) border #eedeb8 r-12; title 12px bold #b48617 lh-20 + body 12px regular #b48617 lh-18                                          |
| CTA                 | `2939:49726` | Figma shows grey disabled (#bfbfbf); implemented as enabled green primary `Button` "Confirm & Continue →" → `/onboarding/parent-review`                |
| Footer              | `2939:49727` | "Already Have an account?" #737373 + "Log in Instead" semibold #387440 → `/onboarding/parent-login`                                                    |

### Auto-link Toast (`2943:52577`)

Success variant, top-right. Width 729px (Figma frame), 36px icon box, 14px title (lh-24) + 14px body (lh-20).
Verbatim — title: "Ward automatically linked Path A"; body: "Your contact matched the details Kofi provided. No further action is needed to establish the link."
Shared component `src/components/ui/Toast.jsx` (widened from 420→729px to match this frame).

> Note: breadcrumb shows 78% in Figma but `ParentOnboardingLayout` computes 50% (step 4/8). The breadcrumb
> is the shared `ParentOnboardingBreadcrumb` — left unchanged to avoid affecting other parent steps.

---

## Parent Review & Consent step (step 6 of 8) `✅ VERIFIED` (2026-06-25)

Main frame: **2943:57781** ("Review & consent"); content nodes `2944:680xx` (header/consent/CTA) + `2973:80xxx` (preview card). Route: `/onboarding/parent-review`.
**FULL-WIDTH** — `ParentOnboardingLayout` hides the gold right panel (`showRightPanel = !pathname.includes('parent-review')`).
Implemented in `src/components/sections/parentLogin/ParentReviewSection.jsx` (page `src/pages/parentLogin/ParentReviewPage.jsx`).

### Layout (content column, max-w-[897px], gap-6)

| Element       | Node ID      | Key tokens / values                                                                            |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| Caption badge | `2947:75882` | shared `<Captions variant="amber" items={[{index:'06',label:'Review & Consent'}]} />`          |
| Headline      | `2944:68077` | Instrument Serif 64px #111 tracking -0.64px; "Review your " + italic #c8951a "details"         |
| Subtitle      | `2944:68079` | SF Pro Rounded Regular 16px #737373; "Take a moment to check your details before signing off…" |
| WavyDivider   | `2944:68080` | 200px line                                                                                     |
| Preview card  | `2973:80541` | bg-white border rgba(0,0,0,0.08) r-24 shadow `0 4px 0 rgba(0,0,0,0.13)`; 5 sections            |

### Preview card sections (all fields = shared `PreviewField`, bg #f8f8f4 r-10)

| Section                 | Node ID      | Fields (verbatim values)                                                                                                                               |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Your Identity           | `2973:80555` | First name=Abena · Middle name=— · Last name=Mensah · Date of birth=12 March 2003 · Gender=Female · Relationship to ward=Mother                        |
| Identity & verification | `2973:80592` | Ghana Card Number=GHA-●●●●●●●●●-● (+Verified badge, id-card icon) · Profile photo=✓ Uploaded & confirmed (user icon) · EDIT                            |
| Contact details         | `2973:80627` | Phone number=+233 20 ••• ••• ••2 (+OTP verified badge) · WhatsApp=Same as phone · Email=a.mensah@gmail.com · Preferred contact=Phone & WhatsApp · EDIT |
| Account Security        | `2973:80658` | Password=•••••••• (8 dots) · Preferred contact=Phone & WhatsApp · EDIT                                                                                 |
| Linked Ward             | `2973:80685` | Ward card (72px avatar + Abena Mensah + meta tag + green "Linked" badge) · EDIT                                                                        |

> Section header: 11px grey icon + 9px bold uppercase label + amber EDIT pill (border #faf4e8, #c8951a) + divider.
> EDIT links navigate to the matching prior step (verification / contact / security / link-ward).
> Note: the "Account Security" second field repeats "Preferred contact / Phone & WhatsApp" — a Figma copy artifact, rendered verbatim per the text-is-sacred rule.

### Consent block (`2944:68279`)

| Element     | Node ID      | Detail                                                                                                           |
| ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Header      | `2944:68280` | "Required agreements — all 3 must be accepted" 10px bold #babab7 uppercase + divider                             |
| Checkbox 1  | `2944:68287` | "I understand my ward has immediate platform access." + link "How the opt-out model works"                       |
| Checkbox 2  | `2944:68288` | "I have read and accept the Parent Rights Policy." + link "Read Parent Rights Policy"                            |
| Checkbox 3  | `2944:68381` | "I consent to Ghana Talent Hub processing my data." + link "Learn more about data processing"                    |
| Data notice | `2944:68289` | bg rgba(234,239,251,0.4) border #e0e7f9 r-12; #3062d4 (informative) "Your data is protected under Ghanaian law…" |

Checkboxes use the shared `Checkbox` component (ReactNode label with green underline links).

### CTA (`2944:68294`) + footer

Gated: grey disabled (#bfbfbf, shadow `0 4px 0 rgba(191,191,191,0.8)`) "Accept All Three To Continue →" until all 3 consents accepted → enabled green primary `Button` → `/onboarding/parent-consent`.
Footer: "Already Have an account?" + "Log in Instead" → `/onboarding/parent-login`.

---

## Parent Review & Consent — pop-ups (3 consent modals) `✅ VERIFIED` (2026-06-25)

Bottom-sheet dialogs opened from the 3 consent checkbox links on `/onboarding/parent-review`.
Shared shell: `src/components/sections/parentLogin/ConsentModal.jsx` (drag handle, SUMMARY badge + italic-accent serif title, optional green intro banner, scrollable numbered list, footer note + "Read full document" + green "I understand and Accept"). Content (data-driven): `src/components/sections/parentLogin/ConsentModals.jsx`.
Each modal's "I understand and Accept" ticks the matching consent checkbox and closes (wired in ParentReviewSection). "Read full document" is a no-op (no Figma target).

| Modal               | Frame        | Title (serif + amber accent)       | Intro banner                                                | List                  | Notices                                                                                         |
| ------------------- | ------------ | ---------------------------------- | ----------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| OptOutModal         | `2947:79682` | "Immediate access _what it means_" | "Kofi's account is already live" / "He registered himself…" | 4 (item 3 green)      | Blue "Under 18?"                                                                                |
| ParentRightsModal   | `2951:80104` | "Your rights as a _parent_"        | "Six rights you have as Kofi's parent on GTH"               | 6 (item 3 green)      | Blue "Under 18?"                                                                                |
| DataProcessingModal | `2951:80262` | "Data Processing _Consent_"        | "What you are explicitly consenting to"                     | 7 (items 1 & 6 green) | Amber "Important if you are under 18" + Blue "Withdrawing consent does not delete your account" |

Shell tokens (from `2947:79682`): card max-w-[666px], rounded-t-[24px], shadow `0 -16px 24px rgba(0,0,0,0.22)`; drag handle 36×4 #c6c6c3; header border-b rgba(0,0,0,0.07); title Instrument Serif 24px tracking -1px + italic #c8951a accent; intro banner bg rgba(235,241,236,0.6) border-b #c1d4c4, green icon box 34px (#387440 shadow `0 3px 0 #2a5730`); list item: 26px numbered circle (default #f8f8f4/#c6c6c3/#70706e, green #ebf1ec/#c1d4c4/#2a5730) + bold 13px title (#111 / green #387440) + 12px #737373 desc; notice boxes — blue bg rgba(234,239,251,0.4) border #bdd7f0 #3062d4, amber bg rgba(250,244,232,0.5) border #eedeb8 #b48617; CTA = green primary `Button` with check + "I understand and Accept".

---

## Parent Sign-up Success / Done step (step 8 of 8) `✅ VERIFIED` (2026-06-25)

Main frame: **2952:96777** (1920×1200). Route: `/onboarding/parent-done`. Two-column: left success content (`2952:96779`) + **simple right-panel variant** (`2952:96846`).
Implemented: `src/components/sections/parentLogin/ParentSuccessSection.jsx` (page `src/pages/parentLogin/ParentDonePage.jsx`) + `src/components/sections/parentLogin/ParentSuccessPanelContent.jsx` (panel content).

### Left content (`2952:96779`)

| Element          | Node ID                  | Key tokens / values                                                                                                                                                                                    |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Success icon     | `2952:96782`             | 80px circle bg #c8951a, layered ring shadow `0 0 0 12px #faf4e8, 0 0 0 16px #eedeb8, 0 3px 0 #967014`, 36px white check                                                                                |
| Caption          | `2952:96786`             | "Registration complete" 10px bold #c8951a uppercase tracking 1.3px                                                                                                                                     |
| Headline         | `2952:96787`             | Instrument Serif 44px #111 tracking -2px; "Your parent account is " + italic #967014 "activated."                                                                                                      |
| Subtitle         | `2952:96788`             | 13px #70706e; "You're now connected to Kofi's journey…"                                                                                                                                                |
| Audit chips      | `2952:96789`             | 2 pills bg #ebf1ec border #c1d4c4 rounded-full; green check + "PARENT_ACCOUNT_CREATED" / "WARD_AUTO_LINKED"                                                                                            |
| Ward card        | `2952:96798`             | white border-2 #c1d4c4 r-16 shadow `0 3px 0 #c1d4c4, 0 8px 24px rgba(56,116,64,0.07)`; green 52px check avatar + "Kofi Mensah" + meta (Age 16 · 🇬🇭 Ghanaian · JHS 3 · Achimota) + green "Linked" badge |
| Next-steps label | `2952:96814`             | "What you can do now" 11px bold #babab7 uppercase                                                                                                                                                      |
| Next-step cards  | `2952:96815/96822/96828` | bg #f8f8f4 r-10; 32px icon box (amber/green/grey-dimmed) + bold 13px title + 11px #70706e desc. 3rd card opacity-60                                                                                    |
| Opt-out hatch    | `2952:96835`             | undo icon + "Changed your mind?" #70706e + red "Opt-out Kofi instead" (#c0392b, underline)                                                                                                             |
| Primary CTA      | `2952:96842`             | **amber** bg #c8951a border-2 #967014 shadow `0 3px 0 #967014` r-10; "Go to Parent Dashboard" white bold 15px + ArrowRightIcon → `/`                                                                   |

### Simple right-panel variant (`2952:96846`)

`ParentLoginRightPanel variant="simple" centerContent={<SuccessPanelContent />}` — **plain** gold (#967014) bg only (no ellipse blobs, no bg-lines, no grid/snow/sparkles/BL element/photo cards/overlay/watch-tutorial) + centered content:

| Element    | Node ID                  | Key tokens / values                                                                                                           |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Trophy box | `2952:96855`             | 72px rounded-24 bg rgba(255,255,255,0.15), ring shadow `0 0 0 12px rgba(255,255,255,0.06)`, 36px trophy                       |
| Heading    | `2952:96861`             | Instrument Serif 34px white tracking -0.8px; "You're officially " + italic "part of the journey."                             |
| Subtitle   | `2952:96862`             | 13px rgba(255,255,255,0.62); "Kofi's talent story is unfolding…"                                                              |
| Stat cards | `2952:96863/96866/96869` | bg rgba(255,255,255,0.1) r-10; serif 24px value + 10px bold uppercase label: "7 Steps done", "1 Ward linked", "100% Complete" |

> Layout: `parent-done` keeps the right panel (simple variant) and forces breadcrumb to **100%** (`isDone` override). Review step's CTA navigates straight to `parent-done`. The empty `parent-consent` step was **removed** from the flow (PARENT_STEP_PATHS, breadcrumb PARENT_STEPS, and DemoNavigator) — the parent flow is now 7 steps: Identity → Verification → Contact → Security → Link Ward → Review & Consent → Done.

---

## Talent Login Screen `✅ VERIFIED` (2026-07-05)

Main frame: `4704:50608` — 739×973px right panel. Route: `/login`.
Shell: `src/components/shared/OnboardingRightPanel.jsx`
Content: `src/components/sections/talentAuth/TalentLoginPanelContent.jsx`

### BG decoration layers (identical across login + welcome panels)

| Layer         | Position                                      | Notes                                                       |
| ------------- | --------------------------------------------- | ----------------------------------------------------------- |
| TR ellipse    | left 83.5%, top -21.6%, width 64%             | inner div `inset[-42.28%]`; NO overflow-hidden/rounded-full |
| BL ellipse    | bottom -22.9%, left -23.1%, width 64%         | inner div `inset[-63.42%]`; NO overflow-hidden/rounded-full |
| Grid          | right 0, top 58.8%, width 48.4%, height 41.6% | `rotate(180deg) scaleY(-1)`                                 |
| Sparkle stars | left 78.2%, top 2.3%, 13.5%×10.5%             | `talent-panel-sparkle-stars.svg`                            |
| Snow pattern  | left -52.6%, top -3.2%, 60.5%×36.9%           | `talent-panel-snow-pattern.svg`                             |

### Foreground — photo cards (3 total, ONE container `absolute inset-0`)

Reference frame: 739×973px. Width formula: `card_px / 739 × 42vw`.

| Card    | Asset                      | Position (% of panel)     | Width (clamp/vw)             | Border                          | Rotation |
| ------- | -------------------------- | ------------------------- | ---------------------------- | ------------------------------- | -------- |
| Photo 1 | `talent-panel-photo-1.png` | left 72.15%, top 52.81%   | `clamp(56px, 7.44vw, 131px)` | 4px solid #eedeb8, ellipseCard1 | 5deg     |
| Photo 2 | `talent-panel-photo-2.png` | left 56.97%, bottom 8.32% | `clamp(59px, 8.25vw, 145px)` | 3px solid #eedeb8               | -7deg    |
| Photo 3 | `talent-panel-photo-3.png` | left 69.15%, top 10.52%   | `clamp(57px, 7.85vw, 138px)` | 3px solid #eedeb8, sparkle26    | -6deg    |

### Foreground — overlay cards (login)

| Card                | Position                | Key tokens                                                                                                 |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Data Protected chip | left 50.61%, top 34.64% | bg white, border #e7e7e7, shield icon #387440, "Data Protected" 10px #575755                               |
| GDPR badge          | left 56.97%, top 57.35% | bg white, border #e7e7e7, 14px bold #111, "GDPR Compliant"                                                 |
| Welcome Back stats  | left 35.18%, top 55.19% | bg white r-12, shadow; "Welcome Back" 10px bold #387440; "1,580 Jobs Available" serif italic; progress bar |

---

## Talent Welcome Screen `✅ VERIFIED` (2026-07-05)

Main frame: `2858:23709` — 739×973px right panel. Route: `/onboarding/talent/welcome`.
Shell: `src/components/shared/OnboardingRightPanel.jsx`
Content: `src/components/sections/talentAuth/TalentWelcomePanelContent.jsx`

BG decoration layers are identical to the login panel (same shell, same assets — see table above).

### ONE CONTAINER rule (mandatory)

The main photo card + ALL 5 overlay cards are placed inside a single `<div className="absolute inset-0">` relative to the aside. All positions are `%` of the 739×973 reference frame. Widths use the vw-based clamp formula: `px / 739 × 42vw`. This ensures all cards scale together proportionally and stay in formation with each other.

### Foreground — main photo card (`2858:23713`)

| Property       | Value                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Asset          | `Students using GTH on phone.jpg`                                                                                 |
| Center point   | left 46.84%, top 50%, transform `translate(-50%, -50%)`                                                           |
| Rotation       | 4deg                                                                                                              |
| Width          | `clamp(240px, 32.5vw, 573px)`, aspect ratio 573/635                                                               |
| Border         | `clamp(5px, 0.57vw, 10px)` solid #eedeb8                                                                          |
| Border-radius  | `clamp(14px, 1.48vw, 26px)`                                                                                       |
| Corner ellipse | `talent-panel-card-ellipse-1.svg`, 238px outer / 223px inner, rotate(-4deg), left -75.84px top -85.44px from card |

### Foreground — 5 overlay cards (same container as photo)

| Card             | Position in 739×973 panel                     | Key tokens                                                                                                 |
| ---------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Jobs Available   | left 4.19%, top 28.13%, rotate(4.71deg)       | width `clamp(64px, 7.61vw, 134px)`; "1,580" Instrument Serif italic; "Jobs Available" 12px                 |
| Saved pill       | left 6.5%, top 51.07%                         | bg #387440, border #2a5730; boxShadow `0px 4px 0 #2a5730, 0px 8px 28px rgba(56,116,64,0.25)`               |
| Verified profile | left 12.24%, top 68.76%, translate(-50%,-50%) | `talent-panel-gth-icon.svg` + "Verified profile" #387440, bg white                                         |
| My Experience    | left 67.81%, top 18.82%, rotate(6.59deg)      | width `clamp(76px, 10.51vw, 185px)`; 3 skeleton bars + green Submit button                                 |
| Institution card | right 7.79%, top 61.89%                       | width `clamp(94px, 12.61vw, 222px)`; bg gradient green; "Accra Girls Senior High"; 3 colour-circle avatars |

### Welcome toast (conditional, `showToast` prop)

Auto-shown on mount, auto-dismissed after 3s in `OnboardingWelcomePage`.
Position: `absolute`, left 50%, top 24px, `transform: translateX(-50%)`.
Content: "Welcome to GTH, Student! / Your profile is live."

---

## Talent onboarding — step 3 Contact Information right panel `✅ VERIFIED` (2026-07-08)

Main frame: `2385:38867` — 739×916 px right panel.
Shell: `src/components/shared/OnboardingRightPanel.jsx` (default green bg, ellipses, grid, sparkle-stars, snow).
Content: `src/components/sections/talentAuth/TalentContactPanelContent.jsx`
Used on routes: `/onboarding/talent/contact`, `/onboarding/talent/address`, `/onboarding/talent/education`.

### Photo cards (ONE container `absolute inset-0`)

| Card        | Position                                   | Width (clamp)               | Border    | Rotation |
| ----------- | ------------------------------------------ | --------------------------- | --------- | -------- |
| Top-right   | left calc(50%+21.53%), top calc(50%-2.93%) | `clamp(140px,15.7vw,277px)` | `#EEDEB8` | +5°      |
| Top-left    | left calc(50%-21.42%), top calc(50%-24.0%) | `clamp(142px,16.1vw,284px)` | `#EBC2BD` | -8.51°   |
| Bottom-left | left calc(50%-19.66%), bottom 7.31%        | `clamp(166px,18.8vw,332px)` | `#C1D4C4` | -18°     |

### Panel-level overlays

| Element            | Node         | Position                                                            | Notes                                                                                                     |
| ------------------ | ------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Sparkle-26         | `2385:38902` | left calc(50%+3.27px), top -17px                                    | rotate(21.55deg); peeking bleed from aside overflow-hidden                                                |
| OTP chip (amber)   | `2385:38883` | left 3.38%, top 36.56%, right 60.4%                                 | bg `#C8951A`, border `#FAF4E8`; "OTP sent after this step"                                                |
| GDPA chip (white)  | `2385:38896` | left 55.54%, top 22.81%, right 7.04%                                | bg white, gthIcon rotate(8deg); "Ghana Data Protection Act compliant"                                     |
| Phone preview card | `2396:19979` | left 60.38%, top 70.20%                                             | bg `#FAF4E8`, border `#EEDEB8`, shadow `0 3px 0 #967014`, rotate(2deg)                                    |
| Arrow down         | `2353:13941` | photo3 children: left 4.91%, top -32.91% (= panel 74.7px, 408.33px) | `talent-panel-arrow-down.svg`; flex-center wrapper 36.1%×36.0% of cardWidth, img 79.45%×80.44% of wrapper |
| Arrow scribble     | `2353:13937` | left 84.17%, top 65.28%                                             | `talent-panel-arrow-scribble.svg`                                                                         |
| WatchTutorial      | `2385:38903` | bottom 38px, right 58px                                             | `WatchTutorial` component, `showLabel` + `label="Watch Tutorial"`                                         |

---

## Parent onboarding — two flows + Flow B ward-invited welcome `✅ VERIFIED` (2026-06-26)

The parent flow has **two entry flows** (config: `src/constants/parentFlows.js`):

| Flow                          | Who                                                                 | Welcome route                | Right panel           |
| ----------------------------- | ------------------------------------------------------------------- | ---------------------------- | --------------------- |
| A — self-serve                | parent signs up on their own, links ward manually                   | `/onboarding/parent-welcome` | photo panel (default) |
| B — ward-invited (pre-filled) | child registered first, pre-filled parent contact, ward auto-linked | `/onboarding/parent-invited` | **simple** panel      |

Both converge on the shared steps (identity → verification → contact → security → link-ward → review → done). `PARENT_FIRST_STEP = /onboarding/parent-identity`.

### Flow B welcome (frame **2864:36856**, route `/onboarding/parent-invited`)

Left content `2864:36858` — `src/components/sections/parentLogin/ParentInviteWelcomeSection.jsx` (page `ParentInvitePage.jsx`). Left-aligned column, no breadcrumb.

| Element            | Node         | Tokens / verbatim                                                                                                                                                          |
| ------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-fill banner    | `2864:36861` | bg #ebf1ec border #c1d4c4 r-16; green 32px icon box + "Your ward registered on Ghana Talent Hub" (bold #2a5730 13px) + "Kofi Mensah (16)" bold #387440 + rest #70706e 12px |
| Caption            | `2864:36867` | "Parent / Guardian Onboarding" 10px bold #c8951a uppercase tracking 1.3px                                                                                                  |
| Headline           | `2864:36868` | Instrument Serif 52px #111 tracking -2px; "Your ward is already " + italic #967014 "on the platform."                                                                      |
| Subtitle           | `2864:36869` | 14px #70706e; "Ghana Talent Hub uses an opt-out model — …"                                                                                                                 |
| How-this-works box | `2864:36870` | bg #faf4e8 border #eedeb8 r-16; info glyph + "HOW THIS WORKS" 12px bold #967014; 3 rows: 20px #c8951a check-pill + bold #111 lead-in + #575755 rest                        |
| Primary CTA        | `2864:36887` | amber bg #c8951a border-2 #967014 shadow `0 3px 0 #967014` r-10; "Create my parent account" + arrow → `/onboarding/parent-identity`                                        |
| Secondary CTA      | `2864:36891` | border #c6c6c3 r-10; "I have concerns — opt-out instead" #70706e semibold                                                                                                  |
| Footer             | `2864:36893` | "Already have an account?" #babab7 + "Log in" #387440 → `/onboarding/parent-login`                                                                                         |

### Flow B simple-panel content (frame **2864:36896**)

`ParentLoginRightPanel variant="simple" centerContent={<WardInvitePanelContent />}` — `src/components/sections/parentLogin/ParentInvitePanelContent.jsx`. Plain gold + centered:

| Element    | Node                   | Tokens / verbatim                                                                                                                                                                                                                  |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heading    | `2864:36902`           | Instrument Serif 34px white tracking -0.8px; "Supporting " + italic "Ghanaian talent" + " starts with you."                                                                                                                        |
| Subtitle   | `2864:36903`           | 13px rgba(255,255,255,0.6); "Your ward has already taken the first step. …"                                                                                                                                                        |
| Info cards | `2864:36904` / `36910` | white r-16 shadow `0 16px 20px rgba(0,0,0,0.18)`, rotated -3.5° / +3° (overlap); 26px amber icon box + 9px bold #70706e label + 12px semibold #111 value: "Account type / Parent / Guardian", "Ward status / Active — Kofi Mensah" |

> Layout: `isInvitedWelcome` (exact `/onboarding/parent-invited`) excludes it from the breadcrumb + selects the simple panel with `WardInvitePanelContent`. DemoNavigator lists it as "Invited".

### Flow B Identity step (frame **2864:37043**, route `/onboarding/parent-invited-identity`)

Card form (left `2864:37048`) — `src/components/sections/parentLogin/ParentInviteIdentitySection.jsx` (page `ParentInviteIdentityPage.jsx`). Two-column: scrollable form + sticky Back/Continue footer; simple step-list panel right. Shows the breadcrumb.

| Element               | Node                   | Tokens / verbatim                                                                                                                                                                                           |
| --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caption               | `2864:37049`           | "Step 1 of 7 — Parent Identity" 10px bold #c8951a uppercase                                                                                                                                                 |
| Heading               | `2864:37050`           | Instrument Serif; "Tell us about " + italic #c8951a "yourself."                                                                                                                                             |
| Subtitle              | `2864:37051`           | 14px #70706e centred                                                                                                                                                                                        |
| First / Last / Middle | `2864:37052` / `37065` | reused `TextInput`; labels bold 13px + red `*` / grey "(optional)"                                                                                                                                          |
| Relationship chips    | `2864:37071`           | single-select pills: Mother, Father, Aunt, Uncle, Nephew, Niece, Older Sibling, Grandparent, Legal Guardian. Selected = bg #faf4e8 border #c8951a text #b48617; default = bg #f8f8f4 border #c6c6c3 #575755 |
| Gender radios         | `2864:37094`           | pill radios Male / Female; selected = amber border + amber dot                                                                                                                                              |
| Date of Birth         | `2864:37105`           | Day (TextInput) · Month (`Select` Jan–Dec) · Year (TextInput)                                                                                                                                               |
| Nationality chips     | `2864:37121`           | 🇬🇭 Ghanaian · 🇳🇬 Nigerian · 🇨🇮 Ivorian · Other                                                                                                                                                              |
| Footer                | `2864:37134`           | sticky `bottom-0` white bar; Back (bordered + chevron) + Continue (gated grey→amber, → `/onboarding/parent-invited-verification`)                                                                           |

Simple step-list panel (right `2864:37143`) — `ParentInviteStepsPanelContent` (`currentStep`/`title`/`titleAccent`/`subtitle`): "Your identity _builds trust._" + 6-item numbered list (Your identity / Verification / Contact details / Security / Link your ward / Consent), active item highlighted. Reusable for future Flow B steps.

### Flow B Verification step (frame **2864:37219**, route `/onboarding/parent-invited-verification`)

Card layout (left `2864:37224`) — `src/components/sections/parentLogin/ParentInviteVerificationSection.jsx` (page `ParentInviteVerificationPage.jsx`). Breadcrumb step 2 / 20%.

| Element      | Node                   | Tokens / verbatim                                                                                                         |
| ------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Caption      | `2864:37225`           | "Step 2 of 7 — Verification"                                                                                              |
| Heading      | `2864:37226`           | "Verify your " + italic #c8951a "identity."                                                                               |
| Subtitle     | `2864:37227`           | "Both fields are optional — you can skip this step and verify later. …"                                                   |
| Note banner  | `2864:37228`           | amber box; "Both fields are optional for parents" (bold) + "Unlike talent accounts, parent verification is not required…" |
| Upload cards | `2864:37235` / `37245` | reused `Upload` (amber): Ghana Card ID + Profile Photo, "Optional" badge, accept-label pills (Figma hint lines)           |
| Skip row     | `2864:37254`           | "Prefer to skip for now?" + "Continue without verification" → next step                                                   |
| Footer       | `2864:37257`           | sticky Back + Continue (amber, enabled — uploads optional) → `/onboarding/parent-invited-contact`                         |

Panel (`2864:37266`): "Optional for _parents._" + "Verification builds trust but isn't required…" + step list with step 1 **checked** (completed) and step 2 active.

### Flow B Security step (frame **2864:37481**, route `/onboarding/parent-invited-security`)

Card layout (left `2864:37486`) — `src/components/sections/parentLogin/ParentInviteSecuritySection.jsx` (page `ParentInviteSecurityPage.jsx`). Breadcrumb step 4 / 50%.

| Element          | Node         | Tokens / verbatim                                                                                                                                                                      |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caption          | `2864:37487` | "Step 4 of 7 — Account Security"                                                                                                                                                       |
| Heading          | `2864:37488` | "Create a strong " + italic #c8951a "password."                                                                                                                                        |
| Subtitle         | `2864:37489` | "This password protects your parent account. Use something only you would know."                                                                                                       |
| Password         | `2864:37490` | `TextInput` type=password + eye toggle (no lock icon) + 4-segment strength meter + 4 live rules: "At least 8 characters", "One uppercase letter", "One lowercase letter", "One number" |
| Confirm Password | `2864:37519` | `TextInput` + eye toggle; "Passwords do not match" error                                                                                                                               |
| Footer           | `2864:37527` | sticky Back + Continue (gated on all rules met + match) → `/onboarding/parent-invited-link-ward`                                                                                       |

Panel (`2864:37536`): "Lock your account _down._" + "A strong password protects your ward's data and your ability to manage their access." + step list (steps 1–3 checked, step 4 active).

> Strength label: "Enter a password" (empty) → Weak/Fair/Good/Strong (1–4 rules met) — only "Enter a password" is in Figma; the strength words are added states.

### Flow B Link Ward step (frame **2864:37620**, route `/onboarding/parent-invited-link-ward`)

Card layout (left `2864:37625`) — `src/components/sections/parentLogin/ParentInviteLinkWardSection.jsx` (page `ParentInviteLinkWardPage.jsx`). Breadcrumb step 5 / 78%.

| Element          | Node         | Tokens / verbatim                                                                                                                                          |
| ---------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caption          | `2864:37626` | "Step 5 of 7 — Link Ward"                                                                                                                                  |
| Heading          | `2864:37627` | "Your ward is " + italic #c8951a "already linked."                                                                                                         |
| Subtitle         | `2864:37628` | "Because your ward provided your contact details during their registration, …"                                                                             |
| Auto-link banner | `2864:37629` | bg rgba(235,241,236,0.6) border #c1d4c4; green 36px check box + "Ward automatically linked — Path A" + "Your contact matched the details Kofi provided. …" |
| Ward card        | `2864:37635` | white border #c1d4c4; green 52px check avatar + "Kofi Mensah" + meta (Age 16 · JHS 3 · 🇬🇭 Ghanaian) + green "Active" dot                                   |
| Detail grid      | `2864:37652` | shared `PreviewField` ×4: School=Achimota School · Curriculum=GES · Account created=Today, 09:42 AM · Account status=Active (#387440)                      |
| Opt-out reminder | `2864:37665` | amber box; "You can opt-out at any time from your dashboard" + "If you have concerns about Kofi's participation…"                                          |
| Footer           | `2864:37672` | sticky Back + "Confirm & Continue" → `/onboarding/parent-invited-consent`                                                                                  |

Panel (`2864:37681`): **custom link diagram** (`WardLinkPanelContent`) — "Ward _linked_ automatically." + "Because Kofi provided your contact during registration, the link is already confirmed." + You (amber 52px avatar) → connector → Kofi Mensah (green 52px avatar). Config entry uses `panel: 'link'` so the layout renders this instead of the step list.

### Flow B Consent step (frame **2864:37752**, route `/onboarding/parent-invited-consent`)

Card layout (left `2864:37757`) — `src/components/sections/parentLogin/ParentInviteConsentSection.jsx` (page `ParentInviteConsentPage.jsx`). Breadcrumb step 6 / 88%.

| Element         | Node         | Tokens / verbatim                                                                                                                          |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Caption         | `2864:37758` | "Step 6 of 7 — Consent & Rights"                                                                                                           |
| Heading         | `2864:37759` | "Understand your " + italic #967014 "parent rights."                                                                                       |
| Subtitle        | `2864:37760` | "Please read and confirm each statement below. All three are required to activate your parent account."                                    |
| Consent card 1  | `2864:37761` | bordered card + 22px checkbox; bold "I understand my ward has immediate platform access." + muted desc                                     |
| Consent card 2  | `2864:37766` | bold "I have read and accept the Parent Rights Policy." + muted desc + green link "Read policy"                                            |
| Consent card 3  | `2864:37773` | bold "I consent to Ghana Talent Hub processing my data." + muted + green link "Ghana Data Protection Act (Act 843)" + muted                |
| Compliance note | `2864:37782` | bg #ebf1ec border #c1d4c4; shield + "Data encrypted at rest · Ghana Data Protection Act compliant · No third-party data sharing" (#142916) |
| Footer          | `2864:37786` | sticky Back + "Activate Parent Account" (gated on all 3) → `/onboarding/parent-invited-done`                                               |

Panel (`2864:37795`): **custom capability list** (`WardConsentPanelContent`, `panel: 'consent'`) — "Almost _there._" + "Understanding your rights and responsibilities…" + 4 checked items: Review ward profile · Flag corrections · Opt-out at any time · Cannot edit directly — only flag.

### Breadcrumb restyle (Flow B style, frame **2864:37569**) `✅ VERIFIED`

`ParentOnboardingBreadcrumb` updated to match Figma (affects BOTH parent flows):

- **completed** (index < current): amber #c8951a circle + white check; label #967014 semibold
- **active** (index === current): **black #111** circle + white dot; label #111 semibold
- **upcoming**: #babab7 @45% circle (empty); label #babab7 medium
- right: "COMPLETE" 10px bold #babab7 + amber % + amber fill on #eedeb8 track
- labels updated to: Identity · Verification · Contact · Security · Link Ward · Consent · Done

### Flow B Contact step (frame **2864:37344**, route `/onboarding/parent-invited-contact`)

Card layout (left `2864:37349`) — `src/components/sections/parentLogin/ParentInviteContactSection.jsx` (page `ParentInviteContactPage.jsx`). Breadcrumb step 3 / 34%.

| Element  | Node         | Tokens / verbatim                                                                                                                   |
| -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Caption  | `2864:37350` | "Step 3 of 7 — Contact Information"                                                                                                 |
| Heading  | `2864:37351` | "How do we " + italic #c8951a "reach you?"                                                                                          |
| Subtitle | `2864:37352` | "We'll send a quick code to confirm it's really you — …"                                                                            |
| Phone    | `2864:37353` | reused `PhoneInput` (🇬🇭 +233), label + "SMS verification" trailing hint, placeholder "24 123 4567" — required                       |
| WhatsApp | `2864:37365` | reused `PhoneInput`, optional, placeholder "Leave blank if same as above" + helper "Leave blank if same as your phone number above" |
| Email    | `2864:37380` | reused `TextInput` (MailIcon), label + "Email verification" hint, placeholder "you@example.com" — required                          |
| Footer   | `2864:37391` | sticky Back + "Send Verification Code" (gated grey→amber) → `/onboarding/parent-invited-security`                                   |

Panel (`2864:37400`): "Secure contact _details._" + "Your contact details are encrypted and protected under Ghana's Data Protection Act." + step list (steps 1–2 checked, step 3 active).

> Per-step Flow B panel copy + breadcrumb step/percent live in `WARD_INVITE_STEP_PANELS` (`src/constants/parentFlows.js`); the layout looks it up by route slug. The step-list panel renders a check for completed steps, highlights the active one, numbers the rest.

> Layout: `isInvitedStep` (parent-invited-\* with a suffix) shows the breadcrumb + the step-list panel. Flow B first step wired from the invited welcome via `PARENT_FLOWS.wardInvited.firstStep`.
> Note: the shared `ParentOnboardingBreadcrumb` shows Flow A labels ("Parent Identity" / "Review & Consent"); Figma Flow B uses "Identity" / "Consent" — minor label diff, breadcrumb left shared.

---

## Profile Filling — Interests Intro page `✅ VERIFIED` (2026-07-04)

Route: `/profile/filling/interests` — `InterestsIntroPage` → `InterestsIntroSection`.

| Node           | ID           | Description                                                                            |
| -------------- | ------------ | -------------------------------------------------------------------------------------- |
| Main frame     | `3530:35614` | `interests(intro page(optional))`, 1728×1079                                           |
| Nav bar        | `3530:35666` | `bg-[#f8f8f4]`, `px-64`, logo 66px, Switch Modes shelf btn, user chip                  |
| Content wrap   | `3530:35694` | `absolute h-[1016px] top-[143px] w-[1728px] overflow-clip`                             |
| Step trail bar | `3530:36666` | `h-[77px] px-[54px] py-[10px] flex justify-between`                                    |
| Progress bar   | `3530:36684` | `w-[323px] flex-col gap-[4px]`; track `bg-[#e1eae2]`                                   |
| Header section | `3531:47134` | `h-[240px] left-0 right-[329px] top-[77px]`; TL green radial + BR pink radial gradient |
| Section label  | `3531:47156` | "WHAT THIS STAGE COVERS", 10px bold #888, + 1px divider                                |
| Step cards     | `3531:47225` | 5 cards, `flex-col gap-[8px]`, `h-84/85px`, `rounded-[12px]`, drop-shadow              |
| Footer         | `3530:36694` | `h-[142px] left-0 right-[329px]`; Go back + Open Interests shelf btns                  |
| Right panel    | `3531:46485` | `w-[329px] top-[81px]`; `linear-gradient(109.386deg, #142916, #2a5730)`                |
| Icon showcase  | `3531:47066` | `top-[10px] h-[152px]`; 56×56 glass box + InterestsIcon + labels                       |
| Stat cards     | `3531:47069` | `top-[174px] flex-col gap-[14px]`; recruiter impact + time cards                       |
| Journey card   | `3531:47044` | `top-[435px] h-[398px]`; 9-step progress list                                          |

**Corrections applied to shared components:**

| Component                     | Node corrected | Change                                                                                                                              |
| ----------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `EngagementTopBar`            | `3530:36666`   | px 40→54px, icon 14→16px, label 11→14px, separator 20→24px, right w clamp→323px                                                     |
| `EngagementProgressIndicator` | `3530:36684`   | track bg neutral→brand-green-light-hover; StatusDot→5×5 square; single row→justify-between                                          |
| `EngagementTopNav`            | `3530:35666`   | px 32→64px, logo 56→66px, Switch Modes padding/border, Save&Exit gradient text, help btn radius/bg, user chip border/radius/padding |
| `AvatarStepLayout`            | —              | Step trail wrapper height 81→77px (clamp corrected)                                                                                 |

---

## Profile Filling — Interests Stage 2 (category selection) `✅ VERIFIED` (2026-07-04)

Route: `/profile/filling/interests/categories` — `InterestsStage2Page` → `InterestsStage2Section`.

| Node                      | ID           | Description                                                                  |
| ------------------------- | ------------ | ---------------------------------------------------------------------------- |
| Main frame                | `3531:46209` | Interests step stage 2, 1728×1084                                            |
| Header section            | `3531:46294` | `"What pulls you in?"` (italic green `you in?`) + subtitle + tag pills       |
| Section heading           | `3531:46331` | "WHAT THIS STAGE COVERS" label + `"Broad areas first."` (italic green)       |
| Category card (collapsed) | `3550:47566` | Creative Arts — `h-84px`, gradient icon bg, `✓ Done` badge, 2 action buttons |
| Category card (collapsed) | `3550:47605` | Business and Finance — same structure                                        |
| Live role matches         | `3547:47351` | `bg-[#fffefc] border-[#eedeb8]`; 3 role rows with `%match` pills             |
| Right panel               | `3531:46491` | `bg-[#f8f8f4]` light panel; 5 scrollable info cards                          |

**Category card token summary (Figma 3550:47566 / 3550:47605):**

- Container: `bg-white border border-[#e8e8e4] rounded-[16px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.06)] h-[84px]`
- Icon bg: `linear-gradient(216deg, rgb(254,241,231) 0%, rgb(232,242,237) 100%)`, `38×38 rounded-[10px]`
- Title: SF Pro Rounded Bold, 13px, `#111`; status: `✓ Done` Bold, 10px, `#1d7c4d`
- Subtitle (specifics): SF Pro Rounded Regular, 11px, `#70706e`
- Specifics pill: `bg-[#ebf1ec] border border-[#c1d4c4] rounded-full h-[19px] px-[8px]`, SemiBold 10px `#2a5730`
- Action buttons: two `28×28 bg-white border border-[#e8e8e4] rounded-[6px]` (chevron + trash)

**Right panel info cards:**

| Card                 | Background              | Border    | Radius |
| -------------------- | ----------------------- | --------- | ------ |
| Why Interests Matter | `bg-white`              | `#e8e8e4` | `16px` |
| What Counts?         | `rgba(235,241,236,0.5)` | `#c1d4c4` | `10px` |
| Popular in Ghana     | `bg-white`              | `#e8e8e4` | `10px` |
| The Sweet Spot       | `bg-white`              | `#e8e8e4` | `10px` |
| Mentor Matching      | `rgba(235,241,236,0.5)` | `#c1d4c4` | `10px` |

---

## Cross-references

- Figma fidelity rules: [figma-fidelity.md](figma-fidelity.md)
- Design tokens: [design-tokens.md](design-tokens.md)
