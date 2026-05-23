import { Link, useNavigate } from 'react-router-dom';
import Captions from '../../ui/Captions.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, ArrowLeftIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ConfirmSection');

/*
 * ConfirmSection — Phase 7 / Confirm Accounts — final review before submit.
 * Figma main frame: 3040:71814 ("Confirm"), 1728×1119.
 *
 * Displays a pre-submission summary:
 *   • Caption "07 | Confirm Accounts" via Captions
 *   • Headline "Ready to submit?" — "submit?" italic green
 *   • Subtitle text (max-w=536px)
 *   • WavyDivider
 *   • 4 stat cards (Accounts To Create / Rows Skipped / Opt-Out SMS / Minors No Parent Contact)
 *   • Checklist box: "What happens when you click Submit" header + 4 numbered action items
 *   • Warning amber box: cancel-window notice
 *   • CTAs: "← Back" | "Submit And Create N Accounts →"
 *   • Footer: "Already Have an account? Log in Instead"
 *
 * Route:   /onboarding/institution/confirm
 * Layout:  InstitutionOnboardingLayout — NO right panel
 *          (added to showRightPanel exclusion list)
 * Back:    /onboarding/institution/validate
 * Next:    /onboarding/institution/report
 *
 * Figma nodes referenced:
 *   3040:71814  main frame 1728×1119
 *   3040:71914  caption badge "07 | Confirm Accounts"
 *   3040:71923  headline "Ready to submit?" (styleTable 73 → italic #387440 for "submit?")
 *   3040:71925  subtitle (fs=16 fw=400 #737373 max-w=536px)
 *   3040:71926  WavyDivider (Line 1, 200×0)
 *   3040:71928  Accounts To Create stat card (#ebf1ec @50%, value #387440)
 *   3040:71929  Accounts To Create inner box (177×60, Frame 376: value+sub-label stacked)
 *   3040:71932  Rows Skipped stat card (#f8f8f4, value #387440)
 *   3040:71933  Rows Skipped inner box (sub-label "Download to fix & re-upload")
 *   3040:71936  Opt-Out SMS Will Be Sent stat card (#eaeffb @50%, value #3062d3)
 *   3040:71940  Minors No Parent Contact stat card (#faf4e8, value #967014)
 *   3046:73914  Checklist box — Border 890×206 stroke #000000@1 r=16
 *   3046:73933  Warning amber box — Overlay+Border 890×46 fill rgba(200,149,26,0.1) r=10
 *   3040:72011  Submit And Create N Accounts button (734×56 green r=14)
 *   3040:72002  Back button (128×56 white r=14)
 */

// ── Mock data (replace with API response) ────────────────────────────────────
const MOCK = {
  validRows: 847,
  failedRows: 26,
  smsCount: 198, // minors with parent contact (312 - 114 no-contact)
  minorsNoContact: 114,
};

// ── Warning exclamation icon ──────────────────────────────────────────────────
/*
 * Figma 3046:73933 → Background 22×22 fill #c8951a r=11 → SVG 10×10
 * Vector: 0.01×6 stroke #ffffff@1.2 → vertical bar of exclamation mark
 */
const ExclamWarningIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M5 2V6.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="5" cy="8.5" r="0.7" fill="#ffffff" />
  </svg>
);

// ── Confirm stat card ─────────────────────────────────────────────────────────
/*
 * Figma 3040:71928–3040:71940 (four cards).
 * Same outer shell as ValidateSection StatCard (194×98 py-[9px] gap-[4px])
 * except the inner box now stacks two items: value + sub-label (both in Frame 376).
 *
 * Inner box: 177×60, bg white, border #000000@0.4, r=10
 * Frame 376 (115×42, gap=4 VERTICAL, counterAxisAlignItems=CENTER):
 *   • value    fs=32 fw=400 lh=22  — colour varies per card
 *   • subLabel fs=10 fw=400 lh=16  — colour varies per card
 * Outer label (below inner box): fs=10 fw=500 lh=16 — colour varies per card
 */
const ConfirmStatCard = ({
  value,
  subLabel,
  label,
  outerFill, // background of outer container (hex or rgba string)
  valueColor, // number colour
  subLabelColor, // sub-label inside inner box
  labelColor, // outer label below inner box
}) => {
  log('ConfirmStatCard render', { label, value });
  return (
    <div
      className="flex flex-col items-center py-[9px] gap-[4px] rounded-[10px] border border-black"
      style={{ width: '194px', height: '98px', backgroundColor: outerFill }}
    >
      {/* Inner box — 177×60 */}
      <div
        className="flex items-center justify-center w-[177px] h-[60px] rounded-[10px] bg-white"
        style={{ border: '0.4px solid rgba(0,0,0,0.4)' }}
      >
        {/* Frame 376 — stacked value + sub-label */}
        <div className="flex flex-col items-center gap-[4px]">
          <span
            className="font-sans font-normal"
            style={{ fontSize: '32px', lineHeight: '22px', color: valueColor }}
          >
            {value}
          </span>
          <span
            className="font-sans font-normal text-center"
            style={{ fontSize: '10px', lineHeight: '16px', color: subLabelColor }}
          >
            {subLabel}
          </span>
        </div>
      </div>
      {/* Outer label */}
      <span
        className="font-sans font-medium"
        style={{ fontSize: '10px', lineHeight: '16px', color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Checklist item ────────────────────────────────────────────────────────────
/*
 * Figma 3046:73914 → HorizontalBorder rows 875×42 (within 890px container).
 * Each row: numbered circle (20×20 fill=#387440 r=10, white number fs=10 fw=700)
 *   + description text (fs=12 fw=400 #111111).
 * Gap between circle and text: ~12px.
 * Row height: 42px. Container horizontal padding: px-[16px].
 */
const ChecklistItem = ({ number, text }) => (
  <div className="flex items-center gap-[12px] h-[42px] px-[16px]">
    {/* Numbered circle */}
    <div
      className="shrink-0 flex items-center justify-center rounded-full bg-[#387440]"
      style={{ width: '20px', height: '20px' }}
    >
      <span
        className="font-sans font-bold text-white"
        style={{ fontSize: '10px', lineHeight: '13px' }}
      >
        {number}
      </span>
    </div>
    {/* Description */}
    <span
      className="font-sans font-normal text-[#111111]"
      style={{ fontSize: '12px', lineHeight: '18px' }}
    >
      {text}
    </span>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const ConfirmSection = () => {
  const navigate = useNavigate();

  const { validRows, failedRows, smsCount, minorsNoContact } = MOCK;

  log('mount', { validRows, failedRows, smsCount, minorsNoContact });

  const handleBack = () => {
    log('back → /onboarding/institution/validate');
    navigate('/onboarding/institution/validate');
  };

  const handleSubmit = () => {
    log('submit → /onboarding/institution/report', { validRows });
    navigate('/onboarding/institution/report');
  };

  return (
    <div className="flex flex-1 flex-col items-center py-[88px] px-6">
      {/* ── Content column: max-w=897px centred ── */}
      <div className="w-full max-w-[897px] flex flex-col gap-[40px]">
        {/* ── Upper block: header + stats + checklist — gap=16 ── */}
        <div className="flex flex-col gap-[16px]">
          {/* ── Header block: caption + headline + subtitle + divider ── */}
          <div className="flex flex-col items-center gap-[8px]">
            {/* Caption badge — Figma 3040:71914 "07 | Confirm Accounts" */}
            <Captions items={[{ index: '07', label: 'Confirm Accounts' }]} currentIndex={0} />

            {/* Headline — Figma 3040:71923
                Instrument Serif fs=64 lh=70 ls=-0.64px CENTER
                styleTable[73]: "submit?" (indices 9–15) → italic #387440 */}
            <h1
              className="text-center font-serif text-black"
              style={{
                fontSize: 'clamp(2rem, 4.4vw, 4rem)',
                lineHeight: 1.094,
                letterSpacing: '-0.64px',
              }}
            >
              Ready to <span className="italic text-brand-green">submit?</span>
            </h1>

            {/* Subtitle — Figma 3040:71925 verbatim
                SF Pro Rounded 400 fs=16 lh=24 ls=0.2 #737373 CENTER max-w=536px */}
            <p
              className="font-sans font-normal text-center text-[#737373]"
              style={{
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                lineHeight: '24px',
                letterSpacing: '0.2px',
                maxWidth: '536px',
              }}
            >
              This is your final check before accounts are created. Review the breakdown below, then
              confirm.
            </p>

            {/* WavyDivider — Figma 3040:71926 "Line 1" (200×0) */}
            <WavyDivider />
          </div>

          {/* ── Stat cards — Figma "File summary" 897×98 HORIZONTAL gap=38 ──
               4 cards with colour-coded outer fills, value, sub-label, outer label */}
          <div
            className="flex items-center justify-between"
            style={{ gap: '38px' }}
            role="region"
            aria-label="Submission summary"
          >
            {/* Accounts To Create — Figma 3040:71928 / 3040:71929
                outer fill: #ebf1ec @50%  value: #387440  sub: #2a5730  label: #2a5730 */}
            <ConfirmStatCard
              value={validRows}
              subLabel="All valid rows from upload"
              label="Accounts To Create"
              outerFill="rgba(235,241,236,0.5)"
              valueColor="#387440"
              subLabelColor="#2a5730"
              labelColor="#2a5730"
            />

            {/* Rows Skipped — Figma 3040:71932 / 3040:71933
                outer fill: #f8f8f4  value: #387440  sub: #2a5730  label: #2a5730 */}
            <ConfirmStatCard
              value={failedRows}
              subLabel="Download to fix & re-upload"
              label="Rows Skipped"
              outerFill="#f8f8f4"
              valueColor="#387440"
              subLabelColor="#2a5730"
              labelColor="#2a5730"
            />

            {/* Opt-Out SMS Will Be Sent — Figma 3040:71936
                outer fill: #eaeffb @50%  value: #3062d3  sub: #244a9f  label: #244a9f */}
            <ConfirmStatCard
              value={smsCount}
              subLabel="All valid rows from upload"
              label="Opt-Out SMS Will Be Sent"
              outerFill="rgba(234,239,251,0.5)"
              valueColor="#3062d3"
              subLabelColor="#244a9f"
              labelColor="#244a9f"
            />

            {/* Minors No Parent Contact — Figma 3040:71940
                outer fill: #faf4e8  value: #967014  sub: #967014  label: #967014 */}
            <ConfirmStatCard
              value={minorsNoContact}
              subLabel="All valid rows from upload"
              label="Minors No Parent Contact"
              outerFill="#faf4e8"
              valueColor="#967014"
              subLabelColor="#967014"
              labelColor="#967014"
            />
          </div>

          {/* ── Checklist box + warning — Figma Frame 358 (890×266, gap=16 VERTICAL) ── */}
          <div className="flex flex-col gap-[16px]">
            {/* Bordered checklist box — Figma 3046:73914 "Border"
                890×206, stroke #000000@1, r=16
                Header strip: "What happens when you click Submit" bg=#f8f8f4
                4 numbered action items (h=42 each) */}
            <div
              className="w-full rounded-[16px] border border-black overflow-hidden"
              role="list"
              aria-label="What happens when you click Submit"
            >
              {/* Header strip — Figma Background+HorizontalBorder 35px
                  fill #f8f8f4, text fs=10 fw=700 #70706e */}
              <div
                className="flex items-center px-[16px] bg-[#f8f8f4]"
                style={{ height: '35px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              >
                <span
                  className="font-sans font-bold text-[#70706e]"
                  style={{ fontSize: '10px', lineHeight: '14px', letterSpacing: '0.2px' }}
                >
                  What happens when you click Submit
                </span>
              </div>

              {/* 4 action items — Figma HorizontalBorder rows (875×42 within 890) */}
              <div role="list">
                <ChecklistItem
                  number={1}
                  text={`${validRows} student accounts are created immediately with temporary passwords`}
                />
                <ChecklistItem
                  number={2}
                  text="Login credentials are sent to each student's email or phone"
                />
                <ChecklistItem
                  number={3}
                  text={`${smsCount} opt-out SMS notifications dispatched to parents within 24 hours`}
                />
                <ChecklistItem
                  number={4}
                  text="You receive a full upload report with counts and any remaining flags"
                />
              </div>
            </div>

            {/* Warning amber box — Figma 3046:73933 "Overlay+Border"
                890×46, fill rgba(200,149,26,0.1), stroke #eedeb8@1, r=10
                Icon circle: 22×22 fill #c8951a r=11 + exclamation SVG
                Text: fs=12 fw=400 #967014 */}
            <div
              className="flex items-center px-[16px] w-full rounded-[10px]"
              style={{
                height: '46px',
                backgroundColor: 'rgba(200,149,26,0.1)',
                border: '1px solid #eedeb8',
              }}
              role="alert"
            >
              {/* Frame 377 (699×22, gap=9 HORIZONTAL) */}
              <div className="flex items-center gap-[9px]">
                {/* Amber exclamation circle — 22×22 fill #c8951a r=11 */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-full bg-[#c8951a]"
                  style={{ width: '22px', height: '22px' }}
                  aria-hidden="true"
                >
                  <ExclamWarningIcon />
                </div>
                {/* Warning text */}
                <p
                  className="font-sans font-normal"
                  style={{ fontSize: '12px', lineHeight: '18px', color: '#967014' }}
                >
                  Once submitted, accounts are created immediately. You can cancel within 5 seconds
                  of clicking Submit if you spot an error.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA row — Figma Frame 360 (882×56, gap=19 HORIZONTAL) ── */}
        <div className="flex items-center gap-[19px] w-full">
          {/* Back button — Figma 3040:72002 "Frame 9 instance"
               128×56, fill=#ffffff, stroke=#111111@2px, r=14
               [left-arrow] "Back" (fs=16 fw=700 #575755) */}
          <button
            type="button"
            onClick={handleBack}
            className={[
              'flex items-center justify-center gap-[8px]',
              'h-[56px] w-[128px] shrink-0',
              'rounded-[14px] border-2 border-[#111111] bg-white',
              'font-sans font-bold text-[16px] leading-6 text-[#575755]',
              'transition-opacity duration-100 hover:opacity-80',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]',
            ].join(' ')}
          >
            <ArrowLeftIcon className="size-[20px] shrink-0" />
            Back
          </button>

          {/* Submit And Create N Accounts — Figma 3040:72011 "Frame 9 instance"
               734×56 (flex-1), fill=#387440, stroke=#2a5730@2px, r=14
               Text: "Submit And Create N Accounts" (white) + right arrow */}
          <button
            type="button"
            onClick={handleSubmit}
            className={[
              'flex flex-1 items-center justify-center gap-[8px]',
              'h-[56px]',
              'rounded-[14px] border-2 border-[#2a5730] bg-[#387440]',
              'font-sans font-bold text-[16px] leading-6 text-white',
              'transition-opacity duration-100 hover:opacity-90',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a5730]',
            ].join(' ')}
          >
            Submit And Create {validRows} Accounts
            <ArrowRightIcon />
          </button>
        </div>

        {/* ── Footer link — consistent with other onboarding steps ── */}
        <div className="flex items-center justify-center gap-2 text-[14px] leading-6">
          <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="font-semibold text-brand-green underline-offset-2 hover:underline"
            style={{ letterSpacing: '0.1px' }}
          >
            Log in Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSection;
