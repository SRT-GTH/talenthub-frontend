import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../publicDataFormat.js';
import { PublicIconSearch } from '../publicDataIcons.jsx';
import { RegionsIconCheckSmall, RegionsIconChevronDown } from './regionsIcons.jsx';

const log = debug('RegionSwitcher');

/*
 * RegionSwitcher — the region title with its chevron and the jump menu (Figma 8493:82 "region switcher", open menu 8495:222 "Region switcher menu",
 * frame 8.3.1d). The title is the page <h1>; the button opens a listbox of every region by talents (16 rows, 10 visible, "+ 6 more · scroll").
 *   button : H gap 10, p 2/4, r10, title 34/41 600 -0.34 (26/31 on phones), chevron 24; open → bg #f2f2ee
 *   menu   : 340 wide, p10 gap2, white, 1px #e7e7e7, r16, shadow 0 12 32; search field 37px (#f2f2ee r10, placeholder "Jump to a region"),
 *            caption "All 16 regions · by talents" (12/14 600 caps +0.72), options 33px r8 (14/17; the current one #ebf1ec 600 #2a5730 + check)
 * Keyboard (combobox pattern): focus moves to the search field; Up/Down move the highlighted option, Enter goes there, Esc closes and returns
 * focus to the button, typing filters. The open state is the URL (?modal=region), so frame 8.3.1d is a link.
 * Props: title, currentId, items [{ id, name, count }], open, onOpenChange(bool), onSelect(id), searchLabel, caption, listLabel, className,
 * bare (opt-in, agency portal: the trigger is a small "bareLabel ▾" link instead of the page <h1> title, and the menu opens right-aligned under it).
 * The same component serves the district title (⚠️ ASSUMPTION: Figma draws the chevron on the district title but no district menu; it reuses
 * the region menu with "Jump to a district" / "All N districts · by talents").
 */

const VISIBLE = 10;
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const RegionSwitcher = ({
  title,
  currentId,
  items,
  open,
  onOpenChange,
  onSelect,
  searchLabel = 'Jump to a region',
  caption,
  listLabel = 'Regions',
  className,
  bare = false,
  bareLabel = 'Switch region',
}) => {
  const uid = useId();
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((it) => it.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    if (!open) return undefined;
    log('open', { count: items.length });
    setQuery('');
    setHighlight(
      Math.max(
        0,
        items.findIndex((it) => it.id === currentId)
      )
    );
    inputRef.current?.focus({ preventScroll: true });
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onOpenChange(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, items, currentId, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${uid}-opt-${highlight}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, highlight, uid]);

  const close = () => {
    onOpenChange(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(shown.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = shown[highlight];
      if (pick) {
        log('select', pick.id);
        onSelect(pick.id);
      }
    } else if (e.key === 'Tab') {
      onOpenChange(false);
    }
  };

  const listId = `${uid}-list`;
  const hiddenCount = Math.max(0, shown.length - VISIBLE);

  return (
    <div ref={wrapRef} className={classNames('relative w-fit', className)}>
      {bare ? (
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => onOpenChange(!open)}
          className={classNames(
            'flex min-h-[24px] cursor-pointer items-center gap-[4px] rounded-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440]',
            FOCUS
          )}
        >
          {bareLabel}
          <RegionsIconChevronDown className="size-[16px] shrink-0" />
        </button>
      ) : (
        <h1 className="m-0 font-sans">
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            onClick={() => onOpenChange(!open)}
            className={classNames(
              'flex cursor-pointer items-center gap-[10px] rounded-[10px] border-0 px-[4px] py-[2px] text-left font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]',
              open ? 'bg-[#f2f2ee]' : 'bg-transparent',
              FOCUS
            )}
          >
            <span>{title}</span>
            <RegionsIconChevronDown className="size-[20px] shrink-0 text-[#1a1a18] md:size-[24px]" />
          </button>
        </h1>
      )}
      {open && (
        <div
          role="presentation"
          className={classNames(
            bare ? 'absolute top-[calc(100%+6px)] right-0' : 'absolute top-[53px] left-0',
            'z-30 flex w-[340px] max-w-[calc(100vw-32px)] flex-col gap-[2px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.12)]'
          )}
          onKeyDown={onKeyDown}
        >
          <label className="flex items-center gap-[8px] rounded-[10px] bg-[#f2f2ee] px-[12px] py-[10px]">
            <PublicIconSearch className="size-[16px] shrink-0 text-[#70706e]" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={shown[highlight] ? `${uid}-opt-${highlight}` : undefined}
              aria-label={searchLabel}
              placeholder={searchLabel}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
            />
          </label>
          <p className="m-0 pt-[2px] pb-[4px] font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
            {caption}
          </p>
          <ul
            id={listId}
            role="listbox"
            aria-label={listLabel}
            className="m-0 flex max-h-[345px] list-none flex-col gap-[2px] overflow-y-auto p-0 [scrollbar-width:thin]"
          >
            {shown.map((it, i) => {
              const current = it.id === currentId;
              return (
                <li
                  key={it.id}
                  id={`${uid}-opt-${i}`}
                  role="option"
                  aria-selected={current}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => onSelect(it.id)}
                  className={classNames(
                    'flex min-h-[33px] cursor-pointer items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] font-sans',
                    current ? 'bg-[#ebf1ec]' : i === highlight ? 'bg-[#f2f2ee]' : 'bg-transparent',
                    i === highlight && 'outline-2 -outline-offset-2 outline-[#387440]/40'
                  )}
                >
                  <span
                    className={classNames(
                      'min-w-0 flex-1 text-[14px] leading-[17px]',
                      current ? 'font-semibold text-[#2a5730]' : 'font-medium text-[#1c2a21]'
                    )}
                  >
                    {it.name}
                  </span>
                  <span className="text-[13px] leading-[16px] font-medium text-[#595959]">
                    {formatCount(it.count)}
                  </span>
                  <span className="flex size-[18px] shrink-0 items-center justify-center text-[#387440]">
                    {current && <RegionsIconCheckSmall className="h-[8px] w-[11px]" />}
                  </span>
                </li>
              );
            })}
          </ul>
          {hiddenCount > 0 && (
            <p
              aria-hidden="true"
              className="m-0 pt-[2px] font-sans text-[12px] leading-[14px] font-medium text-[#595959]"
            >
              {`+ ${hiddenCount} more · scroll`}
            </p>
          )}
          <p aria-live="polite" className="sr-only">
            {`${shown.length} results`}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionSwitcher;
