import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { debug } from '../../../../utils/debug.js';
import { AgencyArrowRightIcon, AgencyChevronDownIcon } from '../agencyIcons.jsx';
import { DemandHourglassIcon } from './demandIcons.jsx';
import { DATE_RANGE } from './data/demandData.js';
import { daysBetween, fmtDay, parseIso } from './trendModel.js';

const log = debug('DateRangePopover');

/*
 * DateRangePopover — "Custom range" (Figma 8705:417651 popover, 414 wide: white r16 border #e7e7e7 shadow, p 20; title 16/600; two required selects "From*" / "To*"
 * 14/500 with a #1d7c4d asterisk; a #faf4e8 hint "656 days. Ranges over 90 days are built in the background." 12/500 #967014 with the hourglass; Cancel + "Apply range →").
 * ⚠️ ASSUMPTION: Figma draws the two fields as date selects; they are native <select>s of month starts (From) and month ends plus today (To), so the keyboard works everywhere.
 * Non-modal popover: focus moves to "From", Esc and outside click close it and return focus to the "Custom" button (`returnRef`). Apply with a span over 90 days starts the
 * mocked background build (?range=long&state=generating), up to 90 days it applies directly (?range=custom).
 * Props: from, to (ISO), onApply({from,to,days}), onCancel(), returnRef, className.
 */

const SELECT =
  'h-[46px] w-full cursor-pointer appearance-none rounded-[12px] border border-solid border-[#c1d4c4] bg-white pr-[36px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const iso = (d) => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const buildOptions = () => {
  const starts = [];
  const ends = [];
  for (let m = 0; m < 34; m += 1) {
    const s = new Date(2024, m, 1);
    const e = new Date(2024, m + 1, 0);
    if (s <= new Date(`${DATE_RANGE.today}T00:00:00`)) starts.push(s);
    if (e < new Date(`${DATE_RANGE.today}T00:00:00`)) ends.push(e);
  }
  ends.push(new Date(`${DATE_RANGE.today}T00:00:00`));
  return {
    from: starts.map((d) => ({ id: iso(d), label: fmtDay(d, true) })),
    to: ends.map((d) => ({ id: iso(d), label: fmtDay(d, true) })),
  };
};

const Field = ({ id, label, value, options, onChange, selectRef }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
    <label htmlFor={id} className="text-[14px] leading-[17px] font-medium text-[#1c2a21]">
      {label}
      <span aria-hidden="true" className="font-semibold text-[#1d7c4d]">
        *
      </span>
    </label>
    <div className="relative">
      <select
        ref={selectRef}
        id={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <AgencyChevronDownIcon className="pointer-events-none absolute top-[16px] right-[12px] size-[14px] text-[#1c2a21]" />
    </div>
  </div>
);

const DateRangePopover = ({ from, to, onApply, onCancel, returnRef, className }) => {
  const uid = useId();
  const rootRef = useRef(null);
  const fromRef = useRef(null);
  const options = useMemo(buildOptions, []);
  const [f, setF] = useState(from ?? DATE_RANGE.defaultFrom);
  const [t, setT] = useState(to ?? DATE_RANGE.defaultTo);
  const a = parseIso(f);
  const b = parseIso(t);
  const valid = a && b && a <= b;
  const days = valid ? daysBetween(a, b) : 0;

  useEffect(() => {
    log('open');
    fromRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        log('esc');
        onCancel();
        returnRef?.current?.focus();
      }
    };
    const onDown = (e) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target) &&
        !returnRef?.current?.contains(e.target)
      ) {
        onCancel();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [onCancel, returnRef]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-labelledby={`${uid}-t`}
      className={`flex w-[min(414px,calc(100vw-32px))] flex-col gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[20px] font-sans shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${className ?? ''}`}
    >
      <h2 id={`${uid}-t`} className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
        {DATE_RANGE.title}
      </h2>
      <div className="flex gap-[12px] max-sm:flex-col">
        <Field
          id={`${uid}-from`}
          label={DATE_RANGE.from}
          value={f}
          options={options.from}
          onChange={setF}
          selectRef={fromRef}
        />
        <Field
          id={`${uid}-to`}
          label={DATE_RANGE.to}
          value={t}
          options={options.to}
          onChange={setT}
        />
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`m-0 flex items-start gap-[8px] rounded-[10px] px-[12px] py-[10px] text-[12px] leading-[16px] font-medium ${valid ? 'bg-[#faf4e8] text-[#967014]' : 'bg-[#f9ebea] text-[#9f2a1e]'}`}
      >
        <DemandHourglassIcon className="mt-[1px] size-[16px] shrink-0 text-[#967014]" />
        <span>
          {valid
            ? days > DATE_RANGE.backgroundDays
              ? `${days} days. Ranges over ${DATE_RANGE.backgroundDays} days are built in the background.`
              : `${days} days.`
            : 'The start date must be on or before the end date.'}
        </span>
      </p>
      <div className="flex justify-end gap-[12px]">
        <Button
          type="button"
          variant="tertiary-subtle"
          size="md"
          onClick={() => {
            onCancel();
            returnRef?.current?.focus();
          }}
          className="!rounded-[14px] !px-[22px] !py-[12px]"
        >
          {DATE_RANGE.cancel}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!valid}
          onClick={() => onApply({ from: f, to: t, days })}
          className="!rounded-[14px] !px-[22px] !py-[12px]"
        >
          <span className="inline-flex items-center gap-[8px]">
            {DATE_RANGE.apply}
            <AgencyArrowRightIcon className="size-[20px]" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default DateRangePopover;
