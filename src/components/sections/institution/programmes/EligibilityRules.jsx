import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import QueryChoiceMenu from '../../agency/queries/QueryChoiceMenu.jsx';
import { FORMS, RESULT_STEPS, STUDY_PROGRAMMES } from './data/programmesData.js';
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
 * EligibilityRules — the "ELIGIBILITY · AUTOMATED" rule cards of "Who can apply" (Figma 11.3.1a, 8594:1843):
 *   the big card (862 wide, 1px #e6e2d6, r14, p 20/22): Year group (the "Form 3" select) · Programme of study (#ebf1ec chips, "+ Add programme") ·
 *   Linked profile ("Linked students only", off in the frame), each row a title 16/24, a sentence #999999 and the switch on the right;
 *   below it two 300 wide cards: Results ("AT LEAST", "1 verified result", an 8px meter) and Under-18s ("Included · Parent links on").
 * Every control is live: the year-group select opens the multi-select menu (one or more forms), "+ Add programme" the single-select listbox, a chip removes itself
 * (its "×" shows on hover / focus), the results meter is a range input (1 · 2 · 3 verified results), the Under-18s switch changes the audience. Esc closes a menu and
 * returns focus to its button.
 * ⚠️ ASSUMPTIONS: the Linked-profile "Linked students only" chip is a static label (no other option is drawn); the Under-18s card reads "Not included · Set by your school"
 * when switched off (only the "Included" state is drawn).
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

  const picked = FORMS.filter((f) => rules.forms.includes(f.id));
  const formLabel = picked.length ? picked.map((f) => f.label).join(', ') : 'All forms';
  const freeStudy = STUDY_PROGRAMMES.filter((s) => !rules.study.includes(s));
  const step = RESULT_STEPS.find((s) => s.count === rules.results) ?? RESULT_STEPS[0];
  const stepIndex = RESULT_STEPS.indexOf(step);

  return (
    <div className="flex min-w-0 flex-col gap-[12px]" ref={wrapRef}>
      <div className="flex flex-col rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] py-[20px]">
        <Row
          icon={<ProgrammesIconAge className="h-[16px] w-[20px]" />}
          title="Year group"
          sentence="Pick one or more forms."
          checked={rules.yearOn}
          onToggle={(v) => onChange({ yearOn: v })}
        >
          <div className="relative w-fit">
            <SelectButton
              buttonRef={(el) => {
                refs.current.year = el;
              }}
              expanded={open === 'year'}
              controls={`${uid}-year`}
              label={`Year group: ${formLabel}`}
              onClick={() => rules.yearOn && setOpen((k) => (k === 'year' ? null : 'year'))}
            >
              {formLabel}
            </SelectButton>
            {open === 'year' ? (
              <QueryChoiceMenu
                id={`${uid}-year`}
                label="Year group"
                searchLabel="Search forms"
                options={FORMS.map((f) => ({ id: f.id, label: f.label }))}
                value={rules.forms}
                noun="form"
                allLabel="Apply · all forms"
                onApply={(ids) => {
                  onChange({ forms: ids });
                  close();
                }}
                onClose={close}
              />
            ) : null}
          </div>
        </Row>
        <Row
          icon={<ProgrammesIconSkills className="size-[20px]" />}
          title="Programme of study"
          sentence="Leave empty for all programmes."
          checked={rules.studyOn}
          onToggle={(v) => onChange({ studyOn: v })}
        >
          <ul className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
            {rules.study.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => onChange({ study: rules.study.filter((x) => x !== s) })}
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
                  refs.current.study = el;
                }}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open === 'study'}
                disabled={!freeStudy.length}
                onClick={() => setOpen((k) => (k === 'study' ? null : 'study'))}
                className="inline-flex h-[34px] cursor-pointer items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add programme
              </button>
              {open === 'study' ? (
                <FilterMenu
                  id={`${uid}-study`}
                  label="Add a programme of study"
                  options={freeStudy.map((s) => ({ id: s, label: s }))}
                  value={null}
                  onSelect={(id) => id && onChange({ study: [...rules.study, id] })}
                  onClose={close}
                />
              ) : null}
            </li>
          </ul>
        </Row>
        <Row
          icon={<ProgrammesIconRegion className="h-[18px] w-[22px]" />}
          title="Linked profile"
          sentence="Only students who linked their GTH profile."
          checked={rules.linkedOn}
          onToggle={(v) => onChange({ linkedOn: v })}
          last
        >
          <span className="inline-flex min-h-[38px] items-center rounded-[8px] border border-solid border-[#e9e9e9] bg-white px-[12px] py-[8px] text-[16px] leading-[22px] text-[#595959]">
            Linked students only
          </span>
        </Row>
      </div>
      <div className="flex flex-wrap gap-[10px]">
        <section
          aria-label="Results"
          className="flex w-full max-w-[300px] min-w-[240px] flex-1 flex-col gap-[4px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] pt-[22px] pb-[38px]"
        >
          <div className="flex items-center justify-between pr-[2px]">
            <ProgrammesIconReadiness className="size-[18px] text-[#387440]" />
            <SwitchControl
              checked={rules.resultsOn}
              onChange={(v) => onChange({ resultsOn: v })}
              label="Results"
            />
          </div>
          <h3 className="m-0 pt-[12px] text-[16px] leading-[24px] font-normal tracking-[0.2px] text-[#1c2a21]">
            Results
          </h3>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
            Students with a verified result.
          </p>
          <div className="flex flex-col gap-[8px] pt-[16px]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="rounded-full bg-[#f3f8f4] px-[8px] py-[4px] text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
                AT LEAST
              </span>
              <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
                {step.label}
              </span>
            </div>
            <div className="relative h-[8px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#f0eee8]"
              >
                <div className="h-full bg-[#387440]" style={{ width: `${step.meter * 100}%` }} />
              </div>
              <input
                type="range"
                min={0}
                max={RESULT_STEPS.length - 1}
                step={1}
                value={stepIndex}
                aria-label="Verified results needed"
                aria-valuetext={step.label}
                disabled={!rules.resultsOn}
                onChange={(e) => onChange({ results: RESULT_STEPS[Number(e.target.value)].count })}
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
            Most Form 3 students are 16–17. Parents are copied on every message.
          </p>
          <p className="m-0 flex items-center gap-[8px] pt-[12px] text-[16px] leading-[24px] tracking-[0.2px] text-[#387440]">
            <ProgrammesIconGlobe className="size-[12px]" />
            {rules.under18 ? 'Included' : 'Not included'}
          </p>
          <p className="m-0 pt-[4px] text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]">
            {rules.under18 ? 'Parent links on' : 'Set by your school'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default EligibilityRules;
