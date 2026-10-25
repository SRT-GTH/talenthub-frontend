import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import QueryChoiceMenu from '../queries/QueryChoiceMenu.jsx';
import {
  AGE_RANGES,
  READINESS_STEPS,
  REGION_CHOICES,
  SKILL_OPTIONS,
} from '../data/programmesData.js';
import SwitchControl from './SwitchControl.jsx';
import {
  ProgrammesIconAge,
  ProgrammesIconCaret,
  ProgrammesIconGlobe,
  ProgrammesIconReadiness,
  ProgrammesIconRegion,
  ProgrammesIconSkills,
  ProgrammesIconUnder18,
} from './programmesIcons.jsx';

/*
 * EligibilityRules — the "ELIGIBILITY · AUTOMATED" rule cards of "Who can apply" (Figma 8597:393873):
 *   the big card (862 wide, 1px #e6e2d6, r14, p 20/22): Age range (the 18–35 select) · Skills (#ebf1ec chips, "+ Add Skill") · Region (the "All 16 regions" select),
 *   each row with a title 16/24 #1c2a21, a sentence #999999 and the switch on the right;
 *   below it two 300 wide cards: Readiness ("AT LEAST" tag, "Ready in 3 months", an 8px meter) and Under-18s ("Not included · Set by your MoU").
 * Every control is live: the selects open Theme 8 listboxes (age, add skill) or the Queries multi-select menu (regions); a skill chip removes itself
 * (its "×" shows on hover / focus); the readiness meter is a range input (1 · 2 · 3 · 6 months); the Under-18s switch changes the audience (the rule is set by the MoU,
 * switching it on leaves almost nobody, frame 11.5.2h). Esc closes a menu and returns focus to its button.
 * Props: rules, onChange(patch).
 */

const Row = ({ icon, title, sentence, checked, onToggle, children, last }) => (
  <div
    className={classNames(
      'flex items-start gap-[16px] rounded-[12px] px-[12px] py-[16px]',
      !last && 'mb-[24px]'
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <div className="flex items-center gap-[8px]">
        <span className="shrink-0 text-[#387440]">{icon}</span>
        <h3 className="m-0 text-[16px] leading-[24px] font-normal tracking-[0.2px] text-[#1c2a21]">
          {title}
        </h3>
      </div>
      <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">{sentence}</p>
      <div className="pt-[8px]">{children}</div>
    </div>
    <SwitchControl checked={checked} onChange={onToggle} label={title} />
  </div>
);

const SelectButton = ({ children, expanded, onClick, buttonRef, controls, label }) => (
  <button
    ref={buttonRef}
    type="button"
    aria-haspopup="listbox"
    aria-expanded={expanded}
    aria-controls={expanded ? controls : undefined}
    aria-label={label}
    onClick={onClick}
    className="inline-flex min-h-[38px] cursor-pointer items-center gap-[4px] rounded-[8px] border border-solid border-[#e9e9e9] bg-white px-[12px] py-[8px] text-[16px] leading-[22px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {children}
    <ProgrammesIconCaret className="size-[16px]" />
  </button>
);

const EligibilityRules = ({ rules, onChange }) => {
  const [open, setOpen] = useState(null);
  const refs = useRef({});
  const wrapRef = useRef(null);
  const uid = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const close = useCallback(
    (reason) => {
      const key = open;
      setOpen(null);
      if (key && reason !== 'tab') refs.current[key]?.focus();
    },
    [open]
  );

  const ageLabel = AGE_RANGES.find((a) => a.id === rules.age)?.label ?? '18–35';
  const freeSkills = SKILL_OPTIONS.filter((s) => !rules.skills.includes(s));
  const readiness = READINESS_STEPS.find((s) => s.months === rules.readiness) ?? READINESS_STEPS[2];
  const stepIndex = READINESS_STEPS.indexOf(readiness);
  const meter = Math.min(1, 0.2867 * readiness.months);

  return (
    <div className="flex min-w-0 flex-col gap-[12px]" ref={wrapRef}>
      <div className="flex flex-col rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] py-[20px]">
        <Row
          icon={<ProgrammesIconAge className="h-[16px] w-[20px]" />}
          title="Age range"
          sentence="YouthStart covers ages 18–35."
          checked={rules.ageOn}
          onToggle={(v) => onChange({ ageOn: v })}
        >
          <div className="relative w-fit">
            <SelectButton
              buttonRef={(el) => {
                refs.current.age = el;
              }}
              expanded={open === 'age'}
              controls={`${uid}-age`}
              label={`Age range: ${ageLabel}`}
              onClick={() => setOpen((k) => (k === 'age' ? null : 'age'))}
            >
              {ageLabel}
            </SelectButton>
            {open === 'age' ? (
              <FilterMenu
                id={`${uid}-age`}
                label="Age range"
                options={AGE_RANGES}
                value={rules.age}
                onSelect={(id) => id && onChange({ age: id })}
                onClose={close}
              />
            ) : null}
          </div>
        </Row>
        <Row
          icon={<ProgrammesIconSkills className="size-[20px]" />}
          title="Skills"
          sentence="At least one of these."
          checked={rules.skillsOn}
          onToggle={(v) => onChange({ skillsOn: v })}
        >
          <ul className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
            {rules.skills.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => onChange({ skills: rules.skills.filter((x) => x !== s) })}
                  className="group inline-flex min-h-[34px] cursor-pointer items-center gap-[6px] rounded-[8px] border-0 bg-[#ebf1ec] px-[12px] py-[8px] text-[15px] leading-[18px] text-[#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {s}
                  <span
                    aria-hidden="true"
                    className="hidden text-[14px] leading-none group-hover:inline group-focus-visible:inline"
                  >
                    ×
                  </span>
                </button>
              </li>
            ))}
            <li className="relative">
              <button
                ref={(el) => {
                  refs.current.skill = el;
                }}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open === 'skill'}
                disabled={!freeSkills.length}
                onClick={() => setOpen((k) => (k === 'skill' ? null : 'skill'))}
                className="inline-flex h-[34px] cursor-pointer items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add Skill
              </button>
              {open === 'skill' ? (
                <FilterMenu
                  id={`${uid}-skill`}
                  label="Add a skill"
                  options={freeSkills.map((s) => ({ id: s, label: s }))}
                  value={null}
                  onSelect={(id) => id && onChange({ skills: [...rules.skills, id] })}
                  onClose={close}
                />
              ) : null}
            </li>
          </ul>
        </Row>
        <Row
          icon={<ProgrammesIconRegion className="h-[18px] w-[22px]" />}
          title="Region"
          sentence="Where talents live today."
          checked={rules.regionOn}
          onToggle={(v) => onChange({ regionOn: v })}
          last
        >
          <div className="relative w-fit">
            <SelectButton
              buttonRef={(el) => {
                refs.current.region = el;
              }}
              expanded={open === 'region'}
              controls={`${uid}-region`}
              label="Regions"
              onClick={() => rules.regionOn && setOpen((k) => (k === 'region' ? null : 'region'))}
            >
              {rules.regionOn && rules.regions.length
                ? `${rules.regions.length} ${rules.regions.length === 1 ? 'region' : 'regions'}`
                : 'All 16 regions'}
            </SelectButton>
            {open === 'region' ? (
              <QueryChoiceMenu
                id={`${uid}-region`}
                label="Regions"
                searchLabel="Search regions"
                options={REGION_CHOICES}
                value={rules.regions}
                onApply={(ids) => {
                  onChange({ regions: ids });
                  close();
                }}
                onClose={close}
              />
            ) : null}
          </div>
        </Row>
      </div>
      <div className="flex flex-wrap gap-[10px]">
        <section
          aria-label="Readiness"
          className="flex w-full max-w-[300px] min-w-[240px] flex-1 flex-col gap-[4px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] pt-[22px] pb-[38px]"
        >
          <div className="flex items-center justify-between pr-[2px]">
            <ProgrammesIconReadiness className="size-[18px] text-[#387440]" />
            <SwitchControl
              checked={rules.readinessOn}
              onChange={(v) => onChange({ readinessOn: v })}
              label="Readiness"
            />
          </div>
          <h3 className="m-0 pt-[12px] text-[16px] leading-[24px] font-normal tracking-[0.2px] text-[#1c2a21]">
            Readiness
          </h3>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
            How soon they can start.
          </p>
          <div className="flex flex-col gap-[8px] pt-[16px]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="rounded-full bg-[#f3f8f4] px-[8px] py-[4px] text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
                AT LEAST
              </span>
              <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
                {readiness.label}
              </span>
            </div>
            <div className="relative h-[8px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#f0eee8]"
              >
                <div className="h-full bg-[#387440]" style={{ width: `${meter * 100}%` }} />
              </div>
              <input
                type="range"
                min={0}
                max={READINESS_STEPS.length - 1}
                step={1}
                value={stepIndex}
                aria-label="Ready within"
                aria-valuetext={readiness.label}
                disabled={!rules.readinessOn}
                onChange={(e) =>
                  onChange({ readiness: READINESS_STEPS[Number(e.target.value)].months })
                }
                className="absolute -inset-y-[8px] inset-x-0 h-[24px] w-full cursor-pointer opacity-0 focus-visible:opacity-100"
              />
            </div>
          </div>
        </section>
        <section
          aria-label="Under-18s"
          className="flex w-full max-w-[300px] min-w-[240px] flex-1 flex-col gap-[4px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] pt-[22px] pb-[34px]"
        >
          <div className="flex items-center justify-between pr-[2px]">
            <ProgrammesIconUnder18 className="h-[20px] w-[16px] text-[#387440]" />
            <SwitchControl
              checked={rules.under18}
              onChange={(v) => onChange({ under18: v })}
              label="Under-18s"
            />
          </div>
          <h3 className="m-0 pt-[12px] text-[16px] leading-[24px] font-normal tracking-[0.2px] text-[#1c2a21]">
            Under-18s
          </h3>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
            YouthStart is for adults. Under-18s can’t be included.
          </p>
          <p className="m-0 flex items-center gap-[8px] pt-[12px] text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
            <ProgrammesIconGlobe className="size-[12px]" />
            Not included
          </p>
          <p className="m-0 pt-[4px] text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]">
            Set by your MoU
          </p>
        </section>
      </div>
    </div>
  );
};

export default EligibilityRules;
