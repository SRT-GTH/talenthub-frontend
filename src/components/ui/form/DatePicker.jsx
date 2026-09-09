import { useEffect, useId, useMemo, useRef, useState } from 'react';
import TextInput from './TextInput.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { CalendarPickerIcon } from '../../shared/assets.jsx';

const log = debug('DatePicker');

/*
 * DatePicker — design-system date field with a calendar popup.
 * Added 2026-09-06 (AddEditWorkModal.jsx's Start/End date fields were the
 * first callers) as a real, reusable component rather than the native
 * `<input type="date">.showPicker()` hack that preceded it — that approach
 * couldn't be styled to match the app at all (a browser-chrome popup), which
 * defeats the point of a design-system field.
 *
 * Composition, not reinvention: the trigger IS a `TextInput` (so label /
 * required / helperText / error / size all come for free and stay visually
 * identical to every other text field), with the calendar-icon button living
 * in its `rightIcon` slot. The popup panel copies `Select.jsx`'s dropdown
 * chrome exactly (absolute, `top-full mt-3`, 2px brand-green border, inverse
 * shelf shadow, click-outside/Escape to close) so it reads as the same
 * family of control, not a one-off widget.
 *
 * Value format is "DD/MM/YYYY" (a plain string, matching the placeholder
 * every date field in this app already uses) rather than ISO — typing
 * still works (the field stays fully editable text), the calendar is an
 * assist, not the only way in.
 */

const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const parseDMY = (value) => {
  const match = DATE_RE.exec(value ?? '');
  if (!match) return null;
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDMY = (date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
};

const isSameDay = (a, b) =>
  Boolean(a) &&
  Boolean(b) &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// 42-cell (6-week) grid for the given month, Monday-first, including the
// trailing/leading days of adjacent months (rendered dimmed).
const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekdayMondayFirst = (firstOfMonth.getDay() + 6) % 7; // 0=Mon..6=Sun
  const gridStart = new Date(year, month, 1 - firstWeekdayMondayFirst);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
};

const ChevronLeftIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M10 3 5 8l5 5" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M6 3l5 5-5 5" />
  </svg>
);

const DatePicker = ({
  label,
  required,
  optional,
  helperText,
  error,
  value = '',
  onChange,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  // Mirrors TextInput's sizes — `xs` (38px, compact modal forms) is the
  // common case; `sm`/`md` work too since the trigger just is a TextInput.
  size = 'xs',
  id,
  className,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => parseDMY(value), [value]);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  log('render', { label, value, open, disabled });

  // Jump the visible month back to the selected (or current) date each time
  // the popup opens, so re-opening never strands the user on a stale month.
  useEffect(() => {
    if (open) setViewDate(selectedDate ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        log('click outside, closing');
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        log('escape, closing');
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const grid = useMemo(
    () => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );
  const today = new Date();

  const goToPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const handlePick = (date) => {
    log('pick', { date: formatDMY(date) });
    onChange?.(formatDMY(date));
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={classNames('relative', className)}>
      <TextInput
        id={inputId}
        size={size}
        label={label}
        required={required}
        optional={optional}
        helperText={helperText}
        error={error}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rightIconInteractive
        rightIcon={
          <button
            type="button"
            onClick={() => !disabled && setOpen((prev) => !prev)}
            aria-label={`Open ${(label || 'date').toLowerCase()} picker`}
            disabled={disabled}
            className="flex size-full items-center justify-center disabled:cursor-not-allowed"
          >
            <CalendarPickerIcon className="size-full" />
          </button>
        }
      />

      {open && !disabled && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute top-full left-0 z-20 mt-3 w-[264px] rounded-md border-2 border-brand-green-light-active bg-white p-3 shadow-[0_-4px_0_0_rgba(34,70,38,0.8)]"
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="flex size-6 items-center justify-center rounded-full text-content-tertiary transition-colors duration-100 hover:bg-brand-green-light hover:text-brand-green"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="font-sans text-[12px] font-semibold text-content-primary">
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="flex size-6 items-center justify-center rounded-full text-content-tertiary transition-colors duration-100 hover:bg-brand-green-light hover:text-brand-green"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAY_LABELS.map((wd) => (
              <span
                key={wd}
                className="flex h-6 items-center justify-center font-sans text-[10px] font-semibold text-content-tertiary"
              >
                {wd}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-[2px]">
            {grid.map((date) => {
              const inMonth = date.getMonth() === viewDate.getMonth();
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handlePick(date)}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  className={classNames(
                    'flex size-8 items-center justify-center rounded-full font-sans text-[12px] transition-colors duration-100',
                    !inMonth && 'text-[#c8c8c8] hover:bg-neutral',
                    inMonth && !isSelected && 'text-content-primary hover:bg-brand-green-light',
                    isSelected && 'bg-brand-green font-semibold text-white',
                    isToday && !isSelected && 'border border-brand-green-light-active'
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-[#e7e7e7] pt-2">
            <button
              type="button"
              onClick={() => handlePick(new Date())}
              className="w-full text-center font-sans text-[11px] font-semibold text-brand-green transition-colors duration-100 hover:text-brand-green-active"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
