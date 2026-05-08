# Figma Fidelity Requirements

## Rule `✅ VERIFIED` (per project standard, copied from MangoTV)

**Every Figma spec value MUST be implemented exactly as seen.** No rounding, no "close enough", no substitutions.

This applies to ALL of:

### Typography

- `font-size` — exact px from Figma
- `font-weight` — exact weight (400, 500, 600, 700, etc.)
- `font-family` — exact family
- `line-height` — exact value (px or unitless)
- `letter-spacing` — exact value

### Spacing

- `padding`, `margin`, `gap` — all sides, exact px

### Sizing

- `width`, `height`, `min-width`, `max-width`, `aspect-ratio`

### Layout

- `display`, `align-items`, `justify-content`, `flex-direction`, `flex-wrap`

### Visual

- `border-radius`, `border`, `background`, `opacity`, `box-shadow`

## Responsive — CSS `clamp()` (mandatory)

**All scalable properties MUST use `clamp()`** to fluidly interpolate between mobile and desktop values. Do NOT use static `px` with media-query breakpoints — use `clamp()` so values scale smoothly across all viewport widths.

### Formula

```
preferred = min_px + (max_px - min_px) * (100vw - MIN_VW) / (MAX_VW - MIN_VW)
```

Default `MIN_VW = 390` (mobile reference), `MAX_VW = 1440` (desktop reference). Adjust if the Figma frames use different widths.

### Example

`14px @ 390vw → 24px @ 1440vw`

```css
font-size: clamp(0.875rem, 0.399rem + 1.905vw, 1.5rem);
```

### Helper (CSS calc form, no SCSS in this project)

For convenience, a JS helper can generate the clamp string:

```javascript
const fluid = (minPx, maxPx, minVw = 390, maxVw = 1440) => {
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  const interceptRem = intercept / 16;
  const slopeVw = slope * 100;
  return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
};

// Usage in inline style:
style={{ fontSize: fluid(14, 24), padding: fluid(8, 16) }}
```

### Rules

1. **Both frames required**: if mobile + desktop Figma frames exist, extract from BOTH and use `clamp()`.
2. **Single frame only**: use the static value but consider reasonable mobile scaling.
3. **Never hardcode breakpoints for sizing**: reserve `@media` only for layout _changes_ (flex-direction row→column, grid column count, hide/show elements).
4. **Test at 390 / 768 / 1024 / 1440** widths via Playwright MCP screenshots.

### What uses `clamp()` vs `@media`

| `clamp()`                  | `@media`                        |
| -------------------------- | ------------------------------- |
| font-size                  | flex-direction change           |
| padding, margin, gap       | grid column count               |
| width, height (when fluid) | show/hide elements              |
| border-radius              | navigation collapse (hamburger) |
| line-height                | completely different layouts    |

## Figma MCP Tool Usage `✅ VERIFIED` (CRITICAL)

**ALWAYS use node detail tools, NEVER screenshot-guess.**

When extracting design specs:

1. **USE** `get_design_context` / `get_variable_defs` / `get_metadata` — these return actual numeric values directly from Figma.
2. **DO NOT** take a screenshot and estimate values — inaccurate, wastes time.
3. Screenshots are for **post-implementation visual verification only**.

### Correct workflow

```
1. Get the node-id from wiki/figma-node-map.md or the Figma URL
2. Call Figma MCP get_design_context(nodeId)   → returns CSS properties
3. Read fontSize, fontWeight, padding, fill colors, etc.
4. Implement those EXACT values in JSX/CSS using clamp() where applicable
5. Take a Playwright screenshot to visually verify
```

### Wrong (do not do this)

```
❌ Take screenshot of Figma frame
❌ Eyeball the spacing → "looks like ~16px"
❌ Implement guessed values
```

## Nested decoration extraction `✅ VERIFIED`

The Figma MCP's `get_design_context` transforms raw geometry into auto-layout relationships ("centered in parent", flex/grid). Great for content rows, **bad for free-floating decoration** — orbs, scribbles, sparkles, spirals — where the absolute x/y/rotation IS the design intent. The transform either drops the rotation, snaps the position to a flex-friendly approximation, or strips the SVG path data entirely (the MCP returns asset references, not paths — see [GitHub issue GLips/Figma-Context-MCP#30](https://github.com/GLips/Figma-Context-MCP/issues/30)).

### Workflow for hero-style frames with nested decoration

1. **`get_metadata` first.** The sparse XML it returns is the rawest geometry the MCP exposes — `id`, `name`, `type`, `x`, `y`, `width`, `height`, `relativeTransform` for every nested node. Walk that tree to recover absolute positions before asking for styling context. ([Figma docs — Tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/))
2. **Cross-validate.** Per [Reuven Naor's pixel-perfect workflow](https://medium.com/@reuvenaor85/the-way-to-figma-mcp-pixel-perfect-code-generation-for-react-tailwind-1623fd5383b8), call `get_metadata` + `get_design_context` + `get_variable_defs` + `get_screenshot` and save outputs to a `temp-outputs/` folder. Implement from saved files. _"Five sources telling the same story — that's pixel-perfect."_
3. **Stay under ~12,000 tokens per selection.** Beyond that the MCP starts dropping fidelity ([Builder.io](https://www.builder.io/blog/figma-mcp-server)). Select smaller subtrees of the hero, not the whole frame.
4. **Round-trip vectors as assets, don't reconstruct.** For decorative SVGs (scribbles, spirals, orbs with built-in gradients/blur), export from Figma → drop in `src/assets/` → use `<img src>`. Do NOT ask the LLM to redraw the path.
5. **Use the helper.** [`src/utils/figmaPosition.js`](../src/utils/figmaPosition.js) converts a `get_metadata` node + its parent into the numbers you'd paste into Tailwind / inline styles, including rotation extraction from `relativeTransform`.

### Helper API

```javascript
import { relativeTo, rotationFromMatrix, relativePercent } from '@/utils/figmaPosition.js';

// Given two boxes from get_metadata XML:
const pos = relativeTo(scribble, heroFrame); // { left, top, width, height }
const deg = rotationFromMatrix(scribble.relativeTransform); // CSS-convention degrees

// For elements inside a scaling container (like HeroPhotoCard):
const pct = relativePercent(card, photoCardContainer); // { leftPct, topPct, widthPct, heightPct }
```

### Rotation gotcha

Figma's `relativeTransform` stores rotation counter-clockwise; CSS `rotate()` is clockwise. The helper flips the sign — don't double-negate it manually.

### When to KEEP a hand-coded React composition

If the element has **dynamic data** (career level number, XP count, partner list) or is **interactive** (CTA, search input, marquee with state), keep it React even if Figma exports a flat vector for it. The exported SVG is a fidelity reference; React is the source of truth for behavior.

## Cross-references

- Design tokens: [design-tokens.md](design-tokens.md)
- Figma node map: [figma-node-map.md](figma-node-map.md)
- Position helper: [`src/utils/figmaPosition.js`](../src/utils/figmaPosition.js)
