import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Captions from '../../ui/Captions.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import ValidationCheckCard from './ValidationCheckCard.jsx';
import { ArrowRightIcon, ArrowLeftIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

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
const MOCK = {
  validRows: 847,
  failedRows: 26,
  minors: 312,
  adults: 532,
  // Breakdown used by the "failed rows" tab stat cards
  missingContact: 14,
  duplicates: 8,
  formatErrors: 4,
  checks: [
    {
      variant: 'passed',
      title: 'Template format',
      description: 'All required columns present in correct order',
      rows: [],
    },
    {
      variant: 'passed',
      title: 'Date of birth format',
      description: 'All dates in DD/MM/YYYY  847 valid',
      rows: [],
    },
    {
      variant: 'passed',
      title: 'Platform duplicates',
      description: 'No existing accounts matched by email or phone',
      rows: [],
    },
    {
      variant: 'failed',
      title: 'Missing required fields  14 rows',
      description:
        'Rows 34, 67, 89, 112, 145, 198, 234, 267, 301, 344, 378, 412, 456, 489  email and phone both missing',
      howToFix:
        'Open your spreadsheet and add a valid email address or phone number for each flagged row.',
      rows: [
        { row: '34', name: 'Abena Owusu', dob: '12/03/2009', reason: 'No email or phone' },
        { row: '67', name: 'Kwame Yeboah', dob: '15/07/2008', reason: 'No email or phone' },
        { row: '89', name: 'Adwoa Mensah', dob: '22/02/2009', reason: 'No email or phone' },
        { row: '112', name: 'Kofi Asante', dob: '03/11/2007', reason: 'No email or phone' },
        { row: '145', name: 'Akosua Frimpong', dob: '18/05/2010', reason: 'No email or phone' },
        { row: '198', name: 'Ama Boateng', dob: '07/09/2008', reason: 'No email or phone' },
        { row: '234', name: 'Yaw Darko', dob: '14/01/2009', reason: 'No email or phone' },
        { row: '267', name: 'Efua Mensah', dob: '28/06/2010', reason: 'No email or phone' },
        { row: '301', name: 'Kojo Osei', dob: '05/12/2007', reason: 'No email or phone' },
        { row: '344', name: 'Abena Asare', dob: '19/04/2008', reason: 'No email or phone' },
        { row: '378', name: 'Fiifi Agyeman', dob: '30/08/2009', reason: 'No email or phone' },
        { row: '412', name: 'Adwoa Kyei', dob: '11/02/2010', reason: 'No email or phone' },
        { row: '456', name: 'Kwesi Baah', dob: '24/07/2007', reason: 'No email or phone' },
        { row: '489', name: 'Kwabena Tawiah', dob: '08/04/2006', reason: 'No email or phone' },
      ],
    },
    {
      variant: 'failed',
      title: 'In-file duplicates  8 rows',
      description: '4 pairs with identical name + DOB. First occurrence kept, duplicate flagged',
      howToFix:
        'Remove or correct the duplicate entries. Each person should appear only once in the file.',
      rows: [
        { row: '78', name: 'Esi Amponsah', dob: '04/05/2008', reason: 'Duplicate of row 23' },
        { row: '134', name: 'Nana Akoto', dob: '17/09/2007', reason: 'Duplicate of row 55' },
        { row: '211', name: 'Mawuli Agbeko', dob: '22/03/2009', reason: 'Duplicate of row 102' },
        { row: '289', name: 'Akua Sarpong', dob: '09/11/2008', reason: 'Duplicate of row 176' },
        { row: '356', name: 'Esi Amponsah', dob: '04/05/2008', reason: 'Duplicate of row 23' },
        { row: '423', name: 'Nana Akoto', dob: '17/09/2007', reason: 'Duplicate of row 55' },
        { row: '510', name: 'Mawuli Agbeko', dob: '22/03/2009', reason: 'Duplicate of row 102' },
        { row: '587', name: 'Akua Sarpong', dob: '09/11/2008', reason: 'Duplicate of row 176' },
      ],
    },
    {
      variant: 'warning',
      title: 'Minors without parent contact 114 rows',
      description: 'Accounts created, but no opt-out notification can be sent. Flag for follow-up.',
      howToFix:
        'Add a parent or guardian email or phone number in the Parent_Contact column for under-18 rows.',
      rows: [
        { row: '12', name: 'Kofi Acheampong', dob: '14/06/2010', reason: 'No parent contact' },
        { row: '19', name: 'Akosua Tetteh', dob: '03/02/2011', reason: 'No parent contact' },
        { row: '27', name: 'Kwame Amoah', dob: '21/09/2010', reason: 'No parent contact' },
        { row: '41', name: 'Ama Ofori', dob: '08/11/2011', reason: 'No parent contact' },
        { row: '53', name: 'Yaw Quansah', dob: '17/04/2012', reason: 'No parent contact' },
        { row: '60', name: 'Abena Nkrumah', dob: '29/07/2010', reason: 'No parent contact' },
        { row: '74', name: 'Kojo Adjei', dob: '05/01/2011', reason: 'No parent contact' },
        { row: '88', name: 'Efua Owusu', dob: '13/05/2012', reason: 'No parent contact' },
        { row: '95', name: 'Fiifi Asante', dob: '24/08/2010', reason: 'No parent contact' },
        { row: '101', name: 'Esi Mensah', dob: '07/03/2011', reason: 'No parent contact' },
      ],
    },
    {
      variant: 'failed',
      title: 'Invalid phone format 4 rows',
      description: 'Rows 502, 611, 734, 798  phone numbers not in +233 format',
      howToFix: 'Phone numbers must start with +233 followed by 9 digits, e.g. +233201234567.',
      rows: [
        { row: '502', name: 'Nana Adu', dob: '16/03/2008', reason: 'Invalid: 0501234567' },
        { row: '611', name: 'Kosi Agyekum', dob: '25/10/2009', reason: 'Invalid: 244987654' },
        { row: '734', name: 'Abena Darko', dob: '12/07/2007', reason: 'Invalid: +1234567890' },
        { row: '798', name: 'Kwaku Boateng', dob: '03/09/2010', reason: 'Invalid: 07712345678' },
      ],
    },
  ],
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
      className="flex items-center gap-[16px] w-full px-[16px] rounded-[10px]"
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
          className="font-sans font-semibold truncate"
          style={{ fontSize: '14px', lineHeight: '16px', color: '#922b21' }}
        >
          Download the error file to see all {failedRows} rows with failure reasons
        </p>
        <p
          className="font-sans font-normal truncate"
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
          'flex items-center justify-center gap-[8px] shrink-0',
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
        onClick={() => log('download csv clicked')}
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
      className="flex flex-col items-center py-[9px] gap-[4px] rounded-[10px] border border-black bg-[#f8f8f4]"
      style={{ width: '194px', height: '98px' }}
    >
      {/* Inner box */}
      <div
        className="flex items-center justify-center w-[177px] h-[60px] rounded-[10px] bg-white"
        style={{ border: '0.4px solid rgba(0,0,0,0.4)' }}
      >
        <span
          className="font-sans font-normal"
          style={{ fontSize: '32px', lineHeight: '22px', color: valueColor }}
        >
          {value}
        </span>
      </div>
      {/* Label */}
      <span
        className="font-sans font-medium"
        style={{ fontSize: '10px', lineHeight: '16px', color: labelColor }}
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
      'flex items-center justify-center h-[32px] px-[16px] rounded-[10px] border',
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

  const {
    validRows,
    failedRows,
    minors,
    adults,
    missingContact,
    duplicates,
    formatErrors,
    checks,
  } = MOCK;

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
            label: 'Missing Contact',
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

  return (
    <div className="flex flex-1 flex-col items-center py-[88px] px-6">
      {/* ── Content column: max-w=897px centred ── */}
      <div className="w-full max-w-[897px] flex flex-col gap-[40px]">
        {/* ── Upper block: header + stats + tabs + checks ── gap=16 between each */}
        <div className="flex flex-col gap-[16px]">
          {/* ── Header block ── */}
          <div className="flex flex-col items-center gap-[8px]">
            {/* Caption badge — Figma 3028:67078 */}
            <Captions items={[{ index: '06', label: 'Validate File' }]} currentIndex={0} />

            {/* Headline — Figma 3028:67087 / 3028:67657
                Instrument Serif fs=64 lh=70 ls=-0.64px CENTER
                "26 issues found." → italic #387440 */}
            <h1
              className="text-center font-serif text-black"
              style={{
                fontSize: 'clamp(2rem, 4.4vw, 4rem)',
                lineHeight: 1.094,
                letterSpacing: '-0.64px',
              }}
            >
              File scanned{' '}
              <span className="italic text-brand-green">{failedRows} issues found.</span>
            </h1>

            {/* Subtitle — Figma 3028:67089 / 3028:67659 verbatim
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
            className="flex items-center justify-between"
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
          <div className="flex flex-col gap-[16px]">
            {/* Tab switcher — Figma 3028:67109 / 3028:67679 "Toggle buttons" */}
            <div className="flex items-center gap-[8px]" role="tablist">
              <TabButton active={activeTab === 'checks'} onClick={() => handleTabChange('checks')}>
                Validation checks
              </TabButton>
              <TabButton active={activeTab === 'failed'} onClick={() => handleTabChange('failed')}>
                {failedRows} failed rows
              </TabButton>
            </div>

            {/* Download banner — only on "failed rows" tab
                Figma 3034:71143, 897×63 */}
            {activeTab === 'failed' && <DownloadBanner failedRows={failedRows} />}

            {/* Check card list — Figma 3028:67114 "Checks view" VERTICAL gap=16 */}
            <div
              className="flex flex-col gap-[16px]"
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
        <div className="flex items-center gap-[19px] w-full">
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
              'transition-opacity duration-100 hover:opacity-80',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]',
            ].join(' ')}
          >
            <ArrowLeftIcon className="size-[20px] shrink-0" />
            Re-Upload File
          </button>

          {/* Proceed With N Valid Rows — Figma 3028:67175 / 3028:67745
               flex-1, fill=#387440, stroke=#2a5730(2px), r=14 */}
          <button
            type="button"
            onClick={handleProceed}
            className={[
              'flex flex-1 items-center justify-center gap-[8px]',
              'h-[56px]',
              'rounded-[14px] border-2 border-[#2a5730] bg-[#387440]',
              'font-sans font-bold text-[16px] leading-6 text-white',
              'transition-opacity duration-100 hover:opacity-90',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a5730]',
            ].join(' ')}
          >
            Proceed With {validRows} Valid Rows
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

export default ValidateSection;
