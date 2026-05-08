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

## Onboarding screens (TBD)

The file is named "onboading" (sic) but the actual onboarding screen frames haven't been catalogued yet. Add them here as we implement.

| Frame name   | Node ID | Viewport | Notes |
| ------------ | ------- | -------- | ----- |
| _(none yet)_ |         |          |       |

## Cross-references

- Figma fidelity rules: [figma-fidelity.md](figma-fidelity.md)
- Design tokens: [design-tokens.md](design-tokens.md)
