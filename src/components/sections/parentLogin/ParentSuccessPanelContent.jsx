import { debug } from '../../../utils/debug.js';

const log = debug('ParentSuccessPanelContent');

/*
 * SuccessPanelContent — centered content for the SIMPLE variant of
 * ParentLoginRightPanel (Figma 2952:96846). Used on the parent sign-up
 * success/done screen and reusable on other "simple panel" screens.
 *
 * Trophy badge + "You're officially part of the journey." headline + subtitle
 * + three translucent stat cards (Steps done / Ward linked / Complete).
 */

// Trophy / award glyph — hand-crafted, 36px white.
const TrophyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path
      d="M11 7h14v6a7 7 0 0 1-14 0V7Z"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M11 9H8a3 3 0 0 0 3 3M25 9h3a3 3 0 0 1-3 3"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 20v4M14 29h8M15 29a3 3 0 0 1 6 0"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Single stat card — Figma 2952:96863 / 96866 / 96869.
const StatCard = ({ value, label }) => (
  <div
    className="flex flex-1 flex-col items-center justify-center gap-[6px] rounded-[10px] py-[14px]"
    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
  >
    <span
      className="font-display"
      style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1 }}
    >
      {value}
    </span>
    <span
      className="text-center font-sans font-bold uppercase"
      style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.5px',
        lineHeight: '13px',
      }}
    >
      {label}
    </span>
  </div>
);

const SuccessPanelContent = () => {
  log('render');
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center text-center">
      {/* Trophy badge — Figma 2952:96855 */}
      <span
        className="flex size-[72px] items-center justify-center rounded-[24px]"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          boxShadow: '0 0 0 12px rgba(255,255,255,0.06)',
        }}
      >
        <TrophyIcon />
      </span>

      {/* Headline — Figma 2952:96861 */}
      <h2
        className="mt-[36px] font-display font-normal"
        style={{ fontSize: 34, color: '#ffffff', letterSpacing: '-0.8px', lineHeight: '35.7px' }}
      >
        You&apos;re officially <span className="italic">part of the journey.</span>
      </h2>

      {/* Subtitle — Figma 2952:96862 */}
      <p
        className="mt-[16px] font-sans"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: '21.45px' }}
      >
        Kofi&apos;s talent story is unfolding. Your account gives you a front-row seat — and a
        safety net if you ever need it.
      </p>

      {/* Stat cards — Figma 2952:96863 / 96866 / 96869 */}
      <div className="mt-[24px] flex w-full items-stretch gap-[10px]">
        <StatCard value="7" label="Steps done" />
        <StatCard value="1" label="Ward linked" />
        <StatCard value="100%" label="Complete" />
      </div>
    </div>
  );
};

export default SuccessPanelContent;
