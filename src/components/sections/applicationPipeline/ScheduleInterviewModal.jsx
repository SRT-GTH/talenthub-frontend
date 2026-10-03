import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import InterviewConfirmModal from './InterviewConfirmModal.jsx';
import ScheduleSelect from './ScheduleSelect.jsx';
import {
  ModalCloseIcon,
  SlotsCalendarIcon,
  SlotArrowIcon,
  SelectArrowIcon,
  FormatOnlineIcon,
  FormatPhoneIcon,
  FormatInPersonIcon,
  AddInterviewerIcon,
  TentativeCheckIcon,
} from './scheduleInterviewIcons.jsx';
import {
  SCHEDULE_HEADER,
  SCHEDULE_CANDIDATE,
  FIELD_LABELS,
  ASSESSMENT_PLACEHOLDER,
  ASSESSMENT_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
  buildScheduleDays,
  NOTES_PLACEHOLDER,
  INTERVIEW_FORMATS,
  FORMAT_FIELDS,
  INTERVIEWER_INPUT,
  RECRUITER_NOTES,
  SLOTS_PANEL,
  SCHEDULE_TIMES,
  TENTATIVE,
  SCHEDULE_ACTIONS,
  CANCEL_CONFIRMATION,
  SCHEDULE_CONFIRMATION,
} from './scheduleInterviewData.js';
import avatarElla from '../../../assets/community/avatar-abigail-mensah.png';

const log = debug('ScheduleInterviewModal');

/*
 * ScheduleInterviewModal — Figma 7249:80368 (empty), :80974 (interviewer input
 * open), :81591 / :83784 / :83147 (filled, one per Interview Format), with
 * :82225 / :82686 layered over it as confirmations.
 *
 * Those five large frames are ONE modal in different states, so this is one
 * component driven by local state rather than five screens.
 *
 * Shell: 1219 wide, white, r24, VERTICAL gap 24, padding 32/28, two stacked
 * shadows (0 4 0 #000 @0.13 and 0 40 100 #000 @0.25). The close control is a
 * 28x28 #ebf1ec r20 button holding a 16px #387440 glyph.
 *
 * Body is HORIZONTAL gap 32: a 495 left column (candidate card + notes) and a
 * 628 right column (slots panel + actions, counter-axis MAX so the action row
 * is right-aligned).
 *
 * States taken straight from the node tree, not guessed:
 *   • SUN 04 / MON 05 are NODE opacity 0.50 — unavailable days.
 *   • 10:00 AM, 11:30 AM and 09:00 AM are NODE opacity 0.40 — unavailable
 *     slots. Figma's own grid order puts 09:00 AM last.
 *   • The selected day fills #f3f8f4; the selected time fills #387440.
 *   • Choosing both reveals the Tentative Selection badge (7249:81755).
 *   • Picking a format swaps in that format's field row (7249:81650 online,
 *     :83784 phone, :83147 in person).
 *   • Once notes exist the textarea is replaced by the read-only
 *     "Recruiter Notes" card (7249:81675) with its Edit affordance.
 */

const FORMAT_ICONS = {
  online: FormatOnlineIcon,
  phone: FormatPhoneIcon,
  'in-person': FormatInPersonIcon,
};

/* Figma GTHInput — 51 tall, white, 1px #cccccc, r10, pad 16/13, and a solid
   2.5px #bfbfbf @0.80 shelf (no blur). */
const INPUT_CLASS =
  'flex h-[51px] w-full items-center justify-between gap-[8px] rounded-[10px] border border-[#cccccc] bg-white px-[16px] text-left shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]';

const FieldLabel = ({ children, required, trailing }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black">
      {children}
      {required && (
        // Figma renders the asterisk in Instrument Sans 14/600 #2e8b57.
        <span className="font-display not-italic font-semibold text-[#2e8b57]">
          {' '}
          {FIELD_LABELS.required}
        </span>
      )}
    </span>
    {trailing}
  </div>
);

const ScheduleInterviewModal = ({ open, onClose, onScheduled }) => {
  const [format, setFormat] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [dayId, setDayId] = useState(null);
  // Figma's filled frames show August / 2026 preselected.
  const [month, setMonth] = useState(SLOTS_PANEL.month);
  const [year, setYear] = useState(SLOTS_PANEL.year);
  const [timeId, setTimeId] = useState(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [addingInterviewer, setAddingInterviewer] = useState(false);
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewers, setInterviewers] = useState([]);
  const [confirm, setConfirm] = useState(null); // 'cancel' | 'schedule'

  // Day carousel. Figma lays the row out as 80px cards with a 16px gap and
  // pages it with the arrows either side, so one click moves exactly one card.
  const dayRowRef = useRef(null);
  const DAY_STEP = 80 + 16;
  const [dayEdges, setDayEdges] = useState({ atStart: true, atEnd: false });

  const syncDayEdges = useCallback(() => {
    const el = dayRowRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setDayEdges((prev) =>
      prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }
    );
  }, []);

  const scrollDays = (direction) => {
    const el = dayRowRef.current;
    if (!el) return;
    log('branch', { dayScroll: direction, from: el.scrollLeft });
    el.scrollBy({ left: direction === 'next' ? DAY_STEP : -DAY_STEP, behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) log('mount', { open, format, dayId, timeId });
  }, [open, format, dayId, timeId]);

  useEffect(() => {
    if (!open) return undefined;
    syncDayEdges();
    const el = dayRowRef.current;
    el?.addEventListener('scroll', syncDayEdges, { passive: true });
    window.addEventListener('resize', syncDayEdges);
    return () => {
      el?.removeEventListener('scroll', syncDayEdges);
      window.removeEventListener('resize', syncDayEdges);
    };
  }, [open, syncDayEdges]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      // A select's own Escape (closing its list) marks the event handled.
      if (event.key === 'Escape' && !event.defaultPrevented) setConfirm('cancel');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const scheduleDays = buildScheduleDays(month, year);
  const selectedTime = SCHEDULE_TIMES.find((t) => t.id === timeId);

  // A different month/year is a different set of days: drop the day + tentative
  // pick and return the carousel to its first day.
  const changeMonthOrYear = (apply) => (next) => {
    apply(next);
    setDayId(null);
    dayRowRef.current?.scrollTo({ left: 0 });
  };
  const hasTentative = Boolean(dayId && timeId);
  const formatFields = format ? FORMAT_FIELDS[format] : null;

  const reset = () => {
    setFormat(null);
    setAssessment(null);
    setMonth(SLOTS_PANEL.month);
    setYear(SLOTS_PANEL.year);
    setDayId(null);
    setTimeId(null);
    setNotes('');
    setNotesSaved(false);
    setAddingInterviewer(false);
    setInterviewerName('');
    setInterviewers([]);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={SCHEDULE_HEADER.title}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
        onClick={() => setConfirm('cancel')}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative my-auto flex w-full max-w-[1219px] flex-col gap-[24px] rounded-[24px] bg-white px-[32px] py-[28px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)]"
        >
          {/* Close — Figma 7249:80519 */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setConfirm('cancel')}
            className="absolute right-[32px] top-[28px] grid size-[28px] place-items-center rounded-[20px] bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover"
          >
            <ModalCloseIcon className="size-[16px]" />
          </button>

          {/* Header — Figma 7249:80369 */}
          <div className="flex max-w-[420px] flex-col gap-[4px]">
            <h2 className="font-display text-[32px] not-italic leading-[41.6px] text-black">
              {SCHEDULE_HEADER.title}
            </h2>
            <p className="font-sans text-[14px] leading-[16.71px] text-[#595959]">
              {SCHEDULE_HEADER.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-[32px] xl:flex-row">
            {/* ── LEFT COLUMN — Figma 7249:80373, 495 wide ── */}
            <div className="flex w-full flex-col gap-[24px] xl:w-[495px] xl:shrink-0">
              <div className="flex flex-col gap-[23px] rounded-[14px] border border-border-card bg-white p-[22px]">
                {/* Candidate — Figma 7249:80375 */}
                <div className="flex items-center gap-[16px]">
                  <span className="grid size-[64px] shrink-0 place-items-center rounded-full border-2 border-[#f3f8f4]">
                    <img
                      src={avatarElla}
                      alt={SCHEDULE_CANDIDATE.name}
                      className="size-[58px] rounded-full object-cover"
                    />
                  </span>
                  <div className="flex min-w-0 flex-col gap-[8px]">
                    <div className="flex flex-col gap-[1px]">
                      <span className="font-display text-[24px] not-italic leading-[31.2px] text-[#1c1c1a]">
                        {SCHEDULE_CANDIDATE.name}
                      </span>
                      <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-content-muted">
                        {SCHEDULE_CANDIDATE.meta}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-[6px]">
                      {SCHEDULE_CANDIDATE.chips.map((chip) => (
                        <span
                          key={chip.id}
                          className={classNames(
                            'inline-flex h-[29px] items-center rounded-pill border-[1.21px] px-[9.64px] font-sans text-[14px] font-medium leading-[16.71px]',
                            chip.tone === 'green'
                              ? 'border-brand-green-light-hover bg-brand-green-light text-brand-green-dark'
                              : 'border-border-pill bg-neutral text-content-helper'
                          )}
                        >
                          {chip.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Config — Figma 7249:80388, gap 15 */}
                <div className="flex flex-col gap-[15px]">
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel required>{FIELD_LABELS.assessmentType}</FieldLabel>
                    <ScheduleSelect
                      label={FIELD_LABELS.assessmentType}
                      options={ASSESSMENT_OPTIONS}
                      value={assessment}
                      placeholder={ASSESSMENT_PLACEHOLDER}
                      onChange={setAssessment}
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel required>{FIELD_LABELS.interviewFormat}</FieldLabel>
                    <div className="flex flex-wrap items-center gap-[10px]">
                      {INTERVIEW_FORMATS.map((item) => {
                        const Icon = FORMAT_ICONS[item.id];
                        const isActive = format === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                              log('branch', { format: item.id });
                              setFormat(item.id);
                            }}
                            className={classNames(
                              'inline-flex h-[40px] items-center gap-[8px] rounded-pill border-[1.21px] px-[16px]',
                              'font-sans text-[16px] leading-6 tracking-[0.2px] transition-all duration-300 ease-in',
                              isActive
                                ? 'border-brand-green-light-hover bg-brand-green-light text-brand-green-dark'
                                : 'border-border-pill bg-neutral text-content-helper hover:bg-neutral-hover'
                            )}
                          >
                            <Icon className="size-[18px] shrink-0" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Format-specific row — Figma 7249:81650 / :83784 / :83147 */}
                  {formatFields?.kind === 'online' && (
                    <div className="flex flex-wrap items-end gap-[10px]">
                      <div className="flex w-[140px] shrink-0 flex-col gap-[8px]">
                        <FieldLabel required>{formatFields.platformLabel}</FieldLabel>
                        <span className={INPUT_CLASS}>
                          <span className="truncate font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-[#595959]">
                            {formatFields.platformValue}
                          </span>
                          <SelectArrowIcon className="size-[20px] shrink-0 text-content-helper" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                        <FieldLabel>{formatFields.linkLabel}</FieldLabel>
                        <span className={INPUT_CLASS}>
                          <span className="truncate font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-[#595959]">
                            {formatFields.linkValue}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {formatFields?.kind === 'phone' && (
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel>{formatFields.toggleLabel}</FieldLabel>
                      <div className="flex items-center gap-[10px]">
                        <span className={classNames(INPUT_CLASS, 'w-[90px] shrink-0')}>
                          <span className="font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-[#595959]">
                            {formatFields.dialCode}
                          </span>
                        </span>
                        <span className={INPUT_CLASS}>
                          <span className="font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-[#595959]">
                            {formatFields.number}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {formatFields?.kind === 'in-person' && (
                    <div className="flex flex-col gap-[8px]">
                      <FieldLabel required>{formatFields.locationLabel}</FieldLabel>
                      <span className="font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-content-helper">
                        {formatFields.toggleLabel}
                      </span>
                      <span className={INPUT_CLASS}>
                        <span className="truncate font-sans text-[13px] font-medium leading-5 tracking-[0.2px] text-[#595959]">
                          {formatFields.address}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Interviewers — Figma 7249:80427 / :80974 */}
                  <div className="flex flex-col gap-[8px]">
                    <FieldLabel>{FIELD_LABELS.addInterviewers}</FieldLabel>
                    <div className="flex flex-wrap items-center gap-[10px]">
                      <div className="flex items-center -space-x-[8px]">
                        {interviewers.map((name) => (
                          <span
                            key={name}
                            title={name}
                            className="grid size-[40px] place-items-center rounded-full border-2 border-white bg-brand-green font-sans text-[13px] font-semibold text-white"
                          >
                            {name.slice(0, 1).toUpperCase()}
                          </span>
                        ))}
                        <button
                          type="button"
                          aria-label={FIELD_LABELS.addInterviewers}
                          onClick={() => {
                            log('branch', { addInterviewer: !addingInterviewer });
                            setAddingInterviewer((prev) => !prev);
                          }}
                          /* 2px #ffffff dashed [6,4] on #eae8e2, rounded-full */
                          className="relative grid size-[40px] shrink-0 place-items-center rounded-full bg-[#eae8e2] text-content-muted"
                        >
                          <svg
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 size-full text-white"
                          >
                            <circle
                              cx="50%"
                              cy="50%"
                              r="19"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray="6 4"
                            />
                          </svg>
                          <AddInterviewerIcon className="relative size-[11.7px]" />
                        </button>
                      </div>

                      {addingInterviewer && (
                        <div className="flex min-w-0 flex-1 items-center gap-[8px]">
                          <input
                            value={interviewerName}
                            onChange={(event) => setInterviewerName(event.target.value)}
                            placeholder={INTERVIEWER_INPUT.placeholder}
                            className="h-[40px] min-w-0 flex-1 rounded-[10px] border border-[#cccccc] bg-white px-[14px] font-sans text-[13px] text-black outline-none placeholder:text-content-helper"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!interviewerName.trim()) return;
                              log('branch', { interviewerAdded: interviewerName.trim() });
                              setInterviewers((prev) => [...prev, interviewerName.trim()]);
                              setInterviewerName('');
                              setAddingInterviewer(false);
                            }}
                            className="inline-flex h-[40px] shrink-0 items-center rounded-[10px] bg-brand-green px-[14px] font-sans text-[13px] font-semibold text-white transition-colors hover:bg-brand-green-hover"
                          >
                            {INTERVIEWER_INPUT.add}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes — textarea (7249:80434) until saved, then the read-only
                  Recruiter Notes card (7249:81675). */}
              {notesSaved ? (
                <div className="flex flex-col gap-[4px] rounded-[8px] border border-[#00522b]/10 bg-[#f3f8f4] p-[16px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-[16px] font-semibold leading-[13px] text-black">
                      {RECRUITER_NOTES.heading}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        log('branch', { action: 'edit-notes' });
                        setNotesSaved(false);
                      }}
                      className="text-center font-sans text-[14px] font-medium leading-[19.2px] text-[#00522b] transition-opacity hover:opacity-80"
                    >
                      {RECRUITER_NOTES.edit}
                    </button>
                  </div>
                  {/* whitespace-pre-line keeps Figma's three hard line breaks */}
                  <p className="whitespace-pre-line font-sans text-[14px] leading-[21.13px] text-content-helper">
                    {notes || RECRUITER_NOTES.body}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  <FieldLabel
                    trailing={
                      <span className="font-sans text-[12px] font-medium leading-5 tracking-[0.2px] text-brand-green">
                        {FIELD_LABELS.optional}
                      </span>
                    }
                  >
                    {FIELD_LABELS.recruiterNotes}
                  </FieldLabel>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    onBlur={() => notes.trim() && setNotesSaved(true)}
                    placeholder={NOTES_PLACEHOLDER}
                    /* Figma 7249:80441 — 86 tall, pad L14 R14 T14 B52 */
                    className="no-scrollbar h-[86px] w-full resize-none rounded-[10px] border border-[#cccccc] bg-white px-[14px] pb-[52px] pt-[14px] font-sans text-[14px] leading-5 tracking-[0.2px] text-black shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] outline-none placeholder:text-[#999999]"
                  />
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN — Figma 7249:80445, 628 wide ── */}
            <div className="flex min-w-0 flex-1 flex-col items-end gap-[24px]">
              <div className="flex w-full flex-col gap-[24px] rounded-[14px] border border-border-card bg-white px-[22px] py-[20px]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="flex items-center gap-[11.99px]">
                    <SlotsCalendarIcon className="h-[20px] w-[18px] shrink-0 text-brand-green" />
                    <span className="font-display text-[20px] not-italic leading-6 text-black">
                      {SLOTS_PANEL.heading}
                    </span>
                  </span>
                  <span className="flex items-center gap-[10px]">
                    <ScheduleSelect
                      size="chip"
                      label="Month"
                      className="w-[120px]"
                      options={MONTH_OPTIONS}
                      value={month}
                      onChange={changeMonthOrYear(setMonth)}
                    />
                    <ScheduleSelect
                      size="chip"
                      label="Year"
                      className="w-[120px]"
                      options={YEAR_OPTIONS}
                      value={year}
                      onChange={changeMonthOrYear(setYear)}
                    />
                  </span>
                </div>

                <div className="flex flex-col gap-[18px]">
                  {/* Day row — Figma 7249:80467 */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black">
                      {SLOTS_PANEL.dayLabel}
                    </span>
                    <div className="flex items-center gap-[8px]">
                      <button
                        type="button"
                        aria-label="Previous days"
                        onClick={() => scrollDays('prev')}
                        disabled={dayEdges.atStart}
                        className="grid size-[32px] shrink-0 place-items-center rounded-[8px] border border-border-card text-content-helper transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <SlotArrowIcon className="size-[14px]" />
                      </button>

                      {/* Figma pages this row with the arrow buttons either side, so the
                          native bar is hidden (the project's own .no-scrollbar
                          utility) while the row stays scrollable/swipeable. */}
                      <div
                        ref={dayRowRef}
                        className="no-scrollbar flex min-w-0 flex-1 items-center gap-[16px] overflow-x-auto scroll-smooth"
                      >
                        {scheduleDays.map((day) => {
                          const isSelected = dayId === day.id;
                          return (
                            <button
                              key={day.id}
                              type="button"
                              disabled={day.disabled}
                              aria-pressed={isSelected}
                              onClick={() => {
                                log('branch', { day: day.id });
                                setDayId(day.id);
                              }}
                              className={classNames(
                                'flex h-[89.6px] w-[80px] shrink-0 flex-col items-center justify-center rounded-[12px] border pb-[16px] pt-[15px]',
                                'transition-all duration-300 ease-in',
                                // Figma draws unavailable days at NODE opacity 0.50
                                day.disabled && 'cursor-not-allowed opacity-50',
                                // Active (7249:81721) is THREE changes, not one:
                                // #f3f8f4 fill, #387440 border and #387440 on both
                                // labels. Inactive (7249:81718) is #ffffff on
                                // #e6e2d6 with #0d0d0d / #111111 text.
                                isSelected
                                  ? 'border-brand-green bg-[#f3f8f4]'
                                  : 'border-border-card bg-white',
                                !day.disabled && !isSelected && 'hover:bg-neutral'
                              )}
                            >
                              <span
                                className={classNames(
                                  'font-sans text-[16px] leading-6 tracking-[0.2px]',
                                  isSelected ? 'text-brand-green' : 'text-[#0d0d0d]'
                                )}
                              >
                                {day.weekday}
                              </span>
                              <span
                                className={classNames(
                                  'text-center font-sans text-[20px] font-semibold leading-8',
                                  isSelected ? 'text-brand-green' : 'text-black'
                                )}
                              >
                                {day.date}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        aria-label="Next days"
                        onClick={() => scrollDays('next')}
                        disabled={dayEdges.atEnd}
                        className="grid size-[32px] shrink-0 place-items-center rounded-[8px] border border-border-card text-content-helper transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <SlotArrowIcon className="size-[14px] rotate-180" />
                      </button>
                    </div>
                  </div>

                  {/* Time grid — Figma 7249:80495 */}
                  <div className="flex flex-col gap-[16px] pb-[24px] pt-[7px]">
                    <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#0d0d0d]">
                      {SLOTS_PANEL.timeLabel}
                    </span>
                    <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4">
                      {SCHEDULE_TIMES.map((slot) => {
                        const isSelected = timeId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={slot.disabled}
                            aria-pressed={isSelected}
                            onClick={() => {
                              log('branch', { time: slot.id });
                              setTimeId(slot.id);
                            }}
                            className={classNames(
                              'flex h-[46.8px] items-center justify-center rounded-[8px] border px-[12px]',
                              'font-sans text-[16px] leading-6 tracking-[0.2px] transition-all duration-300 ease-in',
                              // Figma draws unavailable slots at NODE opacity 0.40
                              slot.disabled && 'cursor-not-allowed opacity-40',
                              // Active (7249:81743) is #387440 fill AND border with
                              // white text. Inactive slots carry NO fill at all —
                              // only the #e6e2d6 outline.
                              isSelected
                                ? 'border-brand-green bg-brand-green text-white'
                                : 'border-border-card bg-transparent text-[#0d0d0d]',
                              !slot.disabled && !isSelected && 'hover:bg-neutral'
                            )}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tentative Selection — Figma 7249:81755 */}
                  {hasTentative && (
                    <div className="flex items-center gap-[12px]">
                      <span className="grid size-[40px] shrink-0 place-items-center rounded-full border border-border-card bg-white text-[#00522b]">
                        <TentativeCheckIcon className="h-[12px] w-[21.9px]" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-[4px]">
                        <span className="font-sans text-[14px] font-medium leading-[19.2px] text-[#00522b]">
                          {TENTATIVE.label}
                        </span>
                        <span className="font-sans text-[12px] leading-[17.6px] text-[#6b6a63]">
                          {TENTATIVE.format(selectedTime?.label ?? '')}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          log('branch', { action: 'clear-selection' });
                          setDayId(null);
                          setTimeId(null);
                        }}
                        className="ml-auto shrink-0 font-sans text-[14px] font-medium text-[#00522b] transition-opacity hover:opacity-80"
                      >
                        {TENTATIVE.clear}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions — Figma 7249:80515, right-aligned, gap 12 */}
              <div className="flex items-center gap-[12px]">
                <button
                  type="button"
                  onClick={() => setConfirm('cancel')}
                  className="inline-flex h-[44px] items-center justify-center rounded-[14px] border-2 border-black/30 bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
                >
                  {SCHEDULE_ACTIONS.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm('schedule')}
                  className="inline-flex h-[44px] items-center justify-center rounded-[10px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[14px] font-bold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none"
                >
                  {SCHEDULE_ACTIONS.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InterviewConfirmModal
        open={confirm === 'cancel'}
        copy={CANCEL_CONFIRMATION}
        onConfirm={() => {
          log('branch', { action: 'interview-cancelled' });
          setConfirm(null);
          reset();
          onClose?.();
        }}
        onCancel={() => setConfirm(null)}
      />

      <InterviewConfirmModal
        open={confirm === 'schedule'}
        copy={SCHEDULE_CONFIRMATION}
        onConfirm={() => {
          log('branch', { action: 'interview-scheduled', dayId, timeId, format });
          setConfirm(null);
          reset();
          onScheduled?.({ dayId, timeId, format });
          onClose?.();
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};

export default ScheduleInterviewModal;
