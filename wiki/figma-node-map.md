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

## Skills Lab (Engagement page) `✅ VERIFIED`

Figma page: Engagement (`3125:10352`). Skills Lab screens live within this page.

| Frame name                       | Node ID       | Viewport | Notes                                           |
| -------------------------------- | ------------- | -------- | ----------------------------------------------- |
| Quiz question (default)          | `4150:15459`  | Desktop  | Main quiz layout — nav, header, progress, cards |
| Answer selected state            | `4140:37230`  | Desktop  | B highlighted green (selected)                  |
| Wrong answer state               | `4576:16658`  | Desktop  | B highlighted red, correct shown                |
| Hint modal                       | `4432:15109`  | Desktop  | Step-by-step breakdown overlay                  |
| Results — pass (Skill Verified!) | `4441:18688`  | Desktop  | Trophy + badge unlocked                         |
| Results — fail (try again)       | `4441:20171`  | Desktop  | Sad icon + retry CTA                            |
| Skills complete page             | `3625:150744` | Desktop  | Post-verification landing                       |

---

## Career Buddy — Educational Background state machine `✅ VERIFIED` (2026-07-29)

Route: `/profile/filling/career-buddy`. Each frame is 1728×1117, same `Placeholder image` (0,224,1112,893) / `RIGHT — customiser panel` (1112,224,616,893) shell as the rest of the Career Buddy screen — only the panel's Educational Background row content differs per state, per Figma's own frame names.

| State (Figma frame name)         | Node ID      | Panel row content                                                                                            |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| NOT STARTED                      | `5132:46553` | Collapsed row, "Completion: Not Started"                                                                     |
| IN PROGRESS                      | `5132:46736` | Collapsed row, "Completion: In Progress" (amber) — shown from the first `edu-q*` message, not just at review |
| AWAITING REVIEW AND CONFIRMATION | `5132:46916` | Expanded, view-details (`5132:47002`): read-only 7-field list + Modify/Confirm buttons                       |
| USER CHOOSES TO EDIT             | `5132:47096` | Expanded, edit-details (`5132:47182`): editable bordered boxes (except Transcript) + single Update button    |
| EDUCATIONAL BACKGROUND SAVED     | `5132:47276` | Success toast (`5132:47544`, "Frame 11") + auto-confirmation chat bubble (`5132:47342`)                      |
| CONFIRMED                        | `5132:47551` | Collapsed row, "Completion: 100%"; auto-confirmation bubble persists in chat (`5132:47617`)                  |

**Toast variants** (compact banner, top-center) — all `rounded-[12px]`, `border-b` accent only, `drop-shadow`:

| Variant | Node ID      | bg        | border-bottom | Copy                                    |
| ------- | ------------ | --------- | ------------- | --------------------------------------- |
| Success | `5132:45989` | `#ebf1ec` | `#387440`     | "Success, Educational background saved" |
| Error   | `5132:46267` | `#fef6f5` | `#c0392b`     | "Error, No internet connection"         |
| Warning | `5132:46545` | `#fefbf4` | `#f59638`     | "Warning, Unsaved changes"              |

**Chrome row restyle** (New Chat / Chat History pills, both `bg-black/[0.21] rounded-[12px]`):

| Element      | Node ID      |
| ------------ | ------------ |
| New Chat     | `5132:47988` |
| Chat History | `5132:47992` |

**EngagementTopBar overflow chevron** (stage-trail scroll affordance, `ghost-icon` Button variant): `5132:44983` (button, 58×44) / `5132:44984` (chevron vector).

---

## Career Buddy — Personal Area of Interest + Personality mode-picker `✅ VERIFIED` (2026-07-30)

Same FSM pattern as Educational Background (`STAGE_SAVE_META` etc. in `CareerBuddySection.jsx`), reused for two more stages.

| State / node                                                                  | Node ID                                             | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Personal Area of Interest — Q&A transition                                    | (verbatim text, no dedicated frame captured)        | 3 free-text questions, `interests-confirm` → panel review → confirm/error/retry/success, chains to `personality-prompt`                                                                                                                                                                                                                                                                                                                                                        |
| Personality — STARTED (transition prompt)                                     | `5132:55364` / `5132:55452` / `5132:55453`          | "Okay that's great. Now would you like to continue with the topic personality?" — corrects an earlier pass that mis-attributed a "Sure bro" reply here                                                                                                                                                                                                                                                                                                                         |
| Personality — mode picker (Games/MCQs/Open Chat)                              | `5132:57368`                                        | Outer `Frame 14224`: `bg-white rounded-[16px] p-[20px] gap-[20px]` wrapping the 3-card row (`Frame 14593`, `5132:57373`) AND the input bar (`GTHInput`, `5132:57377`) together — NOT the message-text bubble, which is a separate sibling (`Component 26`/`5132:57367`, `bg-white rounded-[12px] px-[6px] py-[14px]`) ~200px above. Confirmed via `get_metadata`, not the screenshot alone, after a first implementation pass wrongly nested the cards inside the text bubble. |
| Mode card — Games (default / hover)                                           | `5132:57374` (default)                              | `bg-[#fffefc] border-2 border-[#e6e6e6]`, icon box `bg-[#f8f8f4]`                                                                                                                                                                                                                                                                                                                                                                                                              |
| Mode card — MCQs (hover state shown in this specific reference frame)         | `5132:57375`                                        | `data-annotations: "This is the Hover state for the personality cards"` — bg-white, green border, `drop-shadow-[0px_6px_0px_rgba(34,70,38,0.8)]`                                                                                                                                                                                                                                                                                                                               |
| Mode card — Open Chat (default)                                               | `5132:57376`                                        | Same default styling as Games                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Personality panel fields (Personality type/Key Traits + 4 percentage metrics) | (from user-supplied screenshot, no frame captured)  | Confidence 75% / Adaptability 80% / Risk Tolerance 65% / Emotional Stability 82% — richer bespoke report widgets (progress bars, collapsible insight, comment box) deliberately out of scope; generic panel row list reused                                                                                                                                                                                                                                                    |
| MCQ questions (4, lettered options)                                           | (verbatim text via individual message-node fetches) | `mcq-q1..q4` in `careerBuddyScript.js`; 2–4 options each, `options` message field                                                                                                                                                                                                                                                                                                                                                                                              |
| Open Chat questions (3, free text)                                            | (verbatim text via individual message-node fetches) | `open-chat-q1..q3` in `careerBuddyScript.js`, same freeText pattern as `edu-q*`                                                                                                                                                                                                                                                                                                                                                                                                |
| Games mode                                                                    | Game Store modal + Game Details view                | **Built 2026-07-30** — see the dedicated section below. Actual gameplay (4-stage Escape Room) still deferred.                                                                                                                                                                                                                                                                                                                                                                  |

Mode-card icons (Games/MCQs/Open Chat) are real production SVGs the user supplied directly — `PersonalityGamesIcon`/`PersonalityMcqIcon`/`PersonalityOpenChatIcon` in `assets.jsx` — not hand-crafted per CLAUDE.md Rule 3's normal default, since the exception (user supplies real SVG code) applies.

---

## Career Buddy — Game Store + Game Details modal `✅ VERIFIED` (2026-07-30)

Games mode's Store + Details shell, triggered from the personality mode-picker's "Games" card. Store + Details first, gameplay stubbed — per explicit user sequencing decision (recorded in `wiki/log.md`).

| Element                                   | Node ID(s)                               | Notes                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chat trigger (mode-picker → Games → link) | `5132:64829` ("game")                    | Verbatim transcript: "Play Games" `[Auto]` → bot "All good! Check out the Game Store and choose whatever looks fun to you." + `linkButton` "Open Game Store ↗". "Personality confirmed ✅" comes later via the panel's own Confirm (not chained from this node).                                                                                                                                              |
| Game Store modal ("All Games")            | `5132:60815`                             | 750×749 centered modal over the chat screen (not full-page). Header `5132:61144` (dice icon + title + subtitle + close), body `5132:61155` (search `GTHInput` + 6 category chips + 2-col card grid, `max-h-[441px]` internal scroll).                                                                                                                                                                         |
| Game Store — filtered state               | `5132:63175` ("Games Filter - Strategy") | Same modal, filter-applied — structurally identical to `60815`, just fewer cards + a "SHOWING RESULTS FOR..." label (not reproduced verbatim; app shows the filtered grid directly).                                                                                                                                                                                                                          |
| 7 game cards (verbatim copy)              | `5132:61175`-`61299`                     | The Escape Room (Strategy), Desert Island (Decision Making — not one of the 6 filter chips, a genuine Figma inconsistency reproduced as-is), Tower Builder (Logic), The Negotiation (Social), Speed Sort (Speed), Monopoly (Strategy), The Pitch (Creativity). Each: circle art, category badge, title, description, "Difficulty: X" (colour-coded), "~4 min", "Play →".                                      |
| Game Details ("Game details")             | `5132:61301`, children `61641`-`61729`   | "← Back to Game Store" header, icon+title+badges, "About this game", "What we measure" (4 traits, 2-col), "How to play" (video-preview placeholder + 4 tip rows), footer keyboard hint + "Let's Play →" CTA. **Only The Escape Room has this full copy extracted** — the other 6 games render card-level fields only in the app (no fabricated traits/tips for them).                                         |
| Escape Room gameplay (Stage 1-4)          | `5132:61730`, `62092`, `62454`, `62816`  | **Not built.** Full-bleed illustrated room scene, narrator dialogue, 4 lettered choice bubbles, countdown timer, "Save & Exit", stage badge. Real background/character art (5 PNGs: 4 composited stage scenes + 1 character sprite) supplied by the user mid-session but no discoverable file path existed to pull them into the repo — need them placed in a specific assets path before this stage's build. |
| Character sprite + background art assets  | `5132:63572`-`63576`                     | Real illustrated PNGs referenced by the gameplay stages above — not hand-craftable per CLAUDE.md Rule 3 (genuine illustration, not a simple icon). Placeholder (initial-letter circle) used in the Store/Details views meanwhile.                                                                                                                                                                             |

🪦 STALE note (as of 2026-08-03): the Escape Room gameplay row above says "Not built" — it since WAS built (`EscapeRoomGame.jsx`, real stage art placed, real "How to play" tip list added to Game Details) in a later pass this session. This table wasn't updated at the time; treat the "Not built" / "no discoverable file path" claims here as outdated until this section gets a proper refresh pass.

---

## Career Buddy — Parent welcome (My / Elliot panel) `✅ VERIFIED` (2026-08-11)

Route: same `/profile/filling/career-buddy` with `CareerBuddyRoleProvider` role `parent`. DemoNavigator: Talent | Recruiter | Parent → `?cb=welcome`.

| Piece                       | Node / source                                  | Notes                                                                             |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| NOT STARTED / welcome toast | `5132:77628`, `5132:77862`, toast `5624:67780` | TALI welcome + ward initialized; CTAs Build own / Guide ward / Upload + FAQ chips |
| Script                      | `parentBuddyScript.js`                         | `PARENT_BUDDY_NODES`; My vs Ward stage %; `CAREER_BUDDY_WELCOME_TOAST`            |
| Panel tabs                  | `TalentProfilePanel` `tabs`                    | My Profile \| Elliot's Profile (curly apostrophe)                                 |
| Resume upload               | `parent-upload-prompt` `awaitFile`             | Demo ack only (no parse)                                                          |

## Career Buddy — Parent ward account setup (not initiated) `✅ VERIFIED` (2026-08-11)

When the ward account is not initiated, **Guide my ward's profile** opens the setup modal (details → password → success toast).

| Piece            | Node / source                                                            | Notes                                                                                 |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Details modal    | `5132:80134` / form `5132:80373`                                         | `WardAccountSetupModal` step `details`; required fields + Ghana Card front/back (5MB) |
| Password modal   | `5132:80489` / `5132:80722`                                              | step `password`; Create / I'll do this later (stay, incomplete)                       |
| Success toast    | `5132:80762` / `5132:81004`                                              | compact success: "Congratulations, your ward's account has been created successfully" |
| Empty ward panel | `PARENT_EMPTY_WARD_STAGES`                                               | all Not Started while uninitiated (and after fresh create)                            |
| Demo seeds       | `?cb=ward-uninitiated` / `ward-setup` / `ward-password` / `ward-success` | DemoNavigator Parent Career Buddy steps                                               |
| Data             | `wardAccountSetupData.js`                                                | copy + defaults + validators                                                          |

## Career Buddy — Parent resume → Elliot panel `✅ VERIFIED` (2026-08-11)

| Piece              | Node / source                                | Notes                                                                                              |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Welcome chip strip | `5132:79545`                                 | Upload resume chip on parent welcome                                                               |
| Upload mid-flow    | `5132:79750`                                 | Awesome upload → Resume.pdf → evaluate wards profile → **Of course**                               |
| Attach             | anytime (parent)                             | Same as recruiter; always resumes → ward evaluate path                                             |
| Fill               | `parent-resume-fill`                         | Elliot tab; Personal Info / Education / Interests / Skills / Work awaiting-review + Modify/Confirm |
| Demo               | `?cb=parent-resume` / `parent-resume-filled` |                                                                                                    |

---

## Work Experience — profile filling page flow `✅ VERIFIED` (2026-09-06)

Standalone page-based flow at `/profile/filling/work` (+ `/profile/filling/work/history`), structurally mirroring Interests/Skills' own intro+stage2 page pattern — **distinct** from the Career Buddy conversational Work Experience flow documented above (that one lives in `careerBuddyScript.js`/`CareerBuddySection.jsx`, node range `5132:xxxxx`). This flow uses file key `Bin8roWL8sloyc36IgFMuT` ("Gh-Design-system--onboading"), node range `5112`/`5113`/`5114`/`5178`/`5200`/`5249`/`6686`/`6286`.

| Screen                      | Node ID                               | Notes                                                                                                                                                                                                                                                                                                    |
| --------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro page                  | `5112:32344`                          | "work" frame. Mirrors `InterestsIntroSection.jsx` exactly: nav/breadcrumb ("Step 5 of 9 · Work · 44% profile complete"), icon showcase, Impact-stat + Time cards, "Your journey" 9-stage panel, 4 numbered "What this stage covers" info cards.                                                          |
| List page — empty state     | `5112:106198`                         | "WORK" frame. "No work history yet." + "+ Add your first role" + "Skip this stage" link.                                                                                                                                                                                                                 |
| List page — populated state | `5113:107408`                         | "work added" frame. 4 example role cards (Junior Frontend/Backend Developer, Software Engineering Intern, ICT Instructor), each with laptop icon, status tag, description, tag row, edit/delete icon buttons.                                                                                            |
| Add-role modal              | `5113:121160` (overlay `5114:124039`) | "new work-upload". 3-section form: Role & organisation, Dates & duration, What you did & achieved (+ "Strong description patterns" tips).                                                                                                                                                                |
| Success modal               | `5113:122447` (overlay `5113:122832`) | "success". Trophy + role-count/years summary, "Senior role matching unlocked" checklist, mini role-list preview, profile-strength bar. Wired to fire on every 4th role saved (mirrors the frame's own "4 roles" framing) rather than every save, since there's no backend milestone signal in this mock. |
| Delete-confirm modal        | `5178:34742` (overlay `5178:35347`)   | "Delete work experience ". Role preview, two warning banners, "Edit instead?" nudge linking back to the Edit modal.                                                                                                                                                                                      |
| Edit-role modal             | `5178:36163` (overlay `5178:36457`)   | "Edit Work". Same form as Add, pre-filled, plus a "Delete this role" footer link and a dirty-state "Unsaved changes" bar. The Figma "Editing banner" node (`5178:100857`) is marked `hidden` in Figma itself and is intentionally NOT rendered here (visibility wins over mere tree presence).           |

**Verbatim-fidelity calls made:**

- The intro page's 3rd "What this stage covers" info card reads "Education tab" / "Schools, programmes and dates..." in Figma's actual `characters` field — an unmistakable copy-paste leftover from the Educational Background stage. Kept verbatim per this session's "flag, don't silently fix" rule for nonsensical source copy — visible live at `/profile/filling/work`.
- The list page's header tag row in Figma literally reads "3 categories / 4 specific interests / 4 min" (another Interests-stage-2 copy-paste leftover). Since reproducing it verbatim would display nonsense on a Work page, `WorkStage2Section.jsx` computes real tags from live state instead (`"N roles"` / `"Not started"` or `"In progress"` / `"~5 min"`) — the one deliberate exception to verbatim-text in this section, documented in a code comment.
- The Add-modal headline was suspected (pre-build) to be a Figma copy-paste artifact reading "Identity captured." — re-verified via a real `get_design_context` dive and confirmed the actual text is "New role. Tell your story" / "Update your role." (Add/Edit respectively). The suspicion did not hold up once actually dived into.

**Known gap (flagged, not fixed in this pass):** the Add/Edit form has no input for the extra skill/context tags shown on cards (e.g. "React", "TypeScript", "Teaching") — Figma's own modal doesn't have a field for them either. `buildRole()` in `WorkStage2Section.jsx` preserves any such tags across an edit (swapping only the employment-type entry) rather than losing them, but there is still no way to add or remove one through the UI — a real second-entry/tag-editing flow would need a form field Figma doesn't currently spec.

---

## Project Portfolio — profile filling page flow `✅ VERIFIED` (2026-09-07)

Standalone page-based flow at `/profile/filling/portfolio` (+ `/profile/filling/portfolio/projects`) — the 6th of 9 profile-filling stages, structurally mirroring the Work Experience flow above (same file key `Bin8roWL8sloyc36IgFMuT`, node range `5178`/`5180`/`5200`/`5204`/`5209`/`5211`/`5215`/`5217`/`6286`).

| Screen                        | Node ID                                                       | Notes                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro page                    | `5178:101277`                                                 | "Portfolio start screen". Nav/breadcrumb ("Step 6 of 9 · Portfolio · 56% profile complete"), headline "Portfolio _Show, don't just tell._", 3 tags ("Not Started" / "3.4× attention" / "~7 min"), 4 numbered info cards (Project cards / Links / Pinned project / Cover images), shared `ProfileFillingJourneyPanel` right panel.                                         |
| List page — empty + populated | `5178:101512`                                                 | "Portfolio 1". Headline "Portfolio. _Things you've shipped._", tags ("2–6 projects" / "Pin your best" / "~6 min"), empty state ("No projects yet." + "+ Add your first project" + "Nothing built yet? Skip this stage"), example card ("Accra Bus Tracker" — verbatim description/tags), right aside ("What counts?" / "Popular in Ghana" / "Recruiter views this week"). |
| Add-project modal             | `5178:102292` (+ `5209:112732`, `5204:112463`, `5204:112595`) | "Overlay centred card". 4-section form: Cover image (shared `Upload` component), Project basics (title/type/year/role), What it is & what you built (description + "Strong description patterns" tips), Technologies & links (tech input + live/GitHub/Figma links) + pinned-project toggle.                                                                              |
| Edit-project modal            | `5215:114592`                                                 | Same form as Add, pre-filled (e.g. "Accra Bus Tracker" example values), footer swaps to `[Delete this Project]` + `[Save Changes]` (no separate Cancel — verified via a real dive, not assumed symmetric with Add). The Figma "Editing banner" node (`5217:122714`) is `hidden` in Figma itself and intentionally NOT rendered here.                                      |
| Success modal                 | `5217:122490`                                                 | "div.succ-card:shadow". Trophy + live project/pinned-count summary, "Portfolio filter unlocked in recruiter search" checklist, mini project-list preview (up to 3), static profile-strength bar ("52% : 4 stages done"), CTA "Continue to Certs stage" (secondary/amber variant). Opens on every successful save (add AND edit), not an invented milestone gate.          |
| Delete-confirm modal          | `5211:114088`                                                 | "failed". Project preview card (type-colour strip + icon, same visual language as the list's `ProjectCard`), two reason rows ("Project removed from your portfolio immediately" / "Portfolio strength may decrease"), "Edit instead?" nudge, footer `[Cancel]` + `[Permanently delete this project]` (danger variant).                                                    |

**Verbatim-fidelity calls made** (this modal's Figma frames were evidently cloned from the Skills "Add a skill" modal and only partially re-copy-edited for Portfolio — all reproduced verbatim per this session's "never silently fix Figma copy" rule, same as Work's own Education-tab card):

- The small status badge above the Add/Edit-modal headline (`5178:102300` / `5215:114600`) literally reads "Add A skill" in BOTH modes.
- The subtitle under the headline (`5178:102303` / `5215:114603`) reads "Fill in the name, set your proficiency honestly, and tag it to a category. That's it — you can verify it later." in BOTH modes — Skills-flow concepts ("proficiency", "verify it later") with no Portfolio equivalent. A hidden node in the same tree (`5178:102386` / `5215:114711`, node name "Skills Lab — verify Excel & SQL next", `hidden="true"` in Figma's own layer tree) further confirms the clone — respected by NOT rendering it, same treatment as Work's hidden "Editing banner".
- The "Figma / design file link" field's helper text (`5204:112623` / `5215:114649` area) is word-for-word identical to the "Your specific role" field's own helper a few rows up (`5209:112760` / `5215:114649`) — kept verbatim on both fields.
- The Delete-modal's description (`5211:114115`) reads "This will permanently remove the role from your work history..." — verbatim Work-flow copy (word-for-word matches `DeleteWorkModal.jsx`'s own description apart from that phrase). The two reason rows below it ARE correctly Portfolio-specific, so only this one sentence is the artifact.
- The headline itself, the section titles/descriptions, and the Edit-modal headline ("Editing project. Update the details.") were all independently verified NOT to have this problem via their own `get_design_context` dives.

**Business-logic calls (not blind copies, documented inline in code):**

- Figma's own section-numbering badges show "2" on BOTH the Cover-image section (`5178:102307`) AND the Project-basics section (`5209:112738`) — a numbering slip, renumbered sequentially 1-4 in code for UX clarity.
- The "Required Indicator" asterisk nodes on the Technologies & links section are positioned via absolute offsets landing off-frame (e.g. `left: -495.83px`) — not reliable evidence of which fields are required. All three link fields (Live link, GitHub, Figma) are optional at the code level rather than literally requiring both Live-link and Figma-link as a naive asterisk count would suggest, since that would make "GitHub-only" projects impossible to save (contradicts the intro page's own "Multiple links per project" framing).
- "Project Type" renders as a `Select` (fixed option list in `portfolioProjectTypeStyles.js`) rather than the plain-text `TextInput` Figma's own instance for that slot literally shows (placeholder "writing field", a generic unswapped component — an authoring gap, not a deliberate choice) — the surrounding copy about "a colour is set automatically from your project type" only makes sense against a fixed option set.
- "Only one can be pinned" (evidenced by the pin-toggle's own copy in both Add and Edit modes) is enforced in `PortfolioStage2Section.jsx`: saving a project with `isPinned: true` un-pins every other project in the same update.

**Known gap (flagged, not fixed in this pass):** the two small icon-only buttons next to the Add-modal's pinned-project toggle (`5204:112691`, an external-link icon + a plain icon button) resolve to a live Figma-prototype-server URL (`http://127.0.0.1:28345/...`) in the dived code — identified as Figma prototyping/dev-mode artifacts, not real design elements, and skipped.

---

## Goals (Desired Career Options) — profile filling page flow `✅ VERIFIED` (2026-09-09)

Standalone page-based flow at `/profile/filling/goals` (+ `/profile/filling/goals/list`) — the 8th of 9 profile-filling stages (`PROFILE_STAGES` id `desired-career`, trail label "Goals"), structurally mirroring the Certs / Portfolio / Work flows above. Same file key `Bin8roWL8sloyc36IgFMuT`, node range `5619`/`5622`/`5625`/`5659`/`6286`/`6668`/`6686`.

**MCP note:** unlike the Certs build (where `get_design_context` timed out and `get_metadata` layer names were substituted), `get_design_context` worked for every node in this dive. Everything in this section is read from real design context, not from layer names. `get_metadata` was used only for cheap structure discovery before diving.

| Screen                       | Node ID                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Intro page                   | `5619:80997` ("Goals start screen")                        | Breadcrumb bar `5619:81078` ("Step 8 of 9 · Goals" / "· 78% profile complete · auto-saved"). Header `5619:81195`: headline `81198` ("Goals" + italic green "Where you're actually heading."), subtext `81199`, tags `81201/81202/81203` ("Not Started" / "3.4× attention" / "~7 min"). Section label `81205` ("What this stage covers"). 4 numbered cards `81208/81214/81220/81226`. Footer `81106` ("Go back" / "Open Goals"). Right panel `81115`/`81121`. |
| List page — empty state      | `5619:81232` ("Goals empty state")                         | Header `5619:81341` (headline `81342` "Your goals. " + italic green "Where do you want to go?"; subtext `81343`; "Why goals matter" stat card `81344`; tags `81352/81353/81354` = "3 career goals" / "Primary drives match" / green "~3 min"). Empty state `5659:81360` (NB: the `5659` page prefix is real, not a typo — it resolved cleanly). Example card `81402`. Aside `81355`. Footer `81434` ("Goals" ← / "Next: Pitch →").                           |
| List page — populated        | `5619:81443`                                               | **Canonical** populated artboard. Same header (`5622:89365` tree) and aside (`5619:81566`). Section label `81596` "Your Goals", 5 goal cards `5622:89437/89473/89509/89545/89581`, "Add another Goal" dashed button `5619:81757`, footer `6686:91416`. Each card = 44px "laptop" tile + `role — industry` title + 12px "money-03" glyph + "GHS 3,000 – 6,000/mo" + blue opportunity-type chip + grey location/timeline chips + green quoted description.     |
| List page — stale duplicates | `5622:89666` ("goals"), the list inside `5619:82728`       | ⚠️ **Do not implement from these.** Older artboards wearing the marketing-site nav (How it works / About / For Students…), a "What pulls you in?" section header, "📊 Popular in Ghana" / "🌱 Why interests matter" asides, and Work-stage card fields ("Jan 2024 – Present", "1yr 7mo", "● Active", SQL/R chips, "↕ Re-order"). Superseded by `5619:81443`.                                                                                                 |
| Add-goal modal               | `5622:90104` ("Overlay centred card", inside `5622:89666`) | Badge `90112` "Add A Goal"; headline `90114` "New Goals. " + italic green "Where do you want to go?"; subtitle `90115`. **Four** numbered sections: 1 `90142` "Role & opportunity type", 2 `90203` "Location & timeline", 3 `90220` "Salary / compensation range" (+ "Why add a salary range?" note `90239`), 4 `5625:90547` "Notes for recruiters". Footer `90254` = `[Cancel]` + `[Save Goals]`.                                                           |
| Edit-goal modal              | `5625:90924` (inside frame `5625:90578` "Edits Goals")     | Same 4-section body. Header `5625:90930` re-dived: Figma reuses the Add-mode badge AND headline verbatim ("Add A Goal" / "New Goals…") — a clone leftover, reproduced as designed since there is no second source. Footer `5625:91327` differs for real: destructive "Delete this Goal" pill (`91329`-`91332`, #f9ebea / #ebc2bd / #c0392b, 20-delete glyph) + `[Save Changes]` (`91333`).                                                                   |
| Success modal                | `5619:83053` (inside frame `5619:82728` "Goals-Success")   | 🏆 `83060`; headline `83062` "Goals " + italic green "complete."; stat line `83063`; checklist row `83065`/`83071`/`83072` ("Goal-matched search active"); mini goal-list `83074`/`83075`/`83087`/`83099`; profile-strength bar `83111` ("78% : 8 stages done"); flat #ebf1ec bar `83117`; gold CTA `83120` "Continue to Pitch stage".                                                                                                                       |
| Delete-confirm modal         | `5625:92747` ("failed", inside frame `5625:92217`)         | Header `92769` (56px delete glyph, "Delete this Goal?" `92773`, description `92774`); preview card `92793` (pink #f9ebea/#ebc2bd, laptop tile, summary line `92799`, "● Active" pill `92804`, amber "Primary goal · drives your headline match" `92806`, "★ Primary" blue chip `92808` + grey chips); reason rows `92823`/`92828`; "Edit instead" nudge `92844`; footer `92748` = `[Cancel ]` + danger `[Permanently delete this goal]`.                     |

**Copy-fidelity calls (all reproduced verbatim, flagged inline in code for design review):**

- Intro stage card #4's title is literally "Cover images" (`5619:81230`) while its body (`81231`) is about impact-driven organisations / NGOs — a Portfolio clone. Kept verbatim per `WorkIntroSection.jsx`'s single-mismatched-card precedent (Certs only substituted because all four of its titles were wrong).
- Intro page contradicts itself on duration: header tag says "~7 min" (`81203`), right panel's Time card says "~4 min" (`81136`). Both kept.
- Add/Edit modal placeholders carry three cross-stage leftovers: "Role or opportunity" → a Certs placeholder (`90152`), "Skills or subjects covered" → a Work/Portfolio placeholder (`90170`), "Maximum per month" → "https://…" (`90237`).
- Empty state uses Figma node "certificate-01" (`5659:81364`) as its glyph and its skip line reads "No certs yet?? Skip this stage" (`5659:81375`) — both Certs leftovers, both reproduced.
- Delete modal's "Edit instead" body (`5625:92848`) is word-for-word Certs copy ("Wrong date, wrong org name, missing credential ID?").
- Stage-2 footer's back button is literally labelled "Goals" (`81438`), and its Next label bakes an arrow into the string ("Next: Pitch →", `81439`) rather than using an icon node.

**❓ Open questions carried into code as `NEEDS-CLARIFICATION` comments:**

1. **Section 2's second select** (`5622:90415`/`90420`/`90424`) is labelled "Opportunity type" with default "Any type" — the same label as Section 1's own select, inside a section called "Location & timeline" — while every populated card renders a timeline chip ("Within 6 months" etc.) that no modal field produces. Wired to the timeline chip; label + placeholder kept Figma-verbatim; options are exactly the five timeline strings Figma's own cards contain.
2. **No edit/delete affordance** exists on any card in the canonical populated frame, yet a full Edit modal and Delete modal ship. The 28px icon-button pair is carried over from the Certs/Work/Portfolio card pattern, not read from a Goals node.
3. **Drag-to-reorder** is described in copy twice and appears as a "↕ Re-order" chip on the stale artboards, but has no UI in the canonical frame. Not implemented; the first list entry is simply treated as the primary goal.
4. **Success-modal mini-list badges** are "✓ Verified" / "Self-reported" (`83086`/`83098`/`83110`) — verbatim Certs badges with no Goals-side concept, field, or rule behind them. Replaced with the Goals-native "★ Primary" chip (a real, verified badge from the delete modal) on the primary row only.
5. **Salary required-markers**: Figma puts genuine green (#2e8b57) required asterisks on six fields including both salary inputs, yet the intro page's own stage card #2 (`81218`/`81219`) says compensation range is "Optional but high-value". Asterisks are rendered exactly as designed; `canSubmit` gates only on role / skills / location / description. (Every section frame also carries two pink `#fb7185` "\*" nodes at off-frame absolute offsets — e.g. `90143` at `left:-495.83px` — file artifacts, not required-markers, and not reproduced. Same class of artifact the Portfolio flow flagged.)

**Links checked and deliberately skipped:** `5132:51577` turned out to be "CONFIRMED", a Career-Buddy chat / Talent-Profile-Panel screen, and `5132:64061` ("Frame 14602") a chat-transcript frame — both entirely unrelated to Goals, both left out. `5625:92217` was covered via its own child (`5625:92747`).

---

## Career Buddy — Parent Guide ward profile `✅ VERIFIED` (2026-08-11)

Route: `/profile/filling/career-buddy` (parent role). After ward account is ready, **Guide my ward's profile** runs Elliot's Educational Background (+ Interests) like talent edu/interests.

| Piece         | Node / source                                                                        | Notes                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Welcome entry | `5132:78344`                                                                         | Guide chip on parent welcome                                                                                 |
| Guide opening | `5132:78578` / bot `5132:78734`                                                      | Normal user bubble + opening question; trailing `"` stripped                                                 |
| Level chips   | `5132:78740`–`78743`                                                                 | ✅ VERIFIED: Junior High School (JHS) / Senior High School (SHS) / University/Tertiary / Completed education |
| Status frames | `5132:78873` IN PROGRESS · `5132:79168` COMPLETED                                    | Panel status mirrors talent (not-started → in-progress → awaiting-review → done)                             |
| Script        | `parent-guide-ward` → `parent-guide-edu-q*` → `parent-guide-edu-confirm` → interests | `PARENT_STAGE_SAVE_META` chains Confirm → interests → wrap                                                   |
| Panel         | `PARENT_GUIDE_START_STAGES` + `PARENT_WARD_EDU_FIELDS`                               | Elliot tab; Personal Info done; edu Modify/Confirm                                                           |
| Uninitiated   | `parent-guide-ward-setup`                                                            | Still opens `WardAccountSetupModal`                                                                          |
| Demo          | `?cb=parent-guide` / `parent-guide-progress` / `parent-guide-review`                 |                                                                                                              |

## Career Buddy — Parent Build own profile `✅ VERIFIED` (2026-08-12)

Same talent profile-fill FSM on **My Profile** after **Build my own talent profile**.

| Piece  | Source                                                         | Notes                                                          |
| ------ | -------------------------------------------------------------- | -------------------------------------------------------------- |
| Entry  | `parent-build-own`                                             | Bridges to talent `edu-q1` (ready-prompt equivalent)           |
| Script | `{ ...CAREER_BUDDY_NODES, ...PARENT_BUDDY_NODES }`             | Parent welcome/guide/FAQ override; edu/interests/… from talent |
| Panel  | My Profile (`PARENT_MY_PROFILE_STAGES`)                        | Modify/Confirm + `STAGE_SAVE_META` chain                       |
| Demo   | `?cb=parent-own` / `parent-own-progress` / `parent-own-review` |                                                                |

## Career Buddy — Guidance flow (Career Exposure → Career Options) `✅ VERIFIED` (2026-08-08)

Route: same `/profile/filling/career-buddy`. Figma frames `5132:52485` (IN PROGRESS), `5132:52061` (NOT STARTED), `5132:53009`–`54589` (awaiting review / saved / confirmed), conversation strip `5132:64380`, toast overlay `5132:54581`/`54582`.

| Piece               | Node / script                                                     | Notes                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Area chips (7)      | `guidance-intro*` suggestedReplies                                | Career exposure, Secondary Elective Matching, Tertiary Course Matching, Mock Interviews, Opportunity Matching, Talent Matching, Entrepreneurial Guidance (double space kept) |
| Career Exposure Q&A | `exposure-q1`…`exposure-wrap`                                     | Verbatim from `5132:64380`; fills `desired-career`                                                                                                                           |
| Confirm + continue  | `exposure-confirm-continue`                                       | Panel confirm + next-area chips (no Career exposure)                                                                                                                         |
| Confirm + return    | `exposure-confirm-return` → save → `section-picker-from-guidance` | Return-to-profile path                                                                                                                                                       |
| Other 6 areas       | `stub-guidance-*`                                                 | Coming soon (no Figma Q&A)                                                                                                                                                   |
| Panel fields        | `CAREER_OPTIONS_FIELDS`                                           | Live `confirmed: true` after Exposure Q&A                                                                                                                                    |
| Toast               | `5132:54582`                                                      | `Success, Career options saved`                                                                                                                                              |

## Career Buddy — Work Experience flow + post-Personality section-picker `✅ VERIFIED` (2026-08-03)

The hand-off Personality previously left disconnected (`STAGE_SAVE_META.personality.nextNodeId` was `null`) now continues into a section-picker, and Work Experience is the one section with a real built chat flow.

| Element                                      | Node ID(s)                                                       | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Post-Personality hand-off prompt             | `5132:64061` (part of a longer "Frame 14602" conversation strip) | Verbatim: "Okay that's great. We've covered a lot.\nNow would you like to continue populating your profile or you want some guidance based on what we've discussed so far?" — suggestedReplies "Continue populating profile" / "I think I need some guidance" (the latter → `guidance-intro`, Career Exposure guidance flow — see section below).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Section-picker (6 modeCards, 3×2 grid)       | `5132:49680`, cards `49686`-`49691`                              | "Okay that's wonderful. Which section do you want to us to talk about" [verbatim, includes the grammar quirk] + 6 cards: Skills, Work Experience, Project Portfolio, Certifications, Career Pitch, Career Options — same icons as those stages' own Talent Profile Panel rows (bar-chart/briefcase/folder/certificate/mic/compass), no description text in Figma for any of them (unlike Personality's picker, which had one) — none invented. `ChatThread`'s modeCards container changed from a hardcoded 3-wide flex row to `grid grid-cols-3` to support this (3-card Personality picker still renders identically).                                                                                                                                                                                                                                                 |
| Work Experience Q&A (verbatim)               | `5132:64061` children `64134`-`64293`                            | 6 questions + 1 clarification nudge about a talent's CodeBase Ghana internship — company, role, tasks, dates (with a scripted "be more specific" nudge after a vague first answer, not a real NLP branch), skills gained, supervisor contact — ending in "Perfect, Emma — I've recorded that. Just to confirm, kindly cross-check on your Talent Profile Panel to my right." (typo "Pannel" in source, corrected — see wiki/log.md). Only 5 of 6 section-picker topics are stubbed; Work Experience is real.                                                                                                                                                                                                                                                                                                                                                            |
| Work Experience panel — view/AWAITING REVIEW | `5132:50598`                                                     | **Multi-entry** row (unlike every other stage built so far): "Experience 1 – CodeBase Ghana (Software Dev Intern)" expanded by default showing 6 fields (Organization/Role/Duration/Key Projects/Skills gained/Supervisor Info — the last a 3-line value), "Experience 2 – EduTech Africa (Teaching Assistant)" as a second, permanently-collapsed title-only entry (Figma never shows it expanded, no fields exist for it — not fabricated). **Re-verified 2026-08-07 via REST API:** title wraps (no truncate), `bytesize:chevron-bottom` 16×16 (↑ expanded / ↓ collapsed), field card `border-[#e8e8e8] bg-[#f8f8f8] rounded-[8px] px-16 py-12 gap-18`, field rows gap-16 with label HUG 15px `#0a0a0a` + value FILL 16px `#616161` text-right (no max-width). Modify (white/outline) + Confirm (`#387440`) buttons, same styling as every other stage's view state. |
| Work Experience panel — edit-details         | `5132:50994`                                                     | Same multi-entry card, single **Update** button (Modify/Confirm pair replaced), plus a **"+ Add Experience"** row (`mage:plus` icon) confirming multi-entry is a real, designed affordance — rendered for visual fidelity in this app but its click just logs (a real second-entry flow needs its own Q&A sub-flow this session doesn't have).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 6 states (NOT STARTED → CONFIRMED)           | `5132:49475`, `49801`, `50284`, `50680`, `51076`, `51577`        | Same 6-state machine as Educational Background/Personal Area of Interest, confirmed 1:1 via this pass's own recon: NOT STARTED → IN PROGRESS → AWAITING REVIEW AND CONFIRMATION (`50284`, contains `50598`) → USER CHOOSES TO EDIT (`50680`, contains `50994`) → WORK EXPERIENCE SAVED (`51076`, toast "✅ Success, Work experience saved") → CONFIRMED (`51577`, "[Auto] Work Experience confirmed ✅").                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

**Verbatim-fidelity calls made** (documented in `wiki/log.md`): "Andrew" (2 of the Work Experience Q&A's ~17 lines) normalised to `TALENT_NAME` ("Emma", consistent everywhere else in this app and conversation — same reasoning as the pre-existing Educational Background NAMING NOTE); "Talent Profile Pannel" (double-n, a plain spelling typo in the Figma source) corrected to "Panel".

**Layout overflow fix (2026-08-07):** earlier `TalentProfilePanel` entries branch used `truncate` on titles + `max-w-[280px]` on values + `PlusMinusIcon` — caused mid-word ellipsis and Supervisor/Skills crowding the card edge. Corrected against `5132:50598` REST extract + user screenshots.

---

## Career Buddy — Voice flow + New Chat `✅ VERIFIED` (2026-08-12)

| Element         | Node ID(s)                         | Notes                                                                                                                                      |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| New Chat screen | `5146:75750`, hero `75789`/`75800` | "What are we working on today? Emma" mixed styles (green Instrument Serif + SF Pro Medium name); chips under input; not first-time welcome |
| Voice call      | `5146:75913`, overlay `75964`      | Dual avatars + call label (TALI) + 75px mic/X; settings `76111`; opened via input wave button                                              |
| Voice settings  | `5146:76230`, `76269`              | "Choose a voice"; Sol / Bruce / Tali; Done `#387440` / Cancel; Sol tagline corrected "ad"→"and"                                            |
| Voice-to-text   | `5146:76424`, input `76547`        | Live waveform in input; ✓ fills draft; X discards; real mic via `useVoiceCapture`                                                          |

---

---

## Talent Pitch — profile filling page flow `✅ VERIFIED` (2026-09-09)

File key `Bin8roWL8sloyc36IgFMuT`. The 9th and FINAL profile-filling stage (`PROFILE_STAGES` id `talent-pitch`, trail label "Pitch"). Every node below was read with `mcp__figma__get_design_context` — **nothing in this flow is derived from `get_metadata` layer names** (`get_metadata` was used only to discover which child frames to dive into, and the success screen's underlying page carries stale Interests-era layer names that would have been actively misleading).

### Screen frames

| Screen                          | Node ID       | Implemented in                                 |
| ------------------------------- | ------------- | ---------------------------------------------- |
| Pitch start screen (intro)      | `5625:92953`  | `PitchIntroSection.jsx`                        |
| 09e Pitch — Empty state         | `5890:2`      | `PitchStage2Section.jsx` (mode `null`)         |
| Pitch — Record (camera access)  | `6083:46594`  | `PitchStage2Section.jsx` + `PitchRecorder.jsx` |
| Pitch — Recorded                | `5890:1732`   | `PitchStage2Section.jsx` (record + recorded)   |
| Pitch — Upload (empty)          | `5890:694`    | `PitchStage2Section.jsx` (upload, no file)     |
| Pitch — Upload (loaded)         | `5890:1040`   | `PitchStage2Section.jsx` (upload + file)       |
| Pitch — Written                 | `5890:1386`   | `PitchStage2Section.jsx` (written)             |
| 09f Pitch — Published (Success) | `6107:122172` | `PitchPublishedModal.jsx`                      |
| Pitch — Delete                  | `6107:122671` | `DeletePitchModal.jsx`                         |

### Intro page (`5625:92953`)

| Element              | Node ID(s)                                 | Notes                                                                                                                        |
| -------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Header section       | `5625:93157`                               | Two radial gradients over flat white                                                                                         |
| Headline             | `5625:93160`                               | **Mixed style**: plain `#111` "Pitch" + italic `#387440` "Your 60-second story."                                             |
| Subtext              | `5625:93161`                               | 3 lines, 14px `#959592`                                                                                                      |
| Tags                 | `5625:93163` / `93164` / `93165`           | "Not Started" · "3.4× attention" · **"~7 min"** — the flow's duration source of truth                                        |
| Section label        | `5625:93167`                               | "What this stage covers"                                                                                                     |
| Four info cards      | `5625:93170` / `93176` / `93182` / `93188` | 60-second video / Multiple takes / AI-drafted bio / How both are shown — all Pitch-specific, no clone leftovers              |
| Footer               | `5625:93066` → `93073` / `93074`           | "Go back" / "Open Pitch"                                                                                                     |
| Top bar              | `5625:93152` / `93153` / `93154`           | "Step 9 of 9 ·" / "Pitch" / "· 90% profile complete · auto-saved"                                                            |
| Right panel showcase | `5625:93087` / `93088`                     | "Pitch" / "Your 60-second story." — genuinely Pitch-specific                                                                 |
| Right panel impact   | `5625:93092` / `93093`                     | "60%" ✅ over the label "more recruiter focus on **portfolio**" — ⚠️ Portfolio clone leftover, trailing noun swapped in code |
| Right panel time     | `5625:93096`                               | "~4 min" — ⚠️ contradicts this page's own "~7 min" tag; the tag wins (duration sweep)                                        |

### Stage-2 shared chrome (identical on all five stage-2 frames)

| Element                  | Node ID(s) (empty-state instance)          | Notes                                                                                                                            |
| ------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Header section           | `5978:29454`                               | Same gradient stack as the intro                                                                                                 |
| Headline                 | `5978:29455`                               | **NOT mixed style** — one plain `#111` Instrument-Serif node, two lines "Your Pitch" / "The Final Piece" (verified per-headline) |
| Subtext                  | `5978:29456`                               | Two lines                                                                                                                        |
| "Why pitch matters" card | `5978:29457`–`29463`                       | 90% ring + "Eight stages done. Pitch is the final piece."                                                                        |
| Tags                     | `5978:29465` / `29466` / `29467`           | "3 ways to pitch" · "60 seconds" · **"2 min"** (green) — 🔧 rendered as "~7 min" per the duration sweep                          |
| Right aside              | `5890:131` / `133` / `148` / `151`         | Three cards; copy varies per mode/state (see `pitchModeStyles.js` `ASIDE_CONTENT`)                                               |
| Footer (shared)          | `6686:91434` / `91453` / `91472` / `91510` | "Goals" ← / "Review & publish" — pasted over every frame, painted last, so it is what shows                                      |
| Footer (older)           | `5890:2068` / `5924:22162`                 | ⚠️ The recorded frame's own older footer says "Publish & go live"; it sits _under_ the shared one                                |

### Mode tab row

| Element         | Node ID(s)                                     | Notes                                                                                                                                                               |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upload frame    | `6120:134569` → `134570` / `134578` / `134584` | Record / **Upload** / Written Pitch                                                                                                                                 |
| Upload-loaded   | `6107:134149` → `134150` / `134158` / `134228` | same                                                                                                                                                                |
| Written frame   | `6120:134598` → `134599` / `134613` / `134607` | ⚠️ `134613` ("Upload") holds **two** icons — `edit-01` (`134614`) _and_ `upload-05` (`134627`); an authoring slip, only the upload glyph is rendered                |
| ❓ Not drawn on | `5890:2`, `6083:46594`, `5890:1732`            | Rendered in Record mode anyway, else there is no way back to Upload/Written once you start recording. Pill spec: px-16 py-6 rounded-999, active `#eff4f0`/`#387440` |

### Empty state (`5890:2`)

| Element         | Node ID(s)                                                                   | Notes                                                            |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Section label   | `5895:2`                                                                     | Flat `#387440` 13px "Your Pitch" (NOT gradient-filled)           |
| Dashed panel    | `6083:34043`                                                                 | 381px, 2px dashed `#387440`, bg `rgba(235,241,236,0.5)`          |
| Glyph           | `6083:34047`                                                                 | ⚠️ Figma node name "certificate-01" — Certs leftover, reproduced |
| Headline / body | `6083:34052` / `34053`                                                       | "No pitch yet." + the 3-way body                                 |
| CTAs            | `6083:34055` / `34057`                                                       | "Add your pitch " / "Write a pitch"                              |
| Skip line       | `6083:34058`                                                                 | "No pitch yet? Skip this stage"                                  |
| Three ways      | label `6105:57915`; cards `5895:19` / `23` / `27`                            | Record in-browser / Upload a video / Write a pitch               |
| 4-sentence card | label `6083:34063`; card `5895:32` (rows `34`–`44`, rule `45`, example `46`) | bold green lead + grey tail per row                              |

### Camera viewfinder (`PitchRecorder.jsx`)

| Element            | Node ID(s)                                                                      | Notes                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container          | `6083:46917` (access) / `6107:57918` (recorded) / `6083:47113` (upload preview) | bg `#121211`, rounded-16, h-416                                                                                                                                      |
| Overlays           | `6093:21784` / `6107:57919` / `6083:47114`                                      | identical on all three                                                                                                                                               |
| Grid lines         | `6093:21785`–`21793`                                                            | 4 verticals @320px, 4 horizontals @220px, `rgba(255,255,255,0.08)`                                                                                                   |
| Crosshair          | `6093:21794` / `21795`                                                          | 80px, `rgba(255,255,255,0.2)`                                                                                                                                        |
| Focus brackets     | `6093:21796` / `21805` / `21814` / `21823`                                      | 56px, eight 2×12 rounded bars at `rgba(255,255,255,0.8)`                                                                                                             |
| Badges             | `6093:21833` / `21835`                                                          | "4K" / "24fps"                                                                                                                                                       |
| Battery            | `6093:21838` / `21862` / `21840`                                                | glyph + "82%"                                                                                                                                                        |
| REC indicator      | `6093:21841` / `21842` / `21843`                                                | 44px pill, 12px dot, "REC"                                                                                                                                           |
| Timer              | `6093:21844`                                                                    | "00:00", bottom-39px, centred                                                                                                                                        |
| Camera-access card | `6093:21845`–`21852`                                                            | blurred glass, 44px icon tile, "Camera access needed"                                                                                                                |
| Bottom controls    | `6093:21853` / `21854` / `21857` / `21859`                                      | "Allow camera" pill / 72px shutter / 44px settings                                                                                                                   |
| Preview card       | `6107:57981` / `57982` / `57986`                                                | 72px white play button + "Click to preview"                                                                                                                          |
| ⚠️ Not in Figma    | —                                                                               | The permission-granted **idle** and actively-**recording** states are not drawn; both are minimal deltas from the verified frames (see `PitchRecorder.jsx`'s header) |

### Recorded state extras (`5890:1732`)

| Element               | Node ID(s)                                                      | Notes                                                                                           |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Playback scrubber     | `5906:7` / `8` / `9` / `10`                                     | DM-Mono "0:00" · flat `#e8e8e4` track · "0:58"                                                  |
| Label                 | `5906:11`                                                       | "Quick self-check"                                                                              |
| Re-record action bar  | `5906:29` / `6156:17915` / `6152:120229`                        | green gradient rounded-22 h-56 + white "Re-Record"                                              |
| Checklist rows        | `5906:12` / `15` / `18` / `21` (text `14` / `17` / `20` / `23`) | ⚠️ `5906:17` has a doubled space: "The audio is clear I can hear myself…" — reproduced verbatim |
| Profile strength card | `5906:24` / `26` / `27` / `28` + medal `6107:57999`             | "Profile strength after publishing pitch" / "100% "                                             |
| Footnote              | `5906:34` / `35`                                                | two lines about publishing / editing later                                                      |

### Upload mode (`5890:694` empty, `5890:1040` loaded)

| Element              | Node ID(s)                                                   | Notes                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drop zone            | `6083:46977` (instance of design-system Upload `3014:50687`) | "Drop your pitch video here" / ⚠️ "Or **browser** to choose a file" (Figma typo) / Mp4·Mov·WebM pills. 1.2px dashed `#387440` on `rgba(235,241,236,0.5)` |
| Phone-transfer label | `5900:17`                                                    | "How to get a video from your phone"                                                                                                                     |
| Phone-transfer cards | `5900:19` / `22` / `26` / `29`                               | 4th ("EASIEST OPTION") is tinted `rgba(235,241,236,0.5)`                                                                                                 |
| Skip line            | `5900:32` / `33` / `34`                                      | "Not ready? Skip pitch"                                                                                                                                  |
| File row             | `5903:19`–`28`                                               | film-slate tile + name + "18.4 MB · MP4 ·" + green "✓ 0:54 — within 60s" + "Replace"                                                                     |
| File-checks card     | `5903:29`–`47`                                               | "File passed all checks" + 2×2 grid, **colon** separator (the aside states the same facts with an em dash)                                               |
| Pre-publish label    | `5903:48`                                                    | "Before you publish : quick check"                                                                                                                       |
| Checklist card       | `5903:49`–`64`                                               | tinted rows = checked; ⚠️ `5903:53` has a space before its comma                                                                                         |
| Bottom links         | `5903:67`–`71`                                               | "Not happy with it? Upload a different file or record in-browser instead"                                                                                |

### Written mode (`5890:1386`)

| Element          | Node ID(s)                                     | Notes                                                                                                                             |
| ---------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Field + label    | `6120:134675` / `134677` / `134679`            | "Written Pitch" with a **genuine** green required asterisk (`134680` / `134681`, `#2e8b57`) — a real marker, not a stray artifact |
| Input box        | `6120:134685` (design-system GTHInput)         | 113px tall; placeholder `134696`                                                                                                  |
| Counters         | `5905:42` / `43` / `44`                        | "0 words" (left) / DM-Mono "0 / 600" (right)                                                                                      |
| Tips card        | `5905:10` / `11`                               | "💡 THE 4-SENTENCE FORMULA", bg `rgba(239,244,240,0.2)`, border `rgba(56,116,64,0.4)`                                             |
| Numbered rows    | `5905:12`–`35`                                 | green pill + short title + a LONGER sentence than the compact list uses                                                           |
| Complete example | `5905:37` / `38` / `39`                        | italic Instrument Serif + "4 sentences · 78 words · ~18 seconds to read"                                                          |
| Upsell banner    | `5905:45` / `47` / `48` / `49` / `6120:134706` | "Want 6× more recruiter messages?" + "Record Instead"                                                                             |
| Skip line        | `5905:52` / `53` / `54`                        | "Not ready? Skip pitch"                                                                                                           |

### Success modal (`6107:122561`)

| Element              | Node ID(s)                          | Notes                                                                                                                                                          |
| -------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card                 | `6107:122561`                       | rounded-24, 3px `#c1d4c4`; amber glow `6107:122562`                                                                                                            |
| Trophy               | `6107:122568`                       | 🏆 48px                                                                                                                                                        |
| Headline             | `6107:122570`                       | **Mixed style**: plain "Pitch " + italic green "published."                                                                                                    |
| Subtext              | `6107:122571`                       | ⚠️ verbatim, including Figma's own missing em dash ("hear you not just read about you.")                                                                       |
| Checklist row        | `6107:122573` / `122579` / `122580` | "Your profile is 100% complete"                                                                                                                                |
| Mini-list rows       | `6107:122583` / `122595` / `122607` | the pitch (✓ Published) / "Replace or edit any time" (Anytime) / "Quality checks passed" (✓ Passed)                                                            |
| Profile strength bar | `6107:122619` / `122621`            | "100% : 9 stages done" — the only sibling success modal whose bar geometry and label agree                                                                     |
| Thin bar             | `6107:122625`                       | track and fill both `#ebf1ec`, so it renders as one flat pale bar                                                                                              |
| CTA                  | `6107:122628`                       | gold "View your live profile"; ⚠️ its left "loader" icon slot resolves to the same asset hash as the DELETE glyph — an unset default forwardicon, not rendered |

### Delete modal (`6107:123168`)

| Element       | Node ID(s)                                     | Notes                                                                                                                                                                                    |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header        | `6107:123191` / `123194` / `123195`            | 56px delete glyph + "Delete this Pitch?" + body                                                                                                                                          |
| Preview card  | `6107:123214`–`123240`                         | `#f9ebea` / `#ebc2bd`, laptop tile, title `123219`, file line `123220`, "● Live" `123225`, amber `123227`, chips `123229` (blue "Preview ↗") / `123231` / `123233` / `123235` / `123237` |
| Reason rows   | `6107:123244` / `123249`                       | "Removed from your card immediately" / "You lose the 6× recruiter engagement boost" — both genuinely Pitch-specific (no clone leftovers, unlike Goals')                                  |
| Replace nudge | `6107:123265` / `123268` / `123269` / `123273` | "Want to replace it instead of deleting?" + "Replace Instead"                                                                                                                            |
| Footer        | `6107:123169` / `123172` / `123178`            | "Cancel " + destructive "Permanently delete this pitch" (`#c0392b` / `#ad3327`)                                                                                                          |

### Nodes deliberately skipped

`5132:51577` (unrelated Career-Buddy chat screen, already confirmed in the Goals build) and `5622:90104` / `90112` / `90114` / `90115` / `90142` / `90203` / `90220` / `90254` / `5625:90547` / `5132:64061` (the already-built **Certs** Add/Edit modal nodes — stale copy-paste in the source prompt, irrelevant to Pitch). The success screen's own underlying page (`6107:122287`–`122461`) was also not re-implemented: it is a stale clone whose layer names still read "What pulls you in?" / "🌱 Why interests matter" / "📊 Popular in Ghana"; only the overlay card (`6107:122561`) is real Pitch content.

---

## Cross-references

- Figma fidelity rules: [figma-fidelity.md](figma-fidelity.md)
- Design tokens: [design-tokens.md](design-tokens.md)
