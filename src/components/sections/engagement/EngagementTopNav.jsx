import HomeLogoLink from '../../shared/HomeLogoLink.jsx';
import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import navHelp from '../../../assets/playful/nav-help.svg';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';

const log = debug('EngagementTopNav');

/*
 * EngagementTopNav — top-of-page header on Profile Engagement / Filling screens.
 * Source: Figma frame 3530:35666 (profile-filling variant).
 *
 *   left  → Ghana Talent Hub logo (mark + stacked wordmark)
 *   right → "Save & Exit" gradient link + circular help icon + user chip
 *           (rounded-rect with gradient avatar + name)
 *
 * Props:
 *   bgClass        — background token class (default 'bg-white'; pass
 *                    'bg-neutral' for the profile-filling chrome variant).
 *   styleSwitch    — optional node (the Focused/Playful <StyleSwitch/>).
 *   showSwitchModes — render the gold "Switch Modes" shelf button (avatar /
 *                     milestone pages only; default false).
 *
 * Figma corrections applied 2026-07-04 (node 3530:35666):
 *   - Horizontal padding: clamp(16px,2vw,32px) → clamp(20px,3.7vw,64px)
 *   - Logo height: clamp(40px,4vw,56px) → clamp(40px,3.82vw,66px)
 *   - Switch Modes: px-3.5 py-2 → px-[28px] py-[10px]; shelf-border style applied
 *   - Save & Exit: plain text → gradient dark-green text + explicit underline
 *   - Help button: rounded-full bg-white → rounded-[18px] bg-[#f8fafc] border-[#e2e8f0]
 *   - User chip: rounded-full pl-1 pr-3 → rounded-[10px] px-[16px] py-[8px] gap-[7px] border-[#c1d4c4]
 *   - User avatar: size-7 rounded-full bg-brand-green → size-[24px] rounded-[12px] gradient bg
 *
 * PLAYFUL (Figma 7873:50662, wiki/playful-mode.md): every Playful value is a
 * `playful:` class, so the Focused look is untouched. Nav = #f8f8f4, 1px #e7e7e7
 * rule + 1px soft shadow, 54px side padding, 24px gaps, 184x48 gold shelf button.
 *
 * RESPONSIVE (wiki/responsive-plan.md §4): >= md is the Figma cluster,
 * unchanged. Below md the row would overflow (logo + Switch Modes + Save &
 * Exit + help + chip ≈ 520px), so it keeps logo · Save & Exit · avatar and
 * moves Help + Switch Modes into a "more" menu.
 */

const HelpIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-.9 1.7" />
    <line x1="12" y1="17" x2="12" y2="17.01" />
  </svg>
);

// Gold "Switch Modes" shelf button — shown on milestone/identity screens to
// let the user toggle between the list and map views of the engagement flow.
const SwitchModesButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-[10px] bg-accent text-accent-light px-[28px] py-[10px] font-sans font-semibold text-[13px] leading-5 tracking-[0.2px] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark drop-shadow-[0px_4px_0px_#967014] playful:h-12 playful:min-w-[184px] playful:justify-center playful:whitespace-nowrap playful:py-[14px] playful:text-[14px] playful:font-bold playful:leading-6 playful:tracking-[0.1px] playful:focus-visible:outline-3 playful:active:translate-y-[2px] playful:active:drop-shadow-[0px_2px_0px_#967014] motion-safe:playful:transition-[transform,filter] motion-safe:playful:duration-100"
    style={{
      // Shelf-border pattern: 1px accent-coloured top, 2px darker sides/bottom.
      borderTop: '1px solid #c8951a',
      borderRight: '2px solid #967014',
      borderBottom: '2px solid #967014',
      borderLeft: '2px solid #967014',
    }}
  >
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 playful:hidden"
    >
      <path d="M2 6h8a4 4 0 0 1 0 8H6" />
      <path d="M5 3L2 6l3 3" />
    </svg>
    {/* Playful icon: Figma exchange-01 (14px), stroked in the label colour */}
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="url(#pf-switch-modes-icon)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="hidden size-[14px] playful:block"
    >
      <defs>
        <linearGradient
          id="pf-switch-modes-icon"
          x1="12.25"
          y1="1.75"
          x2="3.59793"
          y2="13.5993"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FEF1E7" />
          <stop offset="0.201923" stopColor="#E8F2ED" />
        </linearGradient>
      </defs>
      <path d="M9.90307 11.375C11.3177 10.4344 12.25 8.82612 12.25 7C12.25 4.10051 9.89952 1.75 7 1.75C6.59902 1.75 6.20853 1.79495 5.83333 1.8801M11.9583 11.375H9.90307V9.33333M4.08333 2.63407C2.67635 3.57587 1.75 5.17975 1.75 7C1.75 9.89952 4.10051 12.25 7 12.25C7.40098 12.25 7.79147 12.205 8.16667 12.1199M2.04167 2.63407H4.08333V4.66667" />
    </svg>
    <span className="playful:bg-[linear-gradient(189.84deg,#fef1e7_0%,#e8f2ed_20.192%)] playful:bg-clip-text playful:text-transparent">
      Switch Modes
    </span>
  </button>
);

const MoreIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

// Mobile-only overflow menu (< md): carries the actions that don't fit inline.
const MoreMenu = ({ showSwitchModes, onSwitchModes, onHelp, styleSwitch }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const item =
    'flex min-h-11 w-full items-center gap-3 px-4 text-left font-sans text-[14px] font-medium text-content-primary hover:bg-neutral';

  return (
    <div ref={ref} className="relative md:hidden">
      <button
        type="button"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="tap-target inline-flex items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green playful:text-brand-green"
      >
        <MoreIcon className="size-5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-30 w-[220px] overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white py-1 shadow-bottom-300 playful:rounded-[18px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0px_rgba(28,42,33,0.55)]"
        >
          {styleSwitch && (
            <div role="none" className="px-3 py-2">
              {styleSwitch}
            </div>
          )}
          {showSwitchModes && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSwitchModes?.();
              }}
              className={item}
            >
              Switch Modes
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onHelp?.();
            }}
            className={item}
          >
            <HelpIcon className="size-5" />
            Help
          </button>
        </div>
      )}
    </div>
  );
};

const EngagementTopNav = ({
  userName = 'Kofi A.',
  userInitials = 'KA',
  onSaveExit,
  onHelp,
  styleSwitch = null,
  showSwitchModes = false,
  onSwitchModes,
  bgClass = 'bg-white',
  className,
}) => {
  log('render', { playfulSwitch: Boolean(styleSwitch), showSwitchModes });
  return (
    <header
      className={classNames(
        `w-full ${bgClass} border-b border-border-default`,
        'px-4 py-1.5 md:px-[clamp(20px,3.7vw,64px)] md:py-[clamp(10px,1.5vw,16px)]',
        // Playful: 1px #e7e7e7 rule + 1px soft shadow, 54px side padding at 1728 (Figma 7873:50662)
        'playful:border-[#e7e7e7] playful:shadow-[0_1px_1px_rgba(27,36,44,0.12)] playful:md:px-[clamp(20px,3.125vw,54px)]',
        'flex items-center justify-between gap-4',
        className
      )}
    >
      <HomeLogoLink className="inline-flex items-center shrink-0">
        <img
          src={gthLogo}
          alt="Ghana Talent Hub"
          className="block h-9 w-auto select-none md:h-[clamp(40px,3.82vw,66px)]"
          draggable="false"
        />
      </HomeLogoLink>

      <div className="flex items-center gap-2 shrink-0 md:gap-3 playful:md:gap-[clamp(10px,1.39vw,24px)]">
        {/* Appearance switch (Focused / Playful) — inline from md; inside the "…" menu on phones. */}
        {styleSwitch && (
          <span className="hidden md:block">
            {isValidElement(styleSwitch) ? cloneElement(styleSwitch, { inNav: true }) : styleSwitch}
          </span>
        )}
        {showSwitchModes && (
          <span className="hidden md:contents">
            <SwitchModesButton onClick={onSwitchModes} />
          </span>
        )}

        {/* Save & Exit — gradient dark-green text with visible underline */}
        <button
          type="button"
          onClick={onSaveExit}
          className="max-md:inline-flex max-md:min-h-11 max-md:items-center font-sans font-medium text-[14px] leading-5 tracking-[0.2px] underline [text-decoration-color:#2a5730] underline-offset-4 bg-clip-text text-transparent bg-gradient-to-b from-[#142916] to-[#2a5730] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green rounded"
        >
          Save &amp; Exit
        </button>

        {/* Help icon button */}
        <button
          type="button"
          onClick={onHelp}
          aria-label="Help"
          className="hidden size-[36px] items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] md:inline-flex text-content-primary hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <HelpIcon className="size-5 playful:hidden" />
          <img
            src={navHelp}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="hidden size-4 playful:block"
          />
        </button>

        {/* User chip */}
        <div className="inline-flex items-center gap-[7px] rounded-[10px] border border-[#c1d4c4] bg-white px-2 py-[8px] md:px-[16px] playful:bg-[#fffefc]">
          {/* Avatar: gradient dark-green square with initials */}
          <span
            aria-hidden="true"
            className="inline-flex size-[24px] items-center justify-center rounded-[12px] text-white font-sans font-semibold text-[11px] max-lg:text-[12px] tracking-[0.2px] shrink-0 playful:text-[10px] playful:font-bold playful:max-lg:text-[12px]"
            style={{ background: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)' }}
          >
            {userInitials}
          </span>
          <span className="max-md:sr-only font-sans font-semibold text-[14px] leading-5 tracking-[0.2px] text-content-primary playful:font-medium playful:leading-6 playful:text-[#1c2a21]">
            {userName}
          </span>
        </div>

        <MoreMenu
          showSwitchModes={showSwitchModes}
          onSwitchModes={onSwitchModes}
          onHelp={onHelp}
          styleSwitch={styleSwitch}
        />
      </div>
    </header>
  );
};

export default EngagementTopNav;
