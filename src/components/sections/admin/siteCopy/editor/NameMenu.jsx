import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import EditorPopover from './EditorPopover.jsx';
import NameChipPill from './NameChipPill.jsx';
import { PRODUCT_NAME_CHIPS } from './sectionEditorData.js';

const log = debug('NameMenu');

/*
 * NameMenu — "Insert a product name" (frame 7.8.2f): 360 wide, r20, p10, gap 4; header "INSERT A PRODUCT NAME" 12/700 ls .48 #575755, one row
 * per product name (39 high, r10, the chip on the left and its role "Assistant · full name" 12.5/400 on the right; the active row #f8f8f4),
 * footer "Chips update by themselves when a name is renamed." 12.5/500 #2a5730. Arrow keys move, Enter / click inserts, Esc closes.
 * Props: pos, onPick(name), onClose.
 */
const NameMenu = ({ pos, onPick, onClose }) => {
  const [active, setActive] = useState(0);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = PRODUCT_NAME_CHIPS.length;
      const next = (active + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
      setActive(next);
      e.currentTarget.querySelectorAll('[role="menuitem"]')[next]?.focus();
    }
  };

  return (
    <EditorPopover
      label="Insert a product name"
      pos={pos}
      width={360}
      onClose={onClose}
      className="p-[10px]"
    >
      <div
        role="menu"
        aria-label="Product names"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-[4px]"
      >
        <p className="m-0 pt-[2px] pb-[2px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755]">
          INSERT A PRODUCT NAME
        </p>
        {PRODUCT_NAME_CHIPS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            role="menuitem"
            tabIndex={i === active ? 0 : -1}
            data-autofocus={i === 0 ? '' : undefined}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => {
              log('pick', c.name);
              onPick(c.name);
            }}
            className={classNames(
              'flex min-h-[39px] w-full cursor-pointer items-center justify-between gap-[10px] rounded-[10px] border-0 px-[10px] py-[9px] text-left focus-visible:outline-2 focus-visible:outline-[#387440]',
              i === active ? 'bg-[#f8f8f4]' : 'bg-transparent'
            )}
          >
            <NameChipPill name={c.name} />
            <span className="font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12px]">
              {c.note}
            </span>
          </button>
        ))}
        <p className="m-0 pt-[4px] font-sans text-[12.5px] leading-[15px] font-medium text-[#2a5730] max-lg:text-[12px]">
          Chips update by themselves when a name is renamed.
        </p>
      </div>
    </EditorPopover>
  );
};

export default NameMenu;
