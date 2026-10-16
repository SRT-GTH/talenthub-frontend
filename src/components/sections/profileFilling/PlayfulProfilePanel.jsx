import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { LoadingSpinner } from '../../shared/assets.jsx';
import iconPersonalInfo from '../../../assets/playful/panel/icon-personal-info.svg';
import iconEducation from '../../../assets/playful/panel/icon-education.svg';
import iconInterests from '../../../assets/playful/panel/icon-interests.svg';
import iconPersonality from '../../../assets/playful/panel/icon-personality.svg';
import iconSkills from '../../../assets/playful/panel/icon-skills.svg';
import iconWork from '../../../assets/playful/panel/icon-work-experience.svg';
import iconPortfolio from '../../../assets/playful/panel/icon-project-portfolio.svg';
import iconCerts from '../../../assets/playful/panel/icon-certifications.svg';
import iconCareer from '../../../assets/playful/panel/icon-career-options.svg';
import iconPitch from '../../../assets/playful/panel/icon-career-pitch.svg';
import glyphPlus from '../../../assets/playful/panel/glyph-plus.svg';
import glyphMinus from '../../../assets/playful/panel/glyph-minus.svg';
import glyphVerified from '../../../assets/playful/panel/glyph-verified.svg';
import glyphModify from '../../../assets/playful/panel/glyph-modify.svg';
import glyphArrow from '../../../assets/playful/panel/glyph-confirm-arrow.svg';
import glyphChevron from '../../../assets/playful/panel/glyph-chevron-down.svg';
import glyphAddPlus from '../../../assets/playful/panel/glyph-add-plus.svg';
import personalityBadge from '../../../assets/playful/panel/personality-badge.png';

const log = debug('PlayfulProfilePanel');

/*
 * PlayfulProfilePanel — Playful appearance of the talent "Your profile, live"
 * panel. Figma: Playful section 7958:212035, panel node "RIGHT — customiser
 * panel" (616x893 in every 1728x1117 frame; e.g. 7873:54042 IN PROGRESS,
 * 54223 AWAITING REVIEW, 54404 EDIT, 55702/55963 interests, 57795/58192 work,
 * 60673/61198 career options, 63603 personality). Rendered by
 * TalentProfilePanel ONLY while <html data-ui-style="playful"> is set (talent
 * Career Buddy); the Focused markup lives untouched in TalentProfilePanel.
 *
 * Props mirror TalentProfilePanel (stages, expandedId, onToggleExpand,
 * onConfirm, onModify, confirming, className).
 *
 * Verbatim Figma copy: "Your profile, live", "Lock in each section to level
 * up your matches.", "+20 XP PER SECTION".
 *
 * Values (px at the 1728 design): card r20, shadow 0 10 24 rgba(28,42,33,.06)
 * + 5 5 0 rgba(28,42,33,.55), row py40/px20, icon 40, title 20 medium #111,
 * status 14 #595959 (In Progress #c8951a medium, 100% #387440 medium), gold
 * round "+" 36 (#ffd86b, 1.5 #1c2a21 border).
 */

const ICONS = {
  'personal-info': { src: iconPersonalInfo, box: [32.1667, 36.3333], at: [3.9167, 1.8333] },
  'educational-background': { src: iconEducation },
  'personal-interests': { src: iconInterests },
  personality: { src: iconPersonality },
  skills: { src: iconSkills },
  'work-experience': { src: iconWork },
  'project-portfolio': { src: iconPortfolio },
  certifications: { src: iconCerts },
  'desired-career': { src: iconCareer, box: [39.1415, 39.1439], at: [0.428, 0.428] },
  'talent-pitch': { src: iconPitch },
};

// ⚠️ ASSUMPTION — Figma shows a plain percentage ("80%", "48%") for the two
// seeded demo stages even though the app marks them `in-progress`; every
// other in-progress section reads "In Progress" in Figma.
const PERCENT_WHEN_IN_PROGRESS = new Set(['personal-info', 'skills']);

// Figma 58192 edit state placeholders for empty experience values.
const ENTRY_PLACEHOLDERS = {
  Duration: 'Add a duration',
  'Supervisor Info': 'Provide your referee’s info',
};

// Figma 63603 — static report copy inside the personality widget.
const PERSONALITY_SUMMARY =
  'Performs best when given autonomy and clear goals and quickly adapts to change.';
const PERSONALITY_COMMENT_PLACEHOLDER = 'What do you think about your personality report?';
const PERSONALITY_METRICS = [
  'Confidence Level',
  'Adaptability',
  'Risk Tolerance',
  'Emotional Stability',
];

const INK = 'text-[#1c2a21]';
const RING_FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#1c2a21] forced-colors:focus-visible:outline-[Highlight]';

const StageIcon = ({ id }) => {
  const icon = ICONS[id];
  if (!icon) return <span className="size-10 shrink-0 max-lg:size-8" aria-hidden="true" />;
  return (
    <span className="relative size-10 shrink-0 max-lg:size-8 max-sm:size-7" aria-hidden="true">
      {icon.box ? (
        <img
          src={icon.src}
          alt=""
          className="absolute max-w-none"
          style={{
            width: `${(icon.box[0] / 40) * 100}%`,
            height: `${(icon.box[1] / 40) * 100}%`,
            left: `${(icon.at[0] / 40) * 100}%`,
            top: `${(icon.at[1] / 40) * 100}%`,
          }}
        />
      ) : (
        <img src={icon.src} alt="" className="block size-full" />
      )}
    </span>
  );
};

const PillButton = ({
  variant,
  children,
  className,
  icon,
  angle = 198.96331177579114,
  ...rest
}) => (
  <button
    type="button"
    className={classNames(
      'inline-flex cursor-pointer items-center justify-center gap-[6px] whitespace-nowrap rounded-full border-[1.5px] border-[rgba(28,42,33,0.55)] px-[28px] py-[14px] font-sans text-[14px] font-semibold tracking-[0.1px] [filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] disabled:cursor-not-allowed disabled:opacity-60 max-lg:px-5',
      variant === 'primary' ? 'h-[48px] bg-[#387440]' : 'h-[52px] bg-white text-[#1c2a21]',
      RING_FOCUS,
      className
    )}
    {...rest}
  >
    <span
      className={classNames('leading-6', variant === 'primary' && 'bg-clip-text text-transparent')}
      style={
        variant === 'primary'
          ? {
              backgroundImage: `linear-gradient(${angle}deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)`,
            }
          : undefined
      }
    >
      {children}
    </span>
    {icon}
  </button>
);

const ChevronToggle = ({ open }) => (
  <img
    src={glyphChevron}
    alt=""
    aria-hidden="true"
    className={classNames(
      'size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-300',
      open && 'rotate-180'
    )}
  />
);

const ViewRow = ({ field }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="max-w-[180px] shrink-0 font-sans text-[16px] font-medium leading-[1.5] text-[#111] max-sm:max-w-[45%] max-sm:shrink">
      {field.label}
    </span>
    {field.verified ? (
      <span className="flex items-center justify-end gap-[6px]">
        <img src={glyphVerified} alt="" aria-hidden="true" className="size-5" />
        <span className="font-sans text-[18px] leading-[1.5] text-[#387440]">{field.value}</span>
      </span>
    ) : (
      <span
        className={classNames(
          'min-h-[25px] w-[250px] min-w-0 max-w-[60%] whitespace-pre-line text-right font-sans text-[#595959] [overflow-wrap:anywhere]',
          // Figma 5132:42203 sets the Grade value at 18px/1.5 (others 17px/1.45).
          field.label === 'Grade' ? 'text-[18px] leading-[1.5]' : 'text-[17px] leading-[1.45]'
        )}
      >
        {field.value}
      </span>
    )}
  </div>
);

const inputClass =
  'w-full min-w-0 rounded-[8px] border border-[#e9e9e9] bg-white px-4 py-3 font-sans text-[16px] leading-[1.4] text-[#737373] placeholder:text-[#999] focus-visible:border-[#1c2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]';

const EditRow = ({ field, inline, onChange, idPrefix }) => {
  const inputId = `${idPrefix}-${field.label.replace(/\s+/g, '-')}`;
  if (field.verified) {
    return <ViewRow field={field} />;
  }
  const isYear = /year/i.test(field.label);
  return (
    <div
      className={classNames(
        inline ? 'flex items-center justify-between gap-3' : 'flex flex-col gap-[14px]'
      )}
    >
      <label
        htmlFor={inputId}
        className="whitespace-pre-line font-sans text-[16px] font-medium leading-[1.5] text-[#111]"
      >
        {field.label}
      </label>
      <input
        id={inputId}
        type="text"
        value={field.value}
        onChange={(e) => onChange(field.label, e.target.value)}
        className={classNames(
          inputClass,
          inline && (isYear ? 'max-w-[144px] flex-1' : 'max-w-[320px] flex-1')
        )}
      />
    </div>
  );
};

const PersonalityWidget = ({ fields, comment, onComment, idPrefix }) => {
  const byLabel = Object.fromEntries(fields.map((f) => [f.label, f.value]));
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [commentOpen, setCommentOpen] = useState(true);
  const summaryId = `${idPrefix}-summary`;
  const commentId = `${idPrefix}-comment`;
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-[11px]">
        <img
          src={personalityBadge}
          alt=""
          aria-hidden="true"
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="flex flex-col gap-1 font-sans">
          <p className="text-[16px] font-medium leading-normal text-[#1c2a21]">Personality type</p>
          <p className="text-[14px] leading-normal text-[#737373]">{byLabel['Personality type']}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-start justify-between gap-3 font-sans leading-[1.5]">
          <span className="whitespace-nowrap text-[16px] font-medium text-[#111]">Key Traits</span>
          <span className="max-w-[297px] flex-1 text-right text-[17px] text-[#595959]">
            {byLabel['Key Traits']}
          </span>
        </div>
        <dl className="m-0 flex flex-col gap-5 font-sans">
          {PERSONALITY_METRICS.map((label) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-[16px] font-medium leading-[19px] text-[#111]">{label}</dt>
              <dd className="m-0 text-[17px] leading-[19px] text-[#595959]">{byLabel[label]}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-[14px]">
          <button
            type="button"
            aria-expanded={summaryOpen}
            aria-controls={summaryId}
            onClick={() => setSummaryOpen((v) => !v)}
            className={classNames(
              'flex w-full items-center justify-between pr-2 text-left font-sans text-[16px] font-medium text-[#111]',
              RING_FOCUS
            )}
          >
            Summary Insight
            <ChevronToggle open={summaryOpen} />
          </button>
          {summaryOpen && (
            <p
              id={summaryId}
              className="m-0 rounded-[8px] border border-[#e9e9e9] bg-[#f8f8f8] px-4 py-3 font-sans text-[15px] leading-[1.4] text-[#737373]"
            >
              {PERSONALITY_SUMMARY}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[14px]">
          <button
            type="button"
            aria-expanded={commentOpen}
            aria-controls={commentId}
            onClick={() => setCommentOpen((v) => !v)}
            className={classNames(
              'flex w-full items-center justify-between pr-2 text-left font-sans text-[16px] font-medium text-[#111]',
              RING_FOCUS
            )}
          >
            Add your comment
            <ChevronToggle open={commentOpen} />
          </button>
          {commentOpen && (
            <input
              id={commentId}
              type="text"
              aria-label="Add your comment"
              value={comment}
              onChange={(e) => onComment(e.target.value)}
              placeholder={PERSONALITY_COMMENT_PLACEHOLDER}
              className={classNames(inputClass, 'text-[15px]')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PlayfulProfilePanel = ({
  stages,
  expandedId,
  onToggleExpand,
  onConfirm,
  onModify,
  confirming,
  className,
}) => {
  const uid = useId();
  const [editingId, setEditingId] = useState(null);
  const [fieldOverrides, setFieldOverrides] = useState({});
  const [entryOverrides, setEntryOverrides] = useState({});
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [personalityComment, setPersonalityComment] = useState('');

  log('render', { stageCount: stages.length, expandedId, editingId, confirming });

  const mergedFields = (stage) => {
    const overrides = fieldOverrides[stage.id];
    if (!overrides || !stage.fields) return stage.fields;
    return stage.fields.map((f) =>
      f.label in overrides ? { ...f, value: overrides[f.label] } : f
    );
  };

  const mergedEntries = (stage) =>
    stage.entries.map((entry) => {
      const o = entryOverrides[`${stage.id}:${entry.id}`];
      if (!o || !entry.fields) return entry;
      return {
        ...entry,
        fields: entry.fields.map((f) => (f.label in o ? { ...f, value: o[f.label] } : f)),
      };
    });

  const activeEntryId = (entries) => {
    if (expandedEntryId === '') return null;
    if (expandedEntryId) return expandedEntryId;
    return entries.find((e) => e.fields)?.id ?? null;
  };

  const statusNode = (stage) => {
    const awaiting = stage.status === 'awaiting-review';
    const inProgress =
      awaiting || (stage.status === 'in-progress' && !PERCENT_WHEN_IN_PROGRESS.has(stage.id));
    if (inProgress) return <span className="font-medium text-[#c8951a]">In Progress</span>;
    if (stage.completionPct >= 100)
      return <span className="font-medium text-[#387440]">{stage.completionPct}%</span>;
    if (stage.completionPct > 0) return `${stage.completionPct}%`;
    return 'Not Started';
  };

  const renderActions = (stage, isEditing, payload) => {
    const isConfirming = confirming === stage.id;
    if (isEditing) {
      return (
        <PillButton
          variant="primary"
          angle={200.448224668251}
          onClick={() => {
            log('branch', { update: stage.id });
            setEditingId(null);
          }}
        >
          Update
        </PillButton>
      );
    }
    return (
      <div className="flex items-center gap-4">
        {stage.id !== 'personality' && (
          <PillButton
            variant="secondary"
            disabled={isConfirming}
            onClick={() => {
              log('branch', { modify: stage.id });
              setEditingId(stage.id);
              onModify?.(stage.id);
            }}
            icon={
              <img src={glyphModify} alt="" aria-hidden="true" className="h-[10.5px] w-[9.33px]" />
            }
          >
            Modify
          </PillButton>
        )}
        <PillButton
          variant="primary"
          disabled={isConfirming}
          onClick={() => {
            log('dispatch', { confirm: stage.id });
            onConfirm?.(stage.id, payload);
          }}
          icon={
            isConfirming ? null : (
              <img src={glyphArrow} alt="" aria-hidden="true" className="h-[9px] w-[11.2px]" />
            )
          }
        >
          {isConfirming ? (
            <span className="inline-flex items-center gap-2">
              <LoadingSpinner stroke="white" /> Saving
            </span>
          ) : (
            'Confirm'
          )}
        </PillButton>
      </div>
    );
  };

  const renderBody = (stage, isEditing) => {
    const fields = mergedFields(stage);
    const idPrefix = `${uid}-${stage.id}`;
    const setField = (label, value) =>
      setFieldOverrides((prev) => ({
        ...prev,
        [stage.id]: { ...prev[stage.id], [label]: value },
      }));

    if (stage.entries) {
      const entries = mergedEntries(stage);
      const openId = activeEntryId(entries);
      return (
        <>
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-[18px]">
              {entries.map((entry) => {
                const canExpand = Boolean(entry.fields);
                const open = canExpand && openId === entry.id;
                const panelId = `${idPrefix}-${entry.id}`;
                return (
                  <div key={entry.id} className="flex flex-col gap-[14px]">
                    <button
                      type="button"
                      disabled={!canExpand}
                      aria-expanded={canExpand ? open : undefined}
                      aria-controls={canExpand ? panelId : undefined}
                      onClick={() => {
                        log('branch', { toggleEntry: entry.id, open });
                        if (canExpand) setExpandedEntryId(open ? '' : entry.id);
                      }}
                      className={classNames(
                        'flex w-full items-center justify-between gap-3 pr-2 text-left font-sans text-[16px] font-medium leading-[1.5] text-[#111] disabled:cursor-default',
                        RING_FOCUS
                      )}
                    >
                      <span className="min-w-0 max-w-[264px] flex-1">{entry.title}</span>
                      <ChevronToggle open={open} />
                    </button>
                    {open && (
                      <div
                        id={panelId}
                        className={classNames(
                          'flex w-full flex-col gap-[18px] rounded-[8px] border border-[#e9e9e9] px-4 py-3',
                          isEditing ? 'bg-white' : 'bg-[#f8f8f8]'
                        )}
                      >
                        {entry.fields.map((f) => (
                          <div key={f.label} className="flex items-start gap-4">
                            <label
                              htmlFor={`${panelId}-${f.label.replace(/\s+/g, '-')}`}
                              className="shrink-0 whitespace-nowrap font-sans text-[15px] leading-[1.5] text-[#1c2a21]"
                            >
                              {f.label}
                            </label>
                            {isEditing ? (
                              <textarea
                                id={`${panelId}-${f.label.replace(/\s+/g, '-')}`}
                                rows={1}
                                value={f.value}
                                placeholder={ENTRY_PLACEHOLDERS[f.label]}
                                onChange={(e) =>
                                  setEntryOverrides((prev) => ({
                                    ...prev,
                                    [`${stage.id}:${entry.id}`]: {
                                      ...prev[`${stage.id}:${entry.id}`],
                                      [f.label]: e.target.value,
                                    },
                                  }))
                                }
                                className="min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-right font-sans text-[16px] leading-[1.4] text-[#616161] [field-sizing:content] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]"
                              />
                            ) : (
                              <span className="min-w-0 flex-1 whitespace-pre-line break-words text-right font-sans text-[16px] leading-[1.4] text-[#616161]">
                                {f.value}
                              </span>
                            )}
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
                className={classNames(
                  'flex items-center gap-2 self-start pr-2 font-sans text-[14px] text-[#1c2a21]',
                  RING_FOCUS
                )}
              >
                <img src={glyphAddPlus} alt="" aria-hidden="true" className="size-4" />
                Add Experience
              </button>
            )}
          </div>
          {renderActions(stage, isEditing, stage.entries)}
        </>
      );
    }

    if (fields) {
      if (stage.id === 'personality' && fields.some((f) => f.label === 'Personality type')) {
        return (
          <>
            <PersonalityWidget
              fields={fields}
              comment={personalityComment}
              onComment={setPersonalityComment}
              idPrefix={idPrefix}
            />
            {renderActions(stage, false, fields)}
          </>
        );
      }
      const inline = stage.id === 'educational-background';
      return (
        <>
          <div
            className={classNames(
              'flex w-full flex-col',
              isEditing && inline ? 'gap-[18px]' : 'gap-[18px]'
            )}
          >
            {fields.map((field) =>
              isEditing ? (
                <EditRow
                  key={field.label}
                  field={field}
                  inline={inline}
                  onChange={setField}
                  idPrefix={idPrefix}
                />
              ) : (
                <ViewRow key={field.label} field={field} />
              )
            )}
          </div>
          {renderActions(stage, isEditing, fields)}
        </>
      );
    }

    return (
      <p className="m-0 w-full font-sans text-[14px] leading-[1.45] text-[#595959]">
        {stage.previewFields
          ? 'Preview — not yet confirmed by Career Buddy'
          : stage.completionPct === 0 && stage.status === 'not-started'
            ? "Nothing to review yet — this section hasn't started."
            : 'Full detail view is coming soon.'}
      </p>
    );
  };

  return (
    <aside
      aria-label="Your profile, live"
      className={classNames(
        'relative flex flex-col overflow-y-auto no-scrollbar bg-[#fbf4e0] !border-l-[1.5px] !border-[#1c2a21] py-[24px] pl-[calc(clamp(20px,3.125vw,54px)-1.5px)] pr-[clamp(20px,3.125vw,54px)] [scroll-padding-top:76px] forced-colors:!border-[CanvasText] lg:!w-[clamp(300px,35.65vw,616px)] max-lg:px-4',
        className
      )}
    >
      {/* XP sticker — scrolls away with the list (owner decision 2026-10-16: it must
          NOT stay fixed on screen). Zero-height wrapper at the same offset it had
          unscrolled = no layout cost; below lg it flows with the header. */}
      <div className="relative z-20 h-0 w-full max-lg:static max-lg:h-auto max-lg:pb-2">
        <span
          aria-hidden="true"
          className="absolute right-[3px] top-[5px] inline-flex -rotate-[4deg] items-center whitespace-nowrap rounded-full border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] font-bold leading-normal text-[#1c2a21] [filter:drop-shadow(2px_2px_0_#1c2a21)] max-lg:relative max-lg:right-auto max-lg:top-auto max-lg:text-[12px] forced-colors:border-[CanvasText]"
        >
          +20 XP PER SECTION
        </span>
      </div>

      <div className="flex flex-col gap-[9px] pb-[20px] pt-[14px] max-lg:gap-1 max-lg:pb-3 max-lg:pt-2">
        <h2 className="m-0 font-[family-name:var(--pf-font-display)] text-[clamp(24px,1.736vw,30px)] font-semibold leading-[1.2] tracking-[-0.3px] text-[#1c2a21]">
          Your profile, live
        </h2>
        <p className="m-0 font-sans text-[16px] leading-[18px] tracking-[0.2px] text-[#595959] max-lg:text-[14px] max-lg:leading-5">
          Lock in each section to level up your matches.
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0 pb-[8px] pt-1">
        {stages.map((stage) => {
          const isExpanded = expandedId === stage.id;
          const isEditing = editingId === stage.id;
          const bodyId = `${uid}-${stage.id}-body`;
          const toggle = () => {
            log('branch', { toggleExpand: stage.id, wasExpanded: isExpanded });
            onToggleExpand?.(stage.id);
          };
          return (
            <li
              key={stage.id}
              className={classNames(
                'group/card overflow-clip rounded-[20px] bg-white [box-shadow:0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] hover:[box-shadow:inset_0_0_0_1.5px_rgba(28,42,33,0.55),0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] focus-within:[box-shadow:inset_0_0_0_1.5px_rgba(28,42,33,0.55),0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] forced-colors:border forced-colors:border-[CanvasText]',
                isExpanded &&
                  'border-[1.5px] border-[rgba(28,42,33,0.55)] pb-[28px] forced-colors:border-[CanvasText]'
              )}
            >
              <div
                onClick={toggle}
                className={classNames(
                  'flex cursor-pointer items-center justify-between gap-5 px-5 py-10 max-lg:gap-3 max-lg:px-3 max-lg:py-4',
                  isExpanded && 'min-h-[127px]'
                )}
              >
                <div className="flex min-w-0 items-center gap-5 max-lg:gap-3 max-sm:gap-2">
                  <StageIcon id={stage.id} />
                  <div className="flex min-w-0 flex-col gap-[6px] font-sans">
                    <span className="whitespace-nowrap text-[20px] font-medium leading-[24px] text-[#111] max-lg:text-[16px] max-sm:text-[14px]">
                      {stage.panelLabel}
                    </span>
                    <span
                      id={`${uid}-${stage.id}-status`}
                      className="whitespace-nowrap text-[14px] leading-[17px] text-[#595959] max-lg:text-[13px]"
                    >
                      Completion: {statusNode(stage)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={bodyId}
                  aria-describedby={`${uid}-${stage.id}-status`}
                  aria-label={`${isExpanded ? 'Close' : 'Open'} ${stage.panelLabel}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  className={classNames(
                    'relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[20px] border-[1.5px] border-[#1c2a21] bg-[#ffd86b] p-[1.5px] before:absolute before:-inset-1 before:content-[""] max-lg:size-11 max-sm:size-10',
                    RING_FOCUS
                  )}
                >
                  <img
                    src={isExpanded ? glyphMinus : glyphPlus}
                    alt=""
                    aria-hidden="true"
                    className="size-5"
                  />
                </button>
              </div>
              {isExpanded && (
                <div
                  id={bodyId}
                  role="region"
                  aria-label={`${stage.panelLabel} details`}
                  className="flex flex-col items-end justify-center gap-[48px] px-10 py-[10px] max-lg:gap-6 max-lg:px-3"
                >
                  {renderBody(stage, isEditing)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default PlayfulProfilePanel;
