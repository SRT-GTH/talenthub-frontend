import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentSuccessSection');

/*
 * ParentSuccessSection — final step ("Done") of the parent sign-up wizard.
 * Figma main frame: 2952:96777 (left content 2952:96779). FULL registration
 * complete screen: success badge, "Your parent account is activated", audit-
 * event chips, confirmed ward card, "what you can do now" next-steps, opt-out
 * escape hatch, and the amber "Go to Parent Dashboard" CTA.
 *
 * The simple gold right panel (trophy + stat cards) is provided by
 * ParentOnboardingLayout via ParentLoginRightPanel variant="simple".
 *
 * Route: /onboarding/parent-done
 */

// ── hand-crafted glyphs (bounding box + stroke colour only) ─────────────────
const Check = ({ size = 16, color = '#ffffff', stroke = 2 }) => (
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
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <circle cx="5" cy="3.2" r="1.8" stroke="currentColor" strokeWidth="1" />
    <path
      d="M1.8 8.6c0-1.8 1.4-3 3.2-3s3.2 1.2 3.2 3"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const EyeGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M1 7s2.2-3.6 6-3.6S13 7 13 7s-2.2 3.6-6 3.6S1 7 1 7Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const FlagGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 1v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path
      d="M3 2h7l-1.5 2.5L10 7H3V2Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const PinGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 13s4.5-4 4.5-7.5A4.5 4.5 0 0 0 7 1a4.5 4.5 0 0 0-4.5 4.5C2.5 9 7 13 7 13Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const UndoGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 4.5H7a3 3 0 1 1 0 6H4.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 2 2 4.5 4.5 6.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── audit-event chip — Figma 2952:96790 / 96794 ─────────────────────────────
const AuditChip = ({ label }) => (
  <span
    className="flex items-center gap-[8px] rounded-full border px-[12px] py-[6px]"
    style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
  >
    <span style={{ color: '#2a5730' }}>
      <Check size={11} color="#2a5730" stroke={2.4} />
    </span>
    <span
      className="font-sans font-bold"
      style={{ fontSize: 11, color: '#2a5730', lineHeight: 'normal' }}
    >
      {label}
    </span>
  </span>
);

// ── next-step card — Figma 2952:96815 / 96822 / 96828 ───────────────────────
const NextStepCard = ({ icon, iconBg, iconShadow, iconColor, title, desc, dimmed = false }) => (
  <div
    className="flex w-full items-start gap-[12px] rounded-[10px] px-[16px] py-[13px]"
    style={{ backgroundColor: '#f8f8f4', opacity: dimmed ? 0.6 : 1 }}
  >
    <span
      className="flex size-[32px] shrink-0 items-center justify-center rounded-[6px] [&>svg]:size-[14px]"
      style={{ backgroundColor: iconBg, boxShadow: `0px 2px 0px ${iconShadow}`, color: iconColor }}
    >
      {icon}
    </span>
    <div className="flex flex-col gap-[3px]">
      <p
        className="font-sans font-bold"
        style={{ fontSize: 13, color: '#111', lineHeight: 'normal' }}
      >
        {title}
      </p>
      <p className="font-sans" style={{ fontSize: 11, color: '#70706e', lineHeight: '15.95px' }}>
        {desc}
      </p>
    </div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

const ParentSuccessSection = () => {
  log('mount');
  const navigate = useNavigate();

  const handleDashboard = () => {
    log('go to parent dashboard clicked');
    navigate('/');
  };

  const handleOptOut = (e) => {
    e.preventDefault();
    log('opt-out Kofi instead clicked');
  };

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-16">
      <div className="flex w-full max-w-[720px] flex-col gap-5">
        {/* ── Header block (centered) ── */}
        <div className="flex flex-col items-center gap-[14px] text-center">
          {/* Success icon — Figma 2952:96782 */}
          <span
            className="flex size-[80px] items-center justify-center rounded-full"
            style={{
              backgroundColor: '#c8951a',
              boxShadow: '0 0 0 12px #faf4e8, 0 0 0 16px #eedeb8, 0 3px 0 0 #967014',
            }}
          >
            <Check size={36} color="#ffffff" stroke={2.4} />
          </span>

          {/* Caption — Figma 2952:96786 */}
          <span
            className="mt-[6px] font-sans font-bold uppercase"
            style={{ fontSize: 10, color: '#c8951a', letterSpacing: '1.3px' }}
          >
            Registration complete
          </span>

          {/* Headline — Figma 2952:96787 */}
          <h1
            className="font-display font-normal"
            style={{
              fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
              lineHeight: 1,
              letterSpacing: '-2px',
              color: '#111',
            }}
          >
            Your parent account
            <br />
            is{' '}
            <span className="italic" style={{ color: '#967014' }}>
              activated.
            </span>
          </h1>

          {/* Subtitle — Figma 2952:96788 */}
          <p
            className="max-w-[420px] font-sans"
            style={{ fontSize: 13, color: '#70706e', lineHeight: '22.1px' }}
          >
            You&apos;re now connected to Kofi&apos;s journey on Ghana Talent Hub. You can review
            their profile, flag anything that needs correcting, and opt-out at any time.
          </p>

          {/* Audit chips — Figma 2952:96789 */}
          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            <AuditChip label="PARENT_ACCOUNT_CREATED" />
            <AuditChip label="WARD_AUTO_LINKED" />
          </div>
        </div>

        {/* ── Ward confirmed card — Figma 2952:96798 ── */}
        <div
          className="flex w-full items-center justify-between rounded-[16px] border-2 bg-white px-[20px] py-[20px]"
          style={{
            borderColor: '#c1d4c4',
            boxShadow: '0px 3px 0px 0px #c1d4c4, 0px 8px 24px 0px rgba(56,116,64,0.07)',
          }}
        >
          <div className="flex items-center gap-[14px]">
            {/* Green avatar badge */}
            <span
              className="flex size-[52px] shrink-0 items-center justify-center rounded-[26px]"
              style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
            >
              <Check size={24} color="#ffffff" stroke={2.4} />
            </span>
            <div className="flex flex-col gap-[3px]">
              <p
                className="font-sans font-bold"
                style={{ fontSize: 16, color: '#111', lineHeight: 'normal' }}
              >
                Kofi Mensah
              </p>
              <div className="flex items-center gap-[6px]" style={{ color: '#70706e' }}>
                <PersonMini />
                <span
                  className="font-sans font-semibold"
                  style={{ fontSize: 11, lineHeight: 'normal' }}
                >
                  Age 16
                </span>
                <span
                  className="font-sans font-semibold"
                  style={{ fontSize: 11, lineHeight: 'normal' }}
                >
                  🇬🇭 Ghanaian
                </span>
                <span
                  className="font-sans font-semibold"
                  style={{ fontSize: 11, lineHeight: 'normal' }}
                >
                  JHS 3 · Achimota
                </span>
              </div>
            </div>
          </div>
          {/* Linked badge */}
          <span
            className="flex shrink-0 items-center gap-[6px] rounded-full px-[12px] py-[6px]"
            style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
          >
            <Check size={11} color="#ffffff" stroke={2.6} />
            <span
              className="font-sans font-bold text-white"
              style={{ fontSize: 11, lineHeight: 'normal' }}
            >
              Linked
            </span>
          </span>
        </div>

        {/* ── Next steps — Figma 2952:96814 ── */}
        <span
          className="font-sans font-bold uppercase"
          style={{ fontSize: 11, color: '#babab7', letterSpacing: '0.7px' }}
        >
          What you can do now
        </span>

        <div className="flex flex-col gap-[8px]">
          <NextStepCard
            icon={<EyeGlyph />}
            iconBg="#faf4e8"
            iconShadow="#eedeb8"
            iconColor="#c8951a"
            title="Review Kofi's profile"
            desc="See everything Kofi has shared on the platform — assessments, profile info, and activity."
          />
          <NextStepCard
            icon={<FlagGlyph />}
            iconBg="#ebf1ec"
            iconShadow="#c1d4c4"
            iconColor="#387440"
            title="Flag something for correction"
            desc="If anything on Kofi's profile looks wrong, you can flag it. Kofi will be notified to review and correct it."
          />
          <NextStepCard
            icon={<PinGlyph />}
            iconBg="#c6c6c3"
            iconShadow="#babab7"
            iconColor="#ffffff"
            title="Opt-out location"
            desc="If you ever want to remove Kofi's access, go to Dashboard → Settings → Opt-out Ward."
            dimmed
          />
        </div>

        {/* ── Opt-out escape hatch — Figma 2952:96835 ── */}
        <div className="flex items-center justify-center gap-[8px]">
          <span style={{ color: '#70706e' }}>
            <UndoGlyph />
          </span>
          <span
            className="font-sans"
            style={{ fontSize: 12, color: '#70706e', lineHeight: 'normal' }}
          >
            Changed your mind?
          </span>
          <a
            href="#"
            onClick={handleOptOut}
            className="font-sans font-bold"
            style={{
              fontSize: 12,
              color: '#c0392b',
              borderBottom: '1px solid rgba(192,57,43,0.25)',
            }}
          >
            Opt-out Kofi instead
          </a>
        </div>

        {/* ── Primary CTA — Figma 2952:96842 (amber) ── */}
        <button
          type="button"
          onClick={handleDashboard}
          className="flex w-full items-center justify-center gap-[8px] rounded-[10px] border-2 px-[40px] py-[16px] text-white transition-transform active:translate-y-[2px]"
          style={{
            backgroundColor: '#c8951a',
            borderColor: '#967014',
            boxShadow: '0px 3px 0px #967014',
          }}
        >
          <span className="font-sans font-bold" style={{ fontSize: 15, lineHeight: 'normal' }}>
            Go to Parent Dashboard
          </span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default ParentSuccessSection;
