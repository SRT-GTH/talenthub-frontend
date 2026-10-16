import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ApiErrorNote from '../../shared/ApiErrorNote.jsx';
import ParentOptOutModal from './ParentOptOutModal.jsx';
import { getApiErrorMessage } from '../../../services/apiErrors.js';
import { getInvite, loadInvite, useWardDisplay } from '../../../services/parentInvite.api.js';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { PARENT_FLOWS } from '../../../constants/parentFlows.js';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteWelcomeSection');

/*
 * ParentInviteWelcomeSection — welcome screen for parent onboarding FLOW B
 * (ward-invited / pre-filled). Figma main frame 2864:36856 (left content
 * 2864:36858). Route: /onboarding/parent-invited.
 *
 * Shown when the child registered first and pre-filled the parent's contact.
 * The simple gold right panel (ward-invite content) is provided by
 * ParentOnboardingLayout via ParentLoginRightPanel variant="simple".
 *
 * Flow A (self-serve) keeps the existing /onboarding/parent-welcome. See
 * src/constants/parentFlows.js.
 */

// ── hand-crafted glyphs (bounding box + stroke/fill colour only) ────────────
const BellGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M3.5 6.5a4 4 0 0 1 8 0c0 3 1 4 1 4h-10s1-1 1-4Z"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M6.2 13a1.6 1.6 0 0 0 2.6 0"
      stroke="#ffffff"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const InfoGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="5.4" stroke="#967014" strokeWidth="1.2" />
    <path d="M6.5 5.8v3.2" stroke="#967014" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="6.5" cy="3.9" r="0.7" fill="#967014" />
  </svg>
);

const BulletCheck = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M2 5.2l2 2L8 3"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── "How this works" rows — Figma 2864:36878 / 36882 / 36886 ────────────────
const HOW_IT_WORKS = [
  {
    strong: "Your ward's account is already active.",
    rest: ' They have access to career guidance, assessments, and age-appropriate resources right now.',
  },
  {
    strong: 'No action needed unless you have concerns.',
    rest: ' If you want to review their profile or remove their access, create your account below.',
  },
  {
    strong: 'You can opt-out at any time.',
    rest: " If you choose to opt-out, your ward's access is suspended immediately and they're notified.",
  },
];

const ParentInviteWelcomeSection = () => {
  log('mount');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ward = useWardDisplay();
  // 'loading' | 'ready' | 'error'
  const [state, setState] = useState(() => (getInvite()?.invite ? 'ready' : 'loading'));
  const [loadError, setLoadError] = useState('');
  const [optOutOpen, setOptOutOpen] = useState(false);

  // The notice email links here with ?token=<ward token>. Load the invite, then
  // drop the token from the address bar (it stays in this tab's session).
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      if (!getInvite()?.invite) {
        setLoadError('This link is incomplete. Open the link in your notification email again.');
        setState('error');
      }
      return;
    }
    let cancelled = false;
    loadInvite(token)
      .then(() => {
        if (cancelled) return;
        setState('ready');
        setSearchParams({}, { replace: true });
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(getApiErrorMessage(err, 'We could not open this link. Please try again.'));
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ready = state === 'ready';
  const optedOut = ward.status === 'opted_out';

  const handleCreate = () => {
    if (!ready) return;
    log('create my parent account → flow B first step');
    navigate(PARENT_FLOWS.wardInvited.firstStep);
  };

  const handleOptOut = (e) => {
    e.preventDefault();
    if (!ready || optedOut) return;
    log('opt-out instead clicked');
    setOptOutOpen(true);
  };

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto max-md:overflow-visible px-6 md:px-14 py-12 md:py-16 max-md:px-4 max-md:py-4">
      <div className="flex w-full max-w-full flex-col gap-[20px] max-md:gap-3">
        {/* Pre-fill notification banner — Figma 2864:36861 */}
        <div
          className="flex w-full items-center gap-[12px] rounded-[16px] border px-[16px] py-[14px] max-md:gap-2.5 max-md:rounded-[12px] max-md:px-3 max-md:py-2.5"
          style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
        >
          <span
            className="flex size-[32px] shrink-0 items-center justify-center rounded-[6px] max-md:size-7 max-md:shadow-none!"
            style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
          >
            <BellGlyph />
          </span>
          <div className="flex flex-col gap-[3px]">
            <p
              className="font-sans font-bold"
              style={{ fontSize: 13, color: '#2a5730', lineHeight: 'normal' }}
            >
              Your ward registered on Ghana Talent Hub
            </p>
            <p className="font-sans" style={{ fontSize: 12, lineHeight: '18px' }}>
              <span
                className="font-bold"
                style={{ color: '#387440' }}
                data-testid="invite-ward-name"
              >
                {state === 'loading' ? 'Loading…' : ward.fullName}
              </span>
              <span style={{ color: '#70706e' }}>
                {' '}
                {ward.school !== '—' ? `(${ward.school}) ` : ''}
                gave your contact. Create your account to review their profile.
              </span>
            </p>
          </div>
        </div>

        {/* Caption — Figma 2864:36867 */}
        <span
          className="font-sans font-bold uppercase"
          style={{ fontSize: 'var(--fs-10)', color: '#c8951a', letterSpacing: '1.3px' }}
        >
          Parent / Guardian Onboarding
        </span>

        {/* Headline — Figma 2864:36868 */}
        <h1
          className="font-display font-normal max-md:text-[24px]! max-md:leading-tight! max-md:tracking-[-0.5px]!"
          style={{
            fontSize: 'clamp(2.25rem, 3.8vw, 3.25rem)',
            lineHeight: 0.95,
            letterSpacing: '-2px',
            color: '#111',
          }}
        >
          Your ward is already{' '}
          <span className="italic" style={{ color: '#967014' }}>
            on the platform.
          </span>
        </h1>

        {/* Subtitle — Figma 2864:36869 */}
        <p
          className="max-w-[460px] font-sans max-md:leading-5!"
          style={{ fontSize: 14, color: '#70706e', lineHeight: '23.8px' }}
        >
          Ghana Talent Hub uses an opt-out model — your ward has immediate access. Create your
          parent account to review their profile and manage their participation.
        </p>

        {/* How this works — Figma 2864:36870 */}
        <div
          className="flex w-full flex-col gap-[9px] rounded-[16px] border px-[20px] py-[19px] max-md:gap-2 max-md:rounded-[12px] max-md:px-3 max-md:py-3"
          style={{ backgroundColor: '#faf4e8', borderColor: '#eedeb8' }}
        >
          <div className="flex items-center gap-[8px]">
            <InfoGlyph />
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 12, color: '#967014', letterSpacing: '0.7px' }}
            >
              How this works
            </span>
          </div>
          {HOW_IT_WORKS.map((row) => (
            <div key={row.strong} className="flex items-start gap-[9px]">
              <span
                className="mt-[1px] flex size-[20px] shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: '#c8951a' }}
              >
                <BulletCheck />
              </span>
              <p
                className="font-sans max-md:leading-[18px]!"
                style={{ fontSize: 13, lineHeight: '20.15px' }}
              >
                <span className="font-bold" style={{ color: '#111' }}>
                  {row.strong}
                </span>
                <span style={{ color: '#575755' }}>{row.rest}</span>
              </p>
            </div>
          ))}
        </div>

        {state === 'error' && <ApiErrorNote message={loadError} className="max-w-none" />}
        {ready && optedOut && (
          <p
            role="status"
            data-testid="invite-opted-out"
            className="rounded-[10px] border border-[#F2C4BE] bg-[#FDF2F1] px-3 py-2 font-sans text-[13px] leading-5 text-[#8f2a20]"
          >
            {ward.firstName === 'your ward' ? "Your ward's" : ward.possessive} access is paused. You
            can still create your account to review their profile.
          </p>
        )}
        {ready && ward.parentAccountExists && (
          <p className="font-sans text-[12px] leading-5 text-[#70706e]">
            A parent account is already linked to {ward.firstName}. If it&apos;s yours, log in
            below.
          </p>
        )}

        {/* Primary CTA — Figma 2864:36887 (amber) */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!ready}
          data-testid="create-parent-account"
          className="flex w-full items-center justify-center gap-[8px] rounded-[10px] border-2 px-[40px] py-[16px] text-white transition-transform active:translate-y-[2px] max-md:h-11 max-md:px-4 max-md:py-0 max-md:shadow-none! disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: '#c8951a',
            borderColor: '#967014',
            boxShadow: '0px 3px 0px #967014',
          }}
        >
          <span
            className="font-sans font-bold max-md:text-[14px]!"
            style={{ fontSize: 15, lineHeight: 'normal' }}
          >
            Create my parent account
          </span>
          <ArrowRightIcon />
        </button>

        {/* Secondary CTA — Figma 2864:36891 */}
        <button
          type="button"
          onClick={handleOptOut}
          disabled={!ready || optedOut}
          data-testid="open-opt-out"
          className="flex w-full items-center justify-center rounded-[10px] border px-[40px] py-[13px] font-sans font-semibold max-md:h-9 max-md:px-4 max-md:py-0 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: '#c6c6c3', color: '#70706e', fontSize: 14 }}
        >
          I have concerns — opt-out instead
        </button>

        {/* Footer — Figma 2864:36893 */}
        <p
          className="flex items-center justify-center gap-[6px] font-sans"
          style={{ fontSize: 'var(--fs-11)' }}
        >
          <span style={{ color: '#babab7' }}>Already have an account?</span>
          <button
            type="button"
            onClick={() => {
              log('log in clicked');
              navigate('/onboarding/parent-login');
            }}
            className="relative font-bold max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-3 max-md:before:content-['']"
            style={{ color: '#387440', borderBottom: '1px solid #c1d4c4' }}
          >
            Log in
          </button>
        </p>
      </div>
      <ParentOptOutModal isOpen={optOutOpen} onClose={() => setOptOutOpen(false)} />
    </div>
  );
};

export default ParentInviteWelcomeSection;
