# Components

> Append entries as components are added. Group by category. Each entry: file path, purpose, props.

## Layout `✅ VERIFIED`

| Component                     | Path                                         | Purpose                                                                                                                                                                                                                                                                                                                         |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MainLayout`                  | `src/layout/MainLayout.jsx`                  | Shell: Navbar + `<Outlet/>` + Footer. Used by all routes that aren't admin.                                                                                                                                                                                                                                                     |
| `InstitutionOnboardingLayout` | `src/layout/InstitutionOnboardingLayout.jsx` | Shell for all `/onboarding/institution/*` routes. Renders bg glow ellipses, `<Outlet>` (left content), and `InstitutionRightPanel`. Conditionally shows `InstitutionOnboardingBreadcrumb` on non-guidelines routes. `showRightPanel` hides the panel for the `/activate` route (full-width step). Props: none (reads pathname). |

## Shared `✅ VERIFIED`

| Component                         | Path                                                        | Figma source                    | Purpose                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Logo`                            | `src/components/shared/Logo.jsx`                            | `2517:28662`                    | Brand mark + wordmark. PNG assets bundled under `src/assets/brand/`. Three sizes (`sm` / `md` / `lg`); `invert` flips the wordmark to dark for light backgrounds; `showWordmark={false}` for icon-only contexts.                                                                                           |
| `InstitutionOnboardingBreadcrumb` | `src/components/shared/InstitutionOnboardingBreadcrumb.jsx` | `2968:24850`                    | Horizontal 8-step progress bar for institution wizard. Props: `currentStep` (0-based, default 0), `completionPercent` (0-100 override, defaults to `currentStep/8 * 100`). Left: check-circle + step label + chevron separators. Right: "COMPLETE" label + percentage + 6px `ProgressBar`. h-12, bg-white. |
| `Navbar`                          | `src/components/shared/Navbar.jsx`                          | landing-page nav `2513:28586`   | Floating top-nav pill (1107×88) with translucent dark fill, 0.8px brand-green border, 24px radius, drop shadow. Logo + 4 nav items + Sign In ghost button + Get Started primary button (with the exact `41:1545` arrow icon).                                                                              |
| `Footer`                          | `src/components/shared/Footer.jsx`                          | landing-page footer `2638:4802` | Brand-green-darker (#142916) full-width footer. Logo + tagline + 3 link columns (Platform / Company / Legal) over a 1px hairline; copyright + contact line below.                                                                                                                                          |

## UI Primitives

| Component       | Path                                  | Figma source       | Purpose                                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`        | `src/components/ui/Button.jsx`        | frame `50:6295`    | Design-system button with 5 variants × 3 sizes × 4 states. Distinctive 4px "shelf" shadow + faux-3D press animation. See "Button details" below.                                                                                                                   |
| `Card`          | `src/components/ui/Card.jsx`          | frame `50:8153`    | Selection card (renders as `<button>`). Default → hover (6px grey shelf) → selected (6px brand-green shelf + green accents on icon/tag/headline). See "Card details" below.                                                                                        |
| `Loader`        | `src/components/ui/Loader.jsx`        | frame `2168:24062` | Brand-green circular spinner — SVG arc rotated via Tailwind's `animate-spin`. Three preset sizes (`sm` 32 / `md` 60 / `lg` 96). Renders `role="status"` with a visually-hidden label for screen readers. See "Loader details" below.                               |
| `Tag`           | `src/components/ui/Tag.jsx`           | frame `3167:29034` | Small status pill (rounded-full). Five colors (`brand` default / `success` / `warning` / `danger` / `neutral`) and two sizes (`sm` / `md`). Children are ReactNode for structured content. See "Tag details" below.                                                |
| `MiniCard`      | `src/components/ui/MiniCard.jsx`      | frame `3384:76788` | Horizontal step / task card: icon + heading + status + description + tag row + action button. `selected` flips to brand-green border + 3px green shelf. See "MiniCard details" below.                                                                              |
| `ProgressBar`   | `src/components/ui/ProgressBar.jsx`   | frame `2282:23906` | Horizontal progress indicator (`value` 0–max, default `max=100`). Brand-green fill on brand-green-light track. Two sizes (`sm` 4px / `md` 6px); `indeterminate` falls back to a pulsing bar. Renders `role="progressbar"`. See "ProgressBar details" below.        |
| `WatchTutorial` | `src/components/ui/WatchTutorial.jsx` | frame `2255:1597`  | Floating "watch tutorial" widget: a 72×72 brand-green play button with optional cream-pill label that overlaps slightly. Same shelf DNA as Button (4px green shelf, presses down on click). Use `showLabel={false}` for icon-only.                                 |
| `Breadcrumbs`   | `src/components/ui/Breadcrumbs.jsx`   | frame `2263:8179`  | Vertical step list (despite the Figma name — it's a wizard sidebar, not horizontal site breadcrumbs). Each item shows a check-circle + label; status is auto-derived from `currentIndex` or overridden per item.                                                   |
| `Captions`      | `src/components/ui/Captions.jsx`      | node `2374:15129`  | Horizontal "you are here" indicator. Soft green-tinted pill with an active-status dot + chevron-separated step labels. `variant='green'` (default, institution) or `'amber'` (parent onboarding). Used as a header strip on onboarding screens.                    |
| `PreviewField`  | `src/components/ui/PreviewField.jsx`  | node `2973:80567`  | Read-only summary field for review/confirmation screens: pale `#f8f8f4` box, 9px uppercase micro-label, value below. Props: `label`, `value` (ReactNode), `valueColor`, `muted`, `leftIcon`, `trailing`, `height`, `className`. Used by Parent Review & Link Ward. |
| `Modal`         | `src/components/ui/Modal.jsx`         | —                  | **Mandatory modal primitive.** Portal + overlay + centered content box. Handles ESC, body-scroll lock, overlay click-to-close, and built-in X button. Use for every dialog/popup — never reach for `createPortal` directly. See "Modal details" below.             |

### Modal details `✅ VERIFIED`

**Rule: every modal in this codebase must use this component.** Do not call `createPortal` or wire up ESC/scroll-lock manually in a modal component — Modal already handles all of that.

**Props**

| Prop               | Type                           | Default | Notes                                                                                                                                                                                                                |
| ------------------ | ------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`           | `boolean`                      | —       | Required. Renders nothing when `false`.                                                                                                                                                                              |
| `onClose`          | `() => void`                   | —       | Called on ESC, overlay click, or X button.                                                                                                                                                                           |
| `size`             | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'`  | Max-width preset: sm → 420px, md → 640px, lg → 920px, xl → 1100px.                                                                                                                                                   |
| `ariaLabel`        | `string`                       | —       | `aria-label` on the `role="dialog"` wrapper. Required for accessibility.                                                                                                                                             |
| `showClose`        | `boolean`                      | `true`  | Renders the built-in X button (top-right, `size-9 rounded-full`).                                                                                                                                                    |
| `className`        | `string`                       | —       | Appended to the overlay `<div>` — use for overlay-level tweaks (rare).                                                                                                                                               |
| `contentClassName` | `string`                       | —       | Appended to the content box. Use to override the default `rounded-2xl` and `shadow-bottom-400` for Figma-specific shapes. Prefix overrides with `!` to beat the base classes (e.g. `!rounded-[24px] !shadow-[...]`). |
| `children`         | `ReactNode`                    | —       | Modal body rendered directly inside the content box.                                                                                                                                                                 |

**Minimal usage**

```jsx
import Modal from '../ui/Modal.jsx';

<Modal isOpen={isOpen} onClose={onClose} size="md" ariaLabel="Confirm deletion">
  <div className="p-8">
    <h2>Delete this item?</h2>
    <button onClick={onClose}>Cancel</button>
    <button onClick={handleConfirm}>Delete</button>
  </div>
</Modal>;
```

**Custom shadow / border-radius (Figma-specific override)**

When Figma specifies a non-standard card shape, override via `contentClassName` with `!` to beat the base `rounded-2xl` / `shadow-bottom-400`:

```jsx
<Modal
  size="sm"
  ariaLabel="Interests complete"
  isOpen={isOpen}
  onClose={onClose}
  contentClassName="!rounded-[24px] !shadow-[0px_24px_64px_0px_rgba(0,0,0,0.12),0px_4px_0px_0px_rgba(0,0,0,0.07),0px_0px_0px_1px_rgba(0,0,0,0.04)] overflow-hidden"
>
  {/* children */}
</Modal>
```

### Card details `✅ VERIFIED`

Renders as a clickable `<button>` so it's keyboard-accessible by default. Visual language matches Button — shelf shadow on hover/selected, faux-3D depth.

**Props**

| Prop          | Type                                                            | Default     | Notes                                                                                                                                        |
| ------------- | --------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `selected`    | `boolean`                                                       | `false`     | Pins the brand-green visual (1.5px green border + 6px green shelf + brand-green-light icon block + green tag/headline). Sets `aria-pressed`. |
| `disabled`    | `boolean`                                                       | `false`     | Sets HTML `disabled` + opacity 0.55 + `cursor-not-allowed`.                                                                                  |
| `state`       | `'default' \| 'hover' \| 'selected' \| 'disabled' \| undefined` | `undefined` | Showcase-only override. Production omits this — `:hover` drives the lift naturally.                                                          |
| `onClick`     | `(event) => void`                                               | —           | Selection handler.                                                                                                                           |
| `icon`        | `ReactNode`                                                     | —           | Renders inside the 62×62 icon block.                                                                                                         |
| `tag`         | `string`                                                        | —           | Small uppercase pill. Yellow-light bg by default; brand-green-light when selected.                                                           |
| `headline`    | `string`                                                        | —           | Instrument Serif 22px. Black by default, brand-green when selected.                                                                          |
| `description` | `string`                                                        | —           | SF Pro Rounded 14/20, neutral grey.                                                                                                          |
| `children`    | `ReactNode`                                                     | —           | If passed, overrides the structured icon/tag/headline/description layout — for fully custom card contents.                                   |
| `className`   | `string`                                                        | —           | Appended last (e.g. drop the fixed 267px height in compact layouts).                                                                         |
| ...rest       | —                                                               | —           | Forwarded (`name`, `aria-*`, `ref`, etc.).                                                                                                   |

**State visuals**

| State                                  | Border / Shadow / Bg                                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Default                                | 2px `#e6e6e6` + bottom.200 elevation, `bg-yellow-light`                                                                                        |
| Hover (interactive `:hover` or pinned) | 2px `#cccccc` + 6px grey shelf `0_6px_0_0_rgba(204,204,204,0.8)`                                                                               |
| Selected                               | 1.5px `brand-green` + 6px green shelf `0_6px_0_0_rgba(34,70,38,0.8)`, `bg-white`. Icon block, tag, and headline switch to brand-green accents. |
| Disabled                               | Default visual + opacity 0.55 + no hover lift                                                                                                  |

**Selection-group pattern** (radio-style)

```jsx
const [role, setRole] = useState(null);
return (
  <div role="radiogroup" aria-label="Choose your role" className="grid grid-cols-3 gap-6">
    {ROLES.map((r) => (
      <Card
        key={r.id}
        icon={r.icon}
        tag={r.tag}
        headline={r.headline}
        description={r.description}
        selected={role === r.id}
        onClick={() => setRole(r.id)}
      />
    ))}
  </div>
);
```

No special "group" component — selection state lives in the parent. See `InteractiveCards` in HomePage.jsx for a working example.

## Form primitives `✅ VERIFIED`

Live under [src/components/ui/form/](../src/components/ui/form/) with a barrel export:

```js
import { Field, TextInput } from '../components/ui/form';
```

The form folder will grow to include `PasswordInput`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `VerificationCode`, `Upload` as those Figma frames are implemented.

| Component          | Path                                          | Figma source             | Purpose                                                                                                                                                                                                                                                              |
| ------------------ | --------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Field`            | `src/components/ui/form/Field.jsx`            | frame `50:6914`          | Generic wrapper: label + required `*` + "optional" badge + helper / error row with alert icon. Used internally by every form primitive; exposed for composition with non-text controls.                                                                              |
| `TextInput`        | `src/components/ui/form/TextInput.jsx`        | frame `50:6914`          | Hybrid text input — accepts native `<input>` props plus `label` / `required` / `optional` / `helperText` / `error` / `verified` / `leftIcon` / `rightIcon`. Renders Field internally.                                                                                |
| `Textarea`         | `src/components/ui/form/Textarea.jsx`         | frame `2021:950`         | Hybrid multi-line input — same state ladder as TextInput with built-in character counter (gold near limit, red over). 100px default height with `resize-y` so users can drag. See "Textarea details" below.                                                          |
| `Select`           | `src/components/ui/form/Select.jsx`           | frame `50:6275`          | Hybrid dropdown — same closed-state visual as TextInput, plus a green-bordered popover menu with optional `searchable` filter. Cascading and grouped-options patterns documented under "Select details" below.                                                       |
| `PhoneInput`       | `src/components/ui/form/PhoneInput.jsx`       | institution contact step | Ghana +233 phone input. Read-only prefix (GhanaFlagRoundIcon + "+233") + hairline divider + numeric field. Field-compatible (label, required, labelTrailing, error). Same shelf-shadow states as TextInput. Use via `Controller`. `✅ VERIFIED`                      |
| `PasswordInput`    | `src/components/ui/form/PasswordInput.jsx`    | institution contact step | TextInput wrapper: LockIcon leftIcon (brand-green) + EyeIcon/EyeOffIcon toggle button as rightIcon. Controlled show/hide state. Passes `rightIconInteractive` to TextInput so the toggle stays accessible. Accepts all TextInput props. `✅ VERIFIED`                |
| `Checkbox`         | `src/components/ui/form/Checkbox.jsx`         | frame `2019:13564`       | 20×20 checkbox with the same shelf DNA as Button — 2px grey shelf collapses to a 1.2px brand-green shelf when checked (presses down on click). Accepts `label` as string or ReactNode for inline-link patterns (T&C / Privacy Policy). See "Checkbox details" below. |
| `VerificationCode` | `src/components/ui/form/VerificationCode.jsx` | frame `2021:911`         | Multi-box one-time-code input. External API exposes a single string; internally manages per-box state, focus advance, backspace-back, arrow nav, paste distribution. Optional `splitAfter` inserts a centered `·` separator. See "VerificationCode details" below.   |
| `Upload`           | `src/components/ui/form/Upload.jsx`           | frame `3014:57097`       | Drop-zone uploader with derived states (default / hover / loading / received / error / disabled). Native `<input type="file">` is visually hidden; the dashed dropzone forwards drag events. Loading + received are consumer-managed. See "Upload details" below.    |

### Hybrid pattern

The form primitives accept Field props directly so the common case is one component:

```jsx
<TextInput
  label="Email"
  required
  type="email"
  leftIcon={<MailIcon />}
  helperText="We’ll never share this"
  error={errors.email?.message}
  {...register('email')}
/>
```

For non-text controls (a custom date picker, file upload, etc.) compose Field manually:

```jsx
<Field label="Avatar" required helperText="PNG only">
  <Upload onChange={...} />
</Field>
```

### TextInput state derivation `✅ VERIFIED`

Highest-priority wins:

```
forced `state` prop  →  `disabled`  →  `error`  →  `verified`  →  interactive (focus-within)
```

| Resolved state                      | Visual                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Interactive (no override)           | `border #ccc` + 2.5px grey shelf; on `:focus-within` → green-light-active border + warm white bg + green-tinted shelf |
| `verified` prop true                | Same green visual as focus, pinned (1.5px border)                                                                     |
| `error` prop set (non-empty string) | Red-light-active border (1.5px) + red-tinted shelf; helper row turns red                                              |
| `disabled` prop true                | Brand-green-light bg, 2px grey border, opacity 0.55, no shelf, no interaction                                         |
| Forced via `state` prop             | One of `'default' \| 'focus' \| 'verified' \| 'error' \| 'disabled'` — for showcase only                              |

Inner box: `h-51 px-20 pr-16 py-13 rounded-md w-full` matching Figma's "GTHInput" symbol. Left icon slot is 16×16, right icon slot is 20×20 (per Figma examples — eye toggle on password is 20px).

### Field props `✅ VERIFIED`

| Prop         | Type      | Notes                                                                                                                                                                  |
| ------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`      | `string`  | Optional. Rendered as `<label htmlFor={...}>`.                                                                                                                         |
| `htmlFor`    | `string`  | Tied to the inner input's id. Auto-generated via `useId()` when TextInput passes it through.                                                                           |
| `required`   | `boolean` | Renders the green `*` next to the label.                                                                                                                               |
| `optional`   | `boolean` | Renders the small "optional" badge on the right side of the label row.                                                                                                 |
| `helperText` | `string`  | Renders below the control with the alert icon.                                                                                                                         |
| `error`      | `string`  | Same row as helperText but in `text-danger`; takes precedence over `helperText` when both set. Adds `role="alert"` to the message row and `aria-invalid` to the input. |

### Select details `✅ VERIFIED`

Closed-state visuals reuse TextInput's state ladder. Open state renders a 2px green-bordered menu 12px below the trigger with an inverse 4px shelf shadow (`shadow-[0_-4px_0_<dark>]`), so the trigger and menu visually "hover" connected.

**Select-specific props** (in addition to Field props):

| Prop                     | Type                                                         | Notes                                                                                     |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `options`                | `Array<{ value, label } \| string>`                          | Strings auto-normalised to `{value: s, label: s}`.                                        |
| `value` / `defaultValue` | any                                                          | Controlled vs uncontrolled.                                                               |
| `onChange`               | `(value, option) => void`                                    | Receives both the raw value and the full option object.                                   |
| `placeholder`            | `string`                                                     | Shown when nothing is selected (default: `"Select an option"`).                           |
| `searchable`             | `boolean`                                                    | When true, the menu shows a filter input at top with a search icon; auto-focuses on open. |
| `verified`               | `boolean`                                                    | Pins the verified visual (1.5px green border + green shelf).                              |
| `disabled`               | `boolean`                                                    | Standard. Useful for cascading: `disabled={!parentValue}`.                                |
| `state`                  | `'default' \| 'open' \| 'verified' \| 'error' \| 'disabled'` | Showcase-only override.                                                                   |
| `leftIcon`               | `ReactNode`                                                  | Optional 16×16 icon on the left of the trigger.                                           |
| `name` / `id`            | `string`                                                     | Forwarded to the trigger button.                                                          |

**Keyboard**

| Key                     | Action                         |
| ----------------------- | ------------------------------ |
| `Tab`                   | Focus trigger                  |
| `Enter` / `Space` / `↓` | Open menu (when closed)        |
| `Esc`                   | Close menu, clear search query |

Click outside also closes. Full keyboard navigation (option highlight via ↑/↓, Enter to select) is a TODO — currently options are mouse/touch only once the menu is open. Tracked under "Open follow-ups" in [log.md](log.md).

**Patterns out of scope for v1** (compose at parent level):

| Pattern                              | How to use today                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Cascading (Level → Grade)            | Render two `Select`s; pass `disabled={!level}` on the child. See `CascadingExample` in HomePage.jsx.                                    |
| Grouped options with section headers | Not yet supported — will need a `groups` prop or `OptionGroup` sub-component. Track in figma frame `50:6275` "Grouped Options" section. |
| Multi-select                         | Future variant. Single-select only for v1.                                                                                              |

### TextInput-specific props (in addition to Field props + native `<input>` attrs) `✅ VERIFIED`

| Prop                     | Type                                                                       | Notes                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verified`               | `boolean`                                                                  | Pins the verified visual (green border + shelf).                                                                                                               |
| `leftIcon` / `rightIcon` | `ReactNode`                                                                | Icon slots inside the input box. The right slot can hold an interactive element (e.g. password eye toggle) — wrap it in a `<button>` yourself if so.           |
| `state`                  | `'default' \| 'focus' \| 'verified' \| 'error' \| 'disabled' \| undefined` | Showcase-only override — pins a state without interaction.                                                                                                     |
| ...native input          | —                                                                          | `type`, `value`, `defaultValue`, `placeholder`, `onChange`, `onBlur`, `name`, `id`, `ref` are all forwarded. Plays well with `react-hook-form`'s `register()`. |

### ProgressBar details `✅ VERIFIED`

Horizontal progress indicator. Figma's four fill-percentage variants collapse into a single `value`-driven primitive — only the fill width changes, so a generic component is more useful than enumerated variants.

**Props**

| Prop            | Type           | Default | Notes                                                                                          |
| --------------- | -------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `value`         | `number`       | —       | Current progress (0–`max`). Required unless `indeterminate`.                                   |
| `max`           | `number`       | `100`   | Upper bound. Useful when `value` represents bytes / steps / etc.                               |
| `size`          | `'sm' \| 'md'` | `'md'`  | `md` matches Figma (6px); `sm` is 4px (used inside Upload's loading state).                    |
| `indeterminate` | `boolean`      | `false` | Renders a full-width pulsing bar via Tailwind's `animate-pulse`. Use when duration is unknown. |
| `label`         | `string`       | —       | `aria-label` for screen readers (e.g. `"60% complete"`).                                       |
| `className`     | `string`       | —       | Appended last.                                                                                 |

ARIA: `role="progressbar"` is always set. In determinate mode, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` are populated; in indeterminate mode they're omitted (per WAI-ARIA spec).

### WatchTutorial details `✅ VERIFIED`

Floating helper widget. Renders as a single `<button>` so the whole widget is one tappable target.

**Props**

| Prop        | Type              | Default            | Notes                                                                              |
| ----------- | ----------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `label`     | `string`          | `'Watch Tutorial'` | Text shown in the cream pill on the left.                                          |
| `showLabel` | `boolean`         | `true`             | Toggle the cream pill on / off. With `false`, only the circular play button shows. |
| `onClick`   | `(event) => void` | —                  | Click / press handler.                                                             |
| `className` | `string`          | —                  | Appended to the wrapping `<button>`.                                               |
| ...rest     | —                 | —                  | Forwarded to the wrapping `<button>`.                                              |

**Visual signature**

72×72 brand-green circular button with the `20-play-circle` icon (Figma `41:1185`). Same shelf DNA as Button — 4px brand-green-dark-hover shelf at rest, collapses on `:active` with a `translate-y-1` (sinks into the shelf). The cream-pill label shares a soft 8px shadow + 2px reflection and overlaps the button by 13px so they read as one element.

### Breadcrumbs details `✅ VERIFIED`

Vertical step list (Figma calls it "Breadcrumbs"; in practice it's a wizard sidebar). Items render in document order; status is auto-derived from `currentIndex` unless overridden per item.

**Props**

| Prop           | Type                                        | Default | Notes                                                                             |
| -------------- | ------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `items`        | `Array<string \| { label, status?, key? }>` | `[]`    | Strings auto-normalise to `{ label }`. Pass `status` to override auto-derivation. |
| `currentIndex` | `number`                                    | `0`     | Index of the active step. Items before are "completed", after are "pending".      |
| `className`    | `string`                                    | —       | Appended to the `<ol>`.                                                           |

**Status visuals**

| Status      | Icon                        | Label                 |
| ----------- | --------------------------- | --------------------- |
| `pending`   | grey `#babab7` filled check | grey `#babab7` medium |
| `active`    | brand-green filled check    | brand-green semibold  |
| `completed` | brand-green filled check    | grey `#babab7` medium |

ARIA: each step is an `<li>` inside an `<ol role="list">`. The active step gets `aria-current="step"`.

### Captions details `✅ VERIFIED`

Horizontal step indicator. Renders as a soft green-tinted pill with a leading active-status dot and chevron-separated step labels.

**Props**

| Prop           | Type                           | Default   | Notes                                                                                                                                                                                                                               |
| -------------- | ------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`        | `string[] \| {index?,label}[]` | `[]`      | Step labels (or `{index,label}` objects) in order.                                                                                                                                                                                  |
| `currentIndex` | `number`                       | `0`       | Index of the active step. The active label is themed; others are grey.                                                                                                                                                              |
| `variant`      | `'green' \| 'amber'`           | `'green'` | Theme. `green` = institution look (green pill/dot/label). `amber` = parent onboarding look (white pill, `#eedeb8` border, amber dot, `#c8951a` active label). Replaces the per-section in-file badges in the parent sign-up wizard. |
| `className`    | `string`                       | —         | Appended last.                                                                                                                                                                                                                      |

The leading dot is a fixed visual anchor — it doesn't move with `currentIndex`. The Figma intent is "you are progressing through this multi-step journey, here's where you are." Colour/padding tokens differ per `variant` and live in a `VARIANTS` map inside the component (because `classNames` is a plain join, not tailwind-merge, so passing overrides via `className` is unreliable).

### Tag details `✅ VERIFIED`

Small status indicator rendered as `<span>`. Two visual shapes correspond to the two distinct shapes used in Figma:

- **`pill` (default)** — Source: Figma frame `3167:29034`, symbol `3167:22477`. Rounded-pill (100px) bordered chip with a soft 1.5px shadow. Used standalone for status callouts ("11% Completed", "Verified").
- **`chip`** — Source: meta-tags inside MiniCard (Figma `3179:29793` brand-green chip, `3179:29795` neutral chip). Flat 4px corners, denser padding (px-8 py-3px), semibold weight, slightly different colour palette per family (brand-green-light bg with brand-green-DARK text vs the pill's white bg + brand-green text). No shadow.

**Props**

| Prop        | Type                                                         | Default   | Notes                                                                                                   |
| ----------- | ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------- |
| `variant`   | `'pill' \| 'chip'`                                           | `'pill'`  | Selects the shape. Pill matches Figma `3167:22477`; chip matches the MiniCard meta-tags.                |
| `color`     | `'brand' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'brand'` | Color family. Each variant flips its own bg / border / text within the family.                          |
| `size`      | `'sm' \| 'md'`                                               | `'md'`    | Pill only. `md` matches Figma (px-12 py-8); `sm` is denser for inline-with-text. Chip is fixed-density. |
| `children`  | `ReactNode`                                                  | —         | The tag content.                                                                                        |
| `className` | `string`                                                     | —         | Appended last.                                                                                          |
| ...rest     | —                                                            | —         | Forwarded to the wrapping `<span>`.                                                                     |

**Color visuals — pill variant**

| Color     | Bg              | Border                    | Text             |
| --------- | --------------- | ------------------------- | ---------------- |
| `brand`   | white           | `brand-green-light-hover` | `brand-green`    |
| `success` | `success-light` | `success-light-active`    | `success`        |
| `warning` | `accent-light`  | `accent-light-active`     | `accent-dark`    |
| `danger`  | `danger-light`  | `danger-light-active`     | `danger`         |
| `neutral` | `neutral`       | `#dfdfdc`                 | `neutral-darker` |

**Color visuals — chip variant**

| Color     | Bg                  | Border                     | Text               |
| --------- | ------------------- | -------------------------- | ------------------ |
| `brand`   | `brand-green-light` | `brand-green-light-active` | `brand-green-dark` |
| `success` | `success-light`     | `success-light-active`     | `success-dark`     |
| `warning` | `accent-light`      | `accent-light-active`      | `accent-dark`      |
| `danger`  | `danger-light`      | `danger-light-active`      | `danger-dark`      |
| `neutral` | `neutral`           | `#dfdfdc`                  | `neutral-darker`   |

The pill carries a 1.5px shadow + 100px radius; the chip has no shadow + 4px radius and uses a denser semibold typeface. Children inheriting `text-` class will adopt the variant's text color unless overridden inline.

### MiniCard details `✅ VERIFIED`

Horizontal step / task card. Figma shows two variants: default (grey border + 4px grey shelf) and selected (brand-green border + 3px green shelf). The right-side action button uses a `bottom.300` dropshadow to stay floating against the card body.

Renders as a `<div>` by default — the whole card is _not_ clickable. The right action is a separate `<button>`. Wrap in a `<button>` or `<a>` at the consumer level if you need the entire row to be a link.

**Props**

| Prop          | Type                                   | Default      | Notes                                                                     |
| ------------- | -------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `icon`        | `ReactNode`                            | —            | Renders inside the 40×40 brand-green-light icon block on the left.        |
| `heading`     | `string`                               | —            | Primary text (medium 14/24).                                              |
| `status`      | `string \| ReactNode`                  | —            | Small green-success badge inline with the heading (e.g. `"✓ Done"`).      |
| `description` | `string \| ReactNode`                  | —            | Secondary line below heading (small grey 10/16).                          |
| `tags`        | `ReactNode`                            | —            | Horizontal tag row below the description. Compose with `<Tag>` instances. |
| `selected`    | `boolean`                              | `false`      | Flips border + shelf to brand-green.                                      |
| `state`       | `'default' \| 'selected' \| undefined` | `undefined`  | Showcase-only override. Production usage drives state via `selected`.     |
| `onAction`    | `(event) => void`                      | —            | When provided, renders the right-side action button. Omit to hide.        |
| `actionLabel` | `string`                               | `'Continue'` | `aria-label` for the action button.                                       |
| `actionIcon`  | `ReactNode`                            | ChevronRight | Optional override for the action button icon.                             |
| `className`   | `string`                               | —            | Appended last.                                                            |
| ...rest       | —                                      | —            | Forwarded to the outer `<div>`.                                           |

**Selection-group pattern** (single-active step)

```jsx
const [active, setActive] = useState(null);
return STEPS.map((step) => (
  <MiniCard
    key={step.id}
    {...step}
    selected={active === step.id}
    onAction={() => setActive(step.id)}
  />
));
```

No special "group" component — same pattern as Card.

### Upload details `✅ VERIFIED`

Drop-zone uploader. The native `<input type="file">` is visually hidden inside the component; the dashed dropzone is a `<div>` that listens to drag events and clicks via the visible "browse to choose a file" `<button>`.

State is _derived from props_ — Upload doesn't own upload progress. Pass `progress={Number}` to render the loading bar; pass `filename={'foo.csv'}` to render the success state. `error` and `disabled` take precedence over progress / filename so a server error overrides any in-flight indicator.

**State derivation priority** (highest first)

```
forced `state` prop  →  `disabled`  →  `error`
→  filename + !progress     ⇒  received
→  progress != null          ⇒  loading
→  drag-over (interactive)   ⇒  hover
→  default
```

**Props** (in addition to standard Field props)

| Prop           | Type                                                                                    | Default     | Notes                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`       | `string`                                                                                | —           | Forwarded to native input (e.g. `".csv,.xlsx,.xls"` or `"image/*"`).                                                                    |
| `acceptLabels` | `string[]`                                                                              | —           | Pills shown beneath the prompt to advertise allowed extensions (e.g. `['.csv', '.xlsx', '.xls']`). Hidden in loading / received states. |
| `multiple`     | `boolean`                                                                               | `false`     | When true, `onFileSelect` receives an `Array<File>` instead of a single `File`.                                                         |
| `onFileSelect` | `(file \| File[]) => void`                                                              | —           | Fires when the user picks via the file dialog or drops files. Argument shape depends on `multiple`.                                     |
| `progress`     | `number` (0–100)                                                                        | —           | When set (including `0`), renders the loading state with a thin progress bar at the bottom.                                             |
| `filename`     | `string`                                                                                | —           | When set without `progress`, renders the received state.                                                                                |
| `state`        | `'default' \| 'hover' \| 'loading' \| 'received' \| 'error' \| 'disabled' \| undefined` | `undefined` | Showcase-only — pins a visual variant. Production usage omits this.                                                                     |
| `height`       | `number`                                                                                | `173`       | Minimum dropzone height in px (matches Figma's 173).                                                                                    |
| `disabled`     | `boolean`                                                                               | `false`     | Disables both the file input and the browse button.                                                                                     |

**Visual ladder**

| Resolved state | Bg                            | Border                                 |
| -------------- | ----------------------------- | -------------------------------------- |
| `default`      | `#fefefd`                     | dashed `brand-green-light-active`      |
| `hover` (drag) | `brand-green-light` (#ebf1ec) | dashed `brand-green`                   |
| `loading`      | `brand-green-light`           | dashed `brand-green` + bottom progress |
| `received`     | `brand-green-light`           | solid `brand-green`                    |
| `error`        | white                         | dashed `danger`                        |
| `disabled`     | `#fefefd`                     | dashed `#cccccc` + opacity 0.55        |

**Consumer-driven flow**

```jsx
const [progress, setProgress] = useState(null);
const [done, setDone] = useState(null);

const handlePick = async (file) => {
  setProgress(0);
  await uploadWithXhr(file, (pct) => setProgress(pct));
  setProgress(null);
  setDone(file.name);
};

return (
  <Upload
    accept=".csv,.xlsx"
    acceptLabels={['.csv', '.xlsx']}
    onFileSelect={handlePick}
    progress={progress}
    filename={done}
  />
);
```

**A11y**: native `<input type="file">` retains its keyboard / form-integration behaviour. Drop-zone wrapper announces nothing; the visible "browse" button + the file input handle accessibility. `aria-invalid` is forwarded to the input when `error` is set; the progress bar is `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.

### Textarea details `✅ VERIFIED`

Multi-line cousin of TextInput. Same Field wrapper, same state-derivation priority (`state` → `disabled` → `error` → `verified` → interactive `:focus-within`), but with two visual differences:

- Active / verified bg is a slight green tint (`#eef7f2`) rather than TextInput's `bg-yellow-light`.
- Shelf shadow is 3px deep (matches VerificationCode) rather than TextInput's 2.5px.

Defaults: `rows={4}` → ~100px tall; `resize-y` so users can drag the bottom-right handle to grow it. The native `<textarea>` resize control replaces Figma's painted `hugeicons:arrow-expand-01` glyph.

**Textarea-specific props** (in addition to standard Field props + native `<textarea>` attrs):

| Prop          | Type                                                                       | Default              | Notes                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verified`    | `boolean`                                                                  | `false`              | Pins the verified visual (green tint + green border + green shelf).                                                                                                                      |
| `maxLength`   | `number`                                                                   | —                    | Drives the character counter. Note: not forwarded to the native textarea — we let the consumer overflow so the counter can show `503/500` and the consumer applies their own validation. |
| `showCounter` | `boolean`                                                                  | `Boolean(maxLength)` | Force the counter on / off. Defaults to true when `maxLength` is set.                                                                                                                    |
| `warnAt`      | `number` (0–1)                                                             | `0.9`                | Fraction of `maxLength` at which the counter turns gold. `length > maxLength` always renders red regardless.                                                                             |
| `rows`        | `number`                                                                   | `4`                  | Forwarded to the native textarea — sets the initial height before resize.                                                                                                                |
| `state`       | `'default' \| 'focus' \| 'verified' \| 'error' \| 'disabled' \| undefined` | `undefined`          | Showcase-only override.                                                                                                                                                                  |
| ...native     | —                                                                          | —                    | `value`, `defaultValue`, `placeholder`, `onChange`, `onBlur`, `name`, `id`, `ref` are all forwarded. Plays well with `react-hook-form`'s `register()`.                                   |

**Counter visual ladder**

| Length condition        | Counter colour                  |
| ----------------------- | ------------------------------- |
| `< warnAt × maxLength`  | `text-neutral-darker` (#575755) |
| `>= warnAt × maxLength` | `text-accent` (#c8951a — gold)  |
| `> maxLength`           | `text-danger` (#c0392b — red)   |

The counter row uses `aria-live="polite"` so screen readers announce it without interrupting.

### Loader details `✅ VERIFIED`

Single brand-green circular spinner. Renders an SVG with two concentric circles — a faint `brand-green-light` track ring and a brand-green arc covering 75% of the circumference. The whole SVG rotates via Tailwind's built-in `animate-spin` (CSS keyframes — no JS animation loop, no asset dependencies).

The Figma source (`2168:24062`) uses a layered raster + repeated keyframe symbols to produce a single dot orbiting the circle; the React implementation captures the same visual intent more cheaply.

**Props**

| Prop        | Type                   | Default      | Notes                                                                                              |
| ----------- | ---------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`       | `sm` 32×32 (inline w/ text), `md` 60×60 (default — matches Figma), `lg` 96×96 (full-page loading). |
| `label`     | `string`               | `'Loading…'` | Visually-hidden text announced by screen readers via `role="status"` + `aria-live="polite"`.       |
| `className` | `string`               | —            | Appended to the wrapping `<span>` (e.g. for spacing inside a button).                              |
| ...rest     | —                      | —            | Forwarded to the wrapping `<span>` (e.g. `data-*`, `aria-*`).                                      |

**Stroke widths** are proportional to size (~10% of diameter) so the arc reads the same at every scale: 3 / 5 / 8 px.

**Composition examples**

```jsx
// Standalone — full-page loading state
<Loader size="lg" />

// Inline with text
<span className="inline-flex items-center gap-2">
  <Loader size="sm" /> Loading your profile…
</span>

// Inside a disabled button
<Button disabled variant="primary">
  <span className="inline-flex items-center gap-2">
    <Loader size="sm" /> Submitting
  </span>
</Button>
```

### Checkbox details `✅ VERIFIED`

Renders the native `<input type="checkbox">` visually hidden (`sr-only`) inside a clickable `<label>` that wraps a 20×20 visual proxy box. Native focus / form-integration behaviour is preserved. Field is _not_ used — checkboxes don't need a separate label row above the control; helper / error text renders below in the same alert-icon style as Field.

**Props**

| Prop             | Type                                                                                       | Default     | Notes                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `string \| ReactNode`                                                                      | —           | Inline label next to the box. Accepts ReactNode so you can embed links (e.g. T&C / Privacy Policy).                              |
| `required`       | `boolean`                                                                                  | `false`     | Appends a brand-green `*` after the label text.                                                                                  |
| `helperText`     | `string \| ReactNode`                                                                      | —           | Below-row helper.                                                                                                                |
| `error`          | `string \| ReactNode`                                                                      | —           | Overrides helperText, paints the box red, sets `aria-invalid` and `role="alert"`.                                                |
| `checked`        | `boolean`                                                                                  | —           | Controlled.                                                                                                                      |
| `defaultChecked` | `boolean`                                                                                  | —           | Uncontrolled.                                                                                                                    |
| `onChange`       | `(event) => void`                                                                          | —           | Receives the native change event (use `e.target.checked`).                                                                       |
| `disabled`       | `boolean`                                                                                  | `false`     | Sets HTML `disabled` + opacity 0.55, no shelf, `cursor-not-allowed`.                                                             |
| `state`          | `'default' \| 'checked' \| 'error' \| 'error-checked' \| 'disabled' \| 'disabled-checked'` | `undefined` | **Showcase-only** — pins a visual variant for documentation. Production usage omits this; visuals derive from `checked` + props. |
| `name` / `id`    | `string`                                                                                   | —           | Forwarded to the native input.                                                                                                   |
| ...native input  | —                                                                                          | —           | Standard `<input>` props are forwarded (incl. `value`, `ref`).                                                                   |

**State derivation priority** (highest first):

```
forced `state` prop  →  `disabled`  →  `error`  →  `checked`  →  default
```

**State visuals**

| State            | Box border      | Box bg             | Shelf shadow                  | Tick  |
| ---------------- | --------------- | ------------------ | ----------------------------- | ----- |
| Default          | `1.5px #ccc`    | white              | `0 2px 0 #ccc`                | —     |
| Checked          | `1.5px #19341d` | `#387440`          | `0 1.2px 0 #19341d` (presses) | white |
| Error            | `1.5px #ebc2bd` | white              | `0 2px 0 rgba(146,43,33,0.8)` | —     |
| Error + checked  | `1.5px #902b20` | `#c0392b` (danger) | `0 1.2px 0 #561a13`           | white |
| Disabled         | `1.5px #ccc`    | white              | none, opacity 0.55            | —     |
| Disabled+checked | `1.5px #19341d` | `#387440`          | none, opacity 0.55            | white |

**Selection-group pattern** — checkboxes are independent by default (each toggles its own `checked`). For a "select all that apply" group, the consumer composes:

```jsx
const [interests, setInterests] = useState(new Set());
return INTERESTS.map((opt) => (
  <Checkbox
    key={opt.value}
    label={opt.label}
    checked={interests.has(opt.value)}
    onChange={(e) => {
      const next = new Set(interests);
      e.target.checked ? next.add(opt.value) : next.delete(opt.value);
      setInterests(next);
    }}
  />
));
```

No special `CheckboxGroup` component — the showcase in HomePage demonstrates a 3-row T&C / consent / marketing pattern with rich-label ReactNode and required `*`.

### VerificationCode details `✅ VERIFIED`

Multi-box one-time-code input. External API exposes a single string value (`onChange(code)`); internally the component manages an array of single-char digits with refs, distributing pastes / advancing focus on input / backspacing back across boxes. Wrapped in `Field` so label/helper/error are consistent with TextInput/Select.

**Props** (in addition to standard Field props):

| Prop           | Type                                             | Default     | Notes                                                                                                      |
| -------------- | ------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `length`       | `number`                                         | `6`         | Number of digit boxes. Common values: 4 (PIN), 6 (SMS / email OTP).                                        |
| `value`        | `string`                                         | —           | Controlled. Non-digit chars are stripped; longer strings are truncated to `length`.                        |
| `defaultValue` | `string`                                         | —           | Uncontrolled.                                                                                              |
| `onChange`     | `(code: string) => void`                         | —           | Fires on every digit change with the joined string (may be partial, e.g. `"123"`).                         |
| `onComplete`   | `(code: string) => void`                         | —           | Fires only when all `length` digits are filled.                                                            |
| `splitAfter`   | `number`                                         | —           | Inserts a centered `·` separator after the Nth box (Figma's example: `splitAfter={3}` for a 6-digit code). |
| `autoFocus`    | `boolean`                                        | `false`     | Focus the first box on mount.                                                                              |
| `disabled`     | `boolean`                                        | `false`     | Disables every box, applies disabled visual.                                                               |
| `state`        | `'default' \| 'active' \| 'error' \| 'disabled'` | `undefined` | **Showcase-only** — pins every box to one variant for documentation. Production usage omits this.          |

**Per-box state derivation** (when not forced):

| Box state  | When                                  | Visual                                                             |
| ---------- | ------------------------------------- | ------------------------------------------------------------------ |
| `default`  | empty, not focused                    | white bg, `2px #ccc` border, `0 3px 0 rgba(191,191,191,0.8)` shelf |
| `active`   | focused or filled                     | white bg, `2px #c1d4c4` border, `0 3px 0 rgba(34,70,38,0.8)` shelf |
| `error`    | `error` prop set (applies to all)     | white bg, `2px #ebc2bd` border, `0 3px 0 #922b21` shelf            |
| `disabled` | `disabled` prop true (applies to all) | `#ebf1ec` bg, `2px #ccc` border, no shelf                          |

**Keyboard behaviour**

| Key                               | Action                                            |
| --------------------------------- | ------------------------------------------------- |
| `0–9`                             | Write digit, advance focus to next box            |
| `Backspace` (filled)              | Clear current digit, focus stays                  |
| `Backspace` (empty)               | Move focus back, clear that previous digit        |
| `←` / `→`                         | Move focus between boxes                          |
| `Home` / `End`                    | Jump to first / last box                          |
| Paste a multi-digit string        | Distribute starting at current box, advance focus |
| Mobile autofill (`one-time-code`) | Native autofill into the first box, distributes   |

ARIA: each box gets `aria-label="Digit N of M"`; `aria-invalid` flips on the first box when `error` is set.

### Button details `✅ VERIFIED`

**Props**

| Prop                     | Type                                                                              | Default     | Notes                                                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                | `'primary' \| 'secondary' \| 'tertiary' \| 'tertiary-subtle' \| 'tertiary-cream'` | `'primary'` | Visual treatment per Figma section.                                                                                                                                              |
| `size`                   | `'lg' \| 'md' \| 'sm'`                                                            | `'lg'`      | Padding + border-radius preset.                                                                                                                                                  |
| `disabled`               | `boolean`                                                                         | `false`     | Sets HTML `disabled` + applies disabled visual.                                                                                                                                  |
| `state`                  | `'default' \| 'hover' \| 'active' \| 'disabled' \| undefined`                     | `undefined` | **Showcase-only override** that pins a visual state without user interaction. Real usage omits this — `:hover`, `:active`, `:disabled` pseudo-classes drive state automatically. |
| `leftIcon` / `rightIcon` | `ReactNode`                                                                       | —           | 20×20 icon slot, rendered inside a flex sibling with 8px gap.                                                                                                                    |
| `type`                   | `'button' \| 'submit' \| 'reset'`                                                 | `'button'`  | Forwarded to `<button>`.                                                                                                                                                         |
| `className`              | `string`                                                                          | —           | Appended last so consumers can override.                                                                                                                                         |
| ...rest                  | —                                                                                 | —           | Forwarded (`onClick`, `aria-*`, `ref`, etc.).                                                                                                                                    |

**Variant visual rules (Figma exact)**

| Variant           | Bg (default)                      | Border                             | Shelf shadow                        | Text                                                      |
| ----------------- | --------------------------------- | ---------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `primary`         | `#387440` brand-green             | `#2a5730`                          | `0 4px 0 #224626`                   | Peach→mint gradient (`bg-clip-text`); white when disabled |
| `secondary`       | `#c8951a` accent                  | `#967014`                          | `0 4px 0 #967014`                   | `#faf4e8` accent-light                                    |
| `tertiary`        | white                             | `rgba(17,17,17,0.3)`               | `0 4px 0 rgba(17,17,17,0.25)`       | `#111` black                                              |
| `tertiary-subtle` | `#e1eae2` brand-green-light-hover | `#c1d4c4` brand-green-light-active | `bottom.100` shadow only (no shelf) | `#165d3a` success-dark                                    |
| `tertiary-cream`  | `#faf4e8` accent-light            | `rgba(17,17,17,0.3)`               | `0 4px 0 rgba(17,17,17,0.25)`       | `#575755` neutral-darker                                  |

**State transitions**

| State       | Visual change                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:hover`    | Shelf deepens 4px → 5px; primary border colour shifts to `brand-green-active`; secondary fill darkens to `accent-hover`                                           |
| `:active`   | Shelf collapses (no drop-shadow); button `translate-y-1` (4px down — sinks into shelf space); primary fill darkens to `brand-green-active`; border colour darkens |
| `:disabled` | Bg `#bfbfbf`, border `#cccccc`, shelf greyed; text white (primary) or opacity 0.5 (tertiaries); cursor not-allowed                                                |

**Sizes**

| Size | Padding     | Radius |
| ---- | ----------- | ------ |
| `lg` | px-34 py-16 | 14px   |
| `md` | px-28 py-14 | 10px   |
| `sm` | px-18 py-12 | 10px   |

Showcase: see [src/pages/HomePage.jsx](../src/pages/HomePage.jsx) — renders all 60 variant/size/state permutations + interactive examples + icon slots.

## Sections `✅ VERIFIED`

| Component                  | Path                                                                         | Figma source                                  | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HeroSection`              | `src/components/sections/landing/HeroSection.jsx`                            | landing hero `2513:27809`                     | Full-width landing hero (1729×1084 in Figma). Dark green bg with decorative orb gradients, two-column layout: left = career-level pill + 120px Instrument Serif headline (mixed italic / regular with brand-green & cream accents) + sub-copy + Get Started CTA + ★★★★★ stats; right = `HeroPhotoCard`. Bottom row: `ScrollIndicator` + `TrustedBy` marquee.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `HeroPhotoCard`            | `src/components/sections/landing/HeroPhotoCard.jsx`                          | photo composition `2517:28762`                | Two stacked rotated photo cards (gold-bordered front + neutral back) holding the students PNG with a Ghana-flag stripe at the bottom, plus 6 floating UI cards (1,580 stat, ♥ Power your career, ✓ Quiz Complete, My Experience form, ⚡ +350 XP, Lift your talent / Find your match).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `GuidelinesSection`        | `src/components/sections/institutionOnboarding/GuidelinesSection.jsx`        | `2971:65353`                                  | **LEFT CONTENT ONLY** (refactored). InstitutionTag eyebrow + Instrument Serif headline + WavyDivider + sub-copy + time badge + 3-step list + CTA. Outer section / bg ellipses / right panel now provided by `InstitutionOnboardingLayout`. Route: `/onboarding/institution/guidelines`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `InstitutionRightPanel`    | `src/components/sections/institutionOnboarding/InstitutionRightPanel.jsx`    | `2971:68519`                                  | Shared brand-green right panel for all institution onboarding steps. 6 decoration layers (ellipse blobs, inverted grid, sparkle stars, snow dots, bg lines) + 3 photo cards. Props: `showWatchTutorial` (bool, default false) — shows `WatchTutorial` widget at `bottom-8 right-8` on form steps (Figma `2972:70224`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `YourInstitutionSection`   | `src/components/sections/institutionOnboarding/YourInstitutionSection.jsx`   | `2972:71456`                                  | Step-1 institution identity form. `Captions` badge + Instrument Serif headline + `WavyDivider` + 5-field form (react-hook-form + zod): 2-col row (legal name + trading name), full-width institution type select, 2-col row (region + cascading district). Opens `IdentityCapturedModal` on success. Route: `/onboarding/institution/your-institution`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `IdentityCapturedModal`    | `src/components/sections/institutionOnboarding/IdentityCapturedModal.jsx`    | `2972:75943`                                  | Success modal after step-1 submit. Fixed overlay + centred card (max-w 600px, rounded-3xl). Header: 62×62 brand-green-light icon box + "Identity Captured!" title. Data table: 5 rows (institution name, trading name, type, region, district). CTA navigates to `/onboarding/institution/contact`. Props: `data` (form values), `onClose`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ContactInfoSection`       | `src/components/sections/institutionOnboarding/ContactInfoSection.jsx`       | `2972:76072`                                  | Step-2 contact details form. `Captions` badge (02 · Contact Details) + headline + `WavyDivider` + 6-field form (react-hook-form + zod): Full Name, Role/Title, Phone (PhoneInput), Email (TextInput w/ DiamondIcon helper), Password, Confirm Password (both PasswordInput). Email helper shows diamond-icon green hint when no error. Confirm field shows "Passwords match" successText. Opens `ContactVerificationModal` on success. Route: `/onboarding/institution/contact`. `✅ VERIFIED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ContactVerificationModal` | `src/components/sections/institutionOnboarding/ContactVerificationModal.jsx` | `2972:76088`                                  | Dual-channel OTP verification modal. Stage machine: 'otp' → 'success'. OTP stage: MessageBubbleIcon header, SMS/Email tab switcher (with per-tab ✓ badges), 6-box `VerificationCode` (splitAfter=3), 10-min countdown, 59s resend delay, auto-switches to email tab after SMS verified. Any complete 6-digit code accepted (mock). Success stage: SuccessCheckIcon, "Contact verified." headline, masked data summary (phone + email), "Continue to Activate Account" CTA → `/onboarding/institution/activate`. Props: `data` (form values), `onClose`. `✅ VERIFIED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `ActivateSection`          | `src/components/sections/institutionOnboarding/ActivateSection.jsx`          | `2973:79786`                                  | Step-3 full-width review + agreements page (no right panel — `InstitutionOnboardingLayout` hides panel for this route). `Captions` badge (03 · Activate Account) + Instrument Serif headline "Review, accept & go live." + `WavyDivider` + review card (Institution Setup 3+2-col fields / Contact Details 2-col; all fields show "—" placeholders until store is wired). 3 agreement `Checkbox` components with inline ReactNode labels (T&C + Privacy links / Data consent "Learn more" link / Authorisation). Red `*` embedded in label JSX. Info notice (bg-[#ebf1ec]). `DisabledCTA` rendered when not all agreed; primary `Button` when all agreed. Opens `TermsAcceptedModal` on CTA click. Route: `/onboarding/institution/activate`. `✅ VERIFIED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `TermsAcceptedModal`       | `src/components/sections/institutionOnboarding/TermsAcceptedModal.jsx`       | `2977:84878`                                  | Post-agreement confirmation modal. Fixed overlay + `border-[3px] border-[#c1d4c4] rounded-[24px]` card. **✕ Close button** `absolute top-5 right-5` (28×28 bg-[#ebf1ec] rounded-[20px]). 64×64 bg-[#e1eae2] icon badge with checkmark. Instrument Serif "Terms Accepted" title. Consent record table (3 rows: T&C / Privacy Policy / Data Consent & Use Policy; bg-[rgba(235,241,236,0.3)] rounded-[16px]). Green progress divider (h-[4px] bg-[#ebf1ec]). "I'm Ready →" primary CTA → `onConfirm` → navigates to `/onboarding/institution/template`. Trust badge. ESC + backdrop dismiss → `onClose`. Props: `onClose`, `onConfirm`. `✅ VERIFIED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `TemplateSection`          | `src/components/sections/institutionOnboarding/TemplateSection.jsx`          | `2977:85777`                                  | Step-4 template preview page (right panel visible). `Captions` badge (04 · Bulk Upload) + Instrument Serif headline "Start with the _template._" + SF Pro Rounded 16px subtitle (verbatim Figma copy, `whitespace-pre-wrap`) + `WavyDivider` + legend row (Required/Optional/Minors only/★ Must fill at least one) + full spreadsheet mock (dark-green title bar, ribbon, formula bar, 12-column header row all bg-[#387440], 5 sample data rows colour-coded by type, 2 empty rows, sheet tabs, tips row with bold/regular mixed typography) + download link row (border-b #387440, shadow) + "I have my file ready →" primary CTA → `/onboarding/institution/upload` + footer login link. Route: `/onboarding/institution/template`. `✅ VERIFIED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `ReportSection`            | `src/components/sections/institutionOnboarding/ReportSection.jsx`            | `3052:74319` (loading) `3065:7371` (complete) | Step-8 two-phase upload feedback (no right panel). **Loading phase:** `Captions` (08 · Processing Report) + headline "Creating _accounts.._" + subtitle + `WavyDivider` + `ConcentricRings` (80×80 decorative rings with inner spinning arc) + 3 `LoadingStatCard`s (flex-1, colored bg, inner white box with pulsing progress bar, gap=28: 821 Accounts To Create / 198 SMS Queued / 26 Skipped) + `ProcessingLog` (scrollable h=130, 5 entries at 900ms each, 6px colored dots) + `InfoBanner` (blue #eaeffb, `InfoCircleIcon` 22×22) + CTAs: Back (128×56) + "View Upload Report" (flex-1, disabled→gray / active→green after animation). **Complete phase:** `Captions` (08 · Upload Complete) + headline "821 students are _live_" + 4 `ReportStatCard`s (194×98, stacked value+sub-label in 177×60 inner box, gap=35: 847/26/198/114) + 2 `DownloadButton`s (40px h) + 2 `ReportCheckCard`s (expandable: "In-file duplicates" 821 rows dark badge / "Invalid phone format" 4 rows red badge; grid table 48px 1fr 90px 1fr 90px; "✓ Created"/"Skipped" status pills; info/more footer variants) + CTAs: "Upload another batch" (220×56) + "Go to Institution Dashboard" (flex-1 green, loading state). Route: `/onboarding/institution/report`. `✅ VERIFIED` |

## Cards

_Empty._ Reusable card components live under `src/components/cards/`.

---

## Conventions

- One component per file, named export default.
- Prefix every component with a `debug(scope)` log on render/mount per [debugging-workflow.md](debugging-workflow.md).
- Co-locate component-specific styles in the same file (Tailwind classes inline). Cross-component styles live in `src/index.css`.
- For forms: use `react-hook-form` + `zod` schema. See [api.md](api.md) for related patterns.
