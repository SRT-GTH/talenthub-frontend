import { useState } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('ValidationCheckCard');

/*
 * ValidationCheckCard — reusable result card for the Validate File step.
 * Figma "Background+Border" rows inside frame 3028:67114 ("Checks view").
 *
 * Three variants (matching Figma colour coding):
 *   passed  — green  (3028:67115 / 3028:67122 / 3028:67129)
 *   failed  — red    (3028:67136 / 3028:67143 / 3028:67157)
 *   warning — amber  (3028:67150)
 *
 * Each variant has:
 *   • Container:      fill + stroke colours
 *   • Icon circle:    26×26 rounded-full, variant-specific background
 *   • Icon SVG:       12×12 check / X / exclamation — hand-crafted paths
 *                     matching the Figma vector shapes (stroke #ffffff 1.4px)
 *   • Title:          fs=13 fw=700 lh=15.5 — colour varies by variant
 *   • Description:    fs=12 fw=400 lh=15.9 — colour varies by variant
 *   • Row count badge: pill badge — shown on right when rows.length > 0
 *                     (Figma 3034:71184 Frame 373: r=100, variant-tinted bg)
 *   • Chevron:        12×12, stroke #babab7@1.3 — rotates when expanded
 *
 * Expand behaviour:
 *   Clicking the header toggles a table beneath the header showing all
 *   flagged rows (ROW / NAME / DOB / REASON columns).
 *   Figma nodes:
 *     3034:71184  expanded card header
 *     3034:71195–71198  column header labels (fs=10 fw=700 #70706e ls=0.5)
 *     3034:71214  default data row  (no fill, 34px)
 *     3034:71199  hover data row    (#ebf1ec @50%, 34px)
 *     3034:71249  "+ N more" row    (fs=11 fw=400 #babab7, 33px)
 *     3034:71251  "How to fix" row  (fill=#fefcf5 border-top, fs=10 fw=700)
 *
 * Card design tokens:
 *   Collapsed h: 57px   r: 10px   px: 16px   gap: 16px (icon↔text)
 *   Text group: flex-col gap-[2px]
 *   Icon circle size: 26×26   SVG frame: 12×12
 *   Icon stroke: #ffffff strokeWidth=1.4px strokeLinecap=round strokeLinejoin=round
 */

// ── Variant config ────────────────────────────────────────────────────────────
const VARIANT = {
  passed: {
    container: 'bg-[#ebf1ec] border-[#c1d4c4]',
    circle: 'bg-[#387440]',
    titleCls: 'text-[#2a5730]',
    bodyCls: 'text-[#70706e]',
    badgeBg: 'rgba(56,116,64,0.12)',
    badgeText: '#2a5730',
    tableBorder: '#c1d4c4',
    reasonColor: '#70706e',
  },
  failed: {
    container: 'bg-[#f9ebea] border-[#ebc2bd]',
    circle: 'bg-[#c0392b]',
    titleCls: 'text-[#c0392b]',
    bodyCls: 'text-[#c0392b]',
    badgeBg: 'rgba(192,57,43,0.12)',
    badgeText: '#c0392b',
    tableBorder: '#ebc2bd',
    reasonColor: '#c0392b',
  },
  warning: {
    container: 'bg-[#fef3c7] border-[#eedeb8]',
    circle: 'bg-[#a07715]',
    titleCls: 'text-[#a07715]',
    bodyCls: 'text-[#a07715]',
    badgeBg: 'rgba(160,119,21,0.12)',
    badgeText: '#a07715',
    tableBorder: '#eedeb8',
    reasonColor: '#a07715',
  },
};

// ── Card-header icons (12×12 viewBox, white stroke 1.4px) ─────────────────────

/*
 * CheckIcon — 8×5 bounding box in Figma (Vector 3028:67118).
 */
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2 6.5L5 9L10 3.5"
      stroke="#ffffff"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * XIcon — 6×6 bounding box in Figma (Vector 3028:67139).
 */
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5"
      stroke="#ffffff"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/*
 * ExclamIcon — vertical bar + dot (Vector 3028:67153).
 */
const ExclamIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 3V7.5" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="6" cy="9.5" r="0.7" fill="#ffffff" />
  </svg>
);

const ICON = { passed: <CheckIcon />, failed: <XIcon />, warning: <ExclamIcon /> };
const ARIA_LABEL = { passed: 'passed', failed: 'failed', warning: 'warning' };

// ── Expand/collapse chevron ───────────────────────────────────────────────────
/*
 * Figma 3034:71184 Frame 373: Vector 6×3, stroke #babab7@1.3
 */
const ChevronIcon = ({ isOpen }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 150ms ease',
    }}
  >
    <path
      d="M2 4.5L6 8L10 4.5"
      stroke="#babab7"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── "How to fix" info icon ────────────────────────────────────────────────────
/*
 * Figma 3034:71251: SVG 11×11, Vector 7.5×9.5 stroke #babab7@1.0
 * Rendered as a simple circle-i.
 */
const InfoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="5.5" r="4.5" stroke="#babab7" strokeWidth="1.3" />
    <path d="M5.5 5V8" stroke="#babab7" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="5.5" cy="3.5" r="0.6" fill="#babab7" />
  </svg>
);

// ── Table sub-components ──────────────────────────────────────────────────────

/*
 * Column header row.
 * Figma 3034:71195–71198: fs=10 fw=700 #70706e ls=0.5 lh=11.93
 */
const TableHeader = () => (
  <div
    className="grid w-full px-[16px] py-[8px]"
    style={{
      gridTemplateColumns: '60px 1fr 110px 1fr',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}
  >
    {['Row', 'Name', 'DOB', 'Reason'].map((col) => (
      <span
        key={col}
        className="font-sans font-bold text-[#70706e]"
        style={{ fontSize: '10px', lineHeight: '11.93px', letterSpacing: '0.5px' }}
      >
        {col}
      </span>
    ))}
  </div>
);

/*
 * Single data row.
 * Figma 3034:71214 (default, no fill) / 3034:71199 (hover, #ebf1ec @50%)
 * h=34px; columns: row# (fs=11 fw=400 #70706e) | name (fs=12 fw=600 #111111)
 *   | dob (fs=11 fw=400 #70706e) | reason (fs=11 fw=600, variant colour)
 */
const TableRow = ({ row, name, dob, reason, reasonColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="grid w-full px-[16px] items-center"
      style={{
        gridTemplateColumns: '60px 1fr 110px 1fr',
        height: '34px',
        backgroundColor: hovered ? 'rgba(235,241,236,0.5)' : 'transparent',
        transition: 'background-color 80ms ease',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="font-sans font-normal text-[#70706e]"
        style={{ fontSize: '11px', lineHeight: '13px' }}
      >
        {row}
      </span>
      <span
        className="font-sans font-semibold text-[#111111]"
        style={{ fontSize: '12px', lineHeight: '14.32px' }}
      >
        {name}
      </span>
      <span
        className="font-sans font-normal text-[#70706e]"
        style={{ fontSize: '11px', lineHeight: '13px' }}
      >
        {dob}
      </span>
      <span
        className="font-sans font-semibold"
        style={{ fontSize: '11px', lineHeight: '13px', color: reasonColor }}
      >
        {reason}
      </span>
    </div>
  );
};

/*
 * "+ N more rows in download file" indicator.
 * Figma 3034:71249: h=33px, fs=11 fw=400 #babab7
 */
const MoreRowsRow = ({ count }) => (
  <div className="flex items-center px-[16px]" style={{ height: '33px' }}>
    <span
      className="font-sans font-normal text-[#babab7]"
      style={{ fontSize: '11px', lineHeight: '13px' }}
    >
      + {count} more rows in download file
    </span>
  </div>
);

/*
 * "How to fix" tip row.
 * Figma 3034:71251: h=34px, fill=#fefcf5, top border, fs=10 fw=700 #111111
 */
const HowToFixRow = ({ text }) => (
  <div
    className="flex items-center gap-[8px] w-full px-[16px]"
    style={{
      height: '34px',
      backgroundColor: '#fefcf5',
      borderTop: '1px solid rgba(0,0,0,0.08)',
    }}
  >
    <InfoIcon />
    <p
      className="font-sans text-[#111111] truncate"
      style={{ fontSize: '10px', lineHeight: '12px' }}
    >
      <span className="font-bold">How to fix: </span>
      <span className="font-normal">{text}</span>
    </p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

/* Max rows shown inline before showing "+ N more" indicator. */
const PREVIEW_ROWS = 10;

/**
 * @param {{
 *   variant:   'passed'|'failed'|'warning',
 *   title:     string,
 *   description: string,
 *   rows?:     Array<{ row: string, name: string, dob: string, reason: string }>,
 *   howToFix?: string,
 * }} props
 */
const ValidationCheckCard = ({ variant, title, description, rows = [], howToFix }) => {
  const cfg = VARIANT[variant] ?? VARIANT.passed;
  const hasRows = rows.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  log('render', { variant, title, rowCount: rows.length, isExpanded });

  const previewRows = rows.slice(0, PREVIEW_ROWS);
  const extraCount = rows.length - previewRows.length;

  const handleToggle = () => {
    if (!hasRows) return;
    log('toggle', { from: isExpanded, to: !isExpanded, title });
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={['w-full rounded-[10px] border overflow-hidden', cfg.container].join(' ')}
      role="listitem"
    >
      {/* ── Card header — click to expand/collapse ── */}
      <div
        className={[
          'flex items-center gap-[16px] px-[16px]',
          hasRows ? 'cursor-pointer select-none' : '',
        ].join(' ')}
        style={{ minHeight: '57px', paddingTop: '8px', paddingBottom: '8px' }}
        onClick={handleToggle}
        aria-expanded={hasRows ? isExpanded : undefined}
        role={hasRows ? 'button' : undefined}
        tabIndex={hasRows ? 0 : undefined}
        onKeyDown={
          hasRows
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle();
                }
              }
            : undefined
        }
      >
        {/* Icon circle — 26×26 rounded-full */}
        <div
          className={[
            'shrink-0 flex items-center justify-center',
            'size-[26px] rounded-full',
            cfg.circle,
          ].join(' ')}
          aria-label={`Check ${ARIA_LABEL[variant]}`}
        >
          {ICON[variant]}
        </div>

        {/* Text group — title + description, VERTICAL gap=2px */}
        <div className="flex flex-1 flex-col gap-[2px] min-w-0">
          <p
            className={['font-sans font-bold truncate', cfg.titleCls].join(' ')}
            style={{ fontSize: '13px', lineHeight: '15.5px' }}
          >
            {title}
          </p>
          <p
            className={['font-sans font-normal truncate', cfg.bodyCls].join(' ')}
            style={{ fontSize: '12px', lineHeight: '15.9px' }}
          >
            {description}
          </p>
        </div>

        {/* Right side — row count badge + chevron (only when expandable) */}
        {hasRows && (
          <div className="flex items-center gap-[6px] shrink-0">
            {/* Row count pill badge
                Figma 3034:71184 Frame 373 → Overlay r=100, tinted bg + text */}
            <span
              className="flex items-center justify-center rounded-full font-sans font-bold"
              style={{
                backgroundColor: cfg.badgeBg,
                color: cfg.badgeText,
                fontSize: '10px',
                lineHeight: '18px',
                padding: '0 8px',
                height: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {rows.length} rows
            </span>
            {/* Chevron — rotates 180° when expanded */}
            <ChevronIcon isOpen={isExpanded} />
          </div>
        )}
      </div>

      {/* ── Expanded table ── */}
      {isExpanded && hasRows && (
        <div style={{ borderTop: `1px solid ${cfg.tableBorder}` }}>
          <TableHeader />
          {previewRows.map((r, i) => (
            <TableRow
              key={`${r.row}-${i}`}
              row={r.row}
              name={r.name}
              dob={r.dob}
              reason={r.reason}
              reasonColor={cfg.reasonColor}
            />
          ))}
          {extraCount > 0 && <MoreRowsRow count={extraCount} />}
          {howToFix && <HowToFixRow text={howToFix} />}
        </div>
      )}
    </div>
  );
};

export default ValidationCheckCard;
