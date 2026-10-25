import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { ACTION_MENU } from '../data/programmesData.js';

const log = debug('ProgrammeActionsMenu');

/*
 * ProgrammeActionsMenu — the "⋯" menu of a programme card (Figma "Tags" 8610:403551 in 11.5.2j: 160 wide, white, 0.7px #e5e5e5, r12, p4, shadow 0 1.5 6;
 * three 49px rows 14/400 ls .24 — "Edit programme" #737373, "Duplicate" #737373, "Close programme" #902b20 — split by 1px #e5e5e5 rules).
 * ARIA menu pattern: focus enters the first item, ArrowUp / ArrowDown / Home / End move, Enter / Space choose, Esc and Tab close
 * (the card returns focus to its ⋯ button), a pointer-down outside closes.
 * Props: label (accessible name), onChoose(id), onClose(reason), className.
 */

const ProgrammeActionsMenu = ({ label, onChoose, onClose, className }) => {
  const rootRef = useRef(null);
  const items = useRef([]);

  useEffect(() => {
    log('open', label);
    items.current[0]?.focus();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        // the ⋯ button toggles by itself
        if (e.target.closest?.('[data-actions-button]')) return;
        onClose?.('outside');
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [label, onClose]);

  const onKeyDown = (e, i) => {
    const move = (to) => {
      e.preventDefault();
      items.current[(to + ACTION_MENU.length) % ACTION_MENU.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(i + 1);
    else if (e.key === 'ArrowUp') move(i - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(ACTION_MENU.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose?.('escape');
    } else if (e.key === 'Tab') onClose?.('tab');
  };

  return (
    <div
      ref={rootRef}
      role="menu"
      aria-label={label}
      className={classNames(
        'absolute top-[26px] right-[-4px] z-20 flex w-[160px] flex-col rounded-[12px] border-[0.7px] border-solid border-[#e5e5e5] bg-white py-[4px] font-sans shadow-[0_1.5px_6.1px_rgba(0,0,0,0.12)]',
        className
      )}
    >
      {ACTION_MENU.map((a, i) => (
        <div
          key={a.id}
          role="none"
          className={i > 0 ? 'border-0 border-t border-solid border-[#e5e5e5]' : ''}
        >
          <button
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            role="menuitem"
            tabIndex={i === 0 ? 0 : -1}
            onClick={() => onChoose(a.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={classNames(
              'flex min-h-[48px] w-full cursor-pointer items-center justify-center bg-transparent px-[16px] py-[12px] text-[14px] leading-[24px] font-normal tracking-[0.24px] hover:bg-[#f8f8f4] focus-visible:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
              a.danger ? 'text-[#902b20]' : 'text-[#737373]'
            )}
          >
            {a.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProgrammeActionsMenu;
