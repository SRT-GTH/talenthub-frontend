import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteStepsPanelContent');

/*
 * WardInviteStepsPanelContent — centered content for the SIMPLE right-panel
 * variant on the ward-invited (Flow B) STEP screens. Figma 2864:37143 /
 * 2864:37266.
 *
 * Heading + subtitle + a 6-item step list: completed steps show a check,
 * the current step is highlighted, upcoming steps show their number.
 * Per-step copy is configured in WARD_INVITE_STEP_PANELS below.
 */

const STEPS = [
  'Your identity',
  'Verification',
  'Contact details',
  'Security',
  'Link your ward',
  'Consent',
];

const StepCheck = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M2 5.2l2 2L8 3"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WardInviteStepsPanelContent = ({
  currentStep = 0,
  title = 'Your identity',
  titleAccent = 'builds trust.',
  subtitle = "A complete parent profile helps us communicate with you and keeps your ward's account secure.",
}) => {
  log('render', { currentStep });

  return (
    <div className="flex w-full max-w-[300px] flex-col text-center">
      {/* Heading — Figma 2864:37148 / 37270 */}
      <h2
        className="font-display font-normal"
        style={{ fontSize: 34, color: '#ffffff', letterSpacing: '-0.8px', lineHeight: '36px' }}
      >
        {title} <span className="italic">{titleAccent}</span>
      </h2>

      {/* Subtitle — Figma 2864:37149 / 37271 */}
      <p
        className="mt-[16px] font-sans"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '21.45px' }}
      >
        {subtitle}
      </p>

      {/* Step list */}
      <div className="mt-[24px] flex flex-col gap-[10px] text-left">
        {STEPS.map((label, i) => {
          const completed = i < currentStep;
          const active = i === currentStep;
          return (
            <div
              key={label}
              className="flex items-center gap-[12px] rounded-[10px] px-[13px] py-[10px]"
              style={{
                backgroundColor: active ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="flex size-[22px] shrink-0 items-center justify-center rounded-full font-sans font-bold"
                style={{
                  fontSize: 11,
                  backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.18)',
                  color: active ? '#967014' : 'rgba(255,255,255,0.85)',
                }}
              >
                {completed ? <StepCheck /> : i + 1}
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active
                    ? '#ffffff'
                    : completed
                      ? 'rgba(255,255,255,0.85)'
                      : 'rgba(255,255,255,0.7)',
                  lineHeight: 'normal',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WardInviteStepsPanelContent;
