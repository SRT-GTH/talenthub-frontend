import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Captions from '../../ui/Captions.jsx';
import StickyActionBar from '../../ui/form/StickyActionBar.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import ValidationCheckCard from './ValidationCheckCard.jsx';
import { ArrowRightIcon, ArrowLeftIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';
import { getBulkState, downloadFailedRows } from '../../../services/institutionBulk.js';

const log = debug('ValidateSection');

/*
 * ValidateSection — Phase 6 / Bulk Upload — pre-flight validation report.
 * Figma main frame: 3016:60108 ("Validate File"), 1728×1363.
 *
 * Displays the result of scanning the uploaded CSV file:
 *   • Headline + subtitle + WavyDivider
 *   • 4 stat cards  — swap content when on "failed rows" tab
 *   • Tab switcher: "Validation checks" | "N failed rows"
 *   • Download banner (only on "failed rows" tab)   Figma 3034:71143
 *   • List of ValidationCheckCard rows (collapsible)
 *   • CTAs: "← Re-Upload File" | "Proceed With N Valid Rows →"
 *
 * Route:   /onboarding/institution/validate
 * Layout:  InstitutionOnboardingLayout — NO right panel
 * Next:    /onboarding/institution/confirm
 * Back:    /onboarding/institution/upload
 *
 * Figma nodes referenced:
 *   3028:67078  caption badge
 *   3028:67087  headline
 *   3028:67089  subtitle
 *   3028:67090  WavyDivider
 *   3028:67091  File summary container (gap=38)
 *   3028:67092  Valid Rows card (normal tab)
 *   3028:67096  Failed Rows card (normal tab)
 *   3028:67100  Minors card (normal tab)
 *   3028:67104  Adults card (normal tab)
 *   3028:67662  Total Failed card (failed tab)
 *   3028:67669  Missing Contact label / 3028:67668 value
 *   3028:67670  Duplicates card (failed tab)
 *   3028:67674  Format Errors card (failed tab)
 *   3028:67109  Tab switcher
 *   3028:67679  Toggle buttons container
 *   3034:71143  Download banner (failed tab, 897×63)
 *   3028:67114  Checks view (list of check cards, gap=16)
 *   3028:67164  CTA container (gap=19)
 *   3028:67166  Re-Upload File button
 *   3028:67175  Proceed button
 */

// ── Mock validation data (replace with API response) ─────────────────────────
// Filled in by validateUpload() on the upload step (services/institutionBulk.js).
const EMPTY_REPORT = {
  validRows: 0,
  failedRows: 0,
  minors: 0,
  adults: 0,
  missingContact: 0,
  duplicates: 0,
  formatErrors: 0,
  checks: [],
};

// ── Download banner icons ─────────────────────────────────────────────────────

/*
 * DownloadFileIcon — 18×18 banner icon.
 * Figma 3034:71143 → SVG 18×18 with two vectors:
 *   Vector 1  8×12 (download arrow)  stroke #c0392b@1.5
 *   Vector 2  14×0 (base line)       stroke #c0392b@1.5
 */
const DownloadFileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M9 2V12M5.5 8.5L9 12L12.5 8.5"
      stroke="#c0392b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2 15H16" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/*
 * DownloadIconWhite — 16×16 icon inside the "Download .csv" button.
 * Same shape, white stroke.
 */
const DownloadIconWhite = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2V10M5 7.5L8 10.5L11 7.5"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2 13H14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Download banner ───────────────────────────────────────────────────────────
/*
 * Figma 3034:71143 "Download banner" — 897×63, r=10
 *   fill #f9ebea at opacity 0.5 → rgba(249,235,234,0.5)
 *   stroke #ebc2bd @ 1px
 *   Children: SVG icon (18×18) | text group (flex-1) | Download button
 *
 * Text group (Frame 368, 404px, VERTICAL gap=2):
 *   Line 1: "Download the error file to see all 26 rows with failure reasons"
 *            fs=14 fw=600 #922b21
 *   Line 2: 'Each row has a "Failure_Reason" column added. Fix and re-upload as a new batch.'
 *            fs=12 fw=400 #c0392b
 *
 * Button (Frame 9 instance, h=36 r=10):
 *   fill #c0392b  stroke #902b20@2px  pad L18 R18 T12 B12  gap=8
 *   Icon: 16×16 white download  Text: "Download .csv" fs=12 fw=700 #ffffff
 */
const DownloadBanner = ({ failedRows }) => {
  log('DownloadBanner render', { failedRows });
  return (
    <div
      className="flex items-center gap-[16px] w-full px-[16px] rounded-[10px] max-md:h-auto! max-md:flex-wrap max-md:gap-x-3 max-md:gap-y-2 max-md:px-3 max-md:py-2.5"
      style={{
        height: '63px',
        backgroundColor: 'rgba(249,235,234,0.5)',
        border: '1px solid #ebc2bd',
        flexShrink: 0,
      }}
    >
      {/* Banner icon */}
      <DownloadFileIcon />

      {/* Text group — flex-1, VERTICAL gap=2 */}
      <div className="flex flex-1 flex-col gap-[2px] min-w-0">
        <p
          className="font-sans font-semibold truncate max-md:whitespace-normal"
          style={{ fontSize: '14px', lineHeight: '16px', color: '#922b21' }}
        >
          Download the error file to see all {failedRows} rows with failure reasons
        </p>
        <p
          className="font-sans font-normal truncate max-md:whitespace-normal"
          style={{ fontSize: '12px', lineHeight: '18px', color: '#c0392b' }}
        >
          Each row has a &ldquo;Failure_Reason&rdquo; column added. Fix and re-upload as a new
          batch.
        </p>
      </div>

      {/* Download .csv button
          h=36 r=10 fill #c0392b stroke #902b20@2px pad L18 R18 gap=8 */}
      <button
        type="button"
        className={[
          'flex items-center justify-center gap-[8px] shrink-0 max-md:h-9! max-md:w-full max-md:text-[13px]!',
          'font-sans font-bold text-white',
          'rounded-[10px]',
          'transition-opacity duration-100 hover:opacity-85',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#902b20]',
        ].join(' ')}
        style={{
          height: '36px',
          padding: '12px 18px',
          backgroundColor: '#c0392b',
          border: '2px solid #902b20',
          fontSize: '12px',
          lineHeight: '14.32px',
          whiteSpace: 'nowrap',
        }}
        onClick={() => {
          log('download csv clicked');
          downloadFailedRows();
        }}
        data-testid="download-failed-rows"
      >
        <DownloadIconWhite />
        Download .csv
      </button>
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
/*
 * Figma:
 *   Outer: 194×98, fill=#f8f8f4, stroke=#000000(1px), r=10
 *   Inner: 177×60, fill=#fefefe, stroke=#000000(0.4px), r=10
 *   Number: fs=32 fw=400 (regular), lh=22, colour = valueColor
 *   Label:  fs=10 fw=500 lh=16, colour = labelColor
 *             Normal tab: #2a5730 (green)
 *             Failed tab: #c0392b (red) — Figma 3028:67662 / 3028:67669
 */
const StatCard = ({ value, label, valueColor, labelColor = '#2a5730' }) => {
  log('StatCard render', { label, value });
  return (
    <div
      className="flex flex-col items-center py-[9px] gap-[4px] rounded-[10px] border border-black bg-[#f8f8f4] max-md:h-auto! max-md:w-full! max-md:gap-0 max-md:border-black/15 max-md:py-2"
      style={{ width: '194px', height: '98px' }}
    >
      {/* Inner box */}
      <div
        className="flex items-center justify-center w-[177px] h-[60px] rounded-[10px] bg-white max-md:h-auto max-md:w-auto max-md:border-0! max-md:bg-transparent"
        style={{ border: '0.4px solid rgba(0,0,0,0.4)' }}
      >
        <span
          className="font-sans font-normal max-md:text-[28px]! max-md:leading-8!"
          style={{ fontSize: '32px', lineHeight: '22px', color: valueColor }}
        >
          {value}
        </span>
      </div>
      {/* Label */}
      <span
        className="font-sans font-medium"
        style={{ fontSize: 'var(--fs-10)', lineHeight: '16px', color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Tab button ────────────────────────────────────────────────────────────────
/*
 * Figma 3028:67679 "Toggle buttons":
 *   Active:   fill=#ebf1ec stroke=#c1d4c4 r=10, text #387440 fs=12 fw=600
 *   Inactive: fill=#ffffff stroke=#cccccc r=10, text #70706e fs=12 fw=600
 *   Height: 32px, padding: px-[16px]
 */
const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'relative flex items-center justify-center h-[32px] px-[16px] rounded-[10px] border',
      "max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-1.5 max-md:before:content-['']",
      'font-sans font-semibold whitespace-nowrap transition-colors duration-100',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green',
      active
        ? 'bg-[#ebf1ec] border-[#c1d4c4] text-[#387440]'
        : 'bg-white border-[#cccccc] text-[#70706e]',
    ].join(' ')}
    style={{ fontSize: '12px', lineHeight: '14.3px' }}
    aria-selected={active}
  >
    {children}
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────

const ValidateSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checks');
  const [report] = useState(() => getBulkState().report || null);

  const {
    validRows,
    failedRows,
    minors,
    adults,
    missingContact,
    duplicates,
    formatErrors,
    checks,
  } = report || EMPTY_REPORT;

  // Derive failed+warning cards for the second tab
  const failedChecks = checks.filter((c) => c.variant === 'failed' || c.variant === 'warning');

  log('mount', { validRows, failedRows, minors, adults, checkCount: checks.length });
  log('activeTab', activeTab);

  const handleReUpload = () => {
    log('re-upload → /onboarding/institution/upload');
    navigate('/onboarding/institution/upload');
  };

  const handleProceed = () => {
    log('proceed → /onboarding/institution/confirm', { validRows });
    navigate('/onboarding/institution/confirm');
  };

  const handleTabChange = (tab) => {
    log('tab change', { from: activeTab, to: tab });
    setActiveTab(tab);
  };

  // Stat cards swap content between tabs
  const visibleStats =
    activeTab === 'failed'
      ? [
          {
            value: failedRows,
            label: 'Total Failed',
            valueColor: '#c0392b',
            labelColor: '#c0392b',
          },
          {
            value: missingContact,
            label: 'Missing Fields',
            valueColor: '#c0392b',
            labelColor: '#c0392b',
          },
          { value: duplicates, label: 'Duplicates', valueColor: '#c0392b', labelColor: '#c0392b' },
          {
            value: formatErrors,
            label: 'Format Errors',
            valueColor: '#c0392b',
            labelColor: '#c0392b',
          },
        ]
      : [
          { value: validRows, label: 'Valid Rows', valueColor: '#387440', labelColor: '#2a5730' },
          { value: failedRows, label: 'Failed Rows', valueColor: '#c0392b', labelColor: '#2a5730' },
          { value: minors, label: 'Minors', valueColor: '#c8951a', labelColor: '#2a5730' },
          { value: adults, label: 'Adults', valueColor: '#595959', labelColor: '#2a5730' },
        ];
  log('visibleStats', { tab: activeTab, labels: visibleStats.map((s) => s.label) });

  // Which check cards to display
  const visibleChecks = activeTab === 'checks' ? checks : failedChecks;
  log('visibleChecks', { count: visibleChecks.length, tab: activeTab });

  if (!report) {
    return <Navigate to="/onboarding/institution/upload" replace />;
  }

  return (
    <div className="flex flex-1 flex-col items-center py-[88px] px-6 max-md:px-4 max-md:py-4">
      {/* ── Content column: max-w=897px centred ── */}
      <div className="w-full max-w-[897px] flex flex-col gap-[40px] max-md:gap-3">
        {/* ── Upper block: header + stats + tabs + checks ── gap=16 between each */}
        <div className="flex flex-col gap-[16px] max-md:gap-3">
          {/* ── Header block ── */}
          <div className="flex flex-col items-center gap-[8px] max-md:items-start">
            {/* Caption badge — Figma 3028:67078 */}
            <Captions
              items={[{ index: '06', label: 'Validate File' }]}
              currentIndex={0}
              className="max-md:px-2.5 max-md:py-0.5"
            />

            {/* Headline — Figma 3028:67087 / 3028:67657
                Instrument Serif fs=64 lh=70 ls=-0.64px CENTER
                "26 issues found." → italic #387440 */}
            <h1
              className="text-center font-serif text-black max-md:text-left max-md:text-[24px]! max-md:leading-tight!"
              style={{
                fontSize: 'clamp(2rem, 4.4vw, 4rem)',
                lineHeight: 1.094,
                letterSpacing: '-0.64px',
              }}
            >
              File scanned{' '}
              <span className="italic text-brand-green">
                {failedRows
                  ? `${failedRows} row${failedRows > 1 ? 's' : ''} with issues.`
                  : 'No issues found.'}
              </span>
            </h1>

            {/* Subtitle — Figma 3028:67089 / 3028:67659 verbatim
                SF Pro Rounded 400 fs=16 lh=24 ls=0.2 #737373 CENTER max-w=536px */}
            <p
              className="font-sans font-normal text-center text-[#737373] max-md:text-left max-md:text-[14px]! max-md:leading-5!"
              style={{
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                lineHeight: '24px',
                letterSpacing: '0.2px',
                maxWidth: '536px',
              }}
            >
              {validRows} rows are valid and ready to submit. The {failedRows} rows below have
              problems they&apos;ll be skipped but you can download and fix them separately.
            </p>

            {/* WavyDivider — Figma 3028:67660 "Line 1" (200×0) */}
            <WavyDivider />
          </div>

          {/* ── Stat cards — Figma 3028:67091 / 3028:67661 "File summary"
               HORIZONTAL gap=38, 897×98
               Swap to error metrics on "failed rows" tab ── */}
          <div
            className="flex items-center justify-between max-md:grid max-md:grid-cols-2 max-md:items-stretch max-md:gap-2!"
            style={{ gap: '38px' }}
            role="region"
            aria-label={activeTab === 'failed' ? 'Error row summary' : 'File scan summary'}
          >
            {visibleStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                valueColor={stat.valueColor}
                labelColor={stat.labelColor}
              />
            ))}
          </div>

          {/* ── Tab switcher + check cards ── */}
          <div className="flex flex-col gap-[16px] max-md:gap-2">
            {/* Tab switcher — Figma 3028:67109 / 3028:67679 "Toggle buttons" */}
            <div className="flex flex-wrap items-center gap-[8px]" role="tablist">
              <TabButton active={activeTab === 'checks'} onClick={() => handleTabChange('checks')}>
                Validation checks
              </TabButton>
              <TabButton active={activeTab === 'failed'} onClick={() => handleTabChange('failed')}>
                {failedRows} failed rows
              </TabButton>
            </div>

            {/* Download banner — only on "failed rows" tab
                Figma 3034:71143, 897×63 */}
            {activeTab === 'failed' && failedRows > 0 && <DownloadBanner failedRows={failedRows} />}

            {/* Check card list — Figma 3028:67114 "Checks view" VERTICAL gap=16 */}
            <div
              className="flex flex-col gap-[16px] max-md:gap-2"
              role="list"
              aria-label={
                activeTab === 'checks'
                  ? 'All validation checks'
                  : `${failedChecks.length} failed or warning checks`
              }
            >
              {visibleChecks.map((check, i) => {
                log('rendering check card', {
                  index: i,
                  variant: check.variant,
                  title: check.title,
                });
                return (
                  <ValidationCheckCard
                    key={`${check.variant}-${i}`}
                    variant={check.variant}
                    title={check.title}
                    description={check.description}
                    rows={check.rows}
                    howToFix={check.howToFix}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CTA row — Figma 3028:67164 "Frame 360"
             HORIZONTAL gap=19, 897×56 ── */}
        <div className="flex items-center gap-[19px] w-full max-md:contents">
          {/* Re-Upload File — Figma 3028:67166
               218×56, fill=#ffffff, stroke=#111111(2px), r=14 */}
          <button
            type="button"
            onClick={handleReUpload}
            className={[
              'flex items-center justify-center gap-[8px]',
              'h-[56px] w-[218px] shrink-0',
              'rounded-[14px] border-2 border-[#111111] bg-white',
              'font-sans font-bold text-[16px] leading-6 text-[#111111]',
              // Phones: secondary action becomes a small centred text link above the pinned CTA.
              "relative max-md:h-auto max-md:w-auto max-md:self-center max-md:gap-1 max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:text-[13px] max-md:font-semibold max-md:leading-5 max-md:text-brand-green max-md:underline max-md:underline-offset-2 max-md:before:absolute max-md:before:-inset-x-3 max-md:before:-inset-y-3 max-md:before:content-['']",
              'transition-opacity duration-100 hover:opacity-80',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]',
            ].join(' ')}
          >
            <ArrowLeftIcon className="size-[20px] shrink-0 max-md:size-4" />
            Re-Upload File
          </button>

          {/* Proceed With N Valid Rows — Figma 3028:67175 / 3028:67745
               flex-1, fill=#387440, stroke=#2a5730(2px), r=14 */}
          <StickyActionBar bleed={16}>
            <button
              type="button"
              onClick={handleProceed}
              disabled={!validRows}
              data-testid="proceed-valid-rows"
              className={[
                'flex flex-1 items-center justify-center gap-[8px] max-md:w-full max-md:flex-none',
                'h-[56px]',
                'rounded-[14px] border-2 border-[#2a5730] bg-[#387440]',
                'font-sans font-bold text-[16px] leading-6 text-white',
                'transition-opacity duration-100 hover:opacity-90',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a5730]',
              ].join(' ')}
            >
              Proceed With {validRows} Valid Rows
              <ArrowRightIcon />
            </button>
          </StickyActionBar>
        </div>

        {/* ── Footer link — consistent with other onboarding steps ── */}
        <div className="flex items-center justify-center gap-2 text-[14px] leading-6 max-md:text-[13px] max-md:leading-5">
          <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="font-semibold text-brand-green underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{ letterSpacing: '0.1px' }}
          >
            Log in Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ValidateSection;
