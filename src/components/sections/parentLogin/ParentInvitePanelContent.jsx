import { debug } from '../../../utils/debug.js';

const log = debug('ParentInvitePanelContent');

/*
 * WardInvitePanelContent — centered content for the SIMPLE variant of
 * ParentLoginRightPanel on the ward-invited (Flow B) welcome. Figma 2864:36896.
 *
 * Heading + subtitle + two slightly-rotated white info cards
 * (Account type / Ward status).
 */

// Card glyphs — hand-crafted, amber (#c8951a).
const PersonGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="3.8" r="2.1" stroke="#c8951a" strokeWidth="1.2" />
    <path
      d="M2.2 10c0-2.1 1.7-3.5 3.8-3.5S9.8 7.9 9.8 10"
      stroke="#c8951a"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const StatusGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="4.6" stroke="#c8951a" strokeWidth="1.2" />
    <path
      d="M4 6.1l1.4 1.4L8 4.6"
      stroke="#c8951a"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Single info card — Figma 2864:36904 / 36910.
const InfoCard = ({ icon, label, value, rotate, className = '' }) => (
  <div
    className={`w-[210px] rounded-[16px] bg-white px-[18px] py-[16px] text-left ${className}`}
    style={{ transform: `rotate(${rotate})`, boxShadow: '0px 16px 20px rgba(0,0,0,0.18)' }}
  >
    <span
      className="flex size-[26px] items-center justify-center rounded-[6px]"
      style={{ backgroundColor: '#faf4e8' }}
    >
      {icon}
    </span>
    <p
      className="mt-[12px] font-sans font-bold uppercase"
      style={{ fontSize: 9, color: '#70706e', letterSpacing: '0.6px', lineHeight: 'normal' }}
    >
      {label}
    </p>
    <p
      className="mt-[4px] font-sans font-semibold"
      style={{ fontSize: 12, color: '#111', lineHeight: 'normal' }}
    >
      {value}
    </p>
  </div>
);

const WardInvitePanelContent = () => {
  log('render');
  return (
    <div className="flex w-full max-w-[320px] flex-col items-center text-center">
      {/* Heading — Figma 2864:36902 */}
      <h2
        className="font-display font-normal"
        style={{ fontSize: 34, color: '#ffffff', letterSpacing: '-0.8px', lineHeight: '36.72px' }}
      >
        Supporting <span className="italic">Ghanaian talent</span> starts with you.
      </h2>

      {/* Subtitle — Figma 2864:36903 */}
      <p
        className="mt-[16px] font-sans"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '21.45px' }}
      >
        Your ward has already taken the first step. Your account gives you visibility and control
        over their journey.
      </p>

      {/* Info cards — Figma 2864:36904 / 36910 (slightly rotated, overlapping) */}
      <div className="mt-[28px] flex flex-col items-center">
        <InfoCard
          icon={<PersonGlyph />}
          label="Account type"
          value="Parent / Guardian"
          rotate="-3.5deg"
        />
        <InfoCard
          icon={<StatusGlyph />}
          label="Ward status"
          value="Active — Kofi Mensah"
          rotate="3deg"
          className="-mt-[12px]"
        />
      </div>
    </div>
  );
};

export default WardInvitePanelContent;
