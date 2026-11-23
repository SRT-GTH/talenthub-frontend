import { useState } from 'react';
import { FILTER_GROUPS, PAY } from './OpportunitiesData.js';
import { payLabel } from './opportunitiesFilter.js';
import { CheckGlyph } from './OpportunitiesIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FilterGroups');

const Label = ({ children }) => (
  <p className="m-0 font-sans text-[12px] font-bold leading-[14.32px] tracking-[1.2px] text-[#387440]">
    {children}
  </p>
);

/*
 * PAY range: the Figma 8px bar (track #eceee8, green→lime fill) made into a two-handle slider. Two native range inputs sit on the
 * bar (native = keyboard, screen readers and touch work, iOS included); only their thumbs take pointer events, so either can be
 * dragged. The URL is written when a drag ends (pointer up / key up / change), not on every pixel, so history and the listing stay calm.
 */
const PayRange = ({ value, onChange }) => {
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  if (synced[0] !== value[0] || synced[1] !== value[1]) {
    setSynced(value);
    setDraft(value);
  }
  const pct = (v) => ((v - PAY.min) / (PAY.max - PAY.min)) * 100;
  const commit = () => {
    if (draft[0] !== value[0] || draft[1] !== value[1]) {
      log('pay range', draft);
      onChange(draft);
    }
  };
  const thumb =
    'pointer-events-none absolute inset-0 m-0 h-5 w-full cursor-pointer appearance-none bg-transparent outline-none ' +
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#387440] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(28,42,33,0.3)] ' +
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#387440] [&::-moz-range-thumb]:bg-white ' +
    'focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-[#387440]';
  const handlers = { onPointerUp: commit, onKeyUp: commit, onTouchEnd: commit, onBlur: commit };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1.5 h-2 overflow-hidden rounded-[4px] bg-[#eceee8]">
          <div
            className="absolute h-full rounded-[4px] bg-[linear-gradient(90deg,#387440,#84cc16)]"
            style={{ left: `${pct(draft[0])}%`, right: `${100 - pct(draft[1])}%` }}
          />
        </div>
        <input
          type="range"
          aria-label="Minimum pay, GH₵ a month"
          min={PAY.min}
          max={PAY.max}
          step={PAY.step}
          value={draft[0]}
          onChange={(e) =>
            setDraft([Math.min(Number(e.target.value), draft[1] - PAY.step), draft[1]])
          }
          className={thumb}
          {...handlers}
        />
        <input
          type="range"
          aria-label="Maximum pay, GH₵ a month"
          min={PAY.min}
          max={PAY.max}
          step={PAY.step}
          value={draft[1]}
          onChange={(e) =>
            setDraft([draft[0], Math.max(Number(e.target.value), draft[0] + PAY.step)])
          }
          className={thumb}
          {...handlers}
        />
      </div>
      <p className="m-0 font-sans text-[13px] font-semibold leading-[15.5px] text-[#595959]">
        {payLabel(draft, PAY.max)}
      </p>
    </div>
  );
};

/*
 * The filter groups shared by the desktop sidebar (Figma 7797:28545) and the mobile/tablet sheet (7815:306510):
 * LEVEL / WORK STYLE / REGION checkbox groups (24px rhythm, 20px tiles r6) and the PAY range slider.
 */
const FilterGroups = ({ state, update }) => {
  const toggle = (key, id) => {
    const current = state[key];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    log('toggle', { key, id, next });
    update({ [key]: next });
  };

  return (
    <div className="flex flex-col gap-6">
      {FILTER_GROUPS.map((group) => (
        <div key={group.key} role="group" aria-label={group.label} className="flex flex-col gap-6">
          <Label>{group.label}</Label>
          {group.options.map((opt) => {
            const checked = state[group.key].includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(group.key, opt.id)}
                className="flex w-fit cursor-pointer items-center gap-[10px] border-0 bg-transparent p-0 text-left"
              >
                <span
                  className={classNames(
                    'flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px]',
                    checked
                      ? 'border-[#387440] bg-[#387440] text-white'
                      : 'border-[#8a8a8a] bg-white'
                  )}
                >
                  {checked ? (
                    <span className="size-3">
                      <CheckGlyph />
                    </span>
                  ) : null}
                </span>
                <span className="font-sans text-[15px] font-medium leading-[17.9px] text-[#1c2a21]">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex flex-col gap-6">
        <Label>{PAY.label}</Label>
        <PayRange value={state.pay} onChange={(pay) => update({ pay: pay.join('-') })} />
      </div>
    </div>
  );
};

export default FilterGroups;
