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

## Cross-references

- Figma fidelity rules: [figma-fidelity.md](figma-fidelity.md)
- Design tokens: [design-tokens.md](design-tokens.md)
