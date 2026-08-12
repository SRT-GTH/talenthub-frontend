import { useEffect, useMemo, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { ArrowRightIcon, ChatLinkArrowIcon } from '../../shared/assets.jsx';

const log = debug('CareerBuddyOptOutModal');

/*
 * Career Buddy Opt Out — Figma 5146:74705 / 75018 (journey),
 * 75029 / 75342 (sorry), 75353 / 75666 (schedule + calendar).
 *
 * Steps: journey → sorry → schedule. Save & Exit opens on `journey`.
 * Cancel / Escape / overlay closes the whole stack (parent handles).
 */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const QUICK_PICKS = [
  { id: 'tomorrow', label: 'Tomorrow', offsetDays: 1 },
  { id: 'in-3-days', label: 'In 3 days', offsetDays: 3 },
  { id: 'next-week', label: 'Next week', offsetDays: 7 },
  { id: 'next-two-weeks', label: 'Next two weeks', offsetDays: 14 },
  { id: 'next-month', label: 'Next month', offsetMonths: 1 },
];

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

const addMonths = (d, n) => {
  const x = startOfDay(d);
  x.setMonth(x.getMonth() + n);
  return x;
};

const sameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const monthTitle = (d) => d.toLocaleString('en-US', { month: 'long', year: 'numeric' });

const ChevronIcon = ({ className = '', direction = 'right' }) => (
  <svg
    viewBox="0 0 8 12"
    fill="none"
    aria-hidden="true"
    className={className}
    style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
  >
    <path
      d="M1.5 1.5 6.5 6l-5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoOutlineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 7.2V11M8 5.1v.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Build a Sun-start month grid (prev / current / next month cells). */
const buildMonthCells = (viewMonth, today) => {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < startPad; i += 1) {
    const day = prevMonthDays - startPad + i + 1;
    cells.push({
      key: `p-${day}`,
      date: new Date(year, month - 1, day),
      inMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `c-${day}`,
      date: new Date(year, month, day),
      inMonth: true,
    });
  }
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= trailing; day += 1) {
    cells.push({
      key: `n-${day}`,
      date: new Date(year, month + 1, day),
      inMonth: false,
    });
  }

  // Prefer 6 week rows to match Figma calendar height (5146:75679).
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = addDays(last, 1);
    cells.push({
      key: `n2-${cells.length}`,
      date: next,
      inMonth: next.getMonth() === month,
    });
  }

  return cells.map((cell) => {
    const dayStart = startOfDay(cell.date);
    const muted = !cell.inMonth || dayStart < today;
    const selectable = cell.inMonth && dayStart >= today;
    return { ...cell, muted, selectable };
  });
};

const ScheduleCalendar = ({ selectedDate, onSelect }) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    if (selectedDate) {
      setViewMonth(startOfDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)));
    }
  }, [selectedDate]);

  const cells = useMemo(() => buildMonthCells(viewMonth, today), [viewMonth, today]);

  const quickDate = (pick) => {
    if (pick.offsetMonths != null) return addMonths(today, pick.offsetMonths);
    return addDays(today, pick.offsetDays);
  };

  return (
    <div className="flex w-full gap-[16px]">
      {/* Quick picks — Figma 5146:75673 */}
      <div
        className="flex w-[153px] shrink-0 flex-col gap-[22px] rounded-[12px] border border-[#e5e5e5] px-[22px] py-[16px]"
        role="listbox"
        aria-label="Quick date picks"
      >
        {QUICK_PICKS.map((pick) => {
          const date = quickDate(pick);
          const active = sameDay(selectedDate, date);
          return (
            <button
              key={pick.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                log('branch', { quickPick: pick.id, date: date.toISOString() });
                onSelect(date);
              }}
              className={[
                'w-full rounded-[6px] px-[6px] py-[4px] text-left font-sans text-[14px] leading-[17px]',
                'transition-colors duration-150',
                active
                  ? 'font-medium text-[#111] bg-[#f0f0f0]'
                  : 'font-normal text-[#404040] hover:bg-[#f5f5f5] hover:text-[#387440]',
              ].join(' ')}
            >
              {pick.label}
            </button>
          );
        })}
      </div>

      {/* Month calendar — Figma 5146:75679 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[12px] border border-[#e5e5e5] px-[22px] py-[16px]">
        <div className="flex items-center justify-between py-[4px]">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() =>
              setViewMonth((m) => addMonths(new Date(m.getFullYear(), m.getMonth(), 1), -1))
            }
            className="inline-flex size-[18px] items-center justify-center text-[#111] hover:opacity-70"
          >
            <ChevronIcon direction="left" className="h-[11px] w-[6px]" />
          </button>
          <p className="font-sans text-[15px] font-medium leading-[18px] text-[#111]">
            {monthTitle(viewMonth)}
          </p>
          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setViewMonth((m) => addMonths(new Date(m.getFullYear(), m.getMonth(), 1), 1))
            }
            className="inline-flex size-[18px] items-center justify-center text-[#111] hover:opacity-70"
          >
            <ChevronIcon direction="right" className="h-[11px] w-[6px]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-x-[4px] gap-y-[14px]">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="flex size-[22px] items-center justify-center font-sans text-[14px] font-medium leading-[17px] text-[#111]"
            >
              {d}
            </div>
          ))}
          {cells.map((cell) => {
            const selected = sameDay(selectedDate, cell.date);
            // Fixed 22×22 hit target for every day — selected circle must not
            // change cell height or the CTA row below the calendar jumps.
            return (
              <button
                key={cell.key}
                type="button"
                disabled={!cell.selectable}
                aria-label={cell.date.toDateString()}
                aria-pressed={selected}
                onClick={() => cell.selectable && onSelect(startOfDay(cell.date))}
                className={[
                  'mx-auto flex size-[22px] shrink-0 items-center justify-center rounded-full',
                  cell.selectable ? 'cursor-pointer' : 'cursor-default',
                  selected
                    ? ''
                    : cell.muted
                      ? 'font-sans text-[14px] font-normal leading-[17px] text-[#cccccc]'
                      : 'font-sans text-[14px] font-normal leading-[17px] text-[#404040] hover:text-[#111]',
                ].join(' ')}
                style={
                  selected
                    ? { background: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)' }
                    : undefined
                }
              >
                {selected ? (
                  <span
                    className="font-sans text-[12px] font-medium leading-[14px] bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(180deg, #fef1e7 0%, #e8f2ed 20.192%)',
                    }}
                  >
                    {cell.date.getDate()}
                  </span>
                ) : (
                  cell.date.getDate()
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CareerBuddyOptOutModal = ({
  open,
  initialStep = 'journey',
  onClose,
  onChooseDifferentMode,
  onGoToDashboard,
  onConfirmSchedule,
}) => {
  const [step, setStep] = useState(initialStep);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    setStep(initialStep);
    setSelectedDate(null);
    log('open', { step: initialStep });
    return undefined;
  }, [open, initialStep]);

  if (!open) return null;

  const isSchedule = step === 'schedule';
  const copy = COPY[step] || COPY.journey;

  const handlePrimary = () => {
    if (step === 'journey') {
      log('branch', { chooseDifferentMode: true });
      onChooseDifferentMode?.();
      return;
    }
    if (step === 'sorry') {
      log('branch', { scheduleDate: true });
      setStep('schedule');
      return;
    }
    if (step === 'schedule' && selectedDate) {
      log('branch', { confirmSchedule: selectedDate.toISOString() });
      onConfirmSchedule?.(selectedDate);
    }
  };

  const handleSecondary = () => {
    if (step === 'journey') {
      log('branch', { leaveEntirely: true });
      setStep('sorry');
      return;
    }
    if (step === 'sorry') {
      log('branch', { goToDashboard: true });
      onGoToDashboard?.();
      return;
    }
    log('branch', { cancelSchedule: true });
    onClose?.();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="md"
      ariaLabel={copy.title}
      showClose={false}
      className="!bg-[rgba(17,17,17,0.7)] !backdrop-blur-none"
      contentClassName={
        isSchedule
          ? '!max-w-[564px] !rounded-[24px] !overflow-hidden'
          : '!max-w-[528px] !rounded-[24px] !overflow-hidden'
      }
    >
      {/* Centered like ConfirmJobPostModal / Figma opt-out cards */}
      <div
        className={[
          'flex w-full flex-col items-center text-center',
          isSchedule ? 'gap-[28px] p-[48px]' : 'gap-[36px] px-[48px] py-[64px]',
        ].join(' ')}
      >
        <div
          className={[
            'flex w-full flex-col items-center',
            isSchedule ? 'gap-[6px]' : 'gap-[10px]',
          ].join(' ')}
        >
          <h2 className="font-display text-[36px] font-normal leading-[1.3] text-[#111]">
            {copy.title}
          </h2>
          <p
            className={[
              'max-w-[432px] font-sans font-normal text-[#575755]',
              isSchedule ? 'text-[14px] leading-[21px]' : 'text-[16px] leading-6',
            ].join(' ')}
          >
            {copy.body}
          </p>
        </div>

        {isSchedule && (
          <div className="w-full">
            <ScheduleCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
          </div>
        )}

        <div
          className={['flex w-full flex-col items-center', isSchedule ? 'gap-[20px]' : ''].join(
            ' '
          )}
        >
          <div className="flex flex-row flex-nowrap items-center justify-center gap-[8px]">
            <Button
              type="button"
              variant="primary"
              size="sm"
              rightIcon={<ArrowRightIcon />}
              disabled={isSchedule && !selectedDate}
              onClick={handlePrimary}
              className="!shrink-0 whitespace-nowrap"
            >
              {copy.primary}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              rightIcon={
                step === 'schedule' ? undefined : <ChatLinkArrowIcon className="size-[16px]" />
              }
              onClick={handleSecondary}
              className="!shrink-0 !rounded-[14px] !gap-[6px] whitespace-nowrap"
            >
              {copy.secondary}
            </Button>
          </div>

          {isSchedule && (
            <div
              className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#e0e7f9] px-[16px] py-[8px]"
              style={{ background: 'rgba(234, 239, 251, 0.4)' }}
            >
              <InfoOutlineIcon className="size-4 shrink-0 text-[#3062d3]" />
              <span className="font-sans text-[12px] font-normal leading-[18px] text-[#3062d3]">
                {COPY.schedule.reminder}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CareerBuddyOptOutModal;
export { QUICK_PICKS };
