import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteConsentSection');

/*
 * ParentInviteConsentSection — Consent step of parent onboarding FLOW B
 * (ward-invited). Figma main frame 2864:37752 (left 2864:37757).
 * Route: /onboarding/parent-invited-consent.
 *
 * Three required consent checkbox cards + a compliance note. Card layout +
 * sticky Back / "Activate Parent Account" footer (gated on all 3). The simple
 * "Almost there." capability panel comes from the layout.
 */

const ChevronLeft = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M8 3 4.5 6.5 8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldMini = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M6.5 1 11 2.6v3.4c0 3-2 4.8-4.5 6-2.5-1.2-4.5-3-4.5-6V2.6L6.5 1Z"
      stroke="#142916"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d="M4.6 6.4l1.4 1.4 2.4-2.6"
      stroke="#142916"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── consent checkbox card — Figma 2864:37761 / 37766 / 37773 ────────────────
const ConsentCard = ({ checked, onToggle, children }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-start gap-[12px] rounded-[10px] border bg-white px-[16px] py-[15px] text-left transition-colors"
    style={{
      borderColor: checked ? '#c1d4c4' : '#ccc',
      boxShadow: checked
        ? '0px 4px 0px rgba(193,212,196,0.8)'
        : '0px 4px 0px rgba(191,191,191,0.8)',
    }}
  >
    <span
      className="mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[5px] border-2"
      style={{
        backgroundColor: checked ? '#387440' : '#ffffff',
        borderColor: checked ? '#2a5730' : '#ccc',
      }}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path
            d="M2 5.6l2.2 2.2L9 2.6"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <p className="font-sans" style={{ fontSize: 13, lineHeight: '20.8px' }}>
      {children}
    </p>
  </button>
);

const Strong = ({ children }) => (
  <span className="font-bold" style={{ color: '#111' }}>
    {children}
  </span>
);
const Muted = ({ children }) => <span style={{ color: '#70706e' }}>{children}</span>;
const PolicyLink = ({ children }) => (
  <span className="font-bold" style={{ color: '#387440', borderBottom: '1px solid #c1d4c4' }}>
    {children}
  </span>
);

const ParentInviteConsentSection = () => {
  log('mount');
  const navigate = useNavigate();
  const [consent, setConsent] = useState({ access: false, rights: false, data: false });
  const allAccepted = consent.access && consent.rights && consent.data;

  const toggle = (key) => () => {
    log('consent toggle', key);
    setConsent((c) => ({ ...c, [key]: !c[key] }));
  };

  const handleActivate = () => {
    if (!allAccepted) return;
    // Flow B shares the Flow A "Done" success screen.
    log('activate parent account → parent-done');
    navigate('/onboarding/parent-done');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 px-6 py-10 md:px-14">
        <div className="mx-auto flex w-full max-w-full flex-col gap-[16px]">
          {/* Header (centered) — Figma 2864:37758 / 37759 / 37760 */}
          <div className="flex flex-col items-center gap-[6px] text-center">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 10, color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 6 of 7 — Consent &amp; Rights
            </span>
            <h1
              className="font-display font-normal"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                letterSpacing: '-1.6px',
                color: '#111',
                lineHeight: 1.1,
              }}
            >
              Understand your{' '}
              <span className="italic" style={{ color: '#967014' }}>
                parent rights.
              </span>
            </h1>
            <p
              className="max-w-[380px] font-sans"
              style={{ fontSize: 13, color: '#70706e', lineHeight: '20.8px' }}
            >
              Please read and confirm each statement below. All three are required to activate your
              parent account.
            </p>
          </div>

          {/* Consent cards — Figma 2864:37761 / 37766 / 37773 */}
          <ConsentCard checked={consent.access} onToggle={toggle('access')}>
            <Strong>I understand my ward has immediate platform access.</Strong>
            <Muted>
              {' '}
              Ghana Talent Hub uses an opt-out model. Kofi&apos;s account is already active. I do
              not need to approve their participation — my account gives me visibility and control,
              not a gate.
            </Muted>
          </ConsentCard>

          <ConsentCard checked={consent.rights} onToggle={toggle('rights')}>
            <Strong>I have read and accept the Parent Rights Policy.</Strong>
            <Muted>
              {' '}
              I understand I can review my ward&apos;s profile, flag incorrect information for
              correction, and opt-out my ward at any time. I cannot edit their profile directly —
              only flag for their correction.{' '}
            </Muted>
            <PolicyLink>Read policy</PolicyLink>
          </ConsentCard>

          <ConsentCard checked={consent.data} onToggle={toggle('data')}>
            <Strong>I consent to Ghana Talent Hub processing my data.</Strong>
            <Muted> My personal data will be handled in accordance with the </Muted>
            <PolicyLink>Ghana Data Protection Act (Act 843)</PolicyLink>
            <Muted>
              {' '}
              and used solely to manage my parent account and ward relationship. Data is never
              shared with third parties without my consent.
            </Muted>
          </ConsentCard>

          {/* Compliance note — Figma 2864:37782 */}
          <div
            className="flex w-full items-center gap-[8px] rounded-[10px] border px-[12px] py-[11px]"
            style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
          >
            <ShieldMini />
            <span
              className="font-sans"
              style={{ fontSize: 11, color: '#142916', lineHeight: 'normal' }}
            >
              Data encrypted at rest · Ghana Data Protection Act compliant · No third-party data
              sharing
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky footer — Figma 2864:37786 ── */}
      <div
        className="sticky bottom-0 bg-white px-6 py-[15px] md:px-14"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="mx-auto flex w-full max-w-full items-center gap-[10px]">
          <button
            type="button"
            onClick={() => {
              log('back clicked');
              navigate(-1);
            }}
            className="flex h-[48px] items-center gap-[8px] rounded-[10px] border px-[21px] font-sans font-semibold"
            style={{ borderColor: '#c6c6c3', color: '#111', fontSize: 14 }}
          >
            <ChevronLeft />
            Back
          </button>

          {allAccepted ? (
            <button
              type="button"
              onClick={handleActivate}
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 text-white transition-transform active:translate-y-[2px]"
              style={{
                backgroundColor: '#c8951a',
                borderColor: '#967014',
                boxShadow: '0px 3px 0px #967014',
              }}
            >
              <span className="font-sans font-bold" style={{ fontSize: 15 }}>
                Activate Parent Account
              </span>
              <ArrowRightIcon />
            </button>
          ) : (
            <div
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2"
              style={{ backgroundColor: '#e6e6e3', borderColor: '#d8d8d4', cursor: 'not-allowed' }}
              aria-disabled="true"
            >
              <span className="font-sans font-bold" style={{ fontSize: 15, color: '#a6a6a3' }}>
                Activate Parent Account
              </span>
              <span style={{ color: '#a6a6a3' }}>
                <ArrowRightIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentInviteConsentSection;
