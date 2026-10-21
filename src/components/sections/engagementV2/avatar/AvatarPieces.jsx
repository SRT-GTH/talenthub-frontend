import { classNames } from '../../../../utils/classNames.js';
import { CheckBadgeIcon } from './avatarIcons.jsx';

/*
 * Small building blocks shared by the five Avatar steps (Figma Avatar selection, Focused 8285:3264 / Playful 3218:2745).
 * Geometry is expressed in "design px" through the page unit `--u` (= 1px at the 1728 frame, scaled fluidly, set by AvatarPage);
 * below lg the grids reflow to auto-fill columns so nothing depends on --u.
 */

export const SHADOW_SOFT = 'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]';
export const SHADOW_HARD =
  'playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

/* Pill showing "<n> <label>" (stats row). */
export const StatPill = ({ n, label, gap = 4 }) => (
  <span
    className="inline-flex items-center rounded-full border border-solid border-[#e6e6e6] bg-white px-[11px] py-[6px] font-sans max-lg:px-[10px]"
    style={{ gap }}
  >
    <span className="text-[11px] font-bold leading-[13px] text-[#1c2a21] max-lg:text-[12px]">
      {n}
    </span>
    <span className="text-[10px] font-medium leading-[12px] text-[#70706e] max-lg:text-[12px]">
      {label}
    </span>
  </span>
);

/* "Style / Skin / Hair / Extras / Outfit" pill row. */
export const StepTabs = ({ tabs, active, onSelect }) => (
  <div role="tablist" aria-label="Avatar customiser" className="flex flex-wrap gap-[8px]">
    {tabs.map((t) => {
      const on = t.id === active;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={on}
          onClick={() => onSelect(t.id)}
          className={classNames(
            'inline-flex min-h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:text-[12px]',
            FOCUS,
            on
              ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
              : 'border-[#e1eae2] bg-white text-[#595959] hover:border-[#c1d4c4]'
          )}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);

/* "Choose a base style ............ 10 Options". tone 'muted' (#595959 14/600) or 'strong' (#334155 14/600 ls .26, meta SF 12/400). */
export const SectionHeader = ({ title, meta, tone = 'muted' }) => (
  <div className="flex items-baseline justify-between gap-3">
    <h3
      className={classNames(
        'm-0 font-sans text-[14px] font-semibold max-lg:text-[14px]',
        tone === 'muted'
          ? 'leading-[14px] tracking-[0.2px] text-[#595959]'
          : 'leading-[17px] tracking-[0.26px] text-[#334155]'
      )}
    >
      {title}
    </h3>
    {meta ? (
      <span
        className={classNames(
          'whitespace-nowrap max-lg:text-[12px]',
          tone === 'muted'
            ? 'font-ui text-[11px] font-medium leading-[13px] text-[#bcb7a8]'
            : 'font-sans text-[12px] font-normal leading-[14px] text-[#bcb7a8]'
        )}
      >
        {meta}
      </span>
    ) : null}
  </div>
);

/* Green 18px badge with the white tick on the selected tile (Figma "Image+Background+Shadow"). */
const TileBadge = () => (
  <span
    aria-hidden="true"
    className="absolute right-[6px] top-[6px] inline-grid size-[18px] place-items-center rounded-full bg-[#387440] shadow-[0_1px_4px_rgba(28,42,33,0.2)]"
  >
    <CheckBadgeIcon className="size-[12px] text-white" />
  </span>
);

/* Square option tile (85px; hairstyles, extras, outfits, skin shades). `label` is drawn under the art. */
export const OptionTile = ({
  selected,
  onClick,
  ariaLabel,
  pressedRole = 'radio',
  children,
  label,
  className,
  labelStyle,
}) => (
  <button
    type="button"
    role={pressedRole}
    aria-checked={selected}
    aria-label={ariaLabel}
    onClick={onClick}
    className={classNames(
      'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-solid p-0',
      'aspect-square lg:aspect-auto lg:h-[calc(85*var(--u))] lg:w-[calc(85*var(--u))]',
      FOCUS,
      selected
        ? 'border-[#387440] bg-[#ebf1ec] playful:shadow-[0_3px_0_#387440]'
        : 'border-transparent bg-[#f8fafc] hover:border-[#c1d4c4]',
      className
    )}
  >
    {children}
    {label ? (
      <span
        className={classNames(
          'mt-[4px] block max-w-full whitespace-nowrap font-sans text-[10.5px] leading-[12px] max-lg:text-[12px]',
          selected ? 'font-bold text-[#387440]' : 'font-medium text-[#475569]'
        )}
        style={labelStyle}
      >
        {label}
      </span>
    ) : null}
    {selected ? <TileBadge /> : null}
  </button>
);

/* Art inside a tile, sized from the Figma "SVG" node ([w, h] design px) and clamped on phones. */
export const TileArt = ({ src, art = [48, 40], alt = '' }) => (
  <img
    src={src}
    alt={alt}
    draggable="false"
    className="block object-contain max-lg:max-h-[44px] max-lg:max-w-[48px]"
    style={{
      width: `max(calc(${art[0]} * var(--u)), ${Math.round(art[0] * 0.8)}px)`,
      height: `max(calc(${art[1]} * var(--u)), ${Math.round(art[1] * 0.8)}px)`,
    }}
  />
);

/* "None" tile body (extras): bold grey "None" + the sub-label. */
export const NoneBody = ({ sub, selected }) => (
  <span className="flex flex-col items-center gap-[3px] text-center">
    <span
      className={classNames(
        'font-sans text-[13px] font-bold leading-[16px] max-lg:text-[13px]',
        selected ? 'text-[#387440]' : 'text-[#94a3b8]'
      )}
    >
      None
    </span>
    <span className="font-sans text-[10.5px] font-normal leading-[12px] text-[#475569] max-lg:text-[12px]">
      {sub}
    </span>
  </span>
);

/* Responsive tile grid: 6 fixed columns at lg (Figma pitch), auto-fill on phones. */
export const TileGrid = ({ children, cols = 6, className }) => (
  <div
    className={classNames(
      'grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-[8px] lg:justify-between lg:gap-x-0 lg:gap-y-[7px]',
      cols === 6 && 'lg:grid-cols-[repeat(6,calc(85*var(--u)))]',
      className
    )}
  >
    {children}
  </div>
);

/* Round colour swatch. `size` 38 (selected 41 with an outer ring) / outfit 32. `badge` = small dyed gradient chip bottom-right. */
export const Swatch = ({
  color,
  background,
  selected,
  onClick,
  label,
  size = 38,
  badge,
  border = 3,
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={label}
    onClick={onClick}
    className={classNames(
      'relative shrink-0 cursor-pointer rounded-full border-solid border-white p-0',
      FOCUS
    )}
    style={{
      width: size + (selected ? 3 : 0),
      height: size + (selected ? 3 : 0),
      borderWidth: border,
      background: background ?? color,
      boxShadow: selected
        ? '0 0 0 1px #387440, 0 0 8px rgba(56,116,64,0.5)'
        : '0 0 0 0.5px rgba(28,42,33,0.12)',
    }}
  >
    {badge ? (
      <span
        aria-hidden="true"
        className="absolute -bottom-[3px] -right-[3px] size-[18px] rounded-full border-2 border-solid border-white"
        style={{ background: 'linear-gradient(135deg,#ec4899,#7c3aed)' }}
      />
    ) : null}
  </button>
);
