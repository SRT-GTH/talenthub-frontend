import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import InstitutionButton from '../InstitutionButton.jsx';
import { RecordsIconChevron } from './recordsIcons.jsx';

/*
 * QueueToolbar — filter chips · cards/list toggle · sort select · action button (Figma toolbar 8593:44, 1329x34).
 * Chips 32 high r999 (active #1c2a21 / white 13/600, others white, 1px #e1eae2, #595959); view toggle 78x34 (r10, active segment #1c2a21); sort select 34 high r999 with the chevron;
 * action = the white shelf button (13/700, r14). ⚠️ ASSUMPTION: the sort select opens a small menu of the two orders; the cards view is not drawn (the toggle keeps the list).
 * Props: chips [{ id, label, count }], chip, onChip, view, onView, sortOptions, sort, onSort, actionLabel, onAction, actionDisabled, actionPressed, filterLabel.
 */
const GridIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[16px] text-[#737373]">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[16px] text-white">
    <rect x="1" y="1" width="2" height="2" rx="1.25" fill="currentColor" />
    <rect
      x="5"
      y="2"
      width="10"
      height="2"
      rx="1"
      fill="currentColor"
      transform="translate(0 -1)"
    />
    <rect x="1" y="5" width="2" height="2" rx="1.25" fill="currentColor" />
    <rect
      x="5"
      y="6"
      width="10"
      height="2"
      rx="1"
      fill="currentColor"
      transform="translate(0 -1)"
    />
    <rect x="1" y="10" width="2" height="2" rx="1.25" fill="currentColor" />
    <rect
      x="5"
      y="11"
      width="10"
      height="2"
      rx="1"
      fill="currentColor"
      transform="translate(0 -1)"
    />
  </svg>
);

const QueueToolbar = ({
  filterLabel,
  chips,
  chip,
  onChip,
  view,
  onView,
  sortOptions,
  sort,
  onSort,
  actionLabel,
  onAction,
  actionDisabled,
  actionPressed,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const currentSort = sortOptions.find((o) => o.id === sort) ?? sortOptions[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="flex flex-wrap items-center gap-[8px] font-sans">
      <div role="group" aria-label={filterLabel} className="flex flex-wrap gap-[8px]">
        {chips.map((c) => {
          const on = c.id === chip;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChip(c.id)}
              className={classNames(
                'inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[14px] text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                on
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {c.label} {c.count}
            </button>
          );
        })}
      </div>
      <span aria-hidden="true" className="min-w-0 flex-1" />
      <div
        role="group"
        aria-label="View"
        className="flex h-[34px] gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
      >
        <button
          type="button"
          aria-label="Cards"
          aria-pressed={view === 'cards'}
          onClick={() => onView('cards')}
          className={classNames(
            'flex w-[34px] cursor-pointer items-center justify-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-[#387440]',
            view === 'cards' ? 'bg-[#1c2a21] [&_svg]:text-white' : 'bg-transparent'
          )}
        >
          <GridIcon />
        </button>
        <button
          type="button"
          aria-label="List"
          aria-pressed={view !== 'cards'}
          onClick={() => onView('list')}
          className={classNames(
            'flex w-[34px] cursor-pointer items-center justify-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-[#387440]',
            view !== 'cards' ? 'bg-[#1c2a21]' : 'bg-transparent [&_svg]:text-[#737373]'
          )}
        >
          <ListIcon />
        </button>
      </div>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {currentSort.label}
          <RecordsIconChevron className="size-[14px]" />
        </button>
        {open ? (
          <ul
            role="menu"
            className="absolute top-[38px] right-0 z-20 m-0 flex min-w-[140px] list-none flex-col rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            {sortOptions.map((o) => (
              <li key={o.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={o.id === sort}
                  onClick={() => {
                    onSort(o.id);
                    setOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-[8px] border-0 bg-transparent px-[10px] py-[8px] text-left text-[13px] leading-[16px] font-semibold text-[#595959] hover:bg-[#ebf1ec]"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <InstitutionButton
        size="xs"
        className="!h-[34px] !rounded-[14px]"
        disabled={actionDisabled}
        aria-pressed={actionPressed}
        onClick={onAction}
      >
        {actionLabel}
      </InstitutionButton>
    </div>
  );
};

export default QueueToolbar;
