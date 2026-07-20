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
};

// Text colour per variant. Primary uses a gradient (handled inline below)
// except in the disabled state where it falls back to white.
const VARIANT_TEXT_CLASSES = {
  primary: 'text-white',
  secondary: 'text-accent-light',
  tertiary: 'text-black',
  'tertiary-subtle': 'text-success-dark',
  'tertiary-cream': 'text-neutral-darker',
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

  const variantConfig = VARIANT_CLASSES[variant];
  const isForcedState = Boolean(state);
  const effectiveDisabled = disabled || state === 'disabled';

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
      {leftIcon && (
        <span className="inline-flex shrink-0 size-5" aria-hidden="true">
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
        <span className="inline-flex shrink-0 size-5" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
