import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AgencyChevronDownIcon, AgencyLockIcon } from '../agencyIcons.jsx';
import { DemandCheckIcon } from './demandIcons.jsx';

const log = debug('DemandViewByMenu');

/*
 * DemandViewByMenu — the "View by <Education level> ▾" button of Success by profile group and its list (Figma 8706:419788, 11.4.5l: white r14 border #e7e7e7 shadow, p 8,
 * "VIEW BY" 11/13 600 #575755 caps, items 14/17 500 with an optional 12/14 note #575755, the chosen one on #ebf1ec with a check, "Disability status" locked: #575755 text,
 * "Not in your MoU · request access" 12/14 #387440 and the lock). Package B's national/ViewByMenu has no notes or locked row, so this is the success variant
 * (see the report: REQUESTS). Menu pattern: Enter / Space / ArrowDown open, ArrowUp/Down + Home/End move, Enter picks, Esc closes and returns focus, Tab closes.
 * Props: options [{ id, label, note, locked }], value, open, onOpenChange(bool), onSelect(id) (must also close the menu).
 */

const DemandViewByMenu = ({ options, value, open, onOpenChange, onSelect }) => {
  const uid = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const current = options.find((o) => o.id === value) ?? options[1];

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    const idx = Math.max(
      0,
      options.findIndex((o) => o.id === current.id)
    );
    itemRefs.current[idx]?.focus();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenChange(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, options, current.id, onOpenChange]);

  const onKey = (e) => {
    const items = itemRefs.current.filter(Boolean);
    const i = items.findIndex((el) => el === document.activeElement);
    const go = (n) => {
      e.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
      buttonRef.current?.focus();
    } else if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Tab') onOpenChange(false);
  };

  return (
    <div ref={rootRef} className="relative min-w-0 font-sans">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? uid : undefined}
        aria-label={`View by: ${current.label}`}
        onClick={() => onOpenChange(!open)}
        className="flex min-h-[32px] max-w-full min-w-0 cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white py-[7px] pr-[10px] pl-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <span className="text-[13px] leading-[16px] text-[#575755]">View by</span>
        <span className="text-[13px] leading-[16px] truncate font-semibold text-[#1c2a21]">
          {current.label}
        </span>
        <AgencyChevronDownIcon
          className={classNames(
            'size-[14px] text-[#595959] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open ? (
        <div
          id={uid}
          role="menu"
          aria-label="View by"
          onKeyDown={onKey}
          className="absolute top-[calc(100%+6px)] right-0 z-30 flex w-[296px] max-w-[calc(100vw-32px)] flex-col gap-[2px] rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <p className="m-0 px-[10px] pt-[6px] pb-[4px] text-[11px] leading-[13px] font-semibold tracking-[0.66px] text-[#575755] uppercase">
            View by
          </p>
          {options.map((o, i) => {
            const on = o.id === current.id;
            const body = (
              <>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span
                    className={classNames(
                      'text-[14px] leading-[17px] font-medium',
                      o.locked ? 'text-[#575755]' : 'text-[#1c2a21]'
                    )}
                  >
                    {o.label}
                  </span>
                  {o.note ? (
                    <span
                      className={classNames(
                        'text-[12px] leading-[14px]',
                        o.locked ? 'text-[#387440]' : 'text-[#575755]'
                      )}
                    >
                      {o.note}
                    </span>
                  ) : null}
                </span>
                {on ? <DemandCheckIcon className="size-[18px] shrink-0 text-[#387440]" /> : null}
                {o.locked ? (
                  <AgencyLockIcon className="size-[16px] shrink-0 text-[#575755]" />
                ) : null}
              </>
            );
            const cls = classNames(
              'flex min-h-[36px] w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] text-left no-underline focus-visible:outline-2 focus-visible:outline-[#387440]',
              on ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f8f8f4]'
            );
            return o.locked ? (
              <Link
                key={o.id}
                to="/agency/data-requests/new"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={cls}
              >
                {body}
              </Link>
            ) : (
              <button
                key={o.id}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => {
                  log('select', o.id);
                  onSelect(o.id); // the owner closes the menu in the same URL update (two router updates in a row would drop one)
                  buttonRef.current?.focus();
                }}
                className={classNames(cls, 'cursor-pointer')}
              >
                {body}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default DemandViewByMenu;
