import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteConsentPanelContent');

/*
 * WardConsentPanelContent — centered content for the SIMPLE right-panel variant
 * on the Flow B Consent step. Figma 2864:37795.
 *
 * "Almost there." heading + subtitle + a 4-item capability list (all checked):
 * what the parent account lets you do.
 */

const ITEMS = [
  'Review ward profile',
  'Flag corrections',
  'Opt-out at any time',
  'Cannot edit directly — only flag',
];

const Check = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
    <path
      d="M1.5 4.6l1.8 1.8L7.2 2.4"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WardConsentPanelContent = () => {
  log('render');
  return (
    <div className="flex w-full max-w-[300px] flex-col text-center">
      {/* Heading — Figma 2864:37799 */}
      <h2
        className="font-display font-normal"
        style={{ fontSize: 30, color: '#ffffff', letterSpacing: '-0.8px', lineHeight: '33px' }}
      >
        Almost <span className="italic">there.</span>
      </h2>

      {/* Subtitle — Figma 2864:37800 */}
      <p
        className="mt-[16px] font-sans"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '21.45px' }}
      >
        Understanding your rights and responsibilities helps you be the best support for your
        ward&apos;s journey.
      </p>

      {/* Capability list — Figma 2864:37801 … 37820 */}
      <div className="mt-[24px] flex flex-col gap-[8px] text-left">
        {ITEMS.map((label) => (
          <div
            key={label}
            className="flex items-center gap-[12px] rounded-[10px] px-[12px] py-[10px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <span
              className="flex size-[18px] shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              <Check />
            </span>
            <span
              className="font-sans"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 'normal' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardConsentPanelContent;
