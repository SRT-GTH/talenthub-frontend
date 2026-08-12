import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Button');

/*
 * Button — TalentHub design-system primitive.
 * Source: Figma frame 50:6295 ("Buttons"). Symbol IDs catalogued in
 * wiki/figma-node-map.md under "Button — internal symbol IDs".
 *
 * Visual signature: a 4px coloured "shelf" beneath the button (faux 3D),
 * achieved via drop-shadow-[0_4px_0_<dark>]. On hover the shelf deepens
 * by 1px; on active the shelf collapses and the button translates down
 * 4px (sinks into the shelf space).
 *
 * Variants:
 *   primary           green shelf, gradient (peach→mint) text
 *   secondary         gold shelf, cream text
 *   tertiary          white face, semi-transparent black shelf, black text
 *   tertiary-subtle   light-green pill (no shelf), success-dark text
 *   tertiary-cream    cream face, semi-transparent black shelf, dark-grey text
 *   gold              bright amber shelf, white text (Figma 5132:62062,
 *                     Escape Room gameplay header's "Save & Exit" — a
 *                     distinct, brighter gold than `secondary`'s muted
 *                     accent-amber token, so it's its own variant rather
 *                     than reusing `secondary` and getting the color wrong)
 *   icon              circular icon-only button (Figma 5132:43389/45079,
 *                     ChatThread input bar — attach/mic/voice buttons).
 *                     No border, no shelf, no text — bypasses BASE_CLASSES
 *                     entirely (see the early-return below) since none of
 *                     the text-button chrome applies to a bare icon glyph.
 *   chip              pill-shaped suggested-reply chip (Figma 5132:43427
 *                     default, 5132:45078 hover — ChatThread welcome/FAQ
 *                     suggested replies). Thin uniform border + regular
 *                     weight text, neither of which fit BASE_CLASSES'
 *                     shelf/bold-border assumptions — its own isolated
 *                     early-return, same reasoning as "icon".
 *   ghost-icon        bare icon-only button, NO background/border chrome at
 *                     all — just the glyph with a colour shift on hover
 *                     (Figma 5132:44983, EngagementTopBar stage-trail
 *                     overflow scroll chevrons). Distinct from "icon"
 *                     (filled #f0f0f0 circle): this is for glyphs that sit
 *                     directly on whatever background is behind them.
 *
 * Sizes (Lg / Md / Sm) per Figma:
 *   lg  px-34 py-16 rounded-14
 *   md  px-28 py-14 rounded-10
 *   sm  px-18 py-12 rounded-10
 *
 * Interactive states are driven by `:hover`, `:active`, `:disabled` pseudo
 * classes for normal usage. The `state` prop (default / hover / active /
 * disabled) is a *showcase-only* override that pins a visual state without
 * user interaction — used by the design-system playground in HomePage.
 */

// "icon" variant — Figma 5132:43389 (default: bg #f0f0f0, grey glyph) and
// 5132:45079 (hover: dark-green diagonal gradient, white glyph). 40px
// circle at size="md" (12px padding around an ~16-18px glyph), matching
// the attach/mic/voice buttons in the Career Buddy input bar exactly.
const ICON_BASE_CLASSES =
  'inline-flex shrink-0 items-center justify-center rounded-full cursor-pointer select-none ' +
  'transition-all duration-300 ease-in ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const ICON_SIZE_CLASSES = {
  // Voice-call mic / hang-up — Figma 5146:76107 / 76109 (75×75, pad 12)
  lg: 'size-[75px] p-3',
  md: 'size-10 p-[10px]',
  sm: 'size-8 p-2',
};

const ICON_HOVER_BG =
  'hover:bg-[linear-gradient(135deg,rgba(20,41,22,0.9)_0%,rgba(42,87,48,0.9)_100%)]';

const ICON_VARIANT_CLASSES = {
  interactive: `bg-[#f0f0f0] text-content-secondary hover:text-white ${ICON_HOVER_BG} disabled:hover:bg-[#f0f0f0] disabled:hover:text-content-secondary`,
  forced: {
    default: 'bg-[#f0f0f0] text-content-secondary',
    hover: `text-white ${ICON_HOVER_BG.replace('hover:', '')}`,
    active: `text-white ${ICON_HOVER_BG.replace('hover:', '')}`,
    disabled: 'bg-[#f0f0f0] text-content-secondary opacity-50',
  },
};

// "chip" variant — Figma 5132:43427 (default: white pill, thin grey border,
// #575755 text) and 5132:45078 (hover: near-vertical dark-green gradient,
// border disappears, text becomes #ebf1ec brand-green-light). size="md"
// (px-16 py-8) is the chat suggested-reply chip; size="sm" (px-16 py-6) is
// the Game Store category filter chip (Figma 5473:48165-48171) — same
// visual language, just 2px shorter.
const CHIP_BASE_CLASSES =
  'inline-flex items-center justify-center rounded-[16px] border-[0.8px] border-solid ' +
  'font-sans font-normal text-[16px] leading-normal whitespace-nowrap ' +
  'cursor-pointer select-none transition-all duration-300 ease-in ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const CHIP_SIZE_CLASSES = {
  md: 'px-[16px] py-[8px]',
  // Game Store category filter chips (Figma 5473:48165-48171) — same pill,
  // border, and gradient as the "md" chat suggested-reply chip, just 2px
  // shorter vertically.
  sm: 'px-[16px] py-[6px]',
};

const CHIP_HOVER_BG =
  'hover:bg-[linear-gradient(173.211deg,rgba(20,41,22,0.9)_0%,rgba(42,87,48,0.9)_100%)]';

const CHIP_VARIANT_CLASSES = {
  interactive:
    `bg-white border-[#e5e7eb] text-[#575755] hover:border-transparent hover:text-[#ebf1ec] ${CHIP_HOVER_BG} ` +
    'disabled:hover:bg-white disabled:hover:text-[#575755] disabled:hover:border-[#e5e7eb]',
  forced: {
    default: 'bg-white border-[#e5e7eb] text-[#575755]',
    hover: `border-transparent text-[#ebf1ec] ${CHIP_HOVER_BG.replace('hover:', '')}`,
    active: `border-transparent text-[#ebf1ec] ${CHIP_HOVER_BG.replace('hover:', '')}`,
    disabled: 'bg-white border-[#e5e7eb] text-[#575755] opacity-50',
  },
};

// "ghost-icon" variant — Figma 5132:44983/44960 (stage-trail overflow
// chevrons). No fill, no border, no shelf: default neutral-dark glyph,
// darkening to Figma's documented Neutrals/White/Dark active colour
// (#737373) on hover/active.
const GHOST_ICON_BASE_CLASSES =
  'inline-flex shrink-0 items-center justify-center rounded-full bg-transparent cursor-pointer select-none ' +
  'transition-colors duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const GHOST_ICON_SIZE_CLASSES = {
  md: 'size-9 p-2',
  sm: 'size-7 p-1.5',
};

const GHOST_ICON_VARIANT_CLASSES = {
  interactive:
    'text-neutral-dark hover:text-[#737373] active:text-[#737373] ' +
    'disabled:hover:text-neutral-dark disabled:active:text-neutral-dark',
  forced: {
    default: 'text-neutral-dark',
    hover: 'text-[#737373]',
    active: 'text-[#737373]',
    disabled: 'text-neutral-dark opacity-50',
  },
};

// Primary text gradient — Figma 188.377deg peach→mint, stops at 0% / 20.192%.
const PRIMARY_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

const SIZE_CLASSES = {
  lg: 'px-[34px] py-[16px] rounded-[14px]',
  md: 'px-[28px] py-[14px] rounded-[10px]',
  sm: 'px-[18px] py-[12px] rounded-[10px]',
  xs: 'px-[14px] py-[6px] rounded-[8px]',
};

// Tailwind v4 JIT requires literal class names in source — no runtime
// concatenation of `hover:` prefixes. Each variant ships two bundles:
//   interactive — default + hover/active/disabled pseudos for real usage
//   forced[state] — literal classes for showcase-pinned states
const VARIANT_CLASSES = {
  primary: {
    interactive:
      'bg-brand-green border-brand-green-dark drop-shadow-[0_4px_0_#224626] ' +
      'hover:border-brand-green-active hover:drop-shadow-[0_5px_0_#224626] ' +
      'active:bg-brand-green-active active:border-brand-green-dark-hover active:translate-y-1 active:drop-shadow-none ' +
      'disabled:bg-[#bfbfbf] disabled:border-[#cccccc] disabled:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:hover:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:active:translate-y-0 disabled:active:bg-[#bfbfbf] disabled:active:border-[#cccccc] ' +
      'disabled:active:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    forced: {
      default: 'bg-brand-green border-brand-green-dark drop-shadow-[0_4px_0_#224626]',
      hover: 'bg-brand-green border-brand-green-active drop-shadow-[0_5px_0_#224626]',
      active: 'bg-brand-green-active border-brand-green-dark-hover translate-y-1',
      disabled: 'bg-[#bfbfbf] border-[#cccccc] drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    },
  },
  secondary: {
    interactive:
      'bg-accent border-accent-dark drop-shadow-[0_4px_0_#967014] ' +
      'hover:bg-accent-hover hover:drop-shadow-[0_5px_0_#967014] ' +
      'active:bg-accent-active active:translate-y-1 active:drop-shadow-none ' +
      'disabled:bg-[#bfbfbf] disabled:border-[#cccccc] disabled:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:hover:bg-[#bfbfbf] disabled:hover:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:active:translate-y-0 disabled:active:bg-[#bfbfbf] ' +
      'disabled:active:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    forced: {
      default: 'bg-accent border-accent-dark drop-shadow-[0_4px_0_#967014]',
      hover: 'bg-accent-hover border-accent-dark drop-shadow-[0_5px_0_#967014]',
      active: 'bg-accent-active border-accent-dark translate-y-1',
      disabled: 'bg-[#bfbfbf] border-[#cccccc] drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    },
  },
  tertiary: {
    interactive:
      'bg-white border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] ' +
      'hover:drop-shadow-[0_5px_0_rgba(17,17,17,0.25)] ' +
      'active:translate-y-1 active:drop-shadow-none ' +
      'disabled:opacity-50 disabled:hover:drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] ' +
      'disabled:active:translate-y-0 disabled:active:drop-shadow-[0_4px_0_rgba(17,17,17,0.25)]',
    forced: {
      default: 'bg-white border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)]',
      hover: 'bg-white border-black/30 drop-shadow-[0_5px_0_rgba(17,17,17,0.25)]',
      active: 'bg-white border-black/30 translate-y-1',
      disabled: 'bg-white border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] opacity-50',
    },
  },
  'tertiary-subtle': {
    interactive:
      'bg-brand-green-light-hover border-brand-green-light-active shadow-bottom-100 ' +
      'hover:bg-brand-green-light ' +
      'active:translate-y-px active:shadow-none ' +
      'disabled:opacity-50 disabled:active:translate-y-0',
    forced: {
      default: 'bg-brand-green-light-hover border-brand-green-light-active shadow-bottom-100',
      hover: 'bg-brand-green-light border-brand-green-light-active shadow-bottom-100',
      active: 'bg-brand-green-light-hover border-brand-green-light-active translate-y-px',
      disabled:
        'bg-brand-green-light-hover border-brand-green-light-active shadow-bottom-100 opacity-50',
    },
  },
  'tertiary-cream': {
    interactive:
      'bg-accent-light border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] ' +
      'hover:drop-shadow-[0_5px_0_rgba(17,17,17,0.25)] ' +
      'active:translate-y-1 active:drop-shadow-none ' +
      'disabled:opacity-50 disabled:hover:drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] ' +
      'disabled:active:translate-y-0 disabled:active:drop-shadow-[0_4px_0_rgba(17,17,17,0.25)]',
    forced: {
      default: 'bg-accent-light border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)]',
      hover: 'bg-accent-light border-black/30 drop-shadow-[0_5px_0_rgba(17,17,17,0.25)]',
      active: 'bg-accent-light border-black/30 translate-y-1',
      disabled:
        'bg-accent-light border-black/30 drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] opacity-50',
    },
  },
  gold: {
    interactive:
      'bg-[#f0b429] border-[#c9920a] drop-shadow-[0_4px_0_#96700f] ' +
      'hover:bg-[#e6a91f] hover:drop-shadow-[0_5px_0_#96700f] ' +
      'active:bg-[#d99e15] active:translate-y-1 active:drop-shadow-none ' +
      'disabled:bg-[#bfbfbf] disabled:border-[#cccccc] disabled:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:hover:bg-[#bfbfbf] disabled:hover:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)] ' +
      'disabled:active:translate-y-0 disabled:active:bg-[#bfbfbf] ' +
      'disabled:active:drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    forced: {
      default: 'bg-[#f0b429] border-[#c9920a] drop-shadow-[0_4px_0_#96700f]',
      hover: 'bg-[#e6a91f] border-[#c9920a] drop-shadow-[0_5px_0_#96700f]',
      active: 'bg-[#d99e15] border-[#c9920a] translate-y-1',
      disabled: 'bg-[#bfbfbf] border-[#cccccc] drop-shadow-[0_4px_0_rgba(191,191,191,0.8)]',
    },
  },
};

// Text colour per variant. Primary uses a gradient (handled inline below)
// except in the disabled state where it falls back to white.
const VARIANT_TEXT_CLASSES = {
  primary: 'text-white',
  secondary: 'text-accent-light',
  tertiary: 'text-black',
  'tertiary-subtle': 'text-success-dark',
  'tertiary-cream': 'text-neutral-darker',
  gold: 'text-white',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 ' +
  'border-t border-l-2 border-r-2 border-b-2 border-solid ' +
  'font-sans font-bold text-[16px] leading-[24px] tracking-[0.1px] ' +
  'whitespace-nowrap select-none cursor-pointer ' +
  'transition-[transform,filter,background-color,border-color] duration-100 ease-out ' +
  'disabled:cursor-not-allowed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const Button = ({
  variant = 'primary',
  size = 'lg',
  type = 'button',
  disabled = false,
  state,
  leftIcon,
  rightIcon,
  className,
  children,
  ref,
  ...rest
}) => {
  log('render', { variant, size, state, disabled });

  const isForcedState = Boolean(state);
  const effectiveDisabled = disabled || state === 'disabled';

  // "icon" bypasses the text-button chrome entirely (no border, no shelf,
  // no bold font) — a bare circular glyph button, styled from its own
  // isolated class maps so every other variant's classes stay untouched.
  if (variant === 'icon') {
    const iconVariantClasses = isForcedState
      ? ICON_VARIANT_CLASSES.forced[state]
      : ICON_VARIANT_CLASSES.interactive;
    return (
      <button
        ref={ref}
        type={type}
        disabled={effectiveDisabled}
        className={classNames(
          ICON_BASE_CLASSES,
          ICON_SIZE_CLASSES[size] ?? ICON_SIZE_CLASSES.md,
          iconVariantClasses,
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }

  // "ghost-icon" is the barest of all three isolated variants — no fill, no
  // border, just a glyph that shifts colour on hover/active.
  if (variant === 'ghost-icon') {
    const ghostIconVariantClasses = isForcedState
      ? GHOST_ICON_VARIANT_CLASSES.forced[state]
      : GHOST_ICON_VARIANT_CLASSES.interactive;
    return (
      <button
        ref={ref}
        type={type}
        disabled={effectiveDisabled}
        className={classNames(
          GHOST_ICON_BASE_CLASSES,
          GHOST_ICON_SIZE_CLASSES[size] ?? GHOST_ICON_SIZE_CLASSES.md,
          ghostIconVariantClasses,
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }

  // "chip" bypasses the text-button chrome too (thin uniform border, regular
  // weight — not the bold multi-side-border shelf look every other variant
  // shares), same isolation strategy as "icon" above.
  if (variant === 'chip') {
    const chipVariantClasses = isForcedState
      ? CHIP_VARIANT_CLASSES.forced[state]
      : CHIP_VARIANT_CLASSES.interactive;
    return (
      <button
        ref={ref}
        type={type}
        disabled={effectiveDisabled}
        className={classNames(
          CHIP_BASE_CLASSES,
          CHIP_SIZE_CLASSES[size] ?? CHIP_SIZE_CLASSES.md,
          chipVariantClasses,
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }

  const variantConfig = VARIANT_CLASSES[variant];
  const variantClasses = isForcedState ? variantConfig.forced[state] : variantConfig.interactive;

  // Primary uses a gradient text fill except when disabled (falls back to white).
  const usePrimaryGradient = variant === 'primary' && !effectiveDisabled;
  const textColourClass = usePrimaryGradient ? null : VARIANT_TEXT_CLASSES[variant];

  return (
    <button
      ref={ref}
      type={type}
      disabled={effectiveDisabled}
      className={classNames(
        BASE_CLASSES,
        SIZE_CLASSES[size],
        variantClasses,
        textColourClass,
        className
      )}
      {...rest}
    >
      {/*
       * Icon slots are always a fixed 20×20 (size-5) box — Figma CTA arrows
       * are 20×20. Force child SVGs to `size-full` so callers can't shrink
       * them with `size-[14px]`. Primary labels use a gradient text fill on
       * a sibling span, so the button itself has no `text-*` colour for
       * `currentColor` stroke icons to inherit — pin near-white (#FEFEFE,
       * same as ArrowRightIcon's fill) on primary icon slots.
       */}
      {leftIcon && (
        <span
          className={classNames(
            'inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-full',
            usePrimaryGradient && 'text-[#FEFEFE]'
          )}
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      <span
        className={usePrimaryGradient ? 'bg-clip-text text-transparent' : undefined}
        style={usePrimaryGradient ? PRIMARY_GRADIENT : undefined}
      >
        {children}
      </span>
      {rightIcon && (
        <span
          className={classNames(
            'inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-full',
            usePrimaryGradient && 'text-[#FEFEFE]'
          )}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
