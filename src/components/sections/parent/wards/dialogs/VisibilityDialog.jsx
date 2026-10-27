import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import spotPrivacy from '../../../../../assets/parent/spot-privacy.svg';
import radioOn from '../../../../../assets/parent/radio-on.svg';
import radioOff from '../../../../../assets/parent/radio-off.svg';
import { DEFAULT_VISIBILITY, visibilityCopy } from './data/dialogsData.js';

const log = debug('VisibilityDialog');

/*
 * VisibilityDialog — PW-14 "Who can find Abena" (Figma 10049:2185, modal 10049:2547): 580 wide, r24, p28, gap16, 1px ink-10 border, 24/48 shadow, scrim ink at 55 %. Spot · Privacy 80 + close 36 (#f8f8f4, r18),
 * 24/600 title, 14/1.45 body, two radio cards (selected = #ebf1ec + 1px #387440, other = 1px #e7e7e7), Cancel + Save (ParentButton).
 * Props: ward { id, firstName, name, pronoun }, initial (current value, default 'partners'), onClose, onSave(value 'partners' | 'hidden').
 * Behaviour: options are a radiogroup (click / arrow keys); Save calls onSave(value); Cancel, the X, the scrim and Esc call onClose (AgencyDialog).
 * ⚠️ ASSUMPTION: Save does not close the dialog itself - the page closes it and shows the PW-14b toast.
 */
const VisibilityDialog = ({ ward, initial = DEFAULT_VISIBILITY, onClose, onSave }) => {
  const copy = visibilityCopy(ward);
  const [value, setValue] = useState(initial);
  log('render', { ward: ward?.id, value });

  const choose = (v) => {
    log('select', v);
    setValue(v);
  };
  const onKey = (e) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = copy.options.findIndex((o) => o.value === value);
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    const next = copy.options[(i + step + copy.options.length) % copy.options.length];
    choose(next.value);
    e.currentTarget.parentElement?.querySelector(`[data-value="${next.value}"]`)?.focus();
  };

  return (
    <DialogCard
      label={copy.title}
      onClose={onClose}
      width={580}
      gap={16}
      focusCard={false}
      className="items-start"
    >
      <div className="flex w-full items-start justify-between">
        <img src={spotPrivacy} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <DialogCloseButton
          onClose={() => {
            log('close');
            onClose?.();
          }}
        />
      </div>
      <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
        {copy.title}
      </h2>
      <p className="m-0 w-full text-[14px] leading-[1.45] font-normal text-[#575755]">
        {copy.body}
      </p>
      <div role="radiogroup" aria-label={copy.title} className="flex w-full flex-col gap-[16px]">
        {copy.options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              data-value={o.value}
              tabIndex={on ? 0 : -1}
              onClick={() => choose(o.value)}
              onKeyDown={onKey}
              className={`flex w-full cursor-pointer items-center gap-[12px] overflow-clip rounded-[14px] border border-solid p-[16px] text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${
                on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e7e7e7] bg-transparent'
              }`}
            >
              <img
                src={on ? radioOn : radioOff}
                alt=""
                aria-hidden="true"
                className="size-[18px] shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[normal]">
                <span className="text-[14px] font-semibold text-[#1c2a21]">{o.label}</span>
                <span className="text-[12px] font-normal text-[#575755]">{o.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex w-full items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {copy.cancel}
        </ParentButton>
        <ParentButton
          onClick={() => {
            log('save', value);
            onSave?.(value);
          }}
        >
          {copy.save}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default VisibilityDialog;
