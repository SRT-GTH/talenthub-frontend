import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import {
  EXAMPLE_GOAL,
  HOW_IT_WORKS,
  goalHeading,
  goalMeta,
  goalTileIcon,
  goalTypeChip,
  payLabel,
} from './goalsData.js';
import { CARD, CHIP_LINE, FOCUS_RING, HEADING_FONT } from './goalsStyles.js';
import { Glyph, IconTile, SectionLabel, Sticker, TagChip } from './GoalsParts.jsx';
import * as Icons from './goalsIcons.jsx';

/* ---------- one goal card (Figma "Entry · …": 1072 wide, r20, 52px tile, meta row, note, tags, edit button) ---------- */
const MetaRow = ({ items }) => (
  <div className="flex flex-wrap gap-x-3 gap-y-1">
    {items.map((m) => (
      <span
        key={m.text}
        className="inline-flex items-center gap-[5px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-lg:text-[12px]"
      >
        <span className="grid size-[14px] shrink-0">
          <Glyph name={m.icon} />
        </span>
        {m.text}
      </span>
    ))}
  </div>
);

/*
 * GoalCard props: goal, primary (first in the list), onEdit, dragProps (HTML5 drag handlers) / onMove(dir) (keyboard),
 * example (the "Example" card of the empty state: no handle / edit button, yellow "Example" chip).
 */
export const GoalCard = ({ goal, primary = false, onEdit, dragProps, onMove, example = false }) => {
  const meta = example ? EXAMPLE_GOAL.meta : goalMeta(goal);
  const heading = example ? EXAMPLE_GOAL.title : goalHeading(goal);
  const notes = example ? EXAMPLE_GOAL.notes : goal.notes;
  const pay = example ? EXAMPLE_GOAL.pay : payLabel(goal);
  const typeChip = example ? null : primary ? 'Primary' : goalTypeChip(goal);
  const solidTile = !example && primary;
  return (
    <article
      {...(example ? {} : dragProps)}
      className={`relative flex items-start gap-4 py-5 pr-5 pl-[18px] ${CARD} rounded-[20px]`}
      data-testid={example ? 'goal-example' : 'goal-card'}
    >
      {example ? null : (
        <button
          type="button"
          aria-label={`Reorder ${heading}`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              onMove?.(-1);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              onMove?.(1);
            }
          }}
          className={`grid size-[18px] min-h-[24px] min-w-[24px] shrink-0 cursor-grab place-items-center border-0 bg-transparent p-0 text-[18px] text-[#babab7] ${FOCUS_RING}`}
        >
          <Icons.DragIcon className="size-[18px]" />
        </button>
      )}
      <span
        className={`grid size-[52px] shrink-0 place-items-center rounded-[14px] ${
          solidTile
            ? `bg-[#387440] ${CHIP_LINE} shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)]`
            : 'bg-[#ebf1ec]'
        }`}
      >
        <span className={`grid size-[24px] ${solidTile ? 'text-white' : 'text-[#387440]'}`}>
          <Glyph name={example ? 'Target' : goalTileIcon(goal)} />
        </span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h3 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
            {heading}
          </h3>
          {example ? (
            <span
              className={`rounded-full bg-[#ffd86b] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21] max-lg:text-[12px] border border-solid border-[rgba(28,42,33,0.12)] playful:border-[#1c2a21]`}
            >
              Example
            </span>
          ) : typeChip ? (
            <span
              className={`rounded-full px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] max-lg:text-[12px] ${
                primary
                  ? 'border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] text-[#1c2a21] playful:border-[#1c2a21]'
                  : `bg-[#ebf1ec] text-[#387440] ${CHIP_LINE}`
              }`}
            >
              {typeChip}
            </span>
          ) : null}
        </div>
        <MetaRow items={meta} />
        {notes ? (
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">{notes}</p>
        ) : null}
        {pay ? (
          <div className="flex flex-wrap items-center gap-[6px]">
            {example ? null : (
              <span className="inline-flex h-8 items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[12px]">
                Private
              </span>
            )}
            <TagChip className="text-[12px] leading-[14px]">{pay}</TagChip>
          </div>
        ) : null}
      </div>
      {example ? null : (
        <button
          type="button"
          aria-label={`Edit ${heading}`}
          onClick={onEdit}
          className={`grid size-[38px] min-h-[24px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] ${FOCUS_RING}`}
        >
          <Icons.EditIcon className="size-4" />
        </button>
      )}
      {primary && !example ? (
        <Sticker className="absolute -top-[19px] right-[68px] rotate-[-4deg]">#1 PRIORITY</Sticker>
      ) : null}
    </article>
  );
};

/* ---------- GO-01: empty state + "how it works" + example ---------- */
export const GoalsEmpty = ({ onAdd, onSkip }) => (
  <>
    <section
      className={`flex flex-col items-center gap-4 px-5 pt-9 pb-9 text-center sm:px-12 sm:pt-11 ${CARD}`}
    >
      <div className="flex items-center justify-center" aria-hidden="true">
        <span className="grid size-16 place-items-center rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] text-[28px] text-[#387440] shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)] mt-2 playful:size-[72px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:text-[32px]">
          <Icons.CompassIcon className="size-[1em]" />
        </span>
        <span className="relative z-[1] -mx-[14px] grid size-20 place-items-center rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#c8951a] text-[36px] text-white shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]">
          <Icons.TargetIcon className="size-[1em]" />
        </span>
        <span className="grid size-16 place-items-center rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] text-[28px] text-[#387440] shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)] mt-2 playful:size-[72px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:text-[32px]">
          <Icons.FlagIcon className="size-[1em]" />
        </span>
      </div>
      <h2
        className={`m-0 text-[clamp(24px,1.85vw,32px)] font-semibold leading-[1.19] text-[#111] ${HEADING_FONT}`}
      >
        <span className="text-[#1c2a21]">No goals yet. </span>
        <span className="text-[#387440]">What’s next for you?</span>
      </h2>
      <p className="m-0 max-w-[640px] font-sans text-[16px] leading-[24px] text-[#595959]">
        Even one goal with a role, a place and a timeline makes your matches sharper straight away.
      </p>
      <Button size="md" rightIcon={<ArrowRightIcon />} onClick={onAdd}>
        Add your first goal
      </Button>
      <button
        type="button"
        onClick={onSkip}
        className={`min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#595959] ${FOCUS_RING}`}
      >
        Not sure yet? Skip this stage
      </button>
      <div className="mt-1 grid w-full max-w-[974px] gap-4 border-t border-solid border-[#e7e7e7] pt-[22px] text-left md:grid-cols-3">
        {HOW_IT_WORKS.map((s) => (
          <div key={s.title} className="flex items-start gap-3">
            <IconTile
              icon={s.icon}
              tileClass="size-9 rounded-[10px] bg-[#ebf1ec]"
              iconClass="size-[18px] text-[#387440]"
            />
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                {s.title}
              </span>
              <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
                {s.text}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
    <SectionLabel>WHAT A COMPLETE GOAL LOOKS LIKE</SectionLabel>
    <GoalCard example />
  </>
);

/* ---------- GO-02: the list ---------- */
export const GoalsList = ({ goals, onEdit, onAdd, onReorder, onMoveBy }) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h2
          className={`m-0 text-[clamp(24px,1.68vw,29px)] font-semibold leading-[1.207] text-[#1c2a21] ${HEADING_FONT}`}
        >
          Your goals
        </h2>
        <span
          className={`rounded-full bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] text-[#595959] ${CHIP_LINE}`}
        >
          {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
        </span>
        <span className="ml-auto inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-lg:text-[12px]">
          <Icons.DragIcon className="size-[14px]" />
          Drag to set priority
        </span>
      </div>
      {goals.map((g, i) => (
        <GoalCard
          key={g.id}
          goal={g}
          primary={i === 0}
          onEdit={() => onEdit(g.id)}
          onMove={(dir) => onMoveBy(g.id, dir)}
          dragProps={{
            draggable: true,
            onDragStart: (e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', g.id);
            },
            onDragOver: (e) => e.preventDefault(),
            onDrop: (e) => {
              e.preventDefault();
              const from = e.dataTransfer.getData('text/plain');
              if (from && from !== g.id) onReorder(from, g.id);
            },
          }}
        />
      ))}
      <button
        type="button"
        onClick={onAdd}
        className={`flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-[20px] border border-solid border-[#387440] bg-[#ebf1ec] p-5 font-sans text-[15px] font-semibold leading-[18px] text-[#387440] playful:border-[1.5px] ${FOCUS_RING}`}
      >
        <Icons.PlusIcon className="size-[18px]" />
        Add another goal
      </button>
    </>
  );
};
