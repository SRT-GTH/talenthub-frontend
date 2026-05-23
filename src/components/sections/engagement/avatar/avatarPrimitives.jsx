import { classNames } from '../../../../utils/classNames.js';

/*
 * avatarPrimitives — small reusable building blocks for the customiser
 * panels (Style, Skin, Hair, Extras, Outfit). Source: Figma frames.
 *
 * Kept in one file because every panel uses every primitive — splitting
 * would just mean more imports for no organisational win.
 *
 * Exports:
 *   AvatarOptionTile     — squared tile with optional body (silhouette /
 *                          emoji / icon) + label. Click-to-select.
 *   AvatarColorSwatch    — round swatch (skin tone / hair colour / tint).
 *   AvatarCategoryTab    — pill tab in the Style / Skin / Hair / Extras /
 *                          Outfit row.
 *   AvatarStatPill       — small white count pill (e.g. "24 styles").
 *   AvatarSectionHeader  — "Choose a base style" left + meta on the right.
 *   AvatarRangeSlider    — labelled slider (Lightness, Volume).
 *   AvatarHelperTip      — leaf-icon callout ("Real talk:" / "Tips:").
 */

// ---------------------------------------------------------------------------
// AvatarOptionTile
//
// Selected state = brand-green border around the tile (no overlay
// check icon / no badge). The tile body itself is the entire visual —
// children fill the inner rounded box edge-to-edge.
// ---------------------------------------------------------------------------

export const AvatarOptionTile = ({
  selected = false,
  onClick,
  label,
  ariaLabel,
  children,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    aria-label={ariaLabel || label}
    className={classNames(
      'group relative inline-flex flex-col items-stretch text-left',
      // Cap each tile's max-width so the boxes stay snug around their
      // icons instead of stretching to fill the grid column. `mx-auto`
      // centres the capped tile within its (wider) grid cell.
      'w-full max-w-[clamp(60px,7vw,84px)] mx-auto',
      'rounded-xl p-1',
      'transition-[border-color,box-shadow] duration-150 ease-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      // Selected: thin brand-green boundary, no shadow (cleaner look).
      // Unselected: transparent border (no visible boundary) — the image's
      // own background is the only thing showing. Hover surfaces a faint
      // green-tinted border so the tile still reads as interactive.
      selected
        ? 'border-[1.5px] border-brand-green'
        : 'border-[1.5px] border-transparent hover:border-brand-green-light-active',
      className
    )}
  >
    {/* Body — children own the entire inner area. No bg-neutral so the
      image's own background (transparent/white edges of the SVG) is what
      shows around the figure. */}
    <span className="relative block aspect-square w-full overflow-hidden rounded-[10px]">
      {children}
    </span>

    {/* Selected-tile badge — small brand-green check-circle inset
      ~6px inside the top-right corner of the tile so it sits comfortably
      ON the tile, well clear of the rounded border. */}
    {selected && (
      <span
        aria-hidden="true"
        className={classNames(
          'absolute top-1.5 right-1.5 z-10 inline-flex size-3.5 items-center justify-center',
          'rounded-full bg-brand-green text-white'
        )}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-2.5"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )}

    {/* Optional caption below the tile */}
    {label && (
      <span
        className={classNames(
          'mt-1.5 block text-center font-sans text-[11px] leading-[14px] tracking-[0.1px]',
          selected ? 'font-semibold text-content-primary' : 'font-medium text-neutral-darker'
        )}
      >
        {label}
      </span>
    )}
  </button>
);

// ---------------------------------------------------------------------------
// AvatarColorSwatch — round colour chip with optional selected ring
// ---------------------------------------------------------------------------

/*
 * AvatarColorSwatch supports two render modes:
 *   - colour mode (default): pass `color` (CSS colour string). Renders
 *     as a small solid round swatch. Default size: 24px (size-6).
 *   - image mode: pass `image` (imported asset URL). Renders the SVG/PNG
 *     inside a slightly larger round button. Used for the "fashion"
 *     hair tones (bluetone / pinktone / greentone) where the swatch is
 *     a designer ring SVG instead of a flat colour.
 *
 * Default sizes match the Figma reference: colour swatches read as
 * "extra small" dots; image swatches read just a touch larger so the
 * SVG content is legible.
 */
export const AvatarColorSwatch = ({
  color,
  image,
  selected = false,
  onClick,
  ariaLabel,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    aria-label={ariaLabel}
    className={classNames(
      'group relative inline-flex items-center justify-center rounded-full',
      // Image-based swatches render a touch bigger than flat-colour ones.
      image ? 'size-7' : 'size-6',
      'transition-transform duration-150 ease-out hover:scale-105',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      selected ? 'ring-2 ring-brand-green ring-offset-2 ring-offset-white' : '',
      className
    )}
    style={image ? undefined : { backgroundColor: color }}
  >
    {image ? (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="block size-full select-none"
      />
    ) : (
      <span className="sr-only">{ariaLabel}</span>
    )}
  </button>
);

// ---------------------------------------------------------------------------
// AvatarCategoryTab — pill tab in the top tab row
// ---------------------------------------------------------------------------

export const AvatarCategoryTab = ({ active = false, icon, label, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={classNames(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5',
      'font-sans font-semibold text-[13px] leading-5 tracking-[0.1px]',
      'border transition-[background-color,border-color,color] duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active
        ? 'bg-brand-green border-brand-green text-white'
        : 'bg-white border-border-default text-content-primary hover:border-brand-green-light-active',
      className
    )}
  >
    {icon && (
      <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
    )}
    {label}
  </button>
);

// ---------------------------------------------------------------------------
// AvatarStatPill — small white count pill (e.g. "24 styles")
// ---------------------------------------------------------------------------

export const AvatarStatPill = ({ count, label, className }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-1 rounded-pill border border-border-default bg-white px-2.5 py-1',
      'font-sans text-[11px] leading-4 tracking-[0.2px]',
      className
    )}
  >
    <span className="font-semibold text-content-primary">{count}</span>
    <span className="font-medium text-neutral-dark-hover">{label}</span>
  </span>
);

// ---------------------------------------------------------------------------
// AvatarSectionHeader — "Choose a base style" + right-side meta
// ---------------------------------------------------------------------------

export const AvatarSectionHeader = ({ title, meta, className }) => (
  <div className={classNames('flex items-baseline justify-between gap-3', className)}>
    <h3 className="font-sans font-semibold text-[14px] leading-5 tracking-[0.1px] text-content-primary">
      {title}
    </h3>
    {meta && (
      <span className="font-sans text-[11px] leading-4 tracking-[0.2px] text-neutral-dark-hover">
        {meta}
      </span>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// AvatarRangeSlider — labelled slider (Lightness, Volume, etc.)
// ---------------------------------------------------------------------------

export const AvatarRangeSlider = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  rightSlot,
  onChange,
  className,
}) => (
  <div className={classNames('flex flex-col gap-2', className)}>
    <div className="flex items-center justify-between">
      <span className="font-sans font-medium text-[12px] leading-4 tracking-[0.2px] text-neutral-darker">
        {label}
      </span>
      {rightSlot && (
        <span className="font-sans text-[12px] leading-4 text-neutral-dark-hover">{rightSlot}</span>
      )}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className={classNames(
        'h-1.5 w-full appearance-none rounded-pill bg-neutral cursor-pointer',
        // Webkit thumb
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4',
        '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
        '[&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-brand-green',
        '[&::-webkit-slider-thumb]:shadow-bottom-100',
        // Firefox thumb
        '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full',
        '[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2px]',
        '[&::-moz-range-thumb]:border-brand-green'
      )}
      aria-label={label}
    />
  </div>
);

// ---------------------------------------------------------------------------
// AvatarHelperTip — leaf-icon callout ("Real talk:" / "Tips:")
// ---------------------------------------------------------------------------

const LeafIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 13C3 7 7 3 13 3C13 9 9 13 3 13Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M3 13L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const AvatarHelperTip = ({ children, className }) => (
  <div
    className={classNames(
      'flex items-start gap-2 rounded-xl border border-brand-green-light-active bg-brand-green-light/40',
      'px-3 py-2.5',
      className
    )}
  >
    <span aria-hidden="true" className="mt-0.5 inline-flex size-4 shrink-0 text-brand-green">
      <LeafIcon className="size-full" />
    </span>
    <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-content-primary">
      {children}
    </p>
  </div>
);
