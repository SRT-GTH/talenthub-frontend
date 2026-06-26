import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../ui/form/TextInput.jsx';
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteSecuritySection');

/*
 * ParentInviteSecuritySection — Security step of parent onboarding FLOW B
 * (ward-invited). Figma main frame 2864:37481 (left 2864:37486).
 * Route: /onboarding/parent-invited-security.
 *
 * Password + Confirm Password, with a live 4-segment strength meter and a
 * 4-rule requirement checklist. Card layout + sticky Back/Continue footer;
 * simple step-list panel from the layout.
 */

// ── password rules (verbatim labels from Figma 2864:37500 … 37512) ──────────
const RULES = [
  { key: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'num', label: 'One number', test: (v) => /[0-9]/.test(v) },
];

const STRENGTH_LABELS = ['Enter a password', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#babab7', '#c0392b', '#c8951a', '#c8951a', '#387440'];

// ── glyphs ──────────────────────────────────────────────────────────────────
const RuleCheck = ({ met }) => (
  <span
    className="flex size-[14px] shrink-0 items-center justify-center rounded-full"
    style={{ backgroundColor: met ? '#387440' : '#e6e6e3' }}
  >
    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
      <path
        d="M1 3.6l1.4 1.4L6 1.4"
        stroke={met ? '#ffffff' : '#babab7'}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

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

const EyeToggle = ({ show, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={show ? 'Hide password' : 'Show password'}
    className="text-neutral-dark-active"
  >
    {show ? <EyeOffIcon /> : <EyeIcon />}
  </button>
);

const FieldLabel = ({ children, required }) => (
  <span
    className="mb-[8px] flex items-center gap-[3px] font-sans font-bold"
    style={{ fontSize: 13, color: '#111' }}
  >
    {children}
    {required && <span style={{ color: '#c0392b' }}>*</span>}
  </span>
);

// ── main component ──────────────────────────────────────────────────────────
const ParentInviteSecuritySection = () => {
  log('mount');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const met = RULES.map((r) => r.test(password));
  const strength = met.filter(Boolean).length; // 0..4
  const allMet = strength === RULES.length;
  const matches = confirm.length > 0 && confirm === password;
  const canContinue = allMet && matches;

  const handleContinue = () => {
    if (!canContinue) return;
    log('continue → parent-invited-link-ward', { strength });
    navigate('/onboarding/parent-invited-link-ward');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 px-6 py-10 md:px-14">
        <div className="mx-auto flex w-full max-w-full flex-col gap-[20px]">
          {/* Header (centered) — Figma 2864:37487 / 37488 / 37489 */}
          <div className="flex flex-col items-center gap-[6px] text-center">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 10, color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 4 of 7 — Account Security
            </span>
            <h1
              className="font-display font-normal"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                letterSpacing: '-1px',
                color: '#111',
                lineHeight: 1.1,
              }}
            >
              Create a strong{' '}
              <span className="italic" style={{ color: '#c8951a' }}>
                password.
              </span>
            </h1>
            <p
              className="max-w-[440px] font-sans"
              style={{ fontSize: 14, color: '#70706e', lineHeight: '23px' }}
            >
              This password protects your parent account. Use something only you would know.
            </p>
          </div>

          {/* Password — Figma 2864:37490 */}
          <div className="flex flex-col">
            <FieldLabel required>Password</FieldLabel>
            <TextInput
              type={showPw ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={<EyeToggle show={showPw} onClick={() => setShowPw((s) => !s)} />}
            />

            {/* Strength meter — Figma 2864:37492 … 37495 */}
            <div className="mt-[14px] flex gap-[4px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-[4px] flex-1 rounded-full"
                  style={{ backgroundColor: i < strength ? STRENGTH_COLORS[strength] : '#e6e6e3' }}
                />
              ))}
            </div>
            <span
              className="mt-[8px] font-sans font-semibold"
              style={{ fontSize: 12, color: STRENGTH_COLORS[strength] }}
            >
              {STRENGTH_LABELS[strength]}
            </span>

            {/* Requirements — Figma 2864:37497 … 37512 */}
            <div className="mt-[10px] flex flex-col gap-[4px]">
              {RULES.map((rule, i) => (
                <span key={rule.key} className="flex items-center gap-[8px]">
                  <RuleCheck met={met[i]} />
                  <span
                    className="font-sans"
                    style={{ fontSize: 12, color: met[i] ? '#387440' : '#70706e' }}
                  >
                    {rule.label}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Confirm Password — Figma 2864:37519 */}
          <div className="flex flex-col">
            <FieldLabel required>Confirm Password</FieldLabel>
            <TextInput
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={confirm.length > 0 && !matches ? 'Passwords do not match' : undefined}
              rightIcon={<EyeToggle show={showConfirm} onClick={() => setShowConfirm((s) => !s)} />}
            />
          </div>
        </div>
      </div>

      {/* ── Sticky footer — Figma 2864:37527 ── */}
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

          {canContinue ? (
            <button
              type="button"
              onClick={handleContinue}
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 text-white transition-transform active:translate-y-[2px]"
              style={{
                backgroundColor: '#c8951a',
                borderColor: '#967014',
                boxShadow: '0px 3px 0px #967014',
              }}
            >
              <span className="font-sans font-bold" style={{ fontSize: 15 }}>
                Continue
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
                Continue
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

export default ParentInviteSecuritySection;
