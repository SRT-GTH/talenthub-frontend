import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleCheckIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import CircleDialogShell from './CircleDialogShell.jsx';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleEndorseDialog — NW-07 "Endorse {first}'s skills": a checklist of their skills ("12 so far"), "How do you know his skills?"
 * (one chip), Cancel / "Endorse N skills". Props: person, dialog (profile.endorseDialog copy), skills (profile skills),
 * initial (ticked skill ids), onEndorse(skillIds, way), onClose, xp (draw the XP sticker; off in live: no XP for endorsing, ADR-04),
 * busy (disables Endorse while sending). Endorse is disabled until one skill is ticked.
 * ⚠️ ASSUMPTION: clicking a skill's own Endorse button opens this dialog with only that skill ticked.
 */
const CircleEndorseDialog = ({
  person,
  dialog,
  skills,
  initial,
  onEndorse,
  onClose,
  xp = true,
  busy = false,
}) => {
  const [ticked, setTicked] = useState(initial ?? []);
  const [way, setWay] = useState(dialog.ways[0]);
  const toggle = (id) =>
    setTicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  const n = ticked.length;
  return (
    <CircleDialogShell
      personId={person.id}
      title={dialog.title}
      subtitle={dialog.subtitle}
      titleId="circle-endorse-title"
      width={560}
      sticker={
        xp ? { text: COPY.xpBoth, className: 'top-[15px] right-[95px] max-sm:hidden' } : undefined
      }
      onClose={onClose}
    >
      <div role="group" aria-label={dialog.title} className="flex flex-col gap-[16px]">
        {skills.map((skill) => {
          const on = ticked.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              aria-label={`${skill.label}, ${skill.count} so far`}
              onClick={() => toggle(skill.id)}
              className={classNames(
                'flex cursor-pointer items-center gap-[12px] rounded-[12px] border-solid px-[14px] py-[12px] text-left',
                on
                  ? 'border-[1.5px] border-[#387440] bg-[#ebf1ec]'
                  : 'border border-[#e7e7e7] bg-white',
                FOCUS_RING
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'flex size-[22px] shrink-0 items-center justify-center rounded-[6px]',
                  on ? 'bg-[#387440]' : 'border border-solid border-[#c1d4c4] bg-white'
                )}
              >
                {on && <CircleCheckIcon className="size-[14px] text-white" />}
              </span>
              <span className="min-w-0 flex-1 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {skill.label}
              </span>
              {/* Count as generated content so the label and the count are one control (responsive-audit "labels wrap") */}
              <span
                aria-hidden="true"
                data-count={`${skill.count} so far`}
                className="shrink-0 font-sans text-[12px] leading-[14px] whitespace-nowrap text-[#737373] after:content-[attr(data-count)]"
              />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-[10px]">
        <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[14px]">
          {dialog.howLabel}
        </span>
        <div role="radiogroup" aria-label={dialog.howLabel} className="flex flex-wrap gap-[8px]">
          {dialog.ways.map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={way === item}
              onClick={() => setWay(item)}
              className={classNames(
                'inline-flex h-[22px] cursor-pointer items-center whitespace-nowrap rounded-full border-0 px-[10px] font-sans text-[12px] font-semibold leading-[14px] max-lg:h-[28px]',
                way === item ? 'bg-[#1c2a21] text-white' : 'bg-[#f8f8f4] text-[#595959]',
                'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
                FOCUS_RING
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <CircleButton tone="soft" onClick={onClose}>
          {COPY.cancel}
        </CircleButton>
        <CircleButton disabled={n === 0 || busy} onClick={() => onEndorse(ticked, way)}>
          {`Endorse ${n} ${n === 1 ? 'skill' : 'skills'}`}
        </CircleButton>
      </div>
    </CircleDialogShell>
  );
};

export default CircleEndorseDialog;
