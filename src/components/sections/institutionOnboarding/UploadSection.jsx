import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import { ArrowRightIcon, CloseIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('UploadSection');

/*
 * UploadSection — Phase 5 / Bulk Upload — file upload screen.
 * Figma main frame: 3010:42286 ("Upload file"), 1728×1117.
 *
 * Institution admin drags-and-drops or browses a CSV/Excel file, then
 * clicks "Run Pre-Fight Check" to proceed to the validate step.
 *
 * Route:   /onboarding/institution/upload
 * Layout:  InstitutionOnboardingLayout (right panel VISIBLE)
 * Next:    /onboarding/institution/validate
 *
 * Upload zone states:
 *   default  — no file selected       (3014:50739)
 *   hover    — file dragged over zone (3014:57783)
 *   uploaded — file selected          (3014:59183 + 3016:59353)
 *
 * Headline character override: indices 12–24 "student file." → italic #387440
 * (verified via Figma REST API styleOverrideTable key 69)
 *
 * Figma nodes referenced:
 *   3010:43788  caption badge ("05 | Bulk Upload") — rendered via Captions component
 *   3010:43797  headline "Upload your student file."
 *   3010:43799  subtitle verbatim
 *   3014:50739  upload zone — default state
 *   3014:57783  upload zone — hover/drag-over state
 *   3014:59183  upload zone — uploaded state
 *   3016:59353  file name pill (shown after file selected)
 *   3010:50554  info row container (HORIZONTAL gap:6)
 *   3010:50555  info icon SVG (11×11, stroke #387440 1.1px)
 *   3010:50558  info text verbatim (Instrument Sans 400 11px #70706e)
 *   3010:43809  CTA "Run Pre-Fight Check" (disabled/primary based on file)
 *   3010:43810  footer "Already Have an account?" + "Log in Instead"
 */

// ── Upload arrow icon (20×20) — Figma "20-upload" ─────────────────────
const UploadArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 13V4m0 0L7 7m3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Large check icon (20×20) — Figma "20-check-large" ─────────────────
const CheckLargeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M3.5 10.5 8 15 16.5 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── File document icon (20×20) — Figma "20-file" ──────────────────────
const FileDocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M12 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8L12 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Info circle icon (11×11) — Figma 3010:50555 ───────────────────────
// Two vector paths: outer circle (9×9 stroke) + vertical bar (4px stroke)
const InfoSmallIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="5.5" r="4" stroke="#387440" strokeWidth="1.1" />
    <path d="M5.5 4.8v3" stroke="#387440" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="5.5" cy="3.5" r="0.55" fill="#387440" />
  </svg>
);

// ── File type pill (".csv" / ".xlsx" / ".xls") ────────────────────────
// Figma: rounded-full white bg, #e6e6e6 stroke, Instrument Sans Bold 10px #70706e
const FileTypePill = ({ ext }) => (
  <span className="inline-flex items-center justify-center rounded-full border border-[#e6e6e6] bg-white px-[6px] h-[21px]">
    <span className="font-sans font-bold text-[10px] leading-[12.2px] text-[#70706e] whitespace-nowrap">
      {ext}
    </span>
  </span>
);

// ── Upload drop zone ─────────────────────────────────────────────────
// Renders all 3 visual states (default / hover / uploaded) based on props.
// Figma: 698×173, r:16, border-2
//   default  fill:#fefef3  stroke:#c1d4c4
//   hover    fill:#ebf1ec  stroke:#387440
//   uploaded fill:#ebf1ec  stroke:#387440
const UploadZone = ({
  isDragging,
  file,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) => {
  const isUploaded = !!file;
  const isHover = isDragging && !isUploaded;

  log('UploadZone render', { isUploaded, isHover });

  const containerCls = [
    'relative flex items-center justify-center w-full h-[173px]',
    'rounded-[16px] border-2 cursor-pointer select-none',
    'transition-colors duration-150',
    isUploaded || isHover ? 'bg-[#ebf1ec] border-[#387440]' : 'bg-[#fefef3] border-[#c1d4c4]',
  ].join(' ');

  return (
    <div
      className={containerCls}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      aria-label={
        isUploaded
          ? `File selected: ${file.name}`
          : 'Upload file — click or drag a CSV, XLSX, or XLS here'
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {/* Inner content — VERTICAL stack, centered (Figma Frame 333) */}
      <div className="flex flex-col items-center gap-2">
        {/* ── Icon box (40×40, r:10) ── */}
        {isUploaded ? (
          /* Uploaded state — Figma 3014:59183: green fill + check icon */
          <div
            className="flex items-center justify-center size-[40px] rounded-[10px] bg-[#387440] text-[#ebf1ec]"
            style={{ boxShadow: '0 2px 8px rgba(27,36,44,0.08), 0 2px 2px rgba(27,36,44,0.04)' }}
            aria-hidden="true"
          >
            <CheckLargeIcon />
          </div>
        ) : (
          /* Default / hover state — Figma 3014:50739 / 3014:57783: white fill + upload icon */
          <div
            className="flex items-center justify-center size-[40px] rounded-[10px] bg-white text-[#387440]"
            style={{ boxShadow: '0 2px 8px rgba(27,36,44,0.08), 0 2px 2px rgba(27,36,44,0.04)' }}
            aria-hidden="true"
          >
            <UploadArrowIcon />
          </div>
        )}

        {/* ── Text group (Frame 332, VERTICAL gap:4, cross:CENTER) ── */}
        <div className="flex flex-col items-center gap-1">
          {/* Primary label — SF Pro Rounded Bold 14px */}
          <span
            className="font-sans font-bold text-[14px] text-center"
            style={{
              lineHeight: '16.7px',
              color: isUploaded ? '#387440' : '#111111',
            }}
          >
            {isUploaded ? 'File Received' : 'Drag Your File Here'}
          </span>
          {/* Secondary label — SF Pro Rounded Regular 12px */}
          <span
            className="font-sans font-normal text-[12px] text-center"
            style={{
              lineHeight: '15.95px',
              color: isUploaded ? '#387440' : '#959592',
            }}
          >
            {isUploaded ? file.name : 'Or browser to choose a file'}
          </span>
        </div>

        {/* ── File type pills — Figma Frame 359, HORIZONTAL gap:6 ── */}
        {/* Shown only in default / hover state (not after upload) */}
        {!isUploaded && (
          <div className="flex items-center gap-[6px]">
            <FileTypePill ext=".csv" />
            <FileTypePill ext=".xlsx" />
            <FileTypePill ext=".xls" />
          </div>
        )}
      </div>
    </div>
  );
};

// ── File name pill — Figma 3016:59353 ────────────────────────────────
// 698×63, fill:#ebf1ec, stroke:#ddebe4, r:6
// [file-icon 32×32] [filename bold 12px #575755] [close button]
const FilePill = ({ file, onRemove }) => {
  log('FilePill render', { fileName: file?.name });
  return (
    <div className="flex w-full items-center gap-3 rounded-[6px] border border-[#ddebe4] bg-[#ebf1ec] px-4 h-[63px]">
      {/* File icon — green circle 32×32, r:8 */}
      <div
        className="flex shrink-0 items-center justify-center size-[32px] rounded-[8px] bg-[#387440] text-white"
        style={{ boxShadow: '0 2px 8px rgba(27,36,44,0.08)' }}
        aria-hidden="true"
      >
        <FileDocIcon />
      </div>

      {/* Filename — SF Pro Rounded Bold 12px #575755 */}
      <span className="flex-1 font-sans font-bold text-[12px] leading-5 tracking-[0.1px] text-[#575755] truncate">
        {file.name}
      </span>

      {/* Remove button — Figma 3016:59363 "20-close" */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove selected file"
        className="shrink-0 text-[#387440] hover:opacity-70 transition-opacity duration-100 focus:outline-none"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────
const UploadSection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0); // counts nested drag-enter/-leave events

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  log('mount');
  log('render', { hasFile: !!file, fileName: file?.name, isDragging });

  // ── File validation & selection ────────────────────────────────
  const ACCEPTED_EXTS = new Set(['.csv', '.xlsx', '.xls']);

  const applyFile = useCallback((candidate) => {
    if (!candidate) {
      log('applyFile — no file provided');
      return;
    }
    const ext = '.' + candidate.name.split('.').pop().toLowerCase();
    log('applyFile', { name: candidate.name, ext, accepted: ACCEPTED_EXTS.has(ext) });
    if (!ACCEPTED_EXTS.has(ext)) return; // silently ignore unsupported types
    setFile(candidate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    log('input change', { fileCount: e.target.files?.length });
    applyFile(e.target.files?.[0] ?? null);
  };

  const handleRemoveFile = () => {
    log('remove file');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Drop zone interaction ──────────────────────────────────────
  const handleZoneClick = () => {
    log('zone click → open file picker');
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    log('drag enter', { counter: dragCounter.current });
    if (dragCounter.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    log('drag leave', { counter: dragCounter.current });
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    log('drop', { fileName: dropped?.name });
    applyFile(dropped ?? null);
  };

  // ── CTA ────────────────────────────────────────────────────────
  const handleContinue = () => {
    log('CTA → /onboarding/institution/validate', { fileName: file?.name });
    navigate('/onboarding/institution/validate');
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-10 py-[88px] px-6">
      {/* ── Header block ─────────────────────────────────────────── */}
      <div className="flex w-full flex-col items-center gap-6 max-w-[560px]">
        {/* Caption badge — Figma 3010:43788 */}
        <Captions items={[{ index: '05', label: 'Bulk Upload' }]} currentIndex={0} />

        {/* ── Headline — Figma 3010:43797 ──
             Instrument Serif 400 64px lh:70 ls:-0.64 CENTER
             Character override indices 12–24: "student file." → italic #387440 */}
        <h1
          className="text-center font-serif text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Upload your <span className="italic text-brand-green">student file.</span>
        </h1>

        {/* ── Subtitle — Figma 3010:43799 — verbatim ──
             SF Pro Rounded 400 16px lh:24 ls:0.2 #737373 CENTER; max-w:482px
             Frame 13 provides pad:4/30/4/30 context. */}
        <p
          className="font-sans font-normal text-center text-[#737373]"
          style={{
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            maxWidth: '482px',
          }}
        >
          Drag and drop your filled-in template below or click to browse. We&apos;ll scan it for
          problems before creating any accounts.
        </p>
      </div>

      {/* ── Wavy divider ── */}
      <WavyDivider />

      {/* ── Upload zone + file pill + info row ───────────────────── */}
      <div className="flex w-full flex-col gap-4 max-w-[698px]">
        {/* Hidden file input — accepts .csv .xlsx .xls */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="sr-only"
          onChange={handleInputChange}
          aria-label="Select a CSV or Excel file to upload"
        />

        {/* ── Upload zone — default / hover / uploaded ── */}
        <UploadZone
          isDragging={isDragging}
          file={file}
          onClick={handleZoneClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />

        {/* ── File name pill — Figma 3016:59353 — conditional ── */}
        {file && <FilePill file={file} onRemove={handleRemoveFile} />}

        {/* ── Info row — Figma 3010:50554 (HORIZONTAL gap:6) ── */}
        <div className="flex items-center gap-[6px]" aria-live="polite">
          {/* Figma 3010:50555 — 11×11 info icon, stroke #387440 1.1px */}
          <InfoSmallIcon />
          {/* Figma 3010:50558 — Instrument Sans 400 11px #70706e — verbatim */}
          <span
            className="font-sans font-normal text-[11px] text-[#70706e]"
            style={{ lineHeight: '13.42px' }}
          >
            Maximum 10,000 rows per upload. Larger batches should be split into multiple uploads.
          </span>
        </div>
      </div>

      {/* ── CTA + footer ────────────────────────────────────────── */}
      <div className="flex w-full flex-col items-center gap-2 max-w-[698px]">
        {/* ── CTA — Figma 3010:43809 ──
             Disabled (gray) when no file; primary (green) when file selected.
             Button component handles the disabled/primary color switch.
             Figma disabled: fill #bfbfbf r:14 shadow y:4 rgba(191,191,191,0.80) */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRightIcon />}
          disabled={!file}
          onClick={handleContinue}
          className="w-full"
        >
          Run Pre-Fight Check
        </Button>

        {/* ── Footer link — Figma 3010:43810 ── */}
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

export default UploadSection;
