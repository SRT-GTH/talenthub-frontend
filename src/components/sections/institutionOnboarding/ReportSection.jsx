import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Captions from '../../ui/Captions.jsx';
import StickyActionBar from '../../ui/form/StickyActionBar.jsx';
import Loader from '../../ui/Loader.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, ArrowLeftIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';
import ApiErrorNote from '../../shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../../services/apiErrors.js';
import {
  getBulkState,
  getBulkStatus,
  clearBulkState,
  describeRow,
  downloadFailedRows,
  downloadFullReport,
} from '../../../services/institutionBulk.js';

const log = debug('ReportSection');

/*
 * ReportSection — Phase 8 / Upload Report — final processing feedback + full report.
 * Figma main frames:
 *   3052:74319  Report-Loading state (1728×1119)
 *   3065:7371   Report-Complete state (1728×1119)
 *
 * Two-phase UI controlled by `phase` state:
 *   'loading' → animated processing counters + disabled CTA
 *   'complete' → full report: stat cards + expandable check cards + CTAs
 *
 * Route:   /onboarding/institution/report
 * Layout:  InstitutionOnboardingLayout — NO right panel (added to exclusion list)
 * Back:    /onboarding/institution/confirm
 * Next:    Institution Dashboard (external, mock-only)
 *
 * Figma nodes referenced:
 *   3052:74319  main loading frame
 *   3065:7371   main report frame
 *   3052:74428  headline loading "Creating accounts.." (italic green "accounts..")
 *   3052:74430  loading subtitle (fs=16 fw=400 #737373)
 *   3052:74433  loading stat card 1 — Accounts To Create (270×98 #ebf1ec/0.5)
 *   3052:75000  loading stat card 2 — SMS Queued (281×98 #faf4e8)
 *   3052:75007  loading stat card 3 — Skipped (281×98 #f8f8f4)
 *   3061:75343  processing log component (890×154)
 *   3052:74476  info banner (890×46 #eaeffb)
 *   3052:74493  "View Upload Report" disabled button (734×56 #bfbfbf)
 *   3052:74484  "Back" button (128×56 white)
 *   headline report: "821 students are live" (styleTable[75] → italic #387440 for "live")
 *   3065:7371   report stat cards (194×98 each, gap=35)
 *   3069:20561  check card 1 header — "In-file duplicates…" (821 rows, dark badge)
 *   3069:20606  check card 2 header — "Invalid phone format…" (21/4 rows, red badge)
 *   3065:8002–8049  expanded row nodes (created rows)
 *   3069:20631–20652 expanded failed row nodes
 *   3065:8347  "Upload another batch" button (220×56 white)
 *   3065:8356  "Loading Institution Dashboard" loading-state button (643×56 green)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Mock data (replace with real API responses)
// ─────────────────────────────────────────────────────────────────────────────

// Live data comes from getBulkStatus() (services/institutionBulk.js).

// ─────────────────────────────────────────────────────────────────────────────
// Hand-crafted SVG icons
// (bounding box + stroke/fill from Figma — no raw path data copied)
// ─────────────────────────────────────────────────────────────────────────────

/** 13×13 download arrow icon — used in download buttons */
const DownloadArrowIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M6.5 1.5v6.5M6.5 8l-2-2M6.5 8l2-2"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2 11h9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** 14×14 users icon — used in report check card header (stroke #70706e) */
const CheckCardUsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    {/* Primary person */}
    <circle cx="5.5" cy="4" r="2.2" stroke="#70706e" strokeWidth="1.1" />
    <path
      d="M1 13c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5"
      stroke="#70706e"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    {/* Secondary person (right) */}
    <circle cx="10.5" cy="4.5" r="1.7" stroke="#70706e" strokeWidth="1.0" />
    <path d="M9 13c.3-2 1.8-3.2 3-3.2" stroke="#70706e" strokeWidth="1.0" strokeLinecap="round" />
  </svg>
);

/** 12×7 chevron — used in report check card expand/collapse */
const ChevronIcon = ({ expanded }) => (
  <svg
    width="12"
    height="7"
    viewBox="0 0 12 7"
    fill="none"
    aria-hidden="true"
    style={{
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      flexShrink: 0,
    }}
  >
    <path
      d="M1 1l5 5 5-5"
      stroke="#babab7"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 22×22 info circle — used in the blue info banner (stroke #ffffff@1.2) */
const InfoCircleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="11" fill="#244a9f" />
    {/* Vertical bar (information "i") */}
    <line x1="11" y1="8.5" x2="11" y2="14" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    {/* Dot above the bar */}
    <circle cx="11" cy="6.5" r="0.9" fill="white" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Decorative concentric rings (loading / report visual motif)
// Figma Group 18 (80×80): three bordered rings (80/64/48 diameter, 3px stroke)
// + inner circle 34×34 (#ebf1ec/0.5) with small inner element
// ─────────────────────────────────────────────────────────────────────────────
const ConcentricRings = () => (
  <div
    aria-hidden="true"
    className="relative flex items-center justify-center"
    style={{ width: '80px', height: '80px' }}
  >
    {/* Outermost ring — 80×80 */}
    <div
      className="absolute rounded-full"
      style={{ width: '80px', height: '80px', border: '3px solid #000000', borderRadius: '50%' }}
    />
    {/* Middle ring — 64×64 */}
    <div
      className="absolute rounded-full"
      style={{ width: '64px', height: '64px', border: '3px solid #000000', borderRadius: '50%' }}
    />
    {/* Inner ring — 48×48 */}
    <div
      className="absolute rounded-full"
      style={{ width: '48px', height: '48px', border: '3px solid #000000', borderRadius: '50%' }}
    />
    {/* Innermost filled circle — 34×34, #ebf1ec at 0.5 opacity */}
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: '34px',
        height: '34px',
        backgroundColor: 'rgba(235,241,236,0.5)',
        borderRadius: '50%',
      }}
    >
      {/* Small inner icon — 16×16 processing indicator */}
      <div style={{ width: '16px', height: '16px' }} className="flex items-center justify-center">
        <div
          className="rounded-full border-[1.5px] border-brand-green animate-spin"
          style={{ width: '12px', height: '12px', borderTopColor: 'transparent' }}
        />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LoadingStatCard — stat card for the processing/loading phase
// Figma: 3052:74433 (card 1), 3052:75000 (card 2), 3052:75007 (card 3)
// Outer: h=98, colored bg, border #000000@1, r=10
// Inner: h=60, bg #fefefe, border #000000@0.4, r=10 (relative for progress bar)
// ─────────────────────────────────────────────────────────────────────────────
const LoadingStatCard = ({ value, valueColor, label, labelColor, outerFill }) => {
  log('LoadingStatCard render', { value, label });
  return (
    <div
      className="flex-1 flex flex-col items-center gap-[4px] max-md:h-auto! max-md:min-w-0 max-md:gap-0.5! max-md:border-black/15! max-md:py-2!"
      style={{
        height: '98px',
        backgroundColor: outerFill,
        border: '1px solid #000000',
        borderRadius: '10px',
        paddingTop: '9px',
        paddingBottom: '9px',
      }}
    >
      {/* Inner white box */}
      <div
        className="relative flex items-center justify-center overflow-hidden max-md:h-auto! max-md:border-0! max-md:bg-transparent!"
        style={{
          width: 'calc(100% - 18px)',
          height: '60px',
          backgroundColor: '#fefefe',
          border: '0.4px solid rgba(0,0,0,0.4)',
          borderRadius: '10px',
        }}
      >
        <span
          className="font-sans max-md:text-[24px]! max-md:leading-8!"
          style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', lineHeight: '22px', color: valueColor }}
        >
          {value}
        </span>
        {/* Thin pulsing progress bar at bottom — h=4px */}
        <div
          className="absolute bottom-0 left-0 right-0 animate-pulse"
          style={{ height: '4px', backgroundColor: outerFill, borderRadius: '0 0 10px 10px' }}
        />
      </div>
      {/* Label below inner box */}
      <span
        className="font-sans font-medium max-md:px-1 max-md:text-center max-md:leading-4!"
        style={{ fontSize: '12px', lineHeight: '20px', color: labelColor, letterSpacing: '0.2px' }}
      >
        {label}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReportStatCard — stat card for the completed report view
// Figma: 194×98, inner box 177×60 with stacked value + sub-label (Frame 376)
// Pattern identical to ConfirmSection's ConfirmStatCard but with sub-label
// ─────────────────────────────────────────────────────────────────────────────
const ReportStatCard = ({
  value,
  valueColor,
  subLabel,
  subColor,
  label,
  labelColor,
  outerFill,
}) => {
  log('ReportStatCard render', { value, label });
  return (
    <div
      className="flex flex-col items-center gap-[4px] max-md:h-auto! max-md:w-full! max-md:gap-0! max-md:border-black/15! max-md:py-2!"
      style={{
        width: '194px',
        height: '98px',
        backgroundColor: outerFill,
        border: '1px solid #000000',
        borderRadius: '10px',
        paddingTop: '9px',
        paddingBottom: '9px',
      }}
    >
      {/* Inner white box — 177×60 */}
      <div
        className="flex flex-col items-center justify-center gap-[4px] max-md:h-auto! max-md:w-full! max-md:border-0! max-md:bg-transparent! max-md:p-0"
        style={{
          width: '177px',
          height: '60px',
          backgroundColor: '#fefefe',
          border: '0.4px solid rgba(0,0,0,0.4)',
          borderRadius: '10px',
        }}
      >
        <span
          className="font-sans max-md:text-[28px]! max-md:leading-8!"
          style={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)', lineHeight: '22px', color: valueColor }}
        >
          {value}
        </span>
        <span
          className="font-sans text-center max-md:hidden"
          style={{
            fontSize: 'var(--fs-10)',
            lineHeight: '16px',
            color: subColor,
            paddingLeft: '4px',
            paddingRight: '4px',
          }}
        >
          {subLabel}
        </span>
      </div>
      {/* Outer label below inner box */}
      <span
        className="font-sans font-medium text-center"
        style={{ fontSize: 'var(--fs-10)', lineHeight: '16px', color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ProcessingLog — scrollable log of batch job activity
// Figma: 3061:75343 (890×154). Log entries: 6px dot + text, gap=7
// ─────────────────────────────────────────────────────────────────────────────
const ProcessingLog = ({ entries }) => (
  <div className="flex flex-col gap-[10px] w-full">
    {/* "Processing log" label — fs=11 fw=700 ls=0.6 #70706e */}
    <span
      className="font-sans font-bold"
      style={{
        fontSize: 'var(--fs-11)',
        lineHeight: '13px',
        letterSpacing: '0.6px',
        color: '#70706e',
      }}
    >
      Processing log
    </span>
    {/* Log box — 890×130 bg #f8f8f4 border #000000@1 r=10 */}
    <div
      className="overflow-y-auto max-md:h-24! max-md:border-black/15! max-md:px-3! max-md:py-2.5!"
      style={{
        height: '130px',
        backgroundColor: '#f8f8f4',
        border: '1px solid #000000',
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      <div className="flex flex-col gap-[8px] max-md:gap-1.5">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-[7px]"
            style={{ transition: 'opacity 0.4s ease', opacity: 1 }}
          >
            {/* 6×6 colored dot — r=3 */}
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: entry.dot,
                borderRadius: '3px',
                flexShrink: 0,
              }}
            />
            <span
              className="font-sans max-md:text-[13px]!"
              style={{ fontSize: '12px', lineHeight: '15.4px', color: '#111111' }}
            >
              {entry.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// InfoBanner — informative blue banner below processing log
// Figma: 3052:74476 (890×46 #eaeffb, border #bfcef2@1, r=10)
// ─────────────────────────────────────────────────────────────────────────────
const InfoBanner = () => (
  <div
    className="flex items-center max-md:h-auto! max-md:items-start max-md:py-2.5"
    style={{
      width: '100%',
      height: '46px',
      backgroundColor: '#eaeffb',
      border: '1px solid #bfcef2',
      borderRadius: '10px',
      paddingLeft: '12px',
      paddingRight: '16px',
      gap: '9px',
    }}
  >
    <InfoCircleIcon />
    <span
      className="font-sans max-md:text-[13px]! max-md:leading-[18px]!"
      style={{ fontSize: '12px', lineHeight: '18px', color: '#244a9f' }}
    >
      Safe to close this tab processing continues in the background. We&apos;ll email you when
      it&apos;s complete.
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DownloadButton — compact download action button
// Figma: 3065:7371 Frame 386 (two buttons, h=40, r=10)
// ─────────────────────────────────────────────────────────────────────────────
const DownloadButton = ({ label, iconColor, borderColor, onClick, testId }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testId}
    className="relative flex items-center gap-[8px] font-sans font-bold max-md:h-9! max-md:w-full max-md:justify-center max-md:text-[13px]! max-md:before:absolute max-md:before:inset-x-0 max-md:before:-inset-y-1 max-md:before:content-['']"
    style={{
      height: '40px',
      backgroundColor: '#ffffff',
      border: `1px solid ${borderColor}`,
      borderRadius: '10px',
      paddingLeft: '14px',
      paddingRight: '14px',
      fontSize: '13px',
      lineHeight: '15.86px',
      color: iconColor,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}
  >
    <DownloadArrowIcon color={iconColor} />
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// ReportCheckCard — expandable check card for the report view
// Figma: 3069:20561 (header, created), 3069:20606 (header, failed)
// Collapsed: h≈46, r=16, border #000000@1
// Header: bg #f8f8f4, h=44, px=16, icon + title + badge + chevron
// Expanded: + row table + footer
// ─────────────────────────────────────────────────────────────────────────────
const ReportCheckCard = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCreated = card.type === 'created';

  log('ReportCheckCard render', { id: card.id, isExpanded, rowCount: card.rows.length });

  const handleToggle = () => {
    log('ReportCheckCard toggle', { id: card.id, willExpand: !isExpanded });
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="w-full overflow-hidden max-md:rounded-[10px]! max-md:border-black/15!"
      style={{ border: '1px solid #000000', borderRadius: '16px' }}
    >
      {/* ── Header row ── */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
        className="flex items-center justify-between cursor-pointer max-md:px-3!"
        style={{
          minHeight: '44px',
          backgroundColor: '#f8f8f4',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '10px',
        }}
      >
        {/* Left: icon + title */}
        <div className="flex items-center gap-[10px] flex-1 min-w-0">
          <CheckCardUsersIcon />
          <span
            className="font-sans font-semibold truncate max-md:whitespace-normal"
            style={{ fontSize: '14px', lineHeight: '16.7px', color: '#111111' }}
          >
            {card.title}
          </span>
        </div>

        {/* Right: badge + chevron */}
        <div className="flex items-center gap-[8px] flex-shrink-0">
          {/* Row count badge */}
          <span
            className="font-sans font-bold"
            style={{
              backgroundColor: isCreated ? '#000000' : '#f9ebea',
              color: isCreated ? '#ffffff' : '#c0392b',
              borderRadius: '100px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '3px',
              paddingBottom: '3px',
              fontSize: 'var(--fs-11)',
              lineHeight: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            {card.badgeCount} rows
          </span>
          <ChevronIcon expanded={isExpanded} />
        </div>
      </div>

      {/* ── Expanded row table ── */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Table header */}
          <div
            className="grid font-sans font-bold max-md:hidden"
            style={{
              gridTemplateColumns: '48px 1fr 90px 1fr 90px',
              padding: '6px 16px',
              fontSize: 'var(--fs-10)',
              lineHeight: '13px',
              letterSpacing: '0.3px',
              color: '#70706e',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>ROW</span>
            <span>NAME</span>
            <span>{isCreated ? 'TYPE' : 'DOB'}</span>
            <span>{isCreated ? 'LEVEL' : 'REASON'}</span>
            <span style={{ textAlign: 'right' }}>STATUS</span>
          </div>

          {/* Data rows */}
          {card.rows.map((row, i) => (
            <ReportTableRow key={i} row={row} isCreated={isCreated} isAlt={i % 2 === 0} />
          ))}

          {/* Footer */}
          <ReportTableFooter card={card} />
        </div>
      )}
    </div>
  );
};

/** Single data row inside an expanded ReportCheckCard */
const ReportTableRow = ({ row, isCreated, isAlt }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="grid items-center font-sans max-md:flex max-md:flex-wrap max-md:gap-x-3 max-md:gap-y-0.5 max-md:px-3! max-md:py-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridTemplateColumns: '48px 1fr 90px 1fr 90px',
        padding: '0 16px',
        minHeight: '34px',
        backgroundColor: hovered
          ? 'rgba(235,241,236,0.3)'
          : isAlt
            ? 'rgba(248,248,244,0.5)'
            : '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        transition: 'background-color 0.12s ease',
      }}
    >
      {/* Row number */}
      <span style={{ fontSize: 'var(--fs-11)', color: '#70706e' }}>{row.row}</span>

      {/* Name */}
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#111111' }}>{row.name}</span>

      {/* col3 — type (created) or dob (failed) */}
      <span style={{ fontSize: 'var(--fs-10)', color: '#70706e' }}>{row.col3}</span>

      {/* col4 — level (created) or reason (failed) */}
      <span style={{ fontSize: 'var(--fs-10)', color: isCreated ? '#70706e' : '#c0392b' }}>
        {row.col4}
      </span>

      {/* Status pill */}
      <div className="max-md:ml-auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span
          className="font-sans font-semibold"
          style={{
            backgroundColor: isCreated ? 'rgba(235,241,236,0.5)' : '#f9ebea',
            color: isCreated ? '#387440' : '#c0392b',
            borderRadius: '100px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '3px',
            paddingBottom: '3px',
            fontSize: 'var(--fs-10)',
            lineHeight: '12px',
          }}
        >
          {isCreated ? '✓ Created' : 'Skipped'}
        </span>
      </div>
    </div>
  );
};

/** Footer row of an expanded ReportCheckCard */
const ReportTableFooter = ({ card }) => {
  const isInfo = card.footerType === 'info';
  return (
    <div
      className="flex items-center"
      style={{
        minHeight: '33px',
        padding: '0 16px',
        backgroundColor: isInfo ? '#fefcf5' : '#ffffff',
        borderTop: isInfo ? '1px solid #000000' : '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="font-sans max-md:py-2 max-md:text-[12px]!"
        style={{
          fontSize: isInfo ? '10px' : '11px',
          fontWeight: isInfo ? 600 : 400,
          lineHeight: isInfo ? '16.5px' : '13px',
          color: isInfo ? '#70706e' : '#babab7',
        }}
      >
        {card.footerText}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReportSection — main component
// ─────────────────────────────────────────────────────────────────────────────
const ReportSection = () => {
  const navigate = useNavigate();
  const [saved] = useState(() => getBulkState());
  const report = saved.report || null;

  /**
   * phase:
   *   'loading'  — processing view while the backend creates accounts
   *   'complete' — full report view
   */
  const [phase, setPhase] = useState('loading');
  const [status, setStatus] = useState(null);
  const [pollError, setPollError] = useState('');
  const [isDashboardLoading, setIsDashboardLoading] = useState(false); // dashboard btn loading state
  const isReportReady = Boolean(status?.done); // enables "View Upload Report" btn

  log('mount', { phase, bulkOperationId: saved.bulkOperationId });

  // ── Poll the bulk operation until it finishes ───────────────────────────────
  useEffect(() => {
    if (!saved.bulkOperationId) return undefined;
    let stopped = false;
    let timer;
    const tick = async () => {
      try {
        const s = await getBulkStatus();
        if (stopped) return;
        setStatus(s);
        setPollError('');
        if (s.done) return;
      } catch (err) {
        if (stopped) return;
        setPollError(getApiErrorMessage(err, 'Could not get the upload status. Retrying…'));
        // Signed out, another institution's upload, or gone: retrying won't help.
        if ([401, 403, 404].includes(err?.response?.status)) return;
      }
      timer = setTimeout(tick, 2000);
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [saved.bulkOperationId]);

  const total = status?.total ?? report?.validRows ?? 0;
  const logs = [{ dot: '#c8951a', text: `Batch job started — ${total} valid rows queued` }];
  if (status?.processed) {
    logs.push({ dot: '#1d7c4d', text: `Rows processed: ${status.processed} of ${status.total}` });
  }
  if (status?.failed) {
    logs.push({
      dot: '#c0392b',
      text: `${status.failed} row${status.failed > 1 ? 's' : ''} could not be created`,
    });
  }
  if (status?.done) {
    logs.push({ dot: '#1d7c4d', text: `Finished: ${status.successful} accounts created ✓` });
  }

  // ── Report view data ─────────────────────────────────────────────────────────
  const created = status?.created ?? [];
  const notCreated = [
    ...(status?.rejected ?? []).map((r) => ({ ...describeRow(r), reason: r.reason })),
    ...(saved.rows || [])
      .filter((r) => r.problems?.length)
      .map((r) => ({ ...describeRow(r), reason: r.problems.map((p) => p.reason).join('; ') })),
  ];
  const SHOW = 8;
  const reportStats = [
    {
      value: status?.successful ?? 0,
      valueColor: '#387440',
      subLabel: 'Email invites sent',
      subColor: '#2a5730',
      label: 'Accounts Created',
      labelColor: '#2a5730',
      outerFill: 'rgba(235,241,236,0.5)',
    },
    {
      value: notCreated.length,
      valueColor: '#387440',
      subLabel: 'Download, fix & re-upload',
      subColor: '#2a5730',
      label: 'Failed rows',
      labelColor: '#2a5730',
      outerFill: '#f8f8f4',
    },
    {
      value: status?.parentNotices ?? 0,
      valueColor: '#3062d4',
      subLabel: 'Opt-out notices emailed',
      subColor: '#244a9f',
      label: 'Parents notified',
      labelColor: '#244a9f',
      outerFill: 'rgba(234,239,251,0.5)',
    },
    {
      value: report?.minorsNoParent ?? 0,
      valueColor: '#967014',
      subLabel: 'Skipped: need a parent email',
      subColor: '#967014',
      label: 'Minors — no parent',
      labelColor: '#967014',
      outerFill: '#faf4e8',
    },
  ];
  const checkCards = [
    {
      id: 'created',
      title: 'Accounts created',
      badgeCount: created.length,
      badgeType: 'created',
      type: 'created',
      rows: created.slice(0, SHOW).map((r) => {
        const d = describeRow(r);
        return { row: d.row, name: d.name, col3: d.type, col4: d.level };
      }),
      footerText:
        created.length > SHOW
          ? `Showing first ${SHOW} of ${created.length} rows — download the full report for the complete list`
          : `All ${created.length} rows shown`,
      footerType: 'info',
    },
    ...(notCreated.length
      ? [
          {
            id: 'failed',
            title: 'Not created — fix and re-upload',
            badgeCount: notCreated.length,
            badgeType: 'failed',
            type: 'failed',
            rows: notCreated
              .slice(0, SHOW)
              .map((d) => ({ row: d.row, name: d.name, col3: d.dob, col4: d.reason })),
            footerText:
              notCreated.length > SHOW
                ? `+ ${notCreated.length - SHOW} more rows in the download file`
                : 'Download the failed rows to fix them',
            footerType: 'more',
          },
        ]
      : []),
  ];

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleViewReport = () => {
    log('view report clicked');
    setPhase('complete');
  };

  const handleBack = () => {
    log('back clicked — navigating to confirm');
    navigate('/onboarding/institution/confirm');
  };

  const handleUploadAnother = () => {
    log('upload another batch clicked');
    clearBulkState();
    navigate('/onboarding/institution/upload');
  };

  const handleDashboard = () => {
    if (isDashboardLoading) return;
    log('go to institution dashboard clicked');
    setIsDashboardLoading(true);
    // The institution dashboard is not built yet.
  };

  if (!saved.bulkOperationId) {
    return <Navigate to="/onboarding/institution/upload" replace />;
  }

  // ── Shared header elements ─────────────────────────────────────────────────
  const isLoading = phase === 'loading';

  return (
    <div className="flex flex-col items-center py-[88px] px-6 w-full max-md:px-4 max-md:py-4">
      <div className="w-full max-w-[897px] flex flex-col gap-[40px] max-md:gap-3">
        {/* ─────────── HEADER BLOCK (shared by both phases) ─────────── */}
        <div className="flex flex-col items-center gap-[16px] max-md:items-start max-md:gap-2">
          {/* Caption badge */}
          <Captions
            items={[
              {
                index: '08',
                label: isLoading ? 'Processing Report' : 'Upload Complete',
              },
            ]}
            currentIndex={0}
            className="max-md:px-2.5 max-md:py-0.5"
          />

          {/* Headline — loading: "Creating accounts.." / report: "821 students are live" */}
          <h1
            className="font-display text-center max-md:text-left max-md:text-[24px]! max-md:leading-tight!"
            style={{
              fontSize: 'clamp(2.5rem, 4.4vw, 4rem)',
              lineHeight: '70px',
              letterSpacing: '-0.64px',
              color: '#000000',
            }}
          >
            {isLoading ? (
              <>
                Creating <span className="italic text-brand-green">accounts..</span>
              </>
            ) : (
              <>
                {status?.successful ?? 0} students are{' '}
                <span className="italic text-brand-green">live</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans text-center max-md:text-left max-md:text-[14px]! max-md:leading-5!"
            style={{
              fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
              lineHeight: '24px',
              letterSpacing: '0.2px',
              color: '#737373',
              maxWidth: '536px',
            }}
          >
            {isLoading
              ? 'Your student data is being processed. Watch the counters below \nthey update live as accounts are created.'
              : "Your batch processed successfully. Here's the full breakdown  and a download link for the ones who need fixing."}
          </p>

          <WavyDivider />
        </div>

        {/* Concentric rings — decorative visual motif (both phases) */}
        <div className="flex justify-center max-md:h-10 max-md:items-center">
          <div className="max-md:scale-50">
            <ConcentricRings />
          </div>
        </div>

        {/* ─────────── LOADING PHASE CONTENT ─────────── */}
        {isLoading && (
          <>
            {/* 3 loading stat cards — gap=28 */}
            <div className="flex gap-[28px] w-full max-md:grid max-md:grid-cols-3 max-md:gap-2">
              <LoadingStatCard
                value={total}
                valueColor="#387440"
                label="Accounts To Create"
                labelColor="#2a5730"
                outerFill="rgba(235,241,236,0.5)"
              />
              <LoadingStatCard
                value={report?.parentNotices ?? 0}
                valueColor="#a07715"
                label="Parent Notices"
                labelColor="#a07715"
                outerFill="#faf4e8"
              />
              <LoadingStatCard
                value={report?.failedRows ?? 0}
                valueColor="#575755"
                label="Skipped"
                labelColor="#111111"
                outerFill="#f8f8f4"
              />
            </div>

            {/* Processing log + info banner — gap=16 */}
            <div className="flex flex-col gap-[16px] w-full max-md:gap-3">
              <ProcessingLog entries={logs} />
              <ApiErrorNote message={pollError} className="max-w-none" />
              <InfoBanner />
            </div>
          </>
        )}

        {/* ─────────── REPORT PHASE CONTENT ─────────── */}
        {!isLoading && (
          <>
            {/* 4 report stat cards — 194×98 each, gap=35 */}
            <div className="flex gap-[35px] justify-center w-full flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
              {reportStats.map((stat) => (
                <ReportStatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Downloads + check cards — gap=16 */}
            <div className="flex flex-col gap-[16px] w-full max-md:gap-2">
              {/* Download button row */}
              <div className="flex gap-[10px] max-md:flex-col max-md:gap-2">
                <DownloadButton
                  label={`Download ${notCreated.length} failed rows`}
                  onClick={() => downloadFailedRows(status?.rejected ?? [])}
                  testId="download-failed"
                  iconColor="#c0392b"
                  borderColor="#f9ebea"
                />
                <DownloadButton
                  label="Download full report"
                  onClick={() => downloadFullReport(status)}
                  testId="download-report"
                  iconColor="#387440"
                  borderColor="#ebf1ec"
                />
              </div>

              {/* Expandable check cards */}
              {checkCards.map((card) => (
                <ReportCheckCard key={card.id} card={card} />
              ))}
            </div>
          </>
        )}

        {/* ─────────── CTA ROW ─────────── */}
        {isLoading ? (
          /* Loading phase CTA — gap=19 */
          <div className="flex gap-[19px] w-full max-md:contents">
            {/* Back button — 128×56, white, #111111@2, r=14 */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-[8px] font-sans font-bold relative max-md:h-auto! max-md:w-auto! max-md:self-center max-md:gap-1 max-md:rounded-none! max-md:border-0! max-md:bg-transparent! max-md:text-[13px]! max-md:font-semibold max-md:leading-5! max-md:text-brand-green! max-md:underline max-md:underline-offset-2 max-md:before:absolute max-md:before:-inset-x-3 max-md:before:-inset-y-3 max-md:before:content-['']"
              style={{
                width: '128px',
                height: '56px',
                backgroundColor: '#ffffff',
                border: '2px solid #111111',
                borderRadius: '14px',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.1px',
                color: '#575755',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeftIcon className="max-md:size-4" />
              Back
            </button>

            {/* "View Upload Report" — flex-1, disabled → gray / active → green */}
            <StickyActionBar bleed={16}>
              <button
                type="button"
                onClick={isReportReady ? handleViewReport : undefined}
                disabled={!isReportReady}
                className="flex items-center justify-center gap-[8px] font-sans font-bold max-md:flex-none! max-md:w-full max-md:h-11! max-md:rounded-[10px]!"
                style={{
                  flex: 1,
                  height: '56px',
                  backgroundColor: isReportReady ? '#387440' : '#bfbfbf',
                  border: `2px solid ${isReportReady ? '#2a5730' : '#cccccc'}`,
                  borderRadius: '14px',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.1px',
                  color: '#ffffff',
                  cursor: isReportReady ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                }}
              >
                View Upload Report
                <ArrowRightIcon />
              </button>
            </StickyActionBar>
          </div>
        ) : (
          /* Report phase CTA — gap=20 */
          <div className="flex gap-[20px] w-full max-md:contents">
            {/* Upload another batch — 220×56, white, r=14 */}
            <button
              type="button"
              onClick={handleUploadAnother}
              className="flex items-center justify-center gap-[8px] font-sans font-bold relative max-md:h-auto! max-md:w-auto! max-md:self-center max-md:gap-1 max-md:rounded-none! max-md:border-0! max-md:bg-transparent! max-md:text-[13px]! max-md:font-semibold max-md:leading-5! max-md:text-brand-green! max-md:underline max-md:underline-offset-2 max-md:before:absolute max-md:before:-inset-x-3 max-md:before:-inset-y-3 max-md:before:content-['']"
              style={{
                width: '220px',
                height: '56px',
                backgroundColor: '#ffffff',
                border: '2px solid #111111',
                borderRadius: '14px',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.1px',
                color: '#575755',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeftIcon className="max-md:size-4" />
              Upload another batch
            </button>

            {/* Go to Institution Dashboard — flex-1, green */}
            <StickyActionBar bleed={16}>
              <button
                type="button"
                onClick={handleDashboard}
                disabled={isDashboardLoading}
                className="flex items-center justify-center gap-[8px] font-sans font-bold max-md:flex-none! max-md:w-full max-md:h-11! max-md:rounded-[10px]!"
                style={{
                  flex: 1,
                  height: '56px',
                  backgroundColor: isDashboardLoading ? '#2d5d33' : '#387440',
                  border: `2px solid ${isDashboardLoading ? '#224626' : '#2a5730'}`,
                  borderRadius: '14px',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.1px',
                  color: '#ffffff',
                  cursor: isDashboardLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isDashboardLoading ? (
                  <>
                    <Loader size="sm" label="Loading Institution Dashboard" />
                    Loading Institution Dashboard
                  </>
                ) : (
                  <>
                    Go to Institution Dashboard
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </StickyActionBar>
          </div>
        )}

        {/* Footer link — "Already Have an account? Log in Instead" */}
        <div className="flex items-center justify-center gap-[4px]">
          <span
            className="font-sans max-md:text-[13px]!"
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              color: '#737373',
              letterSpacing: '0.2px',
            }}
          >
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="font-sans font-semibold underline relative max-md:text-[13px]! max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{
              fontSize: '14px',
              lineHeight: '24px',
              color: '#387440',
              letterSpacing: '0.1px',
            }}
          >
            Log in Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;
