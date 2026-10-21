import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import Button from '../../../ui/Button.jsx';
import { SKILL_CATEGORIES, SKILL_LEVELS } from './skillsData.js';
import { SkillsArrowRightIcon, SkillsCloseIcon, SkillsGameIcon } from './skillsIcons.jsx';
import { LevelDots, SkChip } from './SkillsParts.jsx';
import { CARD_CHROME, SOFT_FOCUS } from './skillsStyles.js';

const log = debug('AddSkillDialog');

/*
 * SK-03 · "Add a skill" dialog — Figma Playful 7665:333 / Focused 8285:23446 (760px card over a #0b1a0f/55% scrim).
 * Fields: Skill name (required), Your level (Beginner..Expert), Category (pick one), Where you used it (optional).
 * Props: initial ({ name, level, category, usedIn }), onCancel, onSubmit(draft). Esc / scrim / close button / Cancel close it.
 * The "Tableau can be verified in Skills Lab" note shows once a name is typed; its second line is the drawn copy.
 */
const Label = ({ htmlFor, children, hint, required, size = 15 }) => (
  <div className="flex items-baseline justify-between gap-[12px]">
    <label
      htmlFor={htmlFor}
      className={classNames(
        'font-sans font-medium text-[#1c2a21]',
        size === 14 ? 'text-[14px] leading-[24px]' : 'text-[15px] leading-[18px]'
      )}
    >
      {children}
      {required ? <span className="ml-[3px] font-semibold text-[#2e8b57]">*</span> : null}
    </label>
    {hint ? (
      <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
        {hint}
      </span>
    ) : null}
  </div>
);

const INPUT =
  'w-full rounded-[10px] border border-solid border-[#cccccc] bg-white py-[13px] pl-[20px] pr-[16px] font-sans text-[14px] leading-[24px] tracking-[0.014em] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const AddSkillDialog = ({ initial, onCancel, onSubmit }) => {
  const [draft, setDraft] = useState(initial);
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const ids = useId();
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const name = draft.name.trim();

  useEffect(() => {
    log('open', { prefilled: Boolean(initial.name) });
  }, [initial.name]);

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: () => {
      log('escape');
      onCancel();
    },
    initialFocus: () => nameRef.current,
    lockScroll: true,
  });

  const submit = (e) => {
    e.preventDefault();
    if (!name) {
      log('submit blocked: name empty');
      return;
    }
    log('submit', { name, level: draft.level, category: draft.category });
    onSubmit({ ...draft, name });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-[16px] py-[clamp(16px,4.2vw,58px)]">
      <div
        className="fixed inset-0 bg-[rgba(11,26,15,0.55)]"
        aria-hidden="true"
        onClick={onCancel}
      />
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${ids}-title`}
        onSubmit={submit}
        className={classNames(
          'relative flex w-full max-w-[760px] flex-col gap-[22px] rounded-[28px] bg-white px-[clamp(20px,2.3vw,40px)] pb-[clamp(20px,1.85vw,32px)] pt-[clamp(24px,2.1vw,36px)]',
          CARD_CHROME
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className={classNames(
            'absolute right-[20px] top-[24px] inline-flex size-[40px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[#387440]',
            SOFT_FOCUS
          )}
        >
          <SkillsCloseIcon className="size-[20px]" />
        </button>
        <header className="flex max-w-[560px] flex-col items-start gap-[8px]">
          <SkChip tone="soft">Add a skill</SkChip>
          <h2
            id={`${ids}-title`}
            className="m-0 font-sans text-[clamp(28px,2.2vw,38px)] font-semibold leading-[1.21] text-[#111111] playful:font-heading"
          >
            What are you <span className="text-[#387440]">adding?</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959] max-lg:leading-[22px]">
            Name it, set your level honestly and say where you used it. You can verify it later.
          </p>
        </header>

        <div className="flex flex-col gap-[8px]">
          <Label htmlFor={`${ids}-name`} required size={14}>
            Skill name
          </Label>
          <div className="relative">
            <input
              ref={nameRef}
              id={`${ids}-name`}
              type="text"
              value={draft.name}
              onChange={(e) => set({ name: e.target.value })}
              autoComplete="off"
              required
              className={classNames(INPUT, 'pr-[52px] font-medium')}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[16px] top-1/2 h-[19px] w-[20px] -translate-y-1/2 rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#d9d9d9] playful:border-[#1c2a21]"
            />
          </div>
        </div>

        <fieldset className="m-0 flex min-w-0 flex-col gap-[10px] border-0 p-0">
          <legend className="sr-only">Your level</legend>
          <Label hint="Be honest. Recruiters can see if it’s verified.">Your level</Label>
          <div
            role="radiogroup"
            aria-label="Your level"
            className="grid grid-cols-2 gap-[8px] sm:grid-cols-4"
          >
            {SKILL_LEVELS.map((level) => {
              const on = draft.level === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set({ level: level.id })}
                  className={classNames(
                    'flex min-h-[56px] cursor-pointer flex-col items-center gap-[6px] rounded-[14px] border border-solid px-[8px] py-[12px] font-sans text-[14px] leading-[17px]',
                    on
                      ? 'border-[#387440] bg-[#f5f9f5] font-semibold text-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]'
                      : 'border-[#e7e7e7] bg-white font-medium text-[#1c2a21]',
                    SOFT_FOCUS
                  )}
                >
                  {level.id}
                  <LevelDots filled={level.dots} size={7} />
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 flex min-w-0 flex-col gap-[10px] border-0 p-0">
          <legend className="sr-only">Category</legend>
          <Label hint="Pick one">Category</Label>
          <div role="group" aria-label="Category" className="flex flex-wrap gap-[8px]">
            {SKILL_CATEGORIES.map((cat) => (
              <SkChip
                key={cat}
                tone={draft.category === cat ? 'dark' : 'outline'}
                pressed={draft.category === cat}
                onClick={() => set({ category: cat })}
              >
                {cat}
              </SkChip>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-[8px]">
          <Label htmlFor={`${ids}-used`} hint="Optional" size={14}>
            Where you used it
          </Label>
          <input
            id={`${ids}-used`}
            type="text"
            value={draft.usedIn}
            onChange={(e) => set({ usedIn: e.target.value })}
            placeholder="Farmerline internship, KNUST final-year project"
            autoComplete="off"
            className={INPUT}
          />
        </div>

        {name ? (
          <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pl-[16px] pr-[14px]">
            <span className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a] text-white">
              <SkillsGameIcon className="size-[18px]" />
            </span>
            <div className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {`${name} can be verified in Skills Lab`}
              </span>
              <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
                After you save: 6 challenges, about 8 min, pass 5 to earn the Verified badge.
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={!name}
            rightIcon={<SkillsArrowRightIcon className="size-[20px]" />}
          >
            Add skill
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default AddSkillDialog;
