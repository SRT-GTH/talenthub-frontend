import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../ui/Button.jsx';
import Select from '../../ui/form/Select.jsx';
import { ArrowheadDownIcon } from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { flowIcons } from './screeningFlowIcons.js';
import { DRAWER } from './screeningFlowData.js';

const log = debug('AdjustCriteriaDrawer');

/*
 * AdjustCriteriaDrawer — Figma JS-07 "Drawer · Adjust criteria" (10117:67041): a 480px white panel on the right edge, below the nav, over the results screen (no scrim is drawn in the frame).
 * Five criteria cards (Minimum experience, Required skills, Education level, Assessment score, Location — 432 wide, r16, 1px #e5e8e3, p16), each with a 40×22 switch and, for the three that take a value, a select;
 * the live-count card ("Would meet all criteria 61"), and Reset / Cancel / Apply changes.
 * Props: values { experience, education, assessment, location, off[] } (URL keys adjExperience, adjEducation, adjAssessment, adjLocation, adjOff),
 * current (count now), adjustment { delta, close, dont }, onChange(partial URL patch), onReset, onCancel, onApply.
 * ⚠️ ASSUMPTION: Escape closes the drawer like Cancel; only the Education and Location switches feed the live count (see RELAX_RULES), the other switches are stored in `adjOff` and are visual.
 */
const Switch = ({ on, onToggle, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onToggle}
    className={classNames(
      'relative h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      on ? 'bg-[#387440]' : 'bg-[#babab7]'
    )}
  >
    <span
      className={classNames(
        'absolute top-[2px] size-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left]',
        on ? 'left-[20px]' : 'left-[2px]'
      )}
    />
  </button>
);

const Card = ({ title, note, noteChanged, on, onToggle, children }) => (
  <section className="flex flex-col gap-[8px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px]">
    <div className="flex items-start gap-[12px]">
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <h3 className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#111]">
          {title}
        </h3>
        <p
          className={classNames(
            'm-0 font-sans text-[12px] leading-[20px] tracking-[0.2px]',
            noteChanged ? 'text-[#463409]' : 'text-[#575755]'
          )}
        >
          {note}
        </p>
      </div>
      <span className="mt-[12px]">
        <Switch on={on} onToggle={onToggle} label={title} />
      </span>
    </div>
    {on ? children : null}
  </section>
);

const ValueSelect = ({ value, options, onChange, withHint }) => (
  <div className="flex flex-col gap-[8px]">
    <span aria-hidden="true" className="block h-[21px]" />
    <Select
      verified
      chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
      value={value}
      onChange={onChange}
      options={options.map((option) => ({ value: option.value, label: option.label }))}
    />
    {withHint ? <span aria-hidden="true" className="block h-[15px]" /> : null}
  </div>
);

const EXPERIENCE = [
  { value: '3plus', label: '3+ years' },
  { value: '4plus', label: '4+ years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10plus', label: '10+ years' },
];
const EDUCATION = [
  { value: 'diploma', label: 'Diploma or HND' },
  { value: 'bachelors', label: 'Bachelor’s' },
  { value: 'masters', label: 'Master’s' },
];
const ASSESSMENT = [
  { value: '60', label: '60+' },
  { value: '70', label: '70+' },
  { value: '80', label: '80+' },
];

const AdjustCriteriaDrawer = ({
  values,
  current,
  adjustment,
  onChange,
  onReset,
  onCancel,
  onApply,
}) => {
  const panelRef = useRef(null);
  const off = new Set(values.off);
  const changedExperience = values.experience !== '5-10';
  const experienceLabel = EXPERIENCE.find((item) => item.value === values.experience)?.label;
  const toggleOff = (id) => {
    const next = new Set(off);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ adjOff: next.size ? [...next].join(',') : null });
  };
  const count = current + adjustment.delta;
  log('render', { values, count, delta: adjustment.delta });

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return createPortal(
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-label={DRAWER.title}
      className="fixed top-[87px] right-0 bottom-0 z-[60] flex w-[480px] max-w-full flex-col gap-[20px] overflow-y-auto bg-white p-[24px] shadow-[-12px_0_32px_-8px_rgba(15,15,10,0.14)] outline-none max-sm:p-[16px]"
    >
      <div className="flex items-start gap-[12px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
            {DRAWER.title}
          </h2>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {DRAWER.hint}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close drawer"
          onClick={onCancel}
          className="mt-[9px] flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={flowIcons.drawerCloseX} alt="" aria-hidden="true" className="size-[18px]" />
        </button>
      </div>

      <Card
        title="Minimum experience"
        note={changedExperience ? `5–10 years → changed to ${experienceLabel}` : '5–10 years'}
        noteChanged={changedExperience}
        on={!off.has('experience')}
        onToggle={() => toggleOff('experience')}
      >
        <ValueSelect
          value={values.experience}
          options={EXPERIENCE}
          onChange={(value) => onChange({ adjExperience: value === '5-10' ? null : value })}
        />
      </Card>
      <Card
        title="Required skills"
        note="Figma, Design systems, User research"
        on={!off.has('skills')}
        onToggle={() => toggleOff('skills')}
      />
      <Card
        title="Education level"
        note="Bachelor’s or higher"
        on={values.education !== 'any'}
        onToggle={() => onChange({ adjEducation: values.education === 'any' ? null : 'any' })}
      >
        <ValueSelect
          withHint
          value={values.education === 'any' ? 'bachelors' : values.education}
          options={EDUCATION}
          onChange={(value) => onChange({ adjEducation: value === 'bachelors' ? null : value })}
        />
      </Card>
      <Card
        title="Assessment score"
        note="Minimum 70 / 100"
        on={!off.has('assessment')}
        onToggle={() => toggleOff('assessment')}
      >
        <ValueSelect
          withHint
          value={values.assessment}
          options={ASSESSMENT}
          onChange={(value) => onChange({ adjAssessment: value === '70' ? null : value })}
        />
      </Card>
      <Card
        title="Location"
        note="Within 50 km of Accra or Remote"
        on={values.location}
        onToggle={() => onChange({ adjLocation: values.location ? 'off' : null })}
      />

      <div
        className="flex flex-col gap-[6px] rounded-[16px] bg-[#ebf1ec]/50 p-[16px]"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-[12px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
            {DRAWER.liveLabel}
          </span>
          <span className="font-['Bricolage_Grotesque',sans-serif] text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#2a5730]">
            {count}
          </span>
        </div>
        <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {adjustment.delta === 0
            ? `Same as now (${current})`
            : `+${adjustment.delta} compared with now (${current}) · ${adjustment.close} from Close match, ${adjustment.dont} from Don’t meet`}
        </p>
      </div>

      <div className="flex items-center justify-end gap-[12px] pb-[4px]">
        <button
          type="button"
          onClick={onReset}
          className="mr-[12px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {DRAWER.reset}
        </button>
        <Button variant="tertiary" onClick={onCancel}>
          {DRAWER.cancel}
        </Button>
        <Button variant="primary" size="sm" onClick={onApply}>
          {DRAWER.apply}
        </Button>
      </div>
    </aside>,
    document.body
  );
};

export default AdjustCriteriaDrawer;
