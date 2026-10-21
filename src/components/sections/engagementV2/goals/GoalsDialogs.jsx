import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { ArrowRightIcon, ChevronDownIcon } from '../../../shared/assets.jsx';
import { debug } from '../../../../utils/debug.js';
import {
  CONFETTI,
  GOAL_INDUSTRIES,
  GOAL_PLACES,
  GOAL_TIMELINES,
  GOAL_TYPES,
  NOTES_MAX,
  STAGE_COMPLETE_STATS,
  UNLOCKS,
  goalHeading,
  goalPreviewLine,
} from './goalsData.js';
import { CARD_BASE, EYEBROW, FOCUS_RING, HEADING_FONT, LINE_SHADOW } from './goalsStyles.js';
import { DoodleStar, IconTile, Sticker } from './GoalsParts.jsx';
import * as Icons from './goalsIcons.jsx';

const log = debug('GoalsDialogs');

/*
 * DialogShell: scrim (#0b1a0f @ 55%) + centred white card r28. role="dialog" aria-modal labelled; focus moves in, is trapped
 * and restored, Esc and scrim click close, the backdrop is inert (usePlayfulDialogA11y).
 */
const DialogShell = ({
  onClose,
  labelledBy,
  widthClass,
  cardClassName = '',
  closeSize = 40,
  closeClassName = '',
  children,
}) => {
  const cardRef = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef: cardRef, onEscape: onClose, lockScroll: true });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-[rgba(11,26,15,0.55)]"
        onClick={onClose}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative my-auto w-full rounded-[28px] outline-none ${widthClass} ${CARD_BASE} ${cardClassName}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{ width: closeSize, height: closeSize }}
          className={`absolute z-10 grid min-h-[24px] min-w-[24px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440] ${FOCUS_RING} ${closeClassName}`}
        >
          <Icons.CloseIcon className="size-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

/* Header chip (32px pill) used above the dialog titles. */
const HeaderChip = ({ children, tone = 'green' }) => (
  <span
    className={`inline-flex h-8 w-fit items-center rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:text-[12px] ${
      tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]'
    }`}
  >
    {children}
  </span>
);

const FIELD_BOX =
  'flex h-[51px] w-full items-center rounded-[10px] border border-solid border-[#cccccc] bg-white py-[13px] pl-5 pr-4 shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)] focus-within:border-[#387440]';
const INVALID = 'border-[#c0392b]!';

const FieldLabel = ({ htmlFor, children, required, aside }) => (
  <div className="flex items-center justify-between gap-2">
    <label
      htmlFor={htmlFor}
      className="flex items-center font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]"
    >
      {children}
      {required ? (
        <span className="ml-px font-[family-name:var(--font-ui)] text-[14px] font-semibold leading-[21px] text-[#2e8b57]">
          *
        </span>
      ) : null}
    </label>
    {aside}
  </div>
);

const SelectField = ({ id, label, value, options, placeholder, onChange, invalid }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <FieldLabel htmlFor={id} required>
      {label}
    </FieldLabel>
    <div className={`relative ${FIELD_BOX} ${invalid ? INVALID : ''}`}>
      <select
        id={id}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`absolute inset-0 size-full cursor-pointer appearance-none rounded-[10px] border-0 bg-transparent py-0 pl-5 pr-11 font-sans text-[14px] font-medium tracking-[0.2px] outline-none ${
          value ? 'text-[#1c2a21]' : 'text-[#1c2a21]'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-1/2 right-4 grid size-5 -translate-y-1/2 place-items-center text-[#387440]">
        <ChevronDownIcon className="size-5" />
      </span>
    </div>
  </div>
);

const digits = (s) => {
  const n = String(s).replace(/[^\d]/g, '');
  return n ? Number(n) : null;
};
const fmtPay = (n) => (n ? `GH₵ ${Number(n).toLocaleString('en-US')}` : '');

const PayField = ({ id, label, value, onChange }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <div className={FIELD_BOX}>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        placeholder="GH₵"
        value={fmtPay(value)}
        onChange={(e) => onChange(digits(e.target.value))}
        className="w-full min-w-0 border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] outline-none placeholder:text-[#595959]"
      />
    </div>
  </div>
);

/*
 * GoalFormDialog (GO-03 add / GO-04 edit; Figma "Modal · Add a goal" 8285:19644 / "Modal · Edit goal" 8285:19905):
 * role + type, industry + when, WHERE chips, private pay range, notes (200), primary checkbox, actions.
 * Props: goal (draft, EMPTY_GOAL for add), mode 'add' | 'edit', isPrimary, onSave(goal, makePrimary), onDelete, onClose.
 */
export const GoalFormDialog = ({ goal, mode, isPrimary, onSave, onDelete, onClose }) => {
  const uid = useId();
  const [draft, setDraft] = useState(goal);
  const [primary, setPrimary] = useState(isPrimary);
  const [tried, setTried] = useState(false);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const edit = mode === 'edit';
  const missing = {
    title: !draft.title.trim(),
    type: !draft.type,
    industry: !draft.industry,
    when: !draft.when,
  };
  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    const first = Object.keys(missing).find((k) => missing[k]);
    if (first) {
      log('save blocked, missing:', first);
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    log('save', { mode, title: draft.title, primary });
    onSave({ ...draft, title: draft.title.trim() }, primary);
  };
  const withCurrent = (opts, v) => (v && !opts.includes(v) ? [...opts, v] : opts);

  return (
    <DialogShell
      onClose={onClose}
      labelledBy={`${uid}-title`}
      widthClass="max-w-[820px]"
      cardClassName="px-5 pt-9 pb-8 sm:px-10"
      closeClassName="top-6 right-6 sm:top-6 sm:right-6"
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pr-10">
          <HeaderChip>{edit ? 'Edit goal' : 'Add a goal'}</HeaderChip>
          <h2
            id={`${uid}-title`}
            className={`m-0 text-[clamp(24px,1.85vw,32px)] font-semibold leading-[1.19] text-[#111] ${HEADING_FONT}`}
          >
            {edit ? (
              <>
                <span className="text-[#1c2a21]">
                  {goal.title}
                  {goal.industry ? ' · ' : ''}
                </span>
                <span className="text-[#387440]">{goal.industry}</span>
              </>
            ) : (
              <>
                <span className="text-[#1c2a21]">New goal. </span>
                <span className="text-[#387440]">Where do you want to go?</span>
              </>
            )}
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {edit
              ? 'Your primary goal. Changes update your matches within a few minutes.'
              : 'One clear goal at a time, so recruiters know if you fit before they reach out.'}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4">
          <div className="flex min-w-0 flex-col gap-2">
            <FieldLabel htmlFor={`${uid}-title-input`} required>
              Role or opportunity
            </FieldLabel>
            <div className={`${FIELD_BOX} ${tried && missing.title ? INVALID : ''}`}>
              <input
                id={`${uid}-title-input`}
                value={draft.title}
                aria-invalid={(tried && missing.title) || undefined}
                placeholder="e.g. Software Engineer, Product Designer, MSc"
                onChange={(e) => set({ title: e.target.value })}
                className="w-full min-w-0 border-0 bg-transparent p-0 font-sans text-[14px] font-medium leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#595959]"
              />
            </div>
          </div>
          <SelectField
            id={`${uid}-type`}
            label="Opportunity type"
            value={draft.type}
            options={withCurrent(GOAL_TYPES, draft.type)}
            placeholder="Select a type"
            invalid={tried && missing.type}
            onChange={(v) => set({ type: v })}
          />
          <SelectField
            id={`${uid}-industry`}
            label="Industry"
            value={draft.industry}
            options={withCurrent(GOAL_INDUSTRIES, draft.industry)}
            placeholder="Select an industry"
            invalid={tried && missing.industry}
            onChange={(v) => set({ industry: v })}
          />
          <SelectField
            id={`${uid}-when`}
            label="When"
            value={draft.when}
            options={withCurrent(GOAL_TIMELINES, draft.when)}
            placeholder="Select a timeline"
            invalid={tried && missing.when}
            onChange={(v) => set({ when: v })}
          />
        </div>

        <div className="flex flex-col gap-[14px]">
          <p className={`${EYEBROW} text-[#595959]`}>WHERE</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Where">
            {GOAL_PLACES.map((p) => {
              const on = draft.where === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ where: on ? '' : p })}
                  className={`inline-flex h-8 min-h-[24px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:text-[12px] ${FOCUS_RING} ${
                    on
                      ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white'
                      : 'border-[#e1eae2] bg-white text-[#595959]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-[14px]">
          <p className={`${EYEBROW} text-[#595959]`}>PAY RANGE PER MONTH (PRIVATE)</p>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4">
            <PayField
              id={`${uid}-min`}
              label="Minimum"
              value={draft.min}
              onChange={(v) => set({ min: v })}
            />
            <PayField
              id={`${uid}-max`}
              label="Maximum"
              value={draft.max}
              onChange={(v) => set({ max: v })}
            />
          </div>
        </div>

        {edit ? null : (
          <div className="flex items-center gap-2 rounded-[12px] bg-[#f7f8f4] px-[14px] py-[10px]">
            <span className="grid size-[15px] shrink-0 text-[15px] text-[#387440]">
              <Icons.LockIcon className="size-full" />
            </span>
            <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-lg:text-[12px]">
              Recruiters never see your pay range. We only use it to filter out roles that won’t
              fit.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <FieldLabel
            htmlFor={`${uid}-notes`}
            aside={
              <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959] max-lg:text-[12px]">
                {draft.notes ? `${draft.notes.length} / ${NOTES_MAX}` : 'Optional'}
              </span>
            }
          >
            Anything else?
          </FieldLabel>
          <div className="flex min-h-[72px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white pt-[14px] pr-4 pb-[13px] pl-5 shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)] focus-within:border-[#387440]">
            <textarea
              id={`${uid}-notes`}
              rows={2}
              maxLength={NOTES_MAX}
              value={draft.notes}
              placeholder="e.g. Preferably a startup, open to night shifts…"
              onChange={(e) => set({ notes: e.target.value })}
              className="min-h-[44px] w-full resize-none border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] outline-none placeholder:text-[#595959]"
            />
          </div>
        </div>

        <label
          className={`flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 ${
            primary ? `rounded-[14px] bg-[#ebf1ec] px-[14px] py-3 ${LINE_SHADOW}` : ''
          }`}
        >
          <input
            type="checkbox"
            checked={primary}
            onChange={(e) => {
              log('primary toggled', e.target.checked);
              setPrimary(e.target.checked);
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={`grid size-5 shrink-0 place-items-center rounded-[6px] border-solid text-[16px] text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green ${
              primary
                ? 'border border-[#387440] bg-[#387440] playful:border-2'
                : 'border-2 border-[#babab7] bg-white'
            }`}
          >
            {primary ? <Icons.CheckIcon className="size-4" /> : null}
          </span>
          <span className="font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
            {primary ? 'This is my primary goal' : 'Make this my primary goal'}
          </span>
          {primary ? (
            <span className="ml-auto font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
              It drives your headline match
            </span>
          ) : null}
        </label>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {edit ? (
            <button
              type="button"
              onClick={onDelete}
              className={`mr-auto inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#902b20] ${FOCUS_RING}`}
            >
              <span className="grid size-4 text-[#387440]">
                <Icons.TrashIcon className="size-full" />
              </span>
              Delete this goal
            </button>
          ) : null}
          <Button variant="tertiary-subtle" size="lg" className="py-[14px]!" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md" rightIcon={<ArrowRightIcon />}>
            {edit ? 'Save changes' : 'Save goal'}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
};

/*
 * DeleteGoalDialog (GO-05, Figma "Modal · Delete goal" 8285:20171): preview of the goal, what happens, "Edit instead".
 * Props: goal, isPrimary, nextPrimary (goal that becomes primary), onEditInstead, onDelete, onClose.
 */
export const DeleteGoalDialog = ({
  goal,
  isPrimary,
  nextPrimary,
  onEditInstead,
  onDelete,
  onClose,
}) => {
  const uid = useId();
  const effects = [
    'Matches based on this goal stop straight away',
    ...(isPrimary && nextPrimary ? [`${nextPrimary.title} becomes your primary goal`] : []),
    'Your private pay range for it is deleted',
  ];
  return (
    <DialogShell
      onClose={onClose}
      labelledBy={`${uid}-title`}
      widthClass="max-w-[620px]"
      cardClassName="px-5 pt-9 pb-8 sm:px-10"
      closeClassName="top-6 right-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pr-10">
          <HeaderChip tone="plain">Delete goal</HeaderChip>
          <h2
            id={`${uid}-title`}
            className={`m-0 text-[clamp(24px,1.85vw,32px)] font-semibold leading-[1.19] text-[#111] ${HEADING_FONT}`}
          >
            <span className="text-[#1c2a21]">Delete this </span>
            <span className="text-[#387440]">goal?</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            It disappears from your profile straight away. This can’t be undone.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-4 pl-[14px]">
          <IconTile
            icon="Target"
            tileClass="size-10 rounded-[12px] bg-[#ebf1ec]"
            iconClass="size-5 text-[#387440]"
          />
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
              {goalHeading(goal)}
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
              {goalPreviewLine(goal, isPrimary)}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${EYEBROW} text-[#595959]`}>WHAT HAPPENS</p>
          {effects.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#c0392b]" />
              <span className="font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
                {t}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-4 pl-[14px]">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-[#c8951a] text-[17px] text-white">
            <Icons.EditIcon className="size-[1em]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
              Just need to fix something?
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
              Changed your mind on timing, pay or place? Edit the goal and keep your matches.
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="py-[14px]!"
            onClick={onEditInstead}
          >
            Edit instead
          </Button>
          <Button variant="danger" size="md" className="border-[#2a5730]!" onClick={onDelete}>
            Delete goal
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};

const Stat = ({ value, label, tone }) => (
  <div
    className={`flex min-w-0 flex-1 flex-col items-center gap-[2px] rounded-[16px] px-2 py-3 ${tone.bg} ${LINE_SHADOW}`}
  >
    <span className={`text-[23px] font-semibold leading-[29px] ${HEADING_FONT} ${tone.fg}`}>
      {value}
    </span>
    <span className="font-sans text-[10px] font-semibold uppercase leading-[12px] tracking-[1px] text-[#595959] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

/*
 * StageCompleteDialog (GO-06, Figma "Modal · Stage complete" 8285:20420): confetti art, target medallion, Playful "STAGE 8 DONE"
 * sticker + star, heading, summary, three stats, unlocks, Stay here / Next: Pitch.
 * Props: goals, uiStyle, onClose (Stay here / close / Esc), onNext.
 */
export const StageCompleteDialog = ({ goals, uiStyle, onClose, onNext }) => {
  const uid = useId();
  const xp = uiStyle === 'playful' ? 'XP' : 'pts';
  return (
    <DialogShell
      onClose={onClose}
      labelledBy={`${uid}-title`}
      widthClass="max-w-[560px]"
      cardClassName="overflow-hidden pb-7"
      closeSize={36}
      closeClassName="top-[19px] right-5"
    >
      <div className="relative h-[176px] bg-[radial-gradient(ellipse_at_center,#e1eae2_0%,#fff_100%)]">
        {CONFETTI.map(([x, y, r, c, o], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute hidden h-[10px] w-[6px] rounded-[2px] min-[560px]:block"
            style={{
              left: `calc(50% + ${x}px)`,
              top: y - 5,
              transform: `translateX(-3px) rotate(${r}deg)`,
              background: c,
              opacity: o,
            }}
          />
        ))}
        <span
          className={`absolute top-[40px] left-1/2 grid size-[100px] -translate-x-1/2 place-items-center rounded-full bg-[#387440] text-[44px] text-white ${LINE_SHADOW}`}
        >
          <Icons.TargetIcon className="size-[1em]" />
        </span>
        <Sticker className="absolute top-[19px] left-[calc(50%+20px)] rotate-[-8deg]">
          STAGE 8 DONE
        </Sticker>
        <DoodleStar
          sizePx={18}
          className="absolute top-[51px] left-[calc(50%-110px)] hidden text-[#ffd86b] playful:block"
        />
      </div>
      <div className="flex flex-col gap-[18px] px-5 sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className={`${EYEBROW} text-[#387440]`}>STAGE 8 OF 9 COMPLETE</p>
          <h2
            id={`${uid}-title`}
            className={`m-0 text-[clamp(26px,2.03vw,35px)] font-semibold leading-[1.19] text-[#111] ${HEADING_FONT}`}
          >
            <span className="text-[#1c2a21]">Aim set. </span>
            <span className="text-[#387440]">One stage to go.</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {goals.length} {goals.length === 1 ? 'goal' : 'goals'} with{' '}
            {goals[0] ? goalHeading(goals[0]) : ''} as your primary. Recruiters now match you by
            role, industry, place and timing.
          </p>
        </div>
        <div className="flex gap-[10px]">
          <Stat
            value={STAGE_COMPLETE_STATS.done}
            label="Stages done"
            tone={{ bg: 'bg-[#f7f8f4]', fg: 'text-[#1c2a21]' }}
          />
          <Stat
            value={STAGE_COMPLETE_STATS.profile}
            label="Profile"
            tone={{ bg: 'bg-[#e8f2ed]', fg: 'text-[#165d3a]' }}
          />
          <Stat
            value={`+${STAGE_COMPLETE_STATS.earned} ${xp}`}
            label="Earned"
            tone={{ bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className={`${EYEBROW} text-[#595959]`}>WHAT YOU JUST UNLOCKED</p>
          {UNLOCKS.map((u) => (
            <div key={u.title} className="flex items-center gap-[14px] py-[10px]">
              <IconTile
                icon={u.icon}
                tileClass="size-[38px] rounded-[12px] bg-[#ebf1ec]"
                iconClass="size-6 text-[#387440]"
              />
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                  {u.title}
                </span>
                <span className="font-sans text-[13px] leading-[18px] text-[#595959] max-lg:text-[12px]">
                  {u.text}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="min-w-[140px] flex-1"
            onClick={onClose}
          >
            Stay here
          </Button>
          <Button
            size="lg"
            className="min-w-[160px] flex-1"
            rightIcon={<ArrowRightIcon />}
            onClick={onNext}
          >
            Next: Pitch
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};
