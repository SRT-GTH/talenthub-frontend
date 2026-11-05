import { useNavigate } from 'react-router-dom';
import PreviewField from '../../ui/PreviewField.jsx';
import ClampText from '../../ui/ClampText.jsx';
import ParentDefRows from './ParentDefRows.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

import { useWardDisplay } from '../../../services/parentInvite.api.js';

const log = debug('ParentInviteLinkWardSection');

/*
 * ParentInviteLinkWardSection — Link Ward step of parent onboarding FLOW B
 * (ward-invited). Figma main frame 2864:37620 (left 2864:37625).
 * Route: /onboarding/parent-invited-link-ward.
 *
 * The ward was auto-linked ("Path A"). Green confirmation banner, ward card,
 * detail grid (shared PreviewField), opt-out reminder, sticky Back / Confirm.
 * The simple "You → Kofi" link panel comes from the layout.
 */

// ── glyphs ──────────────────────────────────────────────────────────────────
const Check = ({ size = 24, color = '#ffffff', stroke = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonMini = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="3.6" r="1.9" stroke="currentColor" strokeWidth="1" />
    <path
      d="M2 9.2c0-1.9 1.6-3.1 3.5-3.1S9 7.3 9 9.2"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const CapMini = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path
      d="M5.5 2 10 4 5.5 6 1 4l4.5-2Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d="M3 5v2.2c0 .7 1.1 1.3 2.5 1.3S8 7.9 8 7.2V5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
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

const BannerCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M3.5 9.5l4 4 7-8.5"
      stroke="#ffffff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoMini = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="5.5" r="4.6" stroke="#b48617" strokeWidth="1" />
    <path d="M5.5 5v2.6" stroke="#b48617" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="5.5" cy="3.4" r="0.6" fill="#b48617" />
  </svg>
);

// ── main component ──────────────────────────────────────────────────────────
const ParentInviteLinkWardSection = () => {
  log('mount');
  const navigate = useNavigate();
  const ward = useWardDisplay();

  const handleConfirm = () => {
    log('confirm & continue → parent-invited-consent');
    navigate('/onboarding/parent-invited-consent');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 px-6 py-10 md:px-14 max-md:px-4 max-md:py-4">
        <div className="mx-auto flex w-full max-w-full flex-col gap-[16px] max-md:gap-3">
          {/* Header (centered) — Figma 2864:37626 / 37627 / 37628 */}
          <div className="flex flex-col items-center gap-[6px] text-center max-md:items-start max-md:gap-1 max-md:text-left">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 'var(--fs-10)', color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 5 of 7 — Link Ward
            </span>
            <h1
              className="font-heading font-semibold max-md:text-[24px]! max-md:leading-tight! max-md:tracking-[-0.5px]!"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                letterSpacing: '-0.02em',
                color: '#111',
                lineHeight: 1.2,
              }}
            >
              Your ward is <span style={{ color: '#c8951a' }}>already linked.</span>
            </h1>
            <p
              className="max-w-[470px] font-sans max-md:leading-5!"
              style={{ fontSize: 14, color: '#70706e', lineHeight: '23px' }}
            >
              Because your ward provided your contact details during their registration, the link
              was created automatically. Please confirm the details below.
            </p>
          </div>

          {/* Auto-link banner — Figma 2864:37629 */}
          <div
            className="flex w-full items-center gap-[12px] rounded-[16px] px-[17px] py-[14px] max-md:gap-2.5 max-md:rounded-[12px] max-md:px-3 max-md:py-2.5"
            style={{ backgroundColor: 'rgba(235,241,236,0.6)', border: '1px solid #c1d4c4' }}
          >
            <span
              className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] max-md:size-8 max-md:shadow-none!"
              style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
            >
              <BannerCheck />
            </span>
            <div className="flex flex-col gap-[3px]">
              <p
                className="font-sans font-bold max-md:text-[13px]!"
                style={{ fontSize: 14, color: '#2a5730', lineHeight: 'normal' }}
              >
                Ward found from your link
              </p>
              <ClampText
                lines={2}
                className="font-sans text-[12px] font-medium leading-[18px] text-[#2a5730] opacity-85"
                buttonClassName="text-[12px] font-semibold text-[#2a5730]"
              >
                Your link comes from the contact {ward.firstName} gave. The link is made when you
                activate your account.
              </ClampText>
            </div>
          </div>

          {/* Ward card — Figma 2864:37635 */}
          <div
            className="flex w-full items-center justify-between rounded-[16px] border bg-white px-[22px] max-md:min-h-0! max-md:gap-3 max-md:rounded-none max-md:border-x-0 max-md:bg-transparent max-md:px-0 max-md:py-2"
            style={{ minHeight: 92, borderColor: '#c1d4c4' }}
          >
            <div className="flex min-w-0 items-center gap-[14px] max-md:gap-3">
              <span
                className="flex size-[52px] shrink-0 items-center justify-center rounded-full max-md:size-10 max-md:shadow-none!"
                style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
              >
                <Check size={24} />
              </span>
              <div className="flex flex-col gap-[4px]">
                <p
                  className="font-sans font-bold"
                  style={{ fontSize: 16, color: '#111', lineHeight: '20px' }}
                >
                  <span data-testid="link-ward-name">{ward.fullName}</span>
                </p>
                <div
                  className="flex flex-wrap items-center gap-x-[6px] gap-y-0.5"
                  style={{ color: '#70706e' }}
                >
                  <PersonMini />
                  <span className="font-sans font-semibold" style={{ fontSize: 'var(--fs-11)' }}>
                    Student
                  </span>
                  <CapMini />
                  <span className="font-sans font-semibold" style={{ fontSize: 'var(--fs-11)' }}>
                    {ward.school}
                  </span>
                </div>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-[6px]">
              <span className="size-[7px] rounded-full" style={{ backgroundColor: '#1d7c4d' }} />
              <span
                className="font-sans font-bold"
                style={{ fontSize: 'var(--fs-11)', color: ward.statusColor }}
              >
                {ward.statusLabel}
              </span>
            </span>
          </div>

          {/* Detail grid — Figma 2864:37652 (shared PreviewField) */}
          <ParentDefRows
            rows={[
              { label: 'School', value: ward.school },
              { label: 'Programme', value: ward.programme },
              { label: 'Account created', value: ward.createdLabel },
              { label: 'Account status', value: ward.statusLabel, valueColor: ward.statusColor },
            ]}
          />
          <div className="grid grid-cols-1 gap-[10px] max-md:hidden sm:grid-cols-2">
            <PreviewField label="School" value={ward.school} valueColor="#111" />
            <PreviewField label="Programme" value={ward.programme} valueColor="#111" />
            <PreviewField label="Account created" value={ward.createdLabel} valueColor="#111" />
            <PreviewField
              label="Account status"
              value={ward.statusLabel}
              valueColor={ward.statusColor}
            />
          </div>

          {/* Opt-out reminder — Figma 2864:37665 */}
          <div
            className="flex w-full items-start gap-[10px] rounded-[12px] border px-[15px] py-[13px] max-md:px-3 max-md:py-2.5"
            style={{ backgroundColor: 'rgba(250,244,232,0.4)', borderColor: '#eedeb8' }}
          >
            <span className="mt-[2px] shrink-0">
              <InfoMini />
            </span>
            <div className="min-w-0 flex-1">
              <ClampText
                lines={3}
                className="font-sans text-[12px] leading-[18px]"
                buttonClassName="text-[12px] font-semibold text-[#b48617]"
              >
                <span className="font-bold" style={{ color: '#b48617' }}>
                  You can opt-out at any time from your dashboard
                </span>
                <span style={{ color: '#b48617', opacity: 0.85 }}>
                  {' '}
                  If you have concerns about {ward.possessive} participation, you can remove their
                  access after completing setup. Their data is preserved and the account can be
                  reactivated.
                </span>
              </ClampText>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky footer — Figma 2864:37672 ── */}
      <div
        className="sticky bottom-0 z-20 bg-white px-6 py-[15px] max-md:px-4 max-md:py-2 max-md:pb-[max(8px,env(safe-area-inset-bottom))] md:px-14"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="mx-auto flex w-full max-w-full items-center gap-[10px]">
          <button
            type="button"
            onClick={() => {
              log('back clicked');
              navigate(-1);
            }}
            aria-label="Back"
            className="flex h-[48px] items-center gap-[8px] rounded-[10px] border px-[21px] font-sans font-semibold max-md:h-11 max-md:w-11 max-md:shrink-0 max-md:justify-center max-md:px-0"
            style={{ borderColor: '#c6c6c3', color: '#111', fontSize: 14 }}
          >
            <ChevronLeft />
            <span className="max-md:sr-only">Back</span>
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 max-md:h-11 max-md:min-w-0 max-md:shadow-none! text-white transition-transform active:translate-y-[2px]"
            style={{
              backgroundColor: '#c8951a',
              borderColor: '#967014',
              boxShadow: '0px 3px 0px #967014',
            }}
          >
            <span className="font-sans font-bold max-md:text-[14px]!" style={{ fontSize: 15 }}>
              Confirm &amp; Continue
            </span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentInviteLinkWardSection;
