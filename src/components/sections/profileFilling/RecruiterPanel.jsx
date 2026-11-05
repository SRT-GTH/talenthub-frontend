import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import RecruiterCompanyEditForm from './RecruiterCompanyEditForm.jsx';
import companyLogo from '../../../assets/recruiter/company-logo-silver-rock.png';
import {
  LoadingSpinner,
  ArrowRightIcon,
  PanelModifyIcon,
  RecruiterCompanyInfoIcon,
} from '../../shared/assets.jsx';

const log = debug('RecruiterPanel');

const PANEL_STAGE_IDS = new Set(['company-info', 'jobs']);

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

/* Check mark — Figma bounding ~14×14, stroke #387440 / #224626. */
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

/* bytesize-style chevron — points down; rotate-180 when Bio expanded (↑). */
const BioChevronIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1 5.5L8 11.5L15 5.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* The company logo of the Profile Photo row (Figma 7958:162027, exported as recruiter/company-logo-silver-rock.png). */
const CompanyLogoMark = ({ className }) => (
  <img
    src={companyLogo}
    alt="Silver Rock Technologies logo"
    className={classNames('size-12 shrink-0 rounded-full object-cover', className)}
  />
);

/*
 * RecruiterPanel — right-hand progress planner for Recruiter Career Buddy
 * (Figma 5132:65996 landing; Company Info 5132:66804/67012; Jobs preview
 * mirrors the same row/view-details chrome while Conversation AI / form
 * fill the draft — undesigned job chrome intentionally reused).
 *
 * Shows Company Info. + Jobs. Editing job details always opens the full
 * JobPostFormModal (parent `onOpenForm`), never inline panel fields.
 */
const RecruiterPanel = ({
  stages = [],
  expandedId,
  onToggleExpand,
  onConfirm,
  onModify,
  onOpenForm,
  confirming,
  // The recruiter frames (Figma 7958:160771) draw the Jobs row only once a job post is under way; the signed-in panel always lists it.
  jobsRowOnlyWhenStarted = false,
  // Stage id whose fields open in edit mode on mount (the "user edits company info" frames, Figma 7958:161872).
  initialEditingId = null,
  className,
}) => {
  const [editingId, setEditingId] = useState(initialEditingId);
  const [fieldOverrides, setFieldOverrides] = useState({});
  const [bioOpen, setBioOpen] = useState(true);

  const visibleStages = stages.filter(
    (stage) =>
      PANEL_STAGE_IDS.has(stage.id) &&
      !(jobsRowOnlyWhenStarted && stage.id === 'jobs' && stage.status === 'not-started')
  );

  log('mount', {
    stageCount: stages.length,
    visible: visibleStages.length,
    expandedId,
    editingId,
    confirming,
  });

  const mergedFields = (stage) => {
    if (!stage.fields) return null;
    const overrides = fieldOverrides[stage.id];
    if (!overrides) return stage.fields;
    return stage.fields.map((field) =>
      field.label in overrides ? { ...field, value: overrides[field.label] } : field
    );
  };

  const emptyHint = (stage) => {
    if (stage.id === 'jobs') {
      return stage.status === 'in-progress'
        ? 'Job details fill in as you chat with Career Buddy — or open the full form anytime.'
        : 'Start Post a Job in chat (Conversation with AI or Manual Creation) to populate this section.';
    }
    return stage.status === 'in-progress'
      ? 'Company details fill in as you chat with Career Buddy.'
      : 'Start Complete Company Profile in chat to populate this panel.';
  };

  const renderCompletion = (stage) => {
    const pct = stage.completionPct ?? 0;
    const padded = `${String(pct).padStart(2, '0')}%`;
    const isJobs = stage.id === 'jobs';

    // Jobs: percent only during an active add (in-progress / awaiting-review).
    // After a successful post → locked 100%. Idle / not-started → no percent
    // (recruiters can add more jobs later, so 00% would be misleading).
    if (isJobs) {
      if (stage.status === 'done') {
        return (
          <>
            Completion: <span className="font-medium text-[#387440]">100%</span>
          </>
        );
      }
      if (stage.status === 'in-progress' || stage.status === 'awaiting-review') {
        const showGreen = stage.status === 'awaiting-review' && pct >= 100;
        return (
          <>
            Completion:{' '}
            <span
              className={classNames('font-medium', showGreen ? 'text-[#387440]' : 'text-[#c8951a]')}
            >
              {pct > 0 ? padded : 'In Progress'}
            </span>
          </>
        );
      }
      return <span className="text-[#595959]">Not started</span>;
    }

    // Company Info — Figma 5132:66804
    if (stage.status === 'done' || (stage.status === 'awaiting-review' && pct >= 100)) {
      return (
        <>
          Completion: <span className="font-medium text-[#387440]">{padded}</span>
        </>
      );
    }
    if (stage.status === 'in-progress' || stage.status === 'awaiting-review') {
      return (
        <>
          Completion:{' '}
          <span className="font-medium text-[#c8951a]">{pct > 0 ? padded : 'In Progress'}</span>
        </>
      );
    }
    return (
      <>
        Completion: <span className="text-[#595959]">{padded}</span>
      </>
    );
  };

  return (
    <aside
      className={classNames(
        'flex h-full min-h-0 flex-col overflow-y-auto no-scrollbar bg-white px-[clamp(24px,3.1vw,54px)] py-[clamp(16px,1.4vw,24px)]',
        className
      )}
    >
      <header className="flex flex-col gap-[9px] pt-[14px] pb-[20px] max-lg:gap-1 max-lg:pb-3 max-lg:pt-2">
        <h2
          className={classNames(
            'leading-tight text-[#111]',
            // Figma 7958:160771: the recruiter panel title is Bricolage Grotesque 600 29px.
            jobsRowOnlyWhenStarted
              ? 'font-heading font-semibold text-[#1c2a21] tracking-[-0.02em]'
              : 'font-display tracking-[-1px]'
          )}
          style={{
            fontSize: jobsRowOnlyWhenStarted
              ? 'clamp(24px, 1.68vw, 29px)'
              : 'clamp(1.5rem, 2.1vw, 2rem)' /* 24→32 */,
          }}
        >
          Recruiter Panel
        </h2>
        <p className="font-sans text-[clamp(14px,1.1vw,16px)] leading-[18px] tracking-[0.2px] text-[#595959]">
          Everything you need to manage your hiring, in one panel.
        </p>
      </header>

      <div className="flex flex-col">
        {visibleStages.map((stage) => {
          const expanded = expandedId === stage.id;
          const Icon = stage.Icon || RecruiterCompanyInfoIcon;
          const isEditing = editingId === stage.id;
          const isConfirming = confirming === stage.id;
          const fields = mergedFields(stage);
          const isJobs = stage.id === 'jobs';
          const canPreview = Boolean(fields) && fields.length > 0;
          const canConfirm = canPreview && stage.status === 'awaiting-review';
          const showReviewActions =
            canPreview &&
            (stage.status === 'awaiting-review' ||
              stage.status === 'done' ||
              (isJobs && stage.status === 'in-progress'));

          return (
            <div key={stage.id} className="border-b border-[#e5e7eb]">
              {/* Header row — Figma 5132:66804: pr-20 py-40, gap-20 */}
              <div className="flex items-center justify-between gap-[20px] py-[40px] pr-[20px] max-lg:gap-3 max-lg:py-3 max-lg:pr-0">
                <div className="flex min-w-0 flex-1 items-center gap-[20px]">
                  <span className="flex size-10 max-lg:size-7 shrink-0 items-center justify-center text-brand-green">
                    <Icon className="size-10 max-lg:size-7" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-[6px]">
                    <p className="font-sans text-[20px] font-medium leading-normal text-[#111] max-lg:text-[16px]">
                      {stage.panelLabel}
                    </p>
                    <p className="font-sans text-[14px] leading-normal text-[#595959]">
                      {renderCompletion(stage)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="icon"
                  size="md"
                  aria-label={
                    expanded ? `Collapse ${stage.panelLabel}` : `Expand ${stage.panelLabel}`
                  }
                  className="border border-[#e5e7eb] bg-white max-lg:size-11"
                  onClick={() => {
                    log('branch', { toggle: stage.id, expanded: !expanded });
                    onToggleExpand?.(stage.id);
                  }}
                >
                  <PlusMinusIcon expanded={expanded} className="size-5" />
                </Button>
              </div>

              {expanded && (
                <div className="flex flex-col items-end gap-[48px] px-[40px] pb-[29px] pt-[10px] max-lg:gap-8 max-lg:px-0">
                  {canPreview ? (
                    isEditing && !isJobs ? (
                      <RecruiterCompanyEditForm
                        fields={fields}
                        onChange={(label, value) =>
                          setFieldOverrides((prev) => ({
                            ...prev,
                            [stage.id]: { ...prev[stage.id], [label]: value },
                          }))
                        }
                        onUpdate={() => {
                          log('branch', { update: stage.id });
                          setEditingId(null);
                        }}
                      />
                    ) : (
                      <>
                        {/* view-details — Figma 5132:66804 pattern (Jobs reuses chrome) */}
                        <div className="flex w-full flex-col gap-[18px]">
                          {fields.map((field) => {
                            if (field.kind === 'photo') {
                              return (
                                <div key={field.label} className="flex items-center gap-[11px]">
                                  <CompanyLogoMark />
                                  <div className="flex flex-col items-start justify-center gap-[4px]">
                                    <span className="whitespace-nowrap font-sans text-[16px] font-medium text-[#0a0a0a]">
                                      {field.label}
                                    </span>
                                    <span className="flex items-center justify-center gap-[6px] font-sans text-[14px] text-[#224626]">
                                      <CheckBadgeIcon className="size-[14px] text-[#387440]" />
                                      {field.value}
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            if (field.kind === 'bio') {
                              return (
                                <div key={field.label} className="flex w-full flex-col gap-[14px]">
                                  <div className="flex w-full items-center justify-between gap-3">
                                    <span className="font-sans text-[16px] font-medium leading-normal text-[#111]">
                                      {field.label}
                                    </span>
                                    <button
                                      type="button"
                                      aria-label={bioOpen ? 'Collapse bio' : 'Expand bio'}
                                      onClick={() => {
                                        log('branch', { bioOpen: !bioOpen });
                                        setBioOpen((prev) => !prev);
                                      }}
                                      className="flex size-4 shrink-0 items-center justify-center text-[#111]"
                                    >
                                      <BioChevronIcon
                                        className={classNames(
                                          'size-4 transition-transform',
                                          bioOpen && 'rotate-180'
                                        )}
                                      />
                                    </button>
                                  </div>
                                  {bioOpen && (
                                    <div className="flex w-full items-center justify-center rounded-[8px] border border-solid border-[#e9e9e9] bg-[#f8f8f8] px-[16px] py-[12px]">
                                      <p className="w-full font-sans text-[15px] leading-[1.4] text-[#70706e]">
                                        {field.value}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            if (field.verified) {
                              return (
                                <div
                                  key={field.label}
                                  className="flex w-full items-start justify-between gap-3"
                                >
                                  <span className="shrink-0 whitespace-nowrap font-sans text-[16px] font-medium leading-[1.5] text-[#111]">
                                    {field.label}
                                  </span>
                                  <span className="flex max-w-[350px] items-center justify-end gap-[6px] font-sans text-[18px] leading-[1.5] text-[#387440]">
                                    <CheckBadgeIcon className="size-[14px]" />
                                    {field.value}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={field.label}
                                className="flex w-full items-start justify-between gap-3"
                              >
                                <span className="shrink-0 whitespace-nowrap font-sans text-[16px] font-medium leading-[1.5] text-[#111]">
                                  {field.label}
                                </span>
                                <span className="w-[250px] max-lg:w-auto max-lg:min-w-0 max-lg:[overflow-wrap:anywhere] max-w-[350px] text-right font-sans text-[17px] leading-[1.45] text-[#595959]">
                                  {field.value}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {showReviewActions && stage.status !== 'done' && (
                          <div className="flex w-full shrink-0 flex-nowrap items-center justify-end gap-[16px]">
                            {/* Mid-conversation only — once awaiting-review, Modify opens the form. */}
                            {isJobs && stage.status === 'in-progress' && (
                              <Button
                                type="button"
                                variant="tertiary"
                                size="md"
                                className="!shrink-0 !rounded-[14px]"
                                onClick={() => {
                                  log('branch', { openJobForm: stage.id });
                                  onOpenForm?.(stage.id);
                                }}
                              >
                                View full form
                              </Button>
                            )}
                            <Button
                              variant="tertiary"
                              size="md"
                              className="!shrink-0 !rounded-[14px]"
                              disabled={isConfirming}
                              rightIcon={<PanelModifyIcon className="size-full" />}
                              onClick={() => {
                                log('branch', { modify: stage.id, viaForm: isJobs });
                                if (isJobs) {
                                  onOpenForm?.(stage.id);
                                  onModify?.(stage.id);
                                  return;
                                }
                                setEditingId(stage.id);
                                onModify?.(stage.id);
                              }}
                            >
                              Modify
                            </Button>
                            {canConfirm && (
                              <Button
                                variant="primary"
                                size="md"
                                className="h-[48px] !shrink-0 !rounded-[10px]"
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
                            )}
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <div className="flex w-full flex-col items-end gap-[16px]">
                      <p className="w-full font-sans text-[15px] leading-[22px] text-[#737373]">
                        {emptyHint(stage)}
                      </p>
                      {isJobs && stage.status === 'in-progress' && (
                        <Button
                          type="button"
                          variant="tertiary"
                          size="md"
                          className="!rounded-[14px]"
                          onClick={() => {
                            log('branch', { openJobFormEmpty: true });
                            onOpenForm?.(stage.id);
                          }}
                        >
                          View full form
                        </Button>
                      )}
                    </div>
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

export default RecruiterPanel;
