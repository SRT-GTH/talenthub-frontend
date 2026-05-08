# Design Tokens

## Source `✅ VERIFIED`

Tailwind v4 reads tokens from the `@theme` block in [src/index.css](../src/index.css). The `tailwind.config.js` is informational only.

All values were extracted on **2026-05-04** from the Figma file **"Gh Design system - onboading"** (`Bin8roWL8sloyc36IgFMuT`). See [figma-node-map.md](figma-node-map.md) for per-section node IDs.

## Naming convention `✅ VERIFIED`

Each color family follows the same 10-step state ladder, matching the Figma swatch labels:

| Token suffix    | Figma swatch   | Use                                                   |
| --------------- | -------------- | ----------------------------------------------------- |
| `-light`        | Light          | subtle background fills                               |
| `-light-hover`  | Light :hover   |                                                       |
| `-light-active` | Light :active  |                                                       |
| _(none)_        | Normal         | default fill / button background                      |
| `-hover`        | Normal :hover  |                                                       |
| `-active`       | Normal :active |                                                       |
| `-dark`         | Dark           | strong fill, dark variants                            |
| `-dark-hover`   | Dark :hover    |                                                       |
| `-dark-active`  | Dark :active   |                                                       |
| `-darker`       | Darker         | deepest emphasis (omitted on a few semantic families) |

Tailwind v4 generates utilities for every namespace (`bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`).

## Brand color families

### Brand-Green `✅ VERIFIED` (Figma `45:7802`)

Ghana-flag-green primary brand color.

| Token                              | Hex       | Notes                    |
| ---------------------------------- | --------- | ------------------------ |
| `--color-brand-green-light`        | `#ebf1ec` |                          |
| `--color-brand-green-light-hover`  | `#e1eae2` |                          |
| `--color-brand-green-light-active` | `#c1d4c4` |                          |
| `--color-brand-green`              | `#387440` | **default action color** |
| `--color-brand-green-hover`        | `#32683a` |                          |
| `--color-brand-green-active`       | `#2d5d33` |                          |
| `--color-brand-green-dark`         | `#2a5730` |                          |
| `--color-brand-green-dark-hover`   | `#224626` |                          |
| `--color-brand-green-dark-active`  | `#19341d` |                          |
| `--color-brand-green-darker`       | `#142916` |                          |

### Accent & Highlights `✅ VERIFIED` (Figma `45:7819`)

Gold accents.

| Token                         | Hex       |
| ----------------------------- | --------- |
| `--color-accent-light`        | `#faf4e8` |
| `--color-accent-light-hover`  | `#f7efdd` |
| `--color-accent-light-active` | `#eedeb8` |
| `--color-accent`              | `#c8951a` |
| `--color-accent-hover`        | `#b48617` |
| `--color-accent-active`       | `#a07715` |
| `--color-accent-dark`         | `#967014` |
| `--color-accent-dark-hover`   | `#785910` |
| `--color-accent-dark-active`  | `#5a430c` |
| `--color-accent-darker`       | `#463409` |

### Grey-Neutrals `✅ VERIFIED` (Figma `45:7836`)

| Token                          | Hex       |
| ------------------------------ | --------- |
| `--color-neutral-light`        | `#fefefe` |
| `--color-neutral-light-hover`  | `#fefefd` |
| `--color-neutral-light-active` | `#fdfdfc` |
| `--color-neutral`              | `#f8f8f4` |
| `--color-neutral-hover`        | `#dfdfdc` |
| `--color-neutral-active`       | `#c6c6c3` |
| `--color-neutral-dark`         | `#babab7` |
| `--color-neutral-dark-hover`   | `#959592` |
| `--color-neutral-dark-active`  | `#70706e` |
| `--color-neutral-darker`       | `#575755` |

### Black `✅ VERIFIED` (Figma `45:7853`)

Foreground / text scale. **Note:** `bg-black` is `#111`, not pure `#000` — overrides Tailwind default.

| Token                        | Hex       |
| ---------------------------- | --------- |
| `--color-black-light`        | `#e7e7e7` |
| `--color-black-light-hover`  | `#dbdbdb` |
| `--color-black-light-active` | `#b5b5b5` |
| `--color-black`              | `#111111` |
| `--color-black-hover`        | `#0f0f0f` |
| `--color-black-active`       | `#0e0e0e` |
| `--color-black-dark`         | `#0d0d0d` |
| `--color-black-dark-hover`   | `#0a0a0a` |
| `--color-black-dark-active`  | `#080808` |
| `--color-black-darker`       | `#060606` |

### Yellow-Background `✅ VERIFIED` (Figma `45:7870`)

Warm cream tints for surfaces.

| Token                         | Hex       |
| ----------------------------- | --------- |
| `--color-yellow-light`        | `#fffefc` |
| `--color-yellow-light-hover`  | `#fefdfa` |
| `--color-yellow-light-active` | `#fefcf5` |
| `--color-yellow`              | `#fbf4e0` |
| `--color-yellow-hover`        | `#e2dcca` |
| `--color-yellow-active`       | `#c9c3b3` |
| `--color-yellow-dark`         | `#bcb7a8` |
| `--color-yellow-dark-hover`   | `#979286` |
| `--color-yellow-dark-active`  | `#716e65` |
| `--color-yellow-darker`       | `#58554e` |

## Semantic color families `✅ VERIFIED`

From Figma `45:11090` ("Colors -Semantics colors").

### Informative (Figma section `45:11357`)

Blue scale for informational UI.

| Token                              | Hex       |
| ---------------------------------- | --------- |
| `--color-informative-light`        | `#eaeffb` |
| `--color-informative-light-hover`  | `#e0e7f9` |
| `--color-informative-light-active` | `#bfcef2` |
| `--color-informative`              | `#3062d4` |
| `--color-informative-hover`        | `#2b58bf` |
| `--color-informative-active`       | `#264eaa` |
| `--color-informative-dark`         | `#244a9f` |
| `--color-informative-dark-hover`   | `#1d3b7f` |
| `--color-informative-dark-active`  | `#162c5f` |
| `--color-informative-darker`       | `#11224a` |

### Success / Positive results (Figma section `45:11374`)

Green for success states. **9 swatches only — no `darker` variant in Figma.**

| Token                          | Hex       |
| ------------------------------ | --------- |
| `--color-success-light`        | `#e8f2ed` |
| `--color-success-light-hover`  | `#ddebe4` |
| `--color-success-light-active` | `#b9d6c8` |
| `--color-success`              | `#1d7c4d` |
| `--color-success-hover`        | `#1a7045` |
| `--color-success-active`       | `#17633e` |
| `--color-success-dark`         | `#165d3a` |
| `--color-success-dark-hover`   | `#114a2e` |
| `--color-success-dark-active`  | `#0d3823` |

### Warning (Figma section header `45:14378`)

Orange for warnings.

| Token                          | Hex       |
| ------------------------------ | --------- |
| `--color-warning-light`        | `#fef5eb` |
| `--color-warning-light-hover`  | `#feefe1` |
| `--color-warning-light-active` | `#fcdec1` |
| `--color-warning`              | `#f59638` |
| `--color-warning-hover`        | `#dd8732` |
| `--color-warning-active`       | `#c4782d` |
| `--color-warning-dark`         | `#b8712a` |
| `--color-warning-dark-hover`   | `#935a22` |
| `--color-warning-dark-active`  | `#6e4419` |
| `--color-warning-darker`       | `#563514` |

### Danger / Destructive (Figma section header `45:14381`)

Red for errors and destructive actions.

| Token                         | Hex       |
| ----------------------------- | --------- |
| `--color-danger-light`        | `#f9ebea` |
| `--color-danger-light-hover`  | `#f6e1df` |
| `--color-danger-light-active` | `#ebc2bd` |
| `--color-danger`              | `#c0392b` |
| `--color-danger-hover`        | `#ad3327` |
| `--color-danger-active`       | `#9a2e22` |
| `--color-danger-dark`         | `#902b20` |
| `--color-danger-dark-hover`   | `#73221a` |
| `--color-danger-dark-active`  | `#561a13` |
| `--color-danger-darker`       | `#43140f` |

## Surface / content / border tokens `✅ VERIFIED`

From Figma variable defs (referenced pervasively across design-system docs).

| Token                        | Hex       | Figma variable              |
| ---------------------------- | --------- | --------------------------- |
| `--color-content-primary`    | `#272e35` | `Content/Primary`           |
| `--color-content-secondary`  | `#555f6d` | `Content/Secondary`         |
| `--color-content-tertiary`   | `#7e8b99` | `Content/Tertiary`          |
| `--color-background-default` | `#ffffff` | `Background/Default`        |
| `--color-background-subtle`  | `#f5f7f9` | `Background/Subtle Neutral` |
| `--color-border-default`     | `#e9ecef` | `Border/Default`            |
| `--color-border-neutral`     | `#555f6d` | `Border/Neutral`            |

## Typography `✅ VERIFIED`

Per Figma's design-system declarations:

- **Body / paragraphs** (Figma `41:228` — "SF Pro Rounded"): `--font-sans` resolves to a stack of `'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Nunito', system-ui, sans-serif`. SF Pro Rounded is **Apple's proprietary system font and is not available on Google Fonts** — the stack uses it natively on Apple devices and falls back to Nunito (variable, rounded geometric sans) loaded from Google Fonts on other platforms. `🔗 EXTERNAL` for the Apple side.
- **Display / headings** (Figma `44:7372` — "Instrument Serif for display & headings"): `--font-display` resolves to `'Instrument Serif', Georgia, serif`. Instrument Serif is loaded from Google Fonts.

`src/index.css` adds an automatic CSS rule so any `text-display-*` utility applies `--font-display` without needing a separate `font-display` class. Override with `font-sans` if you want a display size in body font.

### Display / Headline — Figma frame `44:7368`

All Inter, weight 600 except the italic accent (Instrument Serif Regular 400).

| Token                 | Size / Line-height | Letter-spacing | Weight                 |
| --------------------- | ------------------ | -------------- | ---------------------- |
| `text-display-xl`     | 72 / 72            | 0.1 px         | 600                    |
| `text-display-lg`     | 52 / 52            | 0.1 px         | 600                    |
| `text-display-md`     | 36 / 40 (110%)     | 0.1 px         | 600                    |
| `text-display-sm`     | 16 / 19 (120%)     | 0.1 px         | 600                    |
| `text-display-italic` | 22 / 32            | 0.1 px         | 400 (Instrument Serif) |

### Paragraph — Figma frame `41:224`

3 weights × 9 sizes, all Inter.

| Weight family | Token prefix    | font-weight | letter-spacing |
| ------------- | --------------- | ----------- | -------------- |
| Strong        | `text-strong-*` | 600         | 0.1 px         |
| Medium        | `text-medium-*` | 450         | 0.2 px         |
| Normal        | `text-normal-*` | 400         | 0.2 px         |

Sizes (font-size / line-height in px):

| Size suffix | px      |
| ----------- | ------- |
| `25`        | 10 / 16 |
| `50`        | 12 / 20 |
| `75`        | 14 / 24 |
| `100`       | 16 / 28 |
| `200`       | 18 / 32 |
| `300`       | 24 / 36 |
| `400`       | 32 / 44 |
| `500`       | 40 / 56 |
| `600`       | 48 / 64 |

Example: `text-strong-100` = Inter SemiBold 16/28, letter-spacing 0.1px, weight 600.

### Underline variants — Figma frame `41:274`

Same 27-style scale rendered with text-decoration: underline. **No separate tokens** — compose with Tailwind's `underline` utility:

```jsx
<a className="text-medium-100 underline">link text</a>
```

## Spacing `✅ VERIFIED`

Figma frame `46:5715` ("Spacing Scale") — an 8-point base grid; 4px reserved for micro adjustments.

`--spacing` is set to `0.25rem` (4px), matching Tailwind v4's default. Class names map directly to Figma token names:

| Figma name | px  | Tailwind class           |
| ---------- | --- | ------------------------ |
| 1          | 4   | `p-1`, `gap-1`, `m-1`, … |
| 2          | 8   | `p-2`, `gap-2`, `m-2`, … |
| 3          | 12  | `p-3`                    |
| 4          | 16  | `p-4`                    |
| 5          | 20  | `p-5`                    |
| 6          | 24  | `p-6`                    |
| 7          | 28  | `p-7`                    |
| 8          | 32  | `p-8`                    |
| 10         | 40  | `p-10`                   |
| 12         | 48  | `p-12`                   |
| 16         | 64  | `p-16`                   |
| 20         | 80  | `p-20`                   |
| 24         | 96  | `p-24`                   |
| 32         | 128 | `p-32`                   |
| 40         | 160 | `p-40`                   |
| 48         | 192 | `p-48`                   |

(Skipped numbers like 9, 11, 13–15 etc. work mathematically but aren't part of the documented design vocabulary — prefer the values above.)

## Border radius `✅ VERIFIED`

Figma frame `46:6461`.

| Token           | Value   | Figma name           | Use                  |
| --------------- | ------- | -------------------- | -------------------- |
| `--radius-sm`   | `6px`   | Small                | small chips, inputs  |
| `--radius-md`   | `10px`  | Medium               | buttons, cards       |
| `--radius-lg`   | `16px`  | Large                | large cards, panels  |
| `--radius-xl`   | `24px`  | X-Large              | hero containers      |
| `--radius-pill` | `100px` | Pill / oval / circle | pills, avatars, FABs |

Tailwind utilities: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-pill`.

## Shadows / elevation `✅ VERIFIED`

### General shadows (Figma `46:6704`)

| Token            | Value                                                                      | Use                                   |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| `--shadow-sm`    | `0 2px 8px 0 rgba(0,0,0,0.10)`                                             | Progress tracks, page background      |
| `--shadow-md`    | `0 4px 25px 0 rgba(27,36,44,0.08)`                                         | Skill tags, pills, profile cards      |
| `--shadow-lg`    | `0 12px 48px -2px rgba(27,36,44,0.10), 0 2px 2px -1px rgba(27,35,44,0.04)` | Dropdowns, modals, tooltips           |
| `--shadow-green` | `0 8px 28px 0 rgba(56,116,64,0.28)`                                        | Primary CTA glow (e.g. "Get Started") |

### Top elevation (Figma `46:6704`)

For elements floating above the surface plane.

| Token              | Value                                                                        |
| ------------------ | ---------------------------------------------------------------------------- |
| `--shadow-top-100` | `0 -1px 2px 0 rgba(27,36,44,0.12)`                                           |
| `--shadow-top-200` | `0 -2px 8px -1px rgba(27,36,44,0.08), 0 -2px 2px -1px rgba(27,36,44,0.04)`   |
| `--shadow-top-300` | `0 -8px 16px -2px rgba(27,36,44,0.12), 0 -2px 2px -1px rgba(27,35,44,0.04)`  |
| `--shadow-top-400` | `0 -16px 24px -6px rgba(27,36,44,0.16), 0 -2px 2px -1px rgba(27,36,44,0.04)` |

### Bottom elevation (Figma `46:6704`)

Standard component elevation ladder.

| Token                 | Use                    | Value                                                                      |
| --------------------- | ---------------------- | -------------------------------------------------------------------------- |
| `--shadow-bottom-100` | Buttons, pills         | `0 1px 2px 0 rgba(27,36,44,0.12)`                                          |
| `--shadow-bottom-200` | Cards                  | `0 2px 8px -1px rgba(27,36,44,0.08), 0 2px 2px -1px rgba(27,36,44,0.04)`   |
| `--shadow-bottom-300` | Dropdowns, side panels | `0 8px 16px -2px rgba(27,36,44,0.12), 0 2px 2px -1px rgba(27,35,44,0.04)`  |
| `--shadow-bottom-400` | Dialogs                | `0 16px 24px -6px rgba(27,36,44,0.16), 0 2px 2px -1px rgba(27,36,44,0.04)` |

### Button shadows (Figma `50:8233`)

| Token                   | Value                            | Use                                                                                                  |
| ----------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `--shadow-button-shelf` | `0 4px 8px 0 rgba(25,52,29,0.8)` | Primary button "shelf" — paired with `bg-brand-green` to give the brand-green CTA its grounded depth |

Tailwind utilities: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-green`, `shadow-top-100`…`shadow-top-400`, `shadow-bottom-100`…`shadow-bottom-400`, `shadow-button-shelf`.

## Overlays `🔶 LIKELY` (legacy)

| Token                    | Value             |
| ------------------------ | ----------------- |
| `--color-overlay-light`  | `rgba(0,0,0,0.5)` |
| `--color-overlay-medium` | `rgba(0,0,0,0.4)` |
| `--color-overlay-dark`   | `rgba(0,0,0,0.6)` |

These are carried over from the elysium scaffold and are not yet verified against a Figma source.

## Cross-references

- Figma node map: [figma-node-map.md](figma-node-map.md)
- Figma fidelity rules: [figma-fidelity.md](figma-fidelity.md)
