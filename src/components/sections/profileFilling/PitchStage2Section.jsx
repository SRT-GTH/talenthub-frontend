import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import PitchRecorder from './PitchRecorder.jsx';
import PitchPublishedModal from './PitchPublishedModal.jsx';
import DeletePitchModal from './DeletePitchModal.jsx';
import Button from '../../ui/Button.jsx';
import { Checkbox, Textarea, Upload } from '../../ui/form/index.js';
import { debug } from '../../../utils/debug.js';
import {
  PITCH_MODES,
  TAB_ACTIVE_STYLE,
  TAB_INACTIVE_STYLE,
  ASIDE_CONTENT,
  THREE_WAYS,
  FORMULA_ROWS,
  FORMULA_EXAMPLE_COMPACT,
  FORMULA_EXAMPLE_LONG,
  FORMULA_EXAMPLE_META,
  PHONE_TRANSFER_CARDS,
  RECORD_CHECKLIST,
  UPLOAD_CHECKLIST,
  buildUploadFileChecks,
  buildUploadAsideChecks,
  DEMO_PITCH_FILE,
  WRITTEN_PITCH_CHAR_LIMIT,
  formatDurationLabel,
  countWords,
  buildPitchSummary,
  buildDeletePreview,
} from './pitchModeStyles.js';
import {
  ArrowLeftIcon,
  ArrowRightSmIcon,
  UploadCertificateIcon,
  WorkDeleteWarningIcon,
  PitchFilmSlateIcon,
  PitchUploadTabIcon,
  PitchWriteIcon,
  PitchCameraVideoIcon,
  PitchComputerUploadIcon,
  PitchDropUploadIcon,
  PitchMedalIcon,
} from '../../shared/assets.jsx';

const log = debug('PitchStage2Section');

/*
 * PitchStage2Section — full page for /profile/filling/pitch/record, the
 * SECOND (and final) screen of the Talent Pitch stage, `PROFILE_STAGES` id
 * `talent-pitch`, stage 9 of 9.
 *
 * Source frames (file key Bin8roWL8sloyc36IgFMuT, all dived in full with
 * `mcp__figma__get_design_context` on 2026-09-09 — NOTHING below is derived
 * from `get_metadata` layer names):
 *   5890:2      "09e Pitch — Empty state"        → the no-pitch-yet screen
 *   6083:46594  "Pitch — Record (camera access)" → record mode, idle
 *   5890:1732   "Pitch — Recorded"               → record mode, take captured
 *   5890:694    "Pitch — Upload (empty)"         → upload mode, no file
 *   5890:1040   "Pitch — Upload (loaded)"        → upload mode, file picked
 *   5890:1386   "Pitch — Written"                → written mode
 *   6107:122172 "09f Pitch — Published (Success)" → PitchPublishedModal
 *   6107:122671 → DeletePitchModal (6107:123168)
 *
 * ── Why this stage is NOT a CRUD list ──────────────────────────────────
 * Certs / Work / Portfolio / Goals are all "add N entries to a list" flows.
 * Pitch is not: Figma ships exactly ONE pitch per profile, expressed three
 * mutually-exclusive ways (record in-browser / upload a file / write four
 * sentences). There is no Add/Edit modal anywhere in the Pitch node range,
 * no card list, no "Add another" affordance. So this page is a single-item
 * MODE SWITCHER, not a list — the shape Figma's own frames actually show.
 * The route is `/profile/filling/pitch/record` rather than `/list` for the
 * same reason.
 *
 * ── ❓ NEEDS-CLARIFICATION (flagged, not silently invented) ─────────────
 *   1. The mode tab row (Record / Upload / Written Pitch) is drawn ONLY on
 *      the Upload frames (6120:134569, 6107:134149) and the Written frame
 *      (6120:134598). Neither Record frame nor the empty state has it. With
 *      no tab row in Record mode there would be no way back to Upload or
 *      Written once recording starts, so the row renders in all three modes
 *      here. Flagged rather than reproduced literally.
 *   2. The Written frame's "Upload" tab pill (6120:134613) contains TWO
 *      icon children — an "edit-01" (6120:134614) AND an "upload-05"
 *      (6120:134627) — an authoring slip; every other frame's Upload pill
 *      has only the upload glyph. Only the upload glyph is rendered.
 *   3. NO delete affordance appears on any Pitch frame, yet Figma ships a
 *      complete Delete-Pitch modal (6107:123168). The small delete button
 *      beside the "Your Pitch" section label is carried over from the
 *      sibling stages' card affordance (identical styling), NOT read from a
 *      Pitch node. It uses `WorkDeleteWarningIcon` per the standing
 *      icon-consolidation instruction. Flagged for design confirmation.
 *   4. TWO footers overlap on every Pitch frame. The older per-frame footer
 *      on the recorded screen (5890:2068) says "Publish & go live"; the
 *      newer shared footer component (6686:914xx / 6686:915xx) pasted over
 *      EVERY frame in this range — including that one, painted last, so it
 *      is what actually shows — says "Review & publish". The shared,
 *      on-top, universally-present label is used. Flagged.
 *   5. The empty state's headline glyph is Figma node "certificate-01"
 *      (6083:34047) — the same Certs leftover the Goals empty state carries.
 *      Reproduced as designed via `UploadCertificateIcon`, whose path data
 *      is byte-identical to that node's own SVG asset. Flagged.
 *
 * ── 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user instruction) ──
 *   Figma's stage-2 tag row (5978:29467) says "2 min" while THIS FLOW'S
 *   INTRO PAGE tag (5625:93165) says "~7 min". Per the cross-flow rule that
 *   each flow's intro-page tag is the single source of truth, the tag below
 *   renders "~7 min". Deliberate, instructed divergence from Figma.
 *
 * ── No real media capture ──────────────────────────────────────────────
 *   Same rule as every file-upload button elsewhere in this app: nothing
 *   here calls `navigator.mediaDevices.getUserMedia`, instantiates
 *   `MediaRecorder`, or persists a byte. The recorder is an interactive
 *   mock (see PitchRecorder.jsx); a picked upload file is read for its real
 *   name/size only — duration can't be known without decoding, so Figma's
 *   own "0:54" stands in (`DEMO_PITCH_FILE`).
 */

// The design's own hard limit, stated twice in verified copy ("Keep it under
// 60s", 5890:147; "Maximum 60 seconds", the upload requirements aside).
const MAX_RECORD_SECONDS = 60;

// ─── Section label ────────────────────────────────────────────────────────────
// Figma 5895:2 / 5906:2 / 5900:2 / 5903:2 / 5905:2 — a flat #387440 13px
// semibold "Your Pitch" (NOT the gradient-filled treatment the "Three ways
// to pitch" / "The 4-sentence formula" labels use). ✅ VERIFIED on all five
// frames.
const SectionLabel = ({ children, onDelete, deleteLabel }) => (
  <div className="flex items-center justify-between gap-[12px]">
    <p className="font-sans font-semibold text-[13px] text-brand-green">{children}</p>
    {/* ❓ See file-header note #3 — no Figma node backs this button. */}
    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
      >
        <WorkDeleteWarningIcon className="size-3" />
      </button>
    )}
  </div>
);

// Figma 6105:57915 / 6083:34063 — gradient-filled 13px semibold labels.
const GradientLabel = ({ children, className = '' }) => (
  <p
    className={`font-sans font-semibold text-[13px] ${className}`}
    style={{
      backgroundImage: 'linear-gradient(172deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {children}
  </p>
);

// ─── "Three ways to pitch" ────────────────────────────────────────────────────
// Figma 5895:18 (row) / 5895:19 / 5895:23 / 5895:27 (cards). Present on the
// empty state AND the record-idle frame, identical on both. Figma draws them
// as static cards; they're wired to the mode switcher here so the copy
// ("Record in-browser" / "Upload a video" / "Write a pitch") does what it says.
const MODE_ICONS = {
  record: PitchCameraVideoIcon,
  upload: PitchComputerUploadIcon,
  written: PitchWriteIcon,
};

const ThreeWaysRow = ({ onPick }) => (
  <div className="flex flex-wrap items-start gap-[16px] w-full">
    {THREE_WAYS.map((way) => {
      const Icon = MODE_ICONS[way.id];
      return (
        <button
          key={way.id}
          type="button"
          onClick={() => onPick(way.id)}
          className="flex-1 min-w-[240px] flex flex-col items-center gap-[8px] bg-white border border-[#e1eae2] rounded-[12px] p-[20px] text-center cursor-pointer transition-colors duration-150 hover:bg-[rgba(235,241,236,0.5)]"
          style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
        >
          <Icon className="size-5 text-brand-green" />
          <span className="font-sans font-semibold text-[14px] text-brand-green">{way.title}</span>
          <span className="font-sans text-[12px] leading-[18px] text-[#70706e]">{way.body}</span>
        </button>
      );
    })}
  </div>
);

// ─── "The 4-sentence formula" compact card ────────────────────────────────────
// Figma 5895:32 — bold green lead + grey tail per row, a hairline, then the
// italic Instrument-Serif example. ✅ VERIFIED verbatim.
const FormulaCompactCard = () => (
  <div
    className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[24px] py-[22px] flex flex-col gap-[10px]"
    style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
  >
    {FORMULA_ROWS.map((row) => (
      <div key={row.num} className="flex flex-wrap items-start gap-[6px]">
        <span className="font-sans font-bold text-[12px] text-brand-green">{row.lead}</span>
        <span className="font-sans text-[13px] text-[#70706e]">{row.tail}</span>
      </div>
    ))}
    <div className="h-px w-full bg-[#e8e8e4]" aria-hidden="true" />
    <p className="font-display italic text-[14px] leading-[24px] text-[#70706e]">
      {FORMULA_EXAMPLE_COMPACT}
    </p>
  </div>
);

// ─── Right aside ──────────────────────────────────────────────────────────────
// Figma 5890:131 (empty / record-idle) / 5890:1861 (recorded) / 5890:825
// (upload empty) / 5890:1171 (upload loaded) / 5890:1517 (written). The three
// cards are structurally identical across every frame; only the copy changes,
// which is what ASIDE_CONTENT holds. Unlike the Certs aside, none of these
// cards is a cross-stage clone — all copy is genuinely Pitch-specific.
const PitchStage2RightAside = ({ contentKey, isPublished, uploadedFile }) => {
  const content = ASIDE_CONTENT[contentKey] ?? ASIDE_CONTENT.default;
  // The uploadLoaded card lists the picked file's own facts; Figma's static
  // demo numbers would otherwise contradict the file row on the page.
  const checklist =
    contentKey === 'uploadLoaded' && uploadedFile
      ? buildUploadAsideChecks(uploadedFile)
      : content.checklist;
  log('aside render', {
    contentKey,
    isPublished,
    derivedChecklist: checklist !== content.checklist,
  });

  return (
    <aside
      className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[rgba(0,0,0,0.07)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      aria-label="Pitch guidance"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex flex-col gap-[22px] p-[clamp(16px,1.5vw,24px)]">
        {/* Checklist card — Figma 5890:133 */}
        <div
          className="rounded-[10px] border border-[#c1d4c4] p-[15px]"
          style={{ background: 'rgba(235,241,236,0.5)', boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p
            className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] mb-[10px]"
            style={{
              backgroundImage: 'linear-gradient(170deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {content.checklistTitle}
          </p>
          <ul className="flex flex-col gap-[8px]">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-[7px] font-sans text-[12px] text-[#716e65] leading-[18px]"
              >
                <span className="font-bold text-brand-green shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Prose card — Figma 5890:148 */}
        <div
          className="bg-white border border-[#e8e8e4] rounded-[10px] p-[15px]"
          style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
        >
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.6px] text-[#70706e] mb-[8px]">
            {content.proseTitle}
          </p>
          <p className="font-sans text-[12px] text-[#999] leading-[19.2px]">{content.prose}</p>
        </div>

        {/* Recruiter views — Figma 5890:151. Figma's static state is 0 views
            with a 2%-wide bar and the prompt "Publish your pitch to unlock
            recruiter discovery" (5890:157, ✅ VERIFIED verbatim); the values
            swap to a live derived state once the pitch is published, the same
            convention every sibling aside uses (no analytics backend exists). */}
        <div
          className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px]"
          style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.07)' }}
        >
          <p className="font-sans font-bold text-[10px] uppercase tracking-[0.8px] text-[#70706e] mb-[10px]">
            👀 Recruiter views this week
          </p>
          <p className="font-display text-[36px] leading-[36px] text-[#111] mb-[10px]">
            {isPublished ? 24 : 0}
          </p>
          <p className="font-sans text-[11px] text-[#70706e] mb-[10px]">
            profile views from recruiters
          </p>
          <div className="h-[6px] rounded-full bg-[#e8e8e4] overflow-hidden mb-[10px]">
            <div
              className="h-full rounded-full"
              style={{
                width: isPublished ? '100%' : '2%',
                background: 'linear-gradient(90deg, #3f6212, #84cc16)',
              }}
            />
          </div>
          <p className="font-sans text-[10px] text-[#70706e]">
            {isPublished
              ? 'Recruiters are already discovering your profile.'
              : 'Publish your pitch to unlock recruiter discovery'}
          </p>
        </div>
      </div>
    </aside>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────

const PitchStage2Section = () => {
  log('mount', { route: '/profile/filling/pitch/record', stageIndex: 8 });
  const navigate = useNavigate();

  // `null` = the empty state (no mode chosen yet), Figma 5890:2.
  const [mode, setMode] = useState(null);
  const [recorderState, setRecorderState] = useState('needs-access');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [writtenText, setWrittenText] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ── The recording clock ───────────────────────────────────────────────────
  // No MediaRecorder, no getUserMedia — just a 1s interval, exactly as
  // documented in PitchRecorder.jsx's own header.
  useEffect(() => {
    if (recorderState !== 'recording') return undefined;
    log('branch: recording clock started');
    const id = setInterval(() => {
      setElapsedSeconds((prev) => Math.min(prev + 1, MAX_RECORD_SECONDS));
    }, 1000);
    return () => {
      log('branch: recording clock stopped');
      clearInterval(id);
    };
  }, [recorderState]);

  // The design's own 60-second hard limit.
  useEffect(() => {
    if (recorderState === 'recording' && elapsedSeconds >= MAX_RECORD_SECONDS) {
      log('branch: 60s hard limit reached — auto-stopping', { elapsedSeconds });
      setRecorderState('recorded');
    }
  }, [recorderState, elapsedSeconds]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const hasRecording = mode === 'record' && recorderState === 'recorded';
  const hasUpload = mode === 'upload' && Boolean(uploadedFile);
  const hasWritten = mode === 'written' && writtenText.trim().length > 0;
  const hasPitch = hasRecording || hasUpload || hasWritten;

  const pitch = hasRecording
    ? { kind: 'recorded', durationSeconds: elapsedSeconds }
    : hasUpload
      ? { kind: 'upload', file: uploadedFile }
      : hasWritten
        ? { kind: 'written', text: writtenText }
        : null;

  const asideKey = hasRecording
    ? 'recorded'
    : mode === 'upload'
      ? uploadedFile
        ? 'uploadLoaded'
        : 'uploadEmpty'
      : mode === 'written'
        ? 'written'
        : 'default';

  log('branch: page state', { mode, recorderState, asideKey, hasPitch, isPublished });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  // ❓ Figma labels this back button literally "Goals" (5924:22170 and every
  // sibling frame) — which is the PREVIOUS stage, not this one, so it routes
  // to the Goals list rather than to this stage's own intro. The Pitch intro
  // stays reachable from the top-bar trail (STAGE_ROUTES['talent-pitch']).
  const handleGoBack = () => {
    log('go back → /profile/filling/goals/list');
    navigate('/profile/filling/goals/list');
  };

  // Pitch is the LAST of the 9 stages — every forward exit lands on the hub.
  const handleGoToHub = () => {
    log('→ /profile/engagement (Pitch is the final stage)');
    navigate('/profile/engagement');
  };

  const handlePickMode = (nextMode) => {
    log('mode switch', { from: mode, to: nextMode });
    setMode(nextMode);
  };

  const handleAllowCamera = () => {
    log('camera access granted (mock)');
    setRecorderState('ready');
  };

  const handleToggleRecording = () => {
    if (recorderState === 'recording') {
      log('branch: stop recording', { elapsedSeconds });
      setRecorderState('recorded');
      return;
    }
    log('branch: start recording');
    setElapsedSeconds(0);
    setRecorderState('recording');
  };

  const handleReRecord = () => {
    log('re-record — back to a live viewfinder, previous take discarded');
    setElapsedSeconds(0);
    setCheckedItems({});
    setRecorderState('ready');
  };

  const handleFileSelect = (file) => {
    // No media backend exists — the browser gives a real name and size, but
    // duration would need decoding, so Figma's own value stands in.
    const normalised = {
      ...DEMO_PITCH_FILE,
      name: file?.name ?? DEMO_PITCH_FILE.name,
      sizeLabel: file?.size
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : DEMO_PITCH_FILE.sizeLabel,
      format: (file?.name?.split('.').pop() ?? 'mp4').toUpperCase(),
    };
    log('upload file picked (mock — nothing is transferred)', {
      name: normalised.name,
      sizeLabel: normalised.sizeLabel,
    });
    setUploadedFile(normalised);
    setCheckedItems({});
  };

  const handleToggleCheck = (item) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      log('checklist toggled', { item, checked: next[item] });
      return next;
    });
  };

  const handlePublish = () => {
    log('publish clicked', { kind: pitch?.kind });
    setIsPublished(true);
    setIsPublishedModalOpen(true);
  };

  const handleDeletePitch = () => {
    log('delete pitch', { kind: pitch?.kind });
    setUploadedFile(null);
    setWrittenText('');
    setElapsedSeconds(0);
    setRecorderState('needs-access');
    setCheckedItems({});
    setIsPublished(false);
    setMode(null);
  };

  const handleReplaceInstead = () => {
    log('replace instead — reopening the picker for the current mode', { mode });
    if (mode === 'upload') {
      setUploadedFile(null);
      return;
    }
    if (mode === 'written') {
      setWrittenText('');
      return;
    }
    handleReRecord();
  };

  const handlePreview = () => {
    log('preview requested (no real media attached — mock playback)');
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderChecklist = (items, variant) =>
    items.map((item) => {
      const checked = Boolean(checkedItems[item]);
      // Figma's upload-loaded frame paints its first three rows tinted
      // (rgba(235,241,236,0.5) + 0.5px #c1d4c4) and the fourth plain white —
      // i.e. the tint IS the checked treatment, driven here off real state.
      const tinted = variant === 'upload' && checked;
      return (
        <div
          key={item}
          className={`flex items-center gap-[10px] w-full rounded-[8px] border ${
            variant === 'upload' ? 'px-[12px] py-[9px]' : 'px-[14px] py-[11px]'
          } ${tinted ? 'border-[#c1d4c4]' : 'border-[#e8e8e4] bg-white'}`}
          style={{
            ...(tinted ? { background: 'rgba(235,241,236,0.5)' } : {}),
            ...(variant === 'record' ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' } : {}),
          }}
        >
          <Checkbox
            checked={checked}
            onChange={() => handleToggleCheck(item)}
            label={item}
            labelClassName={`font-sans text-[12px] ${tinted ? 'text-[#142916]' : 'text-[#111]'}`}
          />
        </div>
      );
    });

  // Empty state — Figma 6083:34043 "Large empty state".
  const renderEmptyState = () => (
    <>
      <div
        className="rounded-[24px] border-2 border-dashed border-brand-green flex flex-col items-center gap-[22px] px-[24px] py-[clamp(32px,4vw,56px)] text-center"
        style={{ background: 'rgba(235,241,236,0.5)' }}
      >
        <div className="flex flex-col items-center gap-[20px]">
          <div className="flex flex-col items-center gap-[4px]">
            {/* ❓ Certs leftover glyph — see file-header note #5. */}
            <UploadCertificateIcon className="size-10 text-brand-green" />
            <h3 className="font-display text-[clamp(20px,2vw,26px)] text-brand-green mt-[8px]">
              No pitch yet.
            </h3>
            <p className="font-sans text-[14px] text-[#70706e] leading-[24.5px] max-w-[622px] mt-[4px]">
              Record a 60-second video in-browser, upload one you recorded on your phone, or write a
              4-sentence pitch. All three work. All three beat having nothing.
            </p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-[20px]">
            <Button variant="primary" size="md" onClick={() => handlePickMode('record')}>
              Add your pitch
            </Button>
            <Button variant="tertiary" size="md" onClick={() => handlePickMode('written')}>
              Write a pitch
            </Button>
          </div>
        </div>
        {/* Figma 6083:34058 — ✅ VERIFIED verbatim. */}
        <p className="font-sans text-[12px] text-[#70706e]">
          No pitch yet?{' '}
          <button
            type="button"
            onClick={handleGoToHub}
            className="font-semibold text-brand-green underline underline-offset-2 cursor-pointer"
          >
            Skip this stage
          </button>
        </p>
      </div>

      <GradientLabel>Three ways to pitch</GradientLabel>
      <ThreeWaysRow onPick={handlePickMode} />

      <GradientLabel className="capitalize">The 4-sentence formula</GradientLabel>
      <FormulaCompactCard />
    </>
  );

  // Record mode — Figma 6083:46594 (idle) / 5890:1732 (recorded).
  const renderRecordMode = () => (
    <>
      <PitchRecorder
        state={recorderState}
        elapsedSeconds={elapsedSeconds}
        onAllowCamera={handleAllowCamera}
        onToggleRecording={handleToggleRecording}
        onPreview={handlePreview}
      />

      {hasRecording ? (
        <>
          {/* Playback scrubber — Figma 5906:7/8/9/10. Static in Figma (a flat
              #e8e8e4 track, no thumb); the right-hand value is the real take
              length instead of Figma's literal "0:58". */}
          <div className="flex items-center gap-[12px] w-full">
            <span className="font-mono text-[11px] text-[#111]">0:00</span>
            <div className="flex-1 h-[4px] rounded-[2px] bg-[#e8e8e4]" aria-hidden="true" />
            <span className="font-mono text-[11px] text-[#70706e]">
              {formatDurationLabel(elapsedSeconds)}
            </span>
          </div>

          {/* Figma 5906:11 */}
          <p className="font-sans font-semibold text-[12px] text-[#19341d]">Quick self-check</p>

          {/* Re-record action bar — Figma 5906:29 / 6156:17915 / 6152:120229 */}
          <div
            className="flex flex-wrap items-center gap-[12px] w-full rounded-[22px] px-[16px] py-[12px]"
            style={{
              backgroundImage:
                'linear-gradient(176deg, #2a5730 13.134%, #387440 53.284%, #498b52 86.134%)',
              boxShadow:
                '0px 12px 28px -6px rgba(15,15,10,0.1), 0px 2px 4px 0px rgba(15,15,10,0.06)',
            }}
          >
            <p className="flex-1 min-w-[240px] font-sans text-[14px] leading-[18.9px] text-white/90">
              Not happy with your recording? Re-record your pitch to get it just right before
              publishing.
            </p>
            <Button variant="tertiary" size="sm" onClick={handleReRecord} className="shrink-0">
              Re-Record
            </Button>
          </div>

          {/* Figma 5906:12/15/18/21 */}
          <div className="flex flex-col gap-[10px] w-full">
            {renderChecklist(RECORD_CHECKLIST, 'record')}
          </div>

          {/* Profile-strength card — Figma 5906:24/26/27/28 */}
          <div
            className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[20px] py-[16px] flex flex-col gap-[10px]"
            style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between gap-[12px]">
              <p className="font-sans font-medium text-[12px] text-brand-green">
                Profile strength after publishing pitch
              </p>
              <span className="flex items-center gap-[8px] shrink-0">
                <span className="font-sans font-semibold text-[12px] text-brand-green">100%</span>
                <PitchMedalIcon className="h-4 w-[13px] text-brand-green" />
              </span>
            </div>
            <div
              className="h-[6px] w-full rounded-[3px]"
              style={{ background: 'linear-gradient(90deg, #2a5730, #8bc74a)' }}
            />
          </div>

          {/* Figma 5906:35 — two-line footnote. ✅ VERIFIED verbatim. */}
          <p className="w-full text-center font-sans text-[11px] leading-[17px] text-[#979286]">
            Publishing makes your full profile live on GTH. Recruiters can find and reach out to you
            immediately.
            <br />
            You can edit, re-record or remove your pitch at any time from your dashboard.
          </p>
        </>
      ) : (
        <>
          <GradientLabel>Three ways to pitch</GradientLabel>
          <ThreeWaysRow onPick={handlePickMode} />

          <GradientLabel className="capitalize">The 4-sentence formula</GradientLabel>
          <FormulaCompactCard />
        </>
      )}
    </>
  );

  // Upload mode — Figma 5890:694 (empty) / 5890:1040 (loaded).
  const renderUploadMode = () => (
    <>
      {uploadedFile ? (
        <>
          {/* The uploaded file previews in the same viewfinder shell as a
              recording — Figma 6083:47113 is literally the recorded-state
              viewfinder on the upload frame. */}
          <PitchRecorder state="recorded" onPreview={handlePreview} />

          {/* File row — Figma 5903:19/20/22/23/24/25/26/27 */}
          <div
            className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[20px] py-[14px] flex flex-wrap items-center gap-[14px]"
            style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
          >
            <span className="flex items-start rounded-[10px] bg-[#eff4f0] px-[12px] py-[10px] shrink-0">
              <PitchFilmSlateIcon className="size-4 text-brand-green" />
            </span>
            <div className="flex-1 min-w-[200px] flex flex-col gap-[3px]">
              <p className="font-sans font-medium text-[13px] text-brand-green truncate">
                {uploadedFile.name}
              </p>
              <div className="flex flex-wrap items-start gap-[6px] font-sans font-medium text-[11px]">
                <span className="text-[#70706e]">
                  {uploadedFile.sizeLabel} · {uploadedFile.format} ·
                </span>
                <span className="text-brand-green">
                  ✓ {uploadedFile.durationLabel} — within 60s
                </span>
              </div>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                log('replace file clicked — clearing the picked file');
                setUploadedFile(null);
              }}
              className="shrink-0"
            >
              Replace
            </Button>
          </div>

          {/* "File passed all checks" — Figma 5903:29/30/31/32 + the 2×2 grid
              5903:38/41/44/47. Note Figma writes these facts with a colon
              separator here while the aside uses an em dash for the same
              ones; both reproduced verbatim in their own place. */}
          <div
            className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[20px] py-[18px] flex flex-col gap-[10px]"
            style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start gap-[8px] text-brand-green">
              <span className="font-sans font-bold text-[12px]">✓</span>
              <span className="font-sans font-medium text-[13px]">File passed all checks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[60px] gap-y-[8px]">
              {buildUploadFileChecks(uploadedFile).map((check) => (
                <div key={check} className="flex items-start gap-[8px]">
                  <span className="font-sans font-semibold text-[11px] text-brand-green">✓</span>
                  <span className="font-sans text-[12px] text-[#70706e]">{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Figma 5903:48 */}
          <p className="font-sans font-semibold text-[12px] text-[#2d5d33]">
            Before you publish : quick check
          </p>

          {/* Figma 5903:49 — the four rows live inside one white card here,
              unlike the record frame's free-standing rows. */}
          <div
            className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[20px] py-[16px] flex flex-col gap-[8px]"
            style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
          >
            {renderChecklist(UPLOAD_CHECKLIST, 'upload')}
          </div>

          {/* Figma 5903:67/68/69/70/71 — ✅ VERIFIED verbatim. */}
          <p className="w-full text-center font-sans text-[12px] text-[#70706e]">
            Not happy with it?{' '}
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="font-semibold text-brand-green cursor-pointer"
            >
              Upload a different file
            </button>{' '}
            or{' '}
            <button
              type="button"
              onClick={() => handlePickMode('record')}
              className="font-semibold text-brand-green cursor-pointer"
            >
              record in-browser instead
            </button>
          </p>
        </>
      ) : (
        <>
          {/* Drop zone — Figma 6083:46977. This node is an INSTANCE of the
              design system's own Upload component (internal symbol
              3014:50687), so the shared `ui/form/Upload.jsx` primitive is
              reused rather than re-drawn inline (per the standing
              reuse-components rule).
              ⚠️ Two knowingly-accepted deltas from this instance: the shared
              primitive paints a 2px dashed #c1d4c4 border on #fefefd where
              the Figma instance overrides to 1.2px dashed #387440 on
              rgba(235,241,236,0.5) (not overridable from the call site
              without restyling the primitive for every other page), and its
              link reads "browse to choose a file" where Figma's own string
              has the typo "browser to choose a file" (6083:46977 →
              I…;3014:50692). Flagged, not silently changed either way. */}
          <Upload
            accept="video/mp4,video/quicktime,video/webm"
            acceptLabels={['Mp4', 'Mov', 'WebM']}
            height={207}
            title="Drop your pitch video here"
            icon={<PitchDropUploadIcon className="size-4" />}
            onFileSelect={handleFileSelect}
            className="w-full"
          />

          {/* Figma 5900:17 */}
          <GradientLabel>How to get a video from your phone</GradientLabel>

          {/* Figma 5900:18 / 5900:25 — two rows of two; the 4th card is
              tinted rgba(235,241,236,0.5) in Figma, the rest plain white. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] w-full">
            {PHONE_TRANSFER_CARDS.map((card) => (
              <div
                key={card.id}
                className="border border-[#e1eae2] rounded-[12px] px-[20px] py-[18px] flex flex-col gap-[6px]"
                style={{
                  background: card.highlighted ? 'rgba(235,241,236,0.5)' : '#ffffff',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <p className="font-sans font-semibold text-[11px] tracking-[0.6px] text-brand-green">
                  {card.title}
                </p>
                <p className="font-sans text-[12px] leading-[18px] text-[#70706e]">{card.body}</p>
              </div>
            ))}
          </div>

          {/* Figma 5900:32/33/34 */}
          <p className="w-full text-center font-sans text-[12px] text-[#70706e]">
            Not ready?{' '}
            <button
              type="button"
              onClick={handleGoToHub}
              className="font-semibold text-brand-green cursor-pointer"
            >
              Skip pitch
            </button>
          </p>
        </>
      )}
    </>
  );

  // Written mode — Figma 5890:1386.
  const renderWrittenMode = () => {
    const words = countWords(writtenText);
    return (
      <>
        {/* Figma 6120:134675 — label "Written Pitch" carries a genuine green
            required asterisk (6120:134680/134681, #2e8b57), so `required` is
            real here, not a stray decorative artifact. Placeholder
            6120:134696 is Figma's own. The textarea box (6120:134685) is the
            design system's GTHInput, i.e. the shared Textarea primitive. */}
        <Textarea
          label="Written Pitch"
          required
          value={writtenText}
          onChange={(e) => {
            log('written pitch changed', { length: e.target.value.length });
            setWrittenText(e.target.value);
          }}
          placeholder="Hi, I’m [name], a [role] from [city]…"
          maxLength={WRITTEN_PITCH_CHAR_LIMIT}
          showCounter={false}
          rows={4}
          className="w-full"
        />

        {/* Counters — Figma 5905:42/43/44. The built-in Textarea counter is
            suppressed above because Figma splits it into a left-hand word
            count and a right-hand DM-Mono character budget. */}
        <div className="flex items-start justify-between w-full">
          <span className="font-sans text-[11px] text-[#70706e]">
            {words} word{words === 1 ? '' : 's'}
          </span>
          <span className="font-mono text-[10px] text-[#babab7]">
            {writtenText.length} / {WRITTEN_PITCH_CHAR_LIMIT}
          </span>
        </div>

        {/* Tips card — Figma 5905:10 */}
        <div
          className="w-full border border-[rgba(56,116,64,0.4)] rounded-[12px] px-[24px] py-[22px] flex flex-col gap-[14px]"
          style={{
            background: 'rgba(239,244,240,0.2)',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          <p className="font-sans font-bold text-[11px] tracking-[0.6px] text-brand-green">
            💡 THE 4-SENTENCE FORMULA
          </p>

          <div className="flex flex-col gap-[14px]">
            {FORMULA_ROWS.map((row) => (
              <div key={row.num} className="flex items-start gap-[12px]">
                <span className="inline-flex items-start rounded-full bg-brand-green px-[7px] py-[2px] font-sans font-bold text-[10px] text-white shrink-0">
                  {row.num}
                </span>
                <div className="flex flex-col gap-[2px] min-w-0">
                  <span className="font-sans font-semibold text-[12px] text-[#2d5d33]">
                    {row.title}
                  </span>
                  <span className="font-sans text-[12px] text-[#737373]">{row.sentence}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-[#d5e3d7]" aria-hidden="true" />

          <div className="flex flex-col gap-[12px] text-[#70706e]">
            <p className="font-sans font-bold text-[10px] tracking-[0.6px]">COMPLETE EXAMPLE</p>
            <p className="font-display italic text-[15px] leading-[24px]">{FORMULA_EXAMPLE_LONG}</p>
          </div>

          <p className="font-mono text-[10px] text-[#babab7]">{FORMULA_EXAMPLE_META}</p>
        </div>

        {/* "Want 6× more recruiter messages?" banner — Figma 5905:45/47/48/49
            + the "Record Instead" button 6120:134706. */}
        <div
          className="w-full bg-white border border-[#e8e8e4] rounded-[12px] px-[20px] py-[16px] flex flex-wrap items-center gap-[14px]"
          style={{ boxShadow: '0px 2px 6px rgba(0,0,0,0.04)' }}
        >
          <PitchFilmSlateIcon className="size-4 shrink-0 text-brand-green" />
          <div className="flex-1 min-w-[240px] flex flex-col gap-[8px]">
            <p className="font-sans font-bold text-[13px] text-[#19341d]">
              Want 6× more recruiter messages?
            </p>
            <p className="font-sans text-[12px] text-[#999]">
              A video pitch dramatically outperforms a written one. Record when you’re ready — it
              replaces this.
            </p>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => handlePickMode('record')}
            className="shrink-0"
          >
            Record Instead
          </Button>
        </div>

        {/* Figma 5905:52/53/54 */}
        <p className="w-full text-center font-sans text-[12px] text-[#70706e]">
          Not ready?{' '}
          <button
            type="button"
            onClick={handleGoToHub}
            className="font-semibold text-brand-green cursor-pointer"
          >
            Skip pitch
          </button>
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        {/* completionPct 90 — ✅ VERIFIED from Figma 5924:21659's own
            "· 90% profile complete · auto-saved" string. */}
        <EngagementTopBar currentStageIndex={8} completionPct={90} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {/* Header — Figma 5978:29454, identical on every Pitch stage-2
                  frame. Unlike the intro page's headline, THIS one is NOT
                  mixed-style: 5978:29455 is a single plain #111
                  Instrument-Serif node across both lines (checked
                  per-headline in the raw dive, not assumed). */}
              <section
                aria-label="Your Pitch — the final piece"
                className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)] flex items-start justify-between gap-x-[40px]"
                style={{
                  background: [
                    'radial-gradient(circle at 8% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                    'radial-gradient(circle at 95% 100%, rgba(244,114,182,0.1) 0%, transparent 50%)',
                    '#fff',
                  ].join(', '),
                }}
              >
                <div className="min-w-0">
                  <h2 className="font-display not-italic text-[clamp(26px,2.89vw,40px)] leading-[0.95] tracking-[-1.8px] text-[#111] mb-[clamp(8px,0.93vw,16px)]">
                    <span className="block">Your Pitch</span>
                    <span className="block">The Final Piece</span>
                  </h2>
                  {/* Figma 5978:29456 — ✅ VERIFIED verbatim (two lines). */}
                  <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[22.4px] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[840px]">
                    This is the last stage. A 60-second video or written pitch is the single
                    highest-impact addition you can make to your profile. Record, upload a file, or
                    write a text pitch — all three work.
                  </p>
                  {/* Figma 5978:29465/29466/29467 — the third tag is
                      brand-green. Its VALUE is the deliberate
                      duration-sweep divergence documented in the file
                      header ("2 min" in Figma → "~7 min" here). */}
                  <div className="flex items-center flex-wrap gap-[10px]">
                    {[
                      { label: '3 ways to pitch', tone: 'text-[#737373]' },
                      { label: '60 seconds', tone: 'text-[#737373]' },
                      { label: '~7 min', tone: 'text-brand-green' },
                    ].map((tag) => (
                      <span
                        key={tag.label}
                        className={`inline-flex items-center font-sans font-semibold text-[clamp(10px,0.69vw,12px)] leading-5 bg-white rounded-full px-[12px] py-[6px] border border-[#e1eae2] whitespace-nowrap ${tag.tone}`}
                        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* "Why pitch matters" stat card — Figma 5978:29457 */}
                <div
                  className="hidden lg:block shrink-0 w-[clamp(360px,28vw,487px)] bg-white border border-[#e8e8e4] rounded-[16px] p-[18px]"
                  style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                >
                  <p className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] text-[#70706e] mb-[10px]">
                    Why pitch matters
                  </p>
                  <p className="font-sans text-[12px] text-[#70706e] leading-[19.2px] mb-[14px]">
                    Profiles with a pitch receive 6× more recruiter outreach than those without. A
                    pitch turns a data card into a person. That difference is real and measurable.
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <span className="size-[46px] shrink-0 rounded-full bg-white border border-[#fef1e7] flex items-center justify-center font-display text-[15px] text-brand-green">
                      90%
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[13px] text-[#111]">
                        Profile strength
                      </p>
                      <p className="font-sans text-[12px] text-[#959592]">
                        Eight stages done. Pitch is the final piece.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2vw,32px)] flex flex-col gap-[18px]">
                {/* Section label — Figma 5895:2 / 5906:2 / 5900:2 / 5903:2 /
                    5905:2. Sits ABOVE the mode tab row on every frame that
                    has one (verified on 5890:694 / 5890:1040 / 5890:1386),
                    so it is hoisted here rather than repeated inside each
                    mode renderer. */}
                <SectionLabel
                  onDelete={hasPitch ? () => setIsDeleteOpen(true) : undefined}
                  deleteLabel="Delete this pitch"
                >
                  Your Pitch
                </SectionLabel>

                {/* Mode tabs — Figma 6120:134569 / 6107:134149 / 6120:134598.
                    See file-header note #1 for why they render in Record mode
                    too, and note #2 for the Written frame's doubled icon. */}
                {mode && (
                  <div className="flex flex-wrap items-start gap-[10px] w-full">
                    {PITCH_MODES.map((tab) => {
                      const isActive = tab.id === mode;
                      const style = isActive ? TAB_ACTIVE_STYLE : TAB_INACTIVE_STYLE;
                      const TabIcon =
                        tab.id === 'record'
                          ? PitchFilmSlateIcon
                          : tab.id === 'upload'
                            ? PitchUploadTabIcon
                            : PitchWriteIcon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handlePickMode(tab.id)}
                          className={`inline-flex items-center gap-[6px] rounded-full border px-[16px] py-[6px] font-sans text-[12px] cursor-pointer transition-colors duration-150 ${
                            isActive ? 'font-semibold' : 'font-medium hover:bg-[#fafaf8]'
                          }`}
                          style={{
                            background: style.bg,
                            borderColor: style.border,
                            color: style.text,
                          }}
                        >
                          <TabIcon className="size-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {mode === null && renderEmptyState()}
                {mode === 'record' && renderRecordMode()}
                {mode === 'upload' && renderUploadMode()}
                {mode === 'written' && renderWrittenMode()}
              </div>
            </div>
          </div>

          <PitchStage2RightAside
            contentKey={asideKey}
            isPublished={isPublished}
            uploadedFile={uploadedFile}
          />
        </div>

        {/* Footer — Figma 6686:91434 / 91453 / 91472 / 91510 (the shared
            footer painted over every Pitch frame). Spans the full viewport
            width, sibling of the row above rather than nested next to the
            aside — same layout note as every sibling stage-2 section. */}
        <footer className="shrink-0 h-[101px] w-full border-t border-[rgba(0,0,0,0.07)] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[10px]">
              <span
                aria-hidden="true"
                className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
              />
              <span className="font-sans text-[12px] leading-5 text-[#babab7]">
                Auto-saved · changes carry to all tabs
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* ❓ Figma labels this back button literally "Goals". */}
              <Button
                variant="tertiary"
                size="md"
                onClick={handleGoBack}
                leftIcon={<ArrowLeftIcon className="size-full" />}
              >
                Goals
              </Button>

              {/* Disabled until a pitch actually exists — Figma draws no
                  disabled state for it, but publishing nothing is not a real
                  action. Documented business-logic call. */}
              <Button
                variant="primary"
                size="md"
                onClick={handlePublish}
                disabled={!hasPitch}
                rightIcon={<ArrowRightSmIcon className="size-full" />}
              >
                Review &amp; publish
              </Button>
            </div>
          </div>
        </footer>
      </main>

      <PitchPublishedModal
        isOpen={isPublishedModalOpen}
        onClose={() => setIsPublishedModalOpen(false)}
        onContinue={() => {
          setIsPublishedModalOpen(false);
          handleGoToHub();
        }}
        summary={buildPitchSummary(pitch)}
      />

      <DeletePitchModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeletePitch}
        onReplaceInstead={handleReplaceInstead}
        pitch={pitch ? { ...buildDeletePreview(pitch), onPreview: handlePreview } : null}
      />
    </div>
  );
};

export default PitchStage2Section;
