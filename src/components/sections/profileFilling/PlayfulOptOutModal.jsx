import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import PlayfulDialog from '../../ui/PlayfulDialog.jsx';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import arrowUpRight from '../../../assets/playful/overlays/prime-arrow-up-right.svg';
import calendarChevron from '../../../assets/playful/overlays/calendar-chevron.svg';
import infoIcon from '../../../assets/playful/overlays/info-outline-rounded.svg';

const log = debug('PlayfulOptOutModal');

/*
 * Playful Career Buddy opt-out flow — Figma 7887:87553 (journey),
 * 7887:87877 (sorry), 7887:88201 (return date picker). Same props/callbacks as
 * the Focused CareerBuddyOptOutModal, which renders this when uiStyle === 'playful'.
 * Copy is verbatim from the Playful frames.
 */

const COPY = {
  journey: {
    title: 'Your journey matters to us.',
    body: 'GTH is designed to grow with you from age 15 to 30. Before you decide to leave, consider if adjusting your experience might work better for you.',
    primary: 'Choose different mode',
    secondary: 'Leave entirely',
  },
  sorry: {
    title: 'We’re sorry to see you go',
    body: "Before you leave, we'd like to know—do you have a time you'd like to continue or come back?",
    primary: 'Yes, Schedule a date',
    secondary: 'No, take me to dashboard',
  },
  schedule: {
    title: 'Schedule your return',
    body: "Select a date when you'd like to resume your profile planning",
    primary: 'Confirm Schedule',
    secondary: 'Cancel',
    reminder: "We'll send you a reminder",
  },
};

const QUICK_PICKS = [
  { id: 'tomorrow', label: 'Tomorrow', offsetDays: 1 },
  { id: 'in-3-days', label: 'In 3 days', offsetDays: 3 },
  { id: 'next-week', label: 'Next week', offsetDays: 7 },
  { id: 'next-two-weeks', label: 'Next two weeks', offsetDays: 14 },
  { id: 'next-month', label: 'Next month', offsetMonths: 1 },
];

const WEEKDAYS = [
  { short: 'Su', long: 'Sunday' },
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
];

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};
const sameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const monthTitle = (d) => d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
const fullDate = (d) =>
  d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** Sun-start grid: Figma's 5 week rows, 6 only when the month needs it. */
const buildGrid = (viewMonth) => {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  const rows = Math.ceil(
    (first.getDay() + new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7
  );
  return Array.from({ length: rows * 7 }, (_, i) => addDays(start, i));
};

const quickDate = (today, pick) =>
  pick.offsetMonths != null
    ? new Date(today.getFullYear(), today.getMonth() + pick.offsetMonths, today.getDate())
    : addDays(today, pick.offsetDays);

const ArrowRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.736 5.20385C12.0376 4.91996 12.5123 4.93435 12.7962 5.23598L16.7962 9.48598C17.068 9.77477 17.068 10.2252 16.7962 10.514L12.7962 14.764C12.5123 15.0657 12.0376 15.08 11.736 14.7962C11.4343 14.5123 11.42 14.0376 11.7038 13.736L14.5142 10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H14.5142L11.7038 6.26403C11.42 5.9624 11.4343 5.48774 11.736 5.20385Z"
      fill="#E8F2ED"
    />
  </svg>
);

const DAY_GRADIENT = 'linear-gradient(135deg, #142916 0%, #2a5730 100%)';
const DAY_TEXT_GRADIENT = 'linear-gradient(218.179deg, #fef1e7 0%, #e8f2ed 20.192%)';

/** Month grid — role="grid", roving tabindex, APG date-picker keyboard model. */
const PlayfulCalendar = ({ today, selectedDate, onSelect, onAnnounce }) => {
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [focusDate, setFocusDate] = useState(() => selectedDate ?? today);
  const gridRef = useRef(null);
  const wantFocus = useRef(false);
  const gridId = useId();

  const cells = useMemo(() => buildGrid(viewMonth), [viewMonth]);

  // A quick pick can select a date in another month — follow it.
  useEffect(() => {
    if (!selectedDate) return;
    setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setFocusDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    gridRef.current?.querySelector('button[tabindex="0"]')?.focus();
  });

  const goMonth = useCallback(
    (delta) => {
      const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1);
      log('branch', { month: monthTitle(next) });
      setViewMonth(next);
      const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      setFocusDate(
        new Date(next.getFullYear(), next.getMonth(), Math.min(focusDate.getDate(), last))
      );
      onAnnounce?.(monthTitle(next));
    },
    [viewMonth, focusDate, onAnnounce]
  );

  const moveFocus = (next) => {
    wantFocus.current = true;
    setFocusDate(next);
    if (
      next.getMonth() !== viewMonth.getMonth() ||
      next.getFullYear() !== viewMonth.getFullYear()
    ) {
      setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      onAnnounce?.(monthTitle(next));
    }
  };

  const onGridKey = (e) => {
    const d = focusDate;
    const map = {
      ArrowLeft: addDays(d, -1),
      ArrowRight: addDays(d, 1),
      ArrowUp: addDays(d, -7),
      ArrowDown: addDays(d, 7),
      Home: addDays(d, -d.getDay()),
      End: addDays(d, 6 - d.getDay()),
      PageUp: new Date(d.getFullYear(), d.getMonth() - (e.shiftKey ? 12 : 1), d.getDate()),
      PageDown: new Date(d.getFullYear(), d.getMonth() + (e.shiftKey ? 12 : 1), d.getDate()),
    };
    if (map[e.key]) {
      e.preventDefault();
      moveFocus(map[e.key]);
    }
  };

  const chevronBtn =
    'pf-ov-focus inline-flex size-6 items-center justify-center rounded-full hover:bg-[#ebf1ec] -my-[3px] max-lg:size-11 max-lg:-my-[13px]';

  return (
    <div className="flex h-full min-w-0 flex-col gap-[10px] rounded-[12px] border border-[#e5e5e5] px-[22px] py-4 max-sm:px-3">
      <div className="flex items-center justify-between py-1">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => goMonth(-1)}
          className={chevronBtn}
        >
          <img
            src={calendarChevron}
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[8px] rotate-180"
          />
        </button>
        <p
          id={`${gridId}-title`}
          className="text-center text-[15px] font-medium leading-[18px] text-[#111]"
        >
          {monthTitle(viewMonth)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => goMonth(1)}
          className={chevronBtn}
        >
          <img src={calendarChevron} alt="" aria-hidden="true" className="h-[18px] w-[8px]" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={`${gridId}-title`}
        onKeyDown={onGridKey}
        className="flex w-full flex-col gap-[14px] max-sm:gap-1"
      >
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((w) => (
            <div
              key={w.short}
              role="columnheader"
              className="flex items-center justify-center text-[14px] font-medium leading-[17px] text-[#111]"
            >
              <span aria-hidden="true">{w.short}</span>
              <span className="sr-only">{w.long}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-7">
            {cells.slice(row * 7, row * 7 + 7).map((date) => {
              const past = date < today;
              const selected = sameDay(selectedDate, date);
              const focusable = sameDay(focusDate, date);
              return (
                <div
                  key={date.toISOString()}
                  role="gridcell"
                  aria-selected={selected}
                  aria-disabled={past || undefined}
                  className="flex h-[17px] items-center justify-center max-sm:h-9"
                >
                  <button
                    type="button"
                    tabIndex={focusable ? 0 : -1}
                    aria-label={fullDate(date)}
                    aria-current={sameDay(date, today) ? 'date' : undefined}
                    onClick={() => {
                      if (past) return;
                      log('branch', { pickDate: date.toISOString() });
                      setFocusDate(date);
                      onSelect(date);
                    }}
                    className={classNames(
                      'pf-ov-focus flex size-[22px] items-center justify-center rounded-full text-[14px] leading-[17px] transition-colors max-sm:size-9',
                      selected
                        ? 'text-[12px] font-medium'
                        : past
                          ? 'cursor-default text-[#ccc]'
                          : 'cursor-pointer text-[#404040] hover:bg-[#ebf1ec] hover:text-[#111]'
                    )}
                    style={selected ? { backgroundImage: DAY_GRADIENT } : undefined}
                  >
                    {selected ? (
                      <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: DAY_TEXT_GRADIENT }}
                      >
                        {date.getDate()}
                      </span>
                    ) : (
                      date.getDate()
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayfulOptOutModal = ({
  open,
  initialStep = 'journey',
  onClose,
  onChooseDifferentMode,
  onGoToDashboard,
  onConfirmSchedule,
}) => {
  const [step, setStep] = useState(initialStep);
  const [selectedDate, setSelectedDate] = useState(null);
  const [announce, setAnnounce] = useState('');
  const uid = useId();
  // Recomputed each time the dialog opens so "today" is never stale.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = useMemo(() => startOfDay(new Date()), [open]);

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelectedDate(null);
    setAnnounce('');
    log('open', { step: initialStep });
  }, [open, initialStep]);

  if (!open) return null;

  const isSchedule = step === 'schedule';
  const copy = COPY[step] || COPY.journey;
  const canConfirm = !isSchedule || !!selectedDate;

  const handlePrimary = () => {
    if (step === 'journey') {
      log('branch', { chooseDifferentMode: true });
      onChooseDifferentMode?.();
    } else if (step === 'sorry') {
      log('branch', { scheduleDate: true });
      setStep('schedule');
    } else if (selectedDate) {
      log('branch', { confirmSchedule: selectedDate.toISOString() });
      onConfirmSchedule?.(selectedDate);
    } else {
      log('branch', { confirmBlocked: 'no date' });
      setAnnounce('Select a return date first.');
    }
  };

  const handleSecondary = () => {
    if (step === 'journey') {
      log('branch', { leaveEntirely: true });
      setStep('sorry');
    } else if (step === 'sorry') {
      log('branch', { goToDashboard: true });
      onGoToDashboard?.();
    } else {
      log('branch', { cancelSchedule: true });
      onClose?.();
    }
  };

  const select = (d) => {
    setSelectedDate(d);
    setAnnounce(`${fullDate(d)} selected`);
  };

  const footer = (
    <div
      className={classNames(
        'flex flex-col items-center px-[46.5px] max-sm:px-5 max-sm:pb-4 max-sm:pt-4',
        isSchedule ? 'gap-[20px] pb-[46.5px] pt-[28px] max-sm:gap-3' : 'pb-[62.5px] pt-[36px]'
      )}
    >
      <div
        className={classNames(
          'flex w-full flex-row items-center justify-center gap-2',
          // Schedule: two short buttons share a row on phones (Cancel → icon-only).
          !isSchedule && 'max-sm:flex-col max-sm:items-stretch'
        )}
      >
        <button
          type="button"
          data-autofocus={step === 'schedule' ? undefined : ''}
          aria-disabled={!canConfirm || undefined}
          aria-describedby={!canConfirm ? `${uid}-hint` : undefined}
          onClick={handlePrimary}
          className={classNames(
            'pf-ov-btn pf-ov-btn--primary max-sm:order-1',
            isSchedule && 'max-sm:flex-1',
            !canConfirm && 'pf-ov-btn--inactive'
          )}
        >
          <span className="pf-ov-btn__grad">{copy.primary}</span>
          {isSchedule && <ArrowRight />}
        </button>
        <button
          type="button"
          aria-label={isSchedule ? copy.secondary : undefined}
          onClick={handleSecondary}
          className={classNames(
            'pf-ov-btn pf-ov-btn--secondary max-sm:order-2',
            isSchedule && 'max-sm:w-11 max-sm:px-0!'
          )}
        >
          {isSchedule ? (
            <>
              <span className="max-sm:hidden">{copy.secondary}</span>
              <svg
                viewBox="0 0 12 12"
                className="size-4 sm:hidden"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </>
          ) : (
            <>
              {copy.secondary}
              <img src={arrowUpRight} alt="" aria-hidden="true" className="size-4 shrink-0" />
            </>
          )}
        </button>
      </div>
      {!canConfirm && (
        <p id={`${uid}-hint`} className="sr-only">
          Select a return date to enable Confirm Schedule.
        </p>
      )}
      {isSchedule && (
        <div className="inline-flex items-start gap-[6px] rounded-[8px] border border-[#e0e7f9] bg-[rgba(234,239,251,0.4)] px-4 py-2">
          <img src={infoIcon} alt="" aria-hidden="true" className="size-4 shrink-0" />
          <span className="text-[12px] leading-[18px] tracking-[0.2px] text-[#3062d4]">
            {copy.reminder}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <PlayfulDialog
      open={open}
      onClose={onClose}
      role={isSchedule ? 'dialog' : 'alertdialog'}
      labelledBy={`${uid}-title`}
      describedBy={`${uid}-desc`}
      cardClassName={isSchedule ? 'sm:max-w-[564px]' : 'sm:max-w-[528px]'}
      bodyClassName={classNames(
        'flex flex-col items-center px-[46.5px] text-center max-sm:px-5 max-sm:pt-8',
        isSchedule ? 'gap-[28px] pt-[46.5px]' : 'pt-[62.5px]'
      )}
      footer={footer}
    >
      <div
        className={classNames(
          'flex w-full flex-col items-center',
          isSchedule ? 'gap-[6px]' : 'gap-[10px]'
        )}
      >
        <h2
          id={`${uid}-title`}
          className="pf-ov-display text-[clamp(1.625rem,1.2rem+1vw,2rem)] leading-[1.2]"
        >
          {copy.title}
        </h2>
        <p
          id={`${uid}-desc`}
          className={classNames(
            'max-w-[432px] font-normal text-[#575755]',
            // Figma 7887:87870: 432x72 box = 3 lines at 24px; 14px puts "Before you" on line 1
            isSchedule ? 'text-[14px] leading-[1.5]' : 'text-[14px] leading-[24px]'
          )}
        >
          {copy.body}
        </p>
      </div>

      {isSchedule && (
        <div className="flex w-full items-stretch gap-4 max-sm:flex-col">
          <div
            role="group"
            aria-label="Quick date picks"
            className="flex w-[153px] shrink-0 flex-col items-center justify-center gap-[22px] rounded-[12px] border border-[#e5e5e5] px-[22px] py-4 max-sm:w-full max-sm:flex-row max-sm:flex-wrap max-sm:gap-2 max-sm:px-3"
          >
            {QUICK_PICKS.map((pick) => {
              const date = quickDate(today, pick);
              const active = sameDay(selectedDate, date);
              return (
                <button
                  key={pick.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    log('branch', { quickPick: pick.id });
                    select(date);
                  }}
                  className={classNames(
                    'pf-ov-focus w-full rounded-[6px] text-center text-[14px] transition-colors max-sm:min-h-11 max-sm:w-auto max-sm:px-3',
                    active
                      ? 'bg-[#ebf1ec] font-semibold text-[#1c2a21]'
                      : 'text-[#404040] hover:bg-[#f5f5f5] hover:text-[#387440]'
                  )}
                >
                  {pick.label}
                </button>
              );
            })}
          </div>
          <div className="min-w-0 flex-1">
            <PlayfulCalendar
              today={today}
              selectedDate={selectedDate}
              onSelect={select}
              onAnnounce={setAnnounce}
            />
          </div>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </PlayfulDialog>
  );
};

export default PlayfulOptOutModal;
