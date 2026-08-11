import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { LoadingSpinner, ArrowRightIcon, PanelModifyIcon } from '../../shared/assets.jsx';

const log = debug('TalentProfilePanel');

// "+" glyph inside the 36px row-action button — two straight lines, not a
// circle (the circle is the button's own rounded-full border). Figma
// Component 2 / Vector + Vector1 (5132:43660 subframes), 20x20 container.
const PlusMinusIcon = ({ expanded, className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 7h9" />
    {!expanded && <path d="M7 2.5v9" />}
  </svg>
);

// Experience-entry accordion chevron — Figma `bytesize:chevron-bottom`
// (5132:50598 / Frame 14172+14170), 16×16 hit box, 14×6 stroke path,
// #111. Points down when collapsed; rotate-180 when expanded (matches
// Figma's expanded Experience 1 ↑ / collapsed Experience 2 ↓).
const ExperienceChevronIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    {/* 14×6 stroke path centred in 16×16 — Figma bytesize:chevron-bottom */}
    <path
      d="M1 5.5L8 11.5L15 5.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckBadgeIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 7.3 5.3 10.1 11.5 3.7" />
  </svg>
);

/*
 * TalentProfilePanel — right-hand checklist on the Career Buddy screen.
 * Source: Figma node 5132:43660 ("RIGHT — customiser panel", re-extracted
 * 2026-07-23 via get_design_context for exact padding/type/icon fidelity —
 * supersedes the earlier build sourced from full-page screenshots only)
 * plus the isolated per-row exports at 5264:48151-48195.
 *
 * Row states re-extracted 2026-07-29 via get_design_context on the
 * Educational Background flow's own state machine (Figma 5132:46553
 * "NOT STARTED" → 46736 "IN PROGRESS" → 46916 "AWAITING REVIEW AND
 * CONFIRMATION" → 47096 "USER CHOOSES TO EDIT" → 47276 "EDUCATIONAL
 * BACKGROUND SAVED" → 47551 "CONFIRMED") and cross-checked against the
 * Personal Area of Interest equivalents (5132:48506 view-details /
 * 5132:48766 edit-details — identical treatment, 3 plain-text fields
 * instead of 7, no verified/Transcript row):
 *   - view-details (5132:47002, AWAITING REVIEW): read-only rows, gap-[18px],
 *     label font-medium text-[16px] #111, value text-[17px] #595959 text-
 *     right max-w-[350px], Modify (tertiary, `!rounded-[14px]` override +
 *     SLArrowRightSmIcon rightIcon) + Confirm (primary, h-[48px] +
 *     ArrowRightIcon rightIcon) buttons, both size="md" (px-28 py-14 —
 *     Figma's own value, not the `sm` this first shipped with). Supersedes
 *     an earlier pass that rendered rows at text-[12px] and both buttons
 *     with neither their exact Figma size nor their right-arrow icon at
 *     all — caught re-verifying against this state's own frame.
 *   - edit-details (5132:47182, USER CHOOSES TO EDIT): same rows but each
 *     editable field becomes a bordered box (border-[#e9e9e9] rounded-[8px]
 *     text-[#737373]) with a single content-width "Update" button (primary,
 *     size="md" h-[48px], no icon — NOT full-width, an earlier pass had it
 *     `w-full`). Figma's own edit-details node duplicates the "Field of
 *     Study" label where the read-only sibling (and the value "Second
 *     Class Upper") clearly means "Grade" — a Figma copy-paste slip, not
 *     reproduced here since this build maps fields from
 *     EDUCATIONAL_BACKGROUND_FIELDS (already correctly labelled) rather
 *     than hand-copying the Figma JSX. Transcript stays read-only (verified
 *     badge, size-[20px] matching Figma's material-symbols:verified-rounded)
 *     in both states — it's never one of the editable boxes.
 *
 * Exact values from Figma (px, not approximated):
 *   Panel:      bg-white border-l border-[rgba(0,0,0,0.06)] px-[54px] py-[24px]
 *   Header:     gap-[9px] pt-[14px] pb-[20px]
 *   Title:      Instrument Serif ("font-display"), 32px, tracking -1px, #111
 *   Subtitle:   SF Pro Rounded ("font-sans"), 16px, tracking 0.2px, leading 18px, #595959
 *   Row:        border-b border-[#e5e7eb], py-[40px] pr-[20px] (no pl — panel's own px-54 provides it)
 *   Row left:   gap-[20px] between icon and text stack
 *   Icon:       40x40 (size-10)
 *   Row title:  SF Pro Rounded Medium, 20px, #111
 *   Completion: SF Pro Rounded Regular, 14px, #595959 (or #c8951a amber "In Progress"
 *               while awaiting-review — Figma keeps this label until the real save
 *               lands, not a percentage), gap-[6px] under title
 *   "+" button: 36x36 (size-9), rounded-full, border border-[#e5e7eb], 20px glyph, #595959
 *
 * Presentational + expand/confirm interaction only — the conversational
 * data collection lives in CareerBuddySection/careerBuddyScript.js. A row
 * with `fields` renders the expanded detail card; a row without `fields`
 * (not yet visited by the chat) shows a short placeholder instead of
 * fabricating data that hasn't been collected.
 *
 * Props:
 *   stages       Array<{ id, panelLabel, completionPct, status, Icon, fields? }>
 *                status: 'not-started' | 'in-progress' | 'awaiting-review' | 'done'
 *   expandedId   string | null
 *   onToggleExpand (id) => void
 *   onConfirm      (id, updatedFields) => void  — only called for rows with `fields`;
 *                  updatedFields reflects any edits made via Modify/Update first
 *   onModify       (id) => void — called when Modify is clicked (entering edit mode)
 *   confirming     string | null — stage id currently mid-save (shows a spinner,
 *                  disables Modify/Confirm) so the caller can drive the real
 *                  async save state instead of the panel faking it
 */
/*
 * ROLE-AGNOSTIC SHELL (2026-08-10) — this panel is the shared right-hand
 * surface for every Career Buddy role flow (talent + recruiter), not just the
 * talent one. `title` / `subtitle` / `ariaLabel` / `tabs` were added so the
 * copy and the profile switcher can vary per role; all four default to the
 * values this file previously hardcoded, so the original talent usage in
 * CareerBuddySection renders byte-identically and needed no change.
 *
 *   title      string    — panel <h2>
 *   subtitle   string    — supporting line under the title
 *   ariaLabel  string    — <aside aria-label>
 *   tabs       { id, label }[] | undefined — profile switcher (Figma
 *              5132:69604). Omitted entirely when undefined, which is why the
 *              talent screen is unaffected.
 *   activeTabId  string | undefined
 *   onSelectTab  (id) => void
 */
const TalentProfilePanel = ({
  stages,
  expandedId,
  onToggleExpand,
  onConfirm,
  onModify,
  confirming,
  className,
  title = 'Talent Profile Panel',
  subtitle = 'Every section you confirm brings the right job one step closer',
  ariaLabel = 'Talent profile panel',
  tabs,
  activeTabId,
  onSelectTab,
}) => {
  const [editingId, setEditingId] = useState(null);
  // Per-stage field overrides applied on top of `stage.fields` — owned here
  // since the edit/Update round-trip is a panel-local UI concern; the
  // caller still owns the source of truth for what actually gets confirmed
  // (onConfirm receives the merged array).
  const [fieldOverrides, setFieldOverrides] = useState({});
  // Which experience sub-card is expanded, for stages that use `entries`
  // (currently only Work Experience) instead of flat `fields`.
  //   null  → not yet touched; default to the first entry that has fields
  //   ''    → user explicitly collapsed every entry (accordion closed)
  //   id    → that entry is open
  // Using '' (not null) for "none" is required — collapsing used to set
  // null, which re-triggered the "default first entry" branch and made the
  // chevron look broken (Experience 1 could never stay closed).
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  log('render', { stageCount: stages.length, expandedId, editingId, expandedEntryId, confirming });

  const mergedFields = (stage) => {
    const overrides = fieldOverrides[stage.id];
    if (!overrides || !stage.fields) return stage.fields;
    return stage.fields.map((field) =>
      field.label in overrides ? { ...field, value: overrides[field.label] } : field
    );
  };

  const activeExperienceEntryId = (entries) => {
    if (expandedEntryId === '') return null;
    if (expandedEntryId) return expandedEntryId;
    return entries.find((entry) => entry.fields)?.id ?? null;
  };

  return (
    <aside
      className={classNames(
        'flex flex-col overflow-y-auto no-scrollbar bg-white border-l border-[rgba(0,0,0,0.06)] px-[54px] py-[24px]',
        className
      )}
      aria-label={ariaLabel}
    >
      <div className="flex flex-col gap-[9px] pt-[14px] pb-[20px]">
        <h2 className="font-display not-italic text-[32px] tracking-[-1px] text-[#111]">{title}</h2>
        <p className="font-sans text-[16px] leading-[18px] tracking-[0.2px] text-[#595959]">
          {subtitle}
        </p>
      </div>

      {/* Profile switcher — Figma 5132:69604 / 5132:43218. Only rendered when
          a caller supplies tabs (the talent flow does not), so this is purely
          additive for existing usage. Figma: 300px pill-group, 6px padding,
          6px gap, r-10, drop-shadow 0 1px 1px rgba(0,0,0,0.17); the active tab
          is white with a #e5e5e5 border and brand-green label, the inactive
          tab is transparent with a #595959 label. */}
      {tabs?.length > 0 && (
        <div className="flex flex-col items-center justify-center pb-[20px]">
          <div
            role="tablist"
            aria-label={`${title} view`}
            className="flex w-[300px] items-start gap-[6px] rounded-[10px] bg-[#f2f2f2] p-[6px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.17)]"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab?.(tab.id)}
                  className={classNames(
                    'flex flex-1 min-w-px items-center justify-center overflow-hidden whitespace-nowrap',
                    'font-sans text-[14px] text-center transition-all duration-300 ease-in',
                    isActive
                      ? 'rounded-[10px] border border-[#e5e5e5] bg-white px-[24px] py-[14px] text-brand-green'
                      : 'rounded-pill px-[24px] py-[12px] text-[#595959]'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {stages.map((stage, index) => {
          const isExpanded = expandedId === stage.id;
          const isEditing = editingId === stage.id;
          const isConfirming = confirming === stage.id;
          const isNotStarted = stage.completionPct === 0 && stage.status === 'not-started';
          const isAwaitingReview = stage.status === 'awaiting-review';
          // Figma shows "Completion: In Progress" (amber) from the moment
          // the chat starts collecting this section (5132:46736 "IN
          // PROGRESS") all the way through awaiting-review (5132:46916) —
          // it only becomes a real percentage after the actual save lands.
          const showInProgressLabel = stage.status === 'in-progress' || isAwaitingReview;
          const Icon = stage.Icon;
          const fields = mergedFields(stage);

          return (
            <div key={stage.id} className={classNames(index > 0 && 'border-t border-[#e5e7eb]')}>
              {/* Whole row toggles expand/collapse — a <div> (not <button>)
                  because it contains the dedicated "+/-" Button below;
                  nesting a real <button> inside a <button> is invalid HTML
                  and was throwing a hydration error. role="button" +
                  tabIndex + onKeyDown keep it keyboard-accessible. */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  log('branch', { toggleExpand: stage.id, wasExpanded: isExpanded });
                  onToggleExpand?.(stage.id);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  onToggleExpand?.(stage.id);
                }}
                className="w-full flex items-center justify-between gap-[20px] py-[40px] pr-[20px] text-left cursor-pointer"
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-[20px] min-w-0">
                  <Icon className="size-10 text-brand-green shrink-0" />
                  <span className="flex flex-col gap-[6px] min-w-0">
                    <span className="font-sans font-medium text-[20px] text-[#111] truncate">
                      {stage.panelLabel}
                    </span>
                    <span className="font-sans text-[14px] text-[#595959]">
                      Completion:{' '}
                      {showInProgressLabel ? (
                        <span className="font-medium text-[#c8951a]">In Progress</span>
                      ) : stage.completionPct > 0 ? (
                        `${stage.completionPct}%`
                      ) : (
                        'Not Started'
                      )}
                    </span>
                  </span>
                </span>
                <Button
                  type="button"
                  variant="icon"
                  size="md"
                  aria-label={
                    isExpanded ? `Collapse ${stage.panelLabel}` : `Expand ${stage.panelLabel}`
                  }
                  className="bg-white border border-[#e5e7eb]"
                  onClick={(e) => {
                    // Row itself already toggles on click — stop this from
                    // bubbling up and firing the same toggle a second time.
                    e.stopPropagation();
                    log('branch', {
                      toggleExpand: stage.id,
                      wasExpanded: isExpanded,
                      via: 'button',
                    });
                    onToggleExpand?.(stage.id);
                  }}
                >
                  <PlusMinusIcon expanded={isExpanded} className="size-5" />
                </Button>
              </div>

              {isExpanded && (
                <div className="pb-[29px] px-[40px]">
                  {stage.entries ? (
                    <>
                      {/* Work Experience (Figma 5132:50598 view / 5132:50994
                          edit) — re-verified 2026-08-07 against REST API on
                          5132:50598. LIST of collapsible job sub-cards:
                            • Title row: px-8, SPACE_BETWEEN, 16px/500 #111,
                              wraps (no truncate) — was truncating + using
                              PlusMinus; Figma uses bytesize:chevron-bottom.
                            • Detail card: white, border #e8e8e8, r-8,
                              gap-18, px-16 py-12. Field rows gap-16;
                              label HUG 15px #0a0a0a; value FILL flex-1
                              16px #616161 text-right (NO max-w — the old
                              max-w-[280px] forced Skills/Supervisor to
                              wrap too early and crowd the right edge).
                            • Only entries with Q&A `fields` expand content;
                              Experience 2 still shows the chevron for
                              visual fidelity but is non-interactive. */}
                      <div className="flex flex-col gap-[18px] mb-[48px]">
                        {stage.entries.map((entry) => {
                          const canExpand = Boolean(entry.fields);
                          const isEntryExpanded =
                            canExpand && activeExperienceEntryId(stage.entries) === entry.id;
                          return (
                            <div key={entry.id} className="flex flex-col gap-[14px]">
                              <button
                                type="button"
                                disabled={!canExpand}
                                aria-expanded={canExpand ? isEntryExpanded : undefined}
                                onClick={() => {
                                  log('branch', {
                                    toggleExperienceEntry: entry.id,
                                    wasExpanded: isEntryExpanded,
                                    canExpand,
                                  });
                                  if (!canExpand) return;
                                  // '' = accordion fully closed (see state
                                  // comment above). Do NOT set null here.
                                  setExpandedEntryId(isEntryExpanded ? '' : entry.id);
                                }}
                                className={classNames(
                                  'flex w-full items-center justify-between gap-3 px-2 text-left font-sans font-medium text-[16px] leading-[19px] text-[#111]',
                                  canExpand
                                    ? 'cursor-pointer hover:text-brand-green'
                                    : 'cursor-default'
                                )}
                              >
                                {/* Figma title is layoutGrow FILL + HEIGHT
                                    auto-resize — wraps to 2 lines rather
                                    than truncating with ellipsis. */}
                                <span className="min-w-0 flex-1">{entry.title}</span>
                                <ExperienceChevronIcon
                                  className={classNames(
                                    'size-4 shrink-0 text-[#111] transition-transform duration-300 ease-in',
                                    isEntryExpanded && 'rotate-180'
                                  )}
                                />
                              </button>
                              {isEntryExpanded && (
                                // Card fill: Figma 5132:50598 Frame 14167 lists
                                // white + #f8f8f8 solids; screenshot (visual
                                // ground truth) reads as a light-grey card,
                                // so #f8f8f8 wins over opaque white-on-top.
                                <div className="flex w-full flex-col gap-[18px] rounded-[8px] border border-[#e8e8e8] bg-[#f8f8f8] px-4 py-3">
                                  {entry.fields.map((field) => (
                                    <div
                                      key={field.label}
                                      className="flex w-full items-start gap-4"
                                    >
                                      <span className="shrink-0 whitespace-nowrap font-sans text-[15px] leading-[22.5px] text-[#0a0a0a]">
                                        {field.label}
                                      </span>
                                      {/* flex-1 + min-w-0 + break-words: value
                                          fills remaining row width (Figma
                                          layoutGrow=1 / FILL) and long tokens
                                          (email) wrap inside the card instead
                                          of overflowing the right padding. */}
                                      <span className="min-w-0 flex-1 break-words text-right font-sans text-[16px] leading-[22.4px] text-[#616161] whitespace-pre-line">
                                        {field.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => log('branch', { addExperience: stage.id })}
                          className="mb-6 flex items-center gap-2 font-sans text-[14px] text-[#0a0a0a] hover:text-brand-green"
                        >
                          <PlusMinusIcon expanded={false} className="size-4" />
                          Add Experience
                        </button>
                      )}

                      <div
                        className={classNames(
                          'flex w-full',
                          isEditing ? 'justify-end' : 'items-center justify-end gap-4'
                        )}
                      >
                        {isEditing ? (
                          <Button
                            variant="primary"
                            size="md"
                            className="h-[48px]"
                            onClick={() => {
                              log('branch', { update: stage.id });
                              setEditingId(null);
                            }}
                          >
                            Update
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="tertiary"
                              size="md"
                              className="!rounded-[14px]"
                              disabled={isConfirming}
                              rightIcon={<PanelModifyIcon className="size-full" />}
                              onClick={() => {
                                log('branch', { modify: stage.id });
                                setEditingId(stage.id);
                                onModify?.(stage.id);
                              }}
                            >
                              Modify
                            </Button>
                            <Button
                              variant="primary"
                              size="md"
                              className="h-[48px]"
                              disabled={isConfirming}
                              rightIcon={!isConfirming && <ArrowRightIcon />}
                              onClick={() => onConfirm?.(stage.id, stage.entries)}
                            >
                              {isConfirming ? (
                                <span className="inline-flex items-center gap-2">
                                  <LoadingSpinner stroke="white" /> Saving
                                </span>
                              ) : (
                                'Confirm'
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  ) : fields ? (
                    isEditing ? (
                      <>
                        {/* edit-details (Figma 5132:47182) — editable boxes for
                            every field except Transcript, which stays a
                            read-only verified row in this state too. */}
                        <div className="flex flex-col gap-[18px] mb-[48px]">
                          {fields.map((field) =>
                            field.verified ? (
                              <div
                                key={field.label}
                                className="flex items-start justify-between gap-3"
                              >
                                <span className="font-sans font-medium text-[16px] text-[#111] whitespace-nowrap">
                                  {field.label}
                                </span>
                                <span className="flex items-center gap-[6px] text-brand-green">
                                  <CheckBadgeIcon className="size-[20px]" />
                                  <span className="font-sans text-[17px] text-brand-green">
                                    {field.value}
                                  </span>
                                </span>
                              </div>
                            ) : (
                              <div
                                key={field.label}
                                className="flex items-center justify-between gap-3"
                              >
                                <span className="font-sans font-medium text-[16px] text-[#111] whitespace-nowrap shrink-0">
                                  {field.label}
                                </span>
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setFieldOverrides((prev) => ({
                                      ...prev,
                                      [stage.id]: { ...prev[stage.id], [field.label]: value },
                                    }));
                                  }}
                                  className="flex-1 min-w-0 max-w-[250px] rounded-[8px] border border-[#e9e9e9] px-[16px] py-[12px] font-sans text-[16px] text-[#737373] focus:outline-none focus:border-brand-green-light-active"
                                />
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex justify-end w-full">
                          <Button
                            variant="primary"
                            size="md"
                            className="h-[48px]"
                            onClick={() => {
                              log('branch', { update: stage.id });
                              setEditingId(null);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* view-details / AWAITING REVIEW (Figma 5132:47002) */}
                        <div className="flex flex-col gap-[18px] mb-[48px]">
                          {fields.map((field) => (
                            <div
                              key={field.label}
                              className="flex items-start justify-between gap-3"
                            >
                              <span className="font-sans font-medium text-[16px] text-[#111] whitespace-nowrap">
                                {field.label}
                              </span>
                              <span
                                className={classNames(
                                  'font-sans text-[17px] text-right max-w-[350px] flex items-center gap-[6px]',
                                  field.verified ? 'text-brand-green' : 'text-[#595959]'
                                )}
                              >
                                {field.verified && <CheckBadgeIcon className="size-[14px]" />}
                                {field.value}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-end gap-[16px] w-full">
                          <Button
                            variant="tertiary"
                            size="md"
                            className="!rounded-[14px]"
                            disabled={isConfirming}
                            rightIcon={<PanelModifyIcon className="size-full" />}
                            onClick={() => {
                              log('branch', { modify: stage.id });
                              setEditingId(stage.id);
                              onModify?.(stage.id);
                            }}
                          >
                            Modify
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            className="h-[48px]"
                            disabled={isConfirming}
                            rightIcon={!isConfirming && <ArrowRightIcon />}
                            onClick={() => onConfirm?.(stage.id, fields)}
                          >
                            {isConfirming ? (
                              <span className="inline-flex items-center gap-2">
                                <LoadingSpinner stroke="white" /> Saving
                              </span>
                            ) : (
                              'Confirm'
                            )}
                          </Button>
                        </div>
                      </>
                    )
                  ) : stage.previewFields ? (
                    <>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-content-tertiary mb-2">
                        Preview — not yet confirmed by Career Buddy
                      </p>
                      <dl className="flex flex-col gap-2 opacity-70">
                        {stage.previewFields.map((field) => (
                          <div
                            key={field.label}
                            className="flex items-center justify-between gap-3"
                          >
                            <dt className="font-sans text-[12px] text-content-tertiary">
                              {field.label}
                            </dt>
                            <dd className="font-sans text-[12px] font-medium text-content-primary flex items-center gap-1">
                              {field.value}
                              {field.verified && (
                                <CheckBadgeIcon className="size-3 text-brand-green" />
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : (
                    <p className="font-sans text-[12px] text-content-tertiary italic">
                      {isNotStarted
                        ? "Nothing to review yet — this section hasn't started."
                        : 'Full detail view is coming soon.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default TalentProfilePanel;
