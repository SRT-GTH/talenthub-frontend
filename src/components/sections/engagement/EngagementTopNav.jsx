import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';

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
    className="inline-flex items-center gap-2 rounded-[10px] bg-accent text-accent-light px-[28px] py-[10px] font-sans font-semibold text-[13px] leading-5 tracking-[0.2px] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark drop-shadow-[0px_4px_0px_#967014]"
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
      className="size-4"
    >
      <path d="M2 6h8a4 4 0 0 1 0 8H6" />
      <path d="M5 3L2 6l3 3" />
    </svg>
    Switch Modes
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
const MoreMenu = ({ showSwitchModes, onSwitchModes, onHelp }) => {
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
        className="tap-target inline-flex items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <MoreIcon className="size-5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-30 w-[220px] overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white py-1 shadow-bottom-300"
        >
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
  showSwitchModes = false,
  onSwitchModes,
  bgClass = 'bg-white',
  className,
}) => (
  <header
    className={classNames(
      `w-full ${bgClass} border-b border-border-default`,
      'px-4 py-1.5 md:px-[clamp(20px,3.7vw,64px)] md:py-[clamp(10px,1.5vw,16px)]',
      'flex items-center justify-between gap-4',
      className
    )}
  >
    <Link to={'/'} aria-label="Ghana Talent Hub home" className="inline-flex items-center shrink-0">
      <img
        src={gthLogo}
        alt="Ghana Talent Hub"
        className="block h-9 w-auto select-none md:h-[clamp(40px,3.82vw,66px)]"
        draggable="false"
      />
    </Link>

    <div className="flex items-center gap-2 shrink-0 md:gap-3">
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
        <HelpIcon className="size-5" />
      </button>

      {/* User chip */}
      <div className="inline-flex items-center gap-[7px] rounded-[10px] border border-[#c1d4c4] bg-white px-2 py-[8px] md:px-[16px]">
        {/* Avatar: gradient dark-green square with initials */}
        <span
          aria-hidden="true"
          className="inline-flex size-[24px] items-center justify-center rounded-[12px] text-white font-sans font-semibold text-[11px] max-lg:text-[12px] tracking-[0.2px] shrink-0"
          style={{ background: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)' }}
        >
          {userInitials}
        </span>
        <span className="max-md:sr-only font-sans font-semibold text-[14px] leading-5 tracking-[0.2px] text-content-primary">
          {userName}
        </span>
      </div>

      <MoreMenu showSwitchModes={showSwitchModes} onSwitchModes={onSwitchModes} onHelp={onHelp} />
    </div>
  </header>
);

export default EngagementTopNav;
