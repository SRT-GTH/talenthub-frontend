import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('TemplateGuideSection');

/*
 * TemplateGuideSection — Phase 4 / Bulk Upload — column reference guide.
 * Figma frame: 3007:39760 ("Template guide(CSV)")
 *
 * Explains the structure of GTH_Bulk_Upload_Template.csv so institution
 * admins know what fields to fill before proceeding to the editable
 * spreadsheet.
 *
 * Route:    /onboarding/institution/template-guide
 * Layout:   InstitutionOnboardingLayout  (right panel VISIBLE — does not end
 *           with '/activate' or '/template')
 * Next step: /onboarding/institution/template  (editable spreadsheet)
 *
 * Placement in onboarding flow:
 *   activate → template-guide (this) → template → upload
 *
 * Figma nodes referenced:
 *   3007:40275   caption badge ("04 | Bulk Upload")
 *   3007:40284   headline "Start with the template."
 *   3007:40286   subtitle text (verbatim)
 *   3007:40287   decorative divider line
 *   3007:40571   required column dot swatch in legend
 *   3007:40572   "Required column" legend label
 *   3007:40574   optional column dot swatch in legend
 *   3007:40575   "Optional column" legend label
 *   3007:40577   guide header bar ("GTH_Bulk_Upload_Template.csv" + "Fixed format")
 *   3007:40584   Student identity section (top-left)
 *   3007:40585   "Student identity" section header
 *   3007:40587   "First Name"
 *   3007:40589   "Last Name"
 *   3007:40591   "Middle Name"
 *   3007:40593   "Date of Birth"   3007:40594  "DD/MM/YYYY"
 *   3007:40596   "Gender"          3007:40597  "Male / Female"
 *   3007:40598   Contact section (top-right)
 *   3007:40599   "Contact(at least one)"
 *   3007:40601   "Email Address"
 *   3007:40603   "Phone Number"    3007:40604  "+233…"
 *   3007:40605   Education section (bottom-left)
 *   3007:40606   "Education"
 *   3007:40608   "Level"           3007:40609  "JHS / SHS / University"
 *   3007:40611   "Grade"           3007:40612  "JHS1, SHS2, Level 100…"
 *   3007:40613   Parent/Guardian section (bottom-right)
 *   3007:40614   "Parent / Guardian (minors only)"
 *   3007:40616   "Guardian First Name"
 *   3007:40618   "Guardian Last Name"
 *   3007:40620   "Guardian Email or Phone"
 *   3010:40802   Relationship frame
 *   3007:40622   "Relationship"    3007:40623  "Mother / Father…"
 *   3010:40810   download/secondary button (⚠️ ASSUMPTION — text unverifiable, Figma rate-limited)
 *   3007:40296   primary CTA button (⚠️ ASSUMPTION — text unverifiable, Figma rate-limited)
 *
 * Copy rule: ALL text from Figma node names verbatim. Button labels marked
 * ⚠️ ASSUMPTION where Figma rate-limit prevented direct extraction.
 */

// ── Download icon ────────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2v8m0 0L5.5 7.5M8 10L10.5 7.5M3 13h10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Legend dot + label ────────────────────────────────────────────────────────
const LegendDot = ({ dotClass, children }) => (
  <span className="inline-flex items-center gap-2">
    {/* Figma: 6×7px rounded-rectangle swatch */}
    <span className={`shrink-0 rounded-full size-[7px] ${dotClass}`} aria-hidden="true" />
    <span
      className="font-sans font-normal text-[#959592]"
      style={{ fontSize: '12px', letterSpacing: '0.2px' }}
    >
      {children}
    </span>
  </span>
);

// ── Field row — dot + label + optional hint text ──────────────────────────────
const FieldRow = ({ required = true, label, hint }) => (
  <div className="flex items-start gap-[8px]">
    {/* dot: green = required, grey = optional */}
    <span
      className={[
        'mt-[4px] shrink-0 rounded-full size-[6px]',
        required ? 'bg-[#387440]' : 'bg-[#d0d0d0]',
      ].join(' ')}
      aria-hidden="true"
    />
    <span className="font-sans text-[13px] leading-[15px] text-[#222] font-medium">{label}</span>
    {hint && <span className="font-sans text-[11px] leading-[13px] text-[#888]">{hint}</span>}
  </div>
);

// ── Section header inside a quadrant ─────────────────────────────────────────
const QuadrantHeader = ({ children }) => (
  <p className="mb-[12px] font-sans text-[11px] font-semibold uppercase tracking-[0.5px] leading-[13px] text-[#555]">
    {children}
  </p>
);

// ── Main component ────────────────────────────────────────────────────────────

const TemplateGuideSection = () => {
  const navigate = useNavigate();

  log('mount');

  const handleContinue = () => {
    log('continue → /onboarding/institution/template');
    navigate('/onboarding/institution/template');
  };

  const handleDownload = (e) => {
    e.preventDefault();
    log('download template CSV clicked');
    /* TODO: wire to actual file download once asset is available */
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-10 py-[88px] px-6">
      {/* ── Header block: caption + headline + subtitle ── */}
      <div className="flex w-full flex-col items-center gap-6 max-w-[560px]">
        {/* Caption badge — Figma 3007:40275: "04 | Bulk Upload" */}
        <Captions items={[{ index: '04', label: 'Bulk Upload' }]} currentIndex={0} />

        {/* Headline — Figma 3007:40284 */}
        <h1
          className="text-center font-serif text-black tracking-[-0.64px]"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
          }}
        >
          Start with the <span className="italic text-brand-green">template.</span>
        </h1>

        {/* Subtitle — Figma 3007:40286 — verbatim (double space before "column" is intentional) */}
        <p
          className="font-sans font-normal text-center text-[#737373]"
          style={{
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            maxWidth: '520px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Download the official GTH template, fill in students offline, then upload it. Don't create your own  column names must match.`}
        </p>
      </div>

      {/* ── Wavy divider (matches TemplateSection pattern) ── */}
      <WavyDivider />

      {/* ── Guide section: legend + column reference table ── */}
      <div className="flex w-full flex-col gap-6 max-w-[698px]">
        {/* Legend — Figma 3007:40569 "Frame 338": Required column + Optional column */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          role="list"
          aria-label="Column colour legend"
        >
          {/* 3007:40571 (required dot) + 3007:40572 "Required column" */}
          <LegendDot dotClass="bg-[#387440]">Required column</LegendDot>
          {/* 3007:40574 (optional dot) + 3007:40575 "Optional column" */}
          <LegendDot dotClass="bg-[#d0d0d0]">Optional column</LegendDot>
        </div>

        {/* Column reference table — Figma 3007:40576 "Background+Border" */}
        <div
          className="w-full overflow-hidden rounded-[10px] border border-[#c1d4c4]"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
        >
          {/* ── Header bar — Figma 3007:40577 ── */}
          <div className="flex items-center gap-3 bg-[#387440] px-4 py-[10px]">
            {/* [ASSET: csv-file-icon] — inline SVG placeholder, no paths from Figma */}
            <svg
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="size-[14px] shrink-0 text-white"
            >
              <path
                d="M2.5 1.5h6l3 3V12.5h-9v-11z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 1.5v3h3"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M4 7.5h6M4 9.5h4"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>

            {/* 3007:40581 — "GTH_Bulk_Upload_Template.csv" */}
            <span className="font-sans text-[12px] font-semibold leading-[24px] text-white">
              GTH_Bulk_Upload_Template.csv
            </span>

            {/* 3007:40582 "Overlay" — "Fixed format" badge */}
            <span className="rounded-[4px] bg-white/20 px-[8px] py-[2px] font-sans text-[10px] font-medium leading-[14px] text-white">
              Fixed format
            </span>
          </div>

          {/* ── 2×2 quadrant grid ── */}
          <div className="grid grid-cols-2 divide-x divide-[#c1d4c4]">
            {/* TOP-LEFT — Figma 3007:40584 "HorizontalBorder" ── */}
            {/* ── Student identity (3007:40585) ── */}
            <div className="border-b border-[#c1d4c4] p-4">
              {/* 3007:40585 */}
              <QuadrantHeader>Student identity</QuadrantHeader>
              <div className="flex flex-col gap-[10px]">
                {/* 3007:40587 First Name — required */}
                <FieldRow required label="First Name" />
                {/* 3007:40589 Last Name — required */}
                <FieldRow required label="Last Name" />
                {/* 3007:40591 Middle Name — optional */}
                <FieldRow required={false} label="Middle Name" />
                {/* 3007:40593 Date of Birth + 3007:40594 DD/MM/YYYY */}
                <FieldRow required label="Date of Birth" hint="DD/MM/YYYY" />
                {/* 3007:40596 Gender + 3007:40597 Male / Female */}
                <FieldRow required label="Gender" hint="Male / Female" />
              </div>
            </div>

            {/* TOP-RIGHT — Figma 3007:40598 "Border" ── */}
            {/* ── Contact (at least one) (3007:40599) ── */}
            <div className="border-b border-[#c1d4c4] p-4">
              {/* 3007:40599 */}
              <QuadrantHeader>Contact (at least one)</QuadrantHeader>
              <div className="flex flex-col gap-[10px]">
                {/* 3007:40601 Email Address — required (at least one) */}
                <FieldRow required label="Email Address" />
                {/* 3007:40603 Phone Number + 3007:40604 +233… — required (at least one) */}
                <FieldRow required label="Phone Number" hint="+233…" />
              </div>
            </div>

            {/* BOTTOM-LEFT — Figma 3007:40605 "HorizontalBorder" ── */}
            {/* ── Education (3007:40606) ── */}
            <div className="p-4">
              {/* 3007:40606 */}
              <QuadrantHeader>Education</QuadrantHeader>
              <div className="flex flex-col gap-[10px]">
                {/* 3007:40608 Level + 3007:40609 JHS / SHS / University */}
                <FieldRow required label="Level" hint="JHS / SHS / University" />
                {/* 3007:40611 Grade + 3007:40612 JHS1, SHS2, Level 100… */}
                <FieldRow required label="Grade" hint="JHS1, SHS2, Level 100…" />
              </div>
            </div>

            {/* BOTTOM-RIGHT — Figma 3007:40613 "Border" ── */}
            {/* ── Parent / Guardian (minors only) (3007:40614) ── */}
            <div className="p-4">
              {/* 3007:40614 */}
              <QuadrantHeader>Parent / Guardian (minors only)</QuadrantHeader>
              <div className="flex flex-col gap-[10px]">
                {/* 3007:40616 Guardian First Name — optional */}
                <FieldRow required={false} label="Guardian First Name" />
                {/* 3007:40618 Guardian Last Name — optional */}
                <FieldRow required={false} label="Guardian Last Name" />
                {/* 3007:40620 Guardian Email or Phone — optional */}
                <FieldRow required={false} label="Guardian Email or Phone" />
                {/* 3010:40802 Relationship frame: 3007:40622 "Relationship" + 3007:40623 "Mother / Father…" */}
                <FieldRow required={false} label="Relationship" hint="Mother / Father…" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Download button — Figma 3010:40810 (secondary, h=44) ──
             ⚠️ ASSUMPTION: button text "Download GTH_Bulk_Upload_Template.csv".
             Figma instance text could not be verified (MCP rate-limited). ── */}
        <a
          href="#"
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border-b border-[#387440] px-[34px] py-4 text-[#387440] transition-opacity duration-100 hover:opacity-80"
          style={{ boxShadow: '0px 2px 0px 0px rgba(17,17,17,0.2)' }}
          aria-label="Download GTH_Bulk_Upload_Template.csv"
        >
          <DownloadIcon />
          <span className="font-sans font-semibold text-[12px] tracking-[0.1px] leading-[24px]">
            Download GTH Template (.csv)
          </span>
          <ArrowRightIcon />
        </a>

        {/* ── Primary CTA — Figma 3007:40296 (primary, h=56) ──
             ⚠️ ASSUMPTION: button label "I'm ready to fill the template".
             Figma instance text could not be verified (MCP rate-limited). ── */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRightIcon />}
          onClick={handleContinue}
          className="w-full"
        >
          I&apos;m ready to fill the template
        </Button>
      </div>
    </div>
  );
};

export default TemplateGuideSection;
