import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useParentMe } from '../live/parentLive.js';
import { wardView } from '../live/parentLiveView.js';
import { WARD_LIST } from '../wards/data/wardsData.js';
import { SEARCH_COPY as C, searchParent } from './parentSearchIndex.js';
import { PARENT_NAV_ICONS } from './parentNavIcons.js';
import searchIcon from '../../../../assets/parent/search-0-1.svg';

const log = debug('ParentSearchPanel');

/*
 * ParentSearchPanel — the parent top bar's search (the field with ⌘K). The Parents file draws the field only, so the panel
 * is ⚠️ ASSUMPTION, built on the app's other top-bar pop-ups (white r14 card, hairline, soft shadow, grouped rows like the
 * recruiter search): its own query field, WARDS (the parent's wards) and PAGES AND ACTIONS (parentSearchIndex.js).
 * Opened by `?panel=search` (the field, ⌘K / Ctrl+K, or "Search" in the phone More sheet). ↑ / ↓ move, Enter opens,
 * Esc or a click outside closes. Under 768px it is a sheet below the top bar. Props: onClose.
 */
const Row = ({ row, active, onPick, onHover, id }) => (
  <li role="presentation">
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={active}
      tabIndex={-1}
      onMouseEnter={onHover}
      onClick={onPick}
      className={classNames(
        'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border-0 px-[12px] py-[8px] text-left',
        active ? 'bg-[#ebf1ec]' : 'bg-transparent'
      )}
    >
      {row.kind === 'ward' ? (
        <img
          src={row.photo}
          alt=""
          className="size-[34px] shrink-0 rounded-full object-cover"
          draggable="false"
        />
      ) : (
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#f8f8f4]">
          <img src={PARENT_NAV_ICONS[row.icon]} alt="" className="size-[18px]" draggable="false" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-sans text-[14px] leading-[20px] font-semibold text-[#1c2a21]">
          {row.title}
        </span>
        {row.sub ? (
          <span className="truncate font-sans text-[12px] leading-[16px] text-[#575755]">
            {row.sub}
          </span>
        ) : null}
      </span>
    </button>
  </li>
);

const Group = ({ label, children }) => (
  <>
    <li
      role="presentation"
      className="list-none px-[12px] pt-[12px] pb-[4px] font-sans text-[12px] leading-[16px] font-bold tracking-[0.6px] text-[#575755]"
    >
      {label}
    </li>
    {children}
  </>
);

const ParentSearchPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const me = useParentMe();
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const wards = useMemo(
    () => (me.live ? (me.data?.wards || []).map((w) => wardView(w)) : WARD_LIST),
    [me.live, me.data]
  );
  const results = useMemo(() => searchParent(query, wards), [query, wards]);
  const rows = [...results.wards, ...results.pages];
  const active = Math.min(cursor, Math.max(rows.length - 1, 0));

  useEffect(() => {
    log('open', { live: me.live, wards: wards.length });
    inputRef.current?.focus();
  }, [me.live, wards.length]);

  useEffect(() => {
    const onDown = (event) => {
      if (ref.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-parent-search-trigger]')) return;
      log('outside click closes');
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  const open = (row) => {
    if (!row) return;
    log('open result', { kind: row.kind, to: row.to });
    onClose();
    navigate(row.to);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((active + 1) % Math.max(rows.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((active - 1 + rows.length) % Math.max(rows.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      open(rows[active]);
    }
  };

  const optionId = (i) => `parent-search-opt-${i}`;
  let index = -1;
  const renderRow = (row) => {
    index += 1;
    const i = index;
    return (
      <Row
        key={row.id}
        id={optionId(i)}
        row={row}
        active={i === active}
        onHover={() => setCursor(i)}
        onPick={() => open(row)}
      />
    );
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={C.label}
      className="absolute top-[calc(100%+8px)] left-0 z-50 flex w-[max(100%,440px)] max-w-[calc(100vw-24px)] flex-col rounded-[14px] border border-solid border-[#e5e8e3] bg-white p-[8px] shadow-[0_16px_40px_-8px_rgba(15,15,10,0.2),0_2px_6px_rgba(15,15,10,0.06)] max-md:fixed max-md:top-[96px] max-md:right-[12px] max-md:left-[12px] max-md:w-auto"
    >
      <label className="flex items-center gap-[10px] rounded-[10px] border border-solid border-[#dfdfdc] px-[12px] py-[8px] focus-within:border-[#387440]">
        <img src={searchIcon} alt="" className="size-[18px] shrink-0" />
        <span className="sr-only">{C.label}</span>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="parent-search-list"
          aria-activedescendant={rows.length ? optionId(active) : undefined}
          aria-autocomplete="list"
          value={query}
          placeholder={C.placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] leading-[20px] text-[#1c2a21] outline-none placeholder:text-[#babab7]"
        />
      </label>
      <ul
        id="parent-search-list"
        role="listbox"
        aria-label={C.label}
        className="m-0 max-h-[min(60vh,460px)] list-none overflow-y-auto p-0"
      >
        {results.wards.length ? (
          <Group label={C.wards}>{results.wards.map(renderRow)}</Group>
        ) : null}
        {results.pages.length ? (
          <Group label={C.pages}>{results.pages.map(renderRow)}</Group>
        ) : null}
      </ul>
      {rows.length === 0 ? (
        <p
          role="status"
          className="m-0 px-[12px] py-[16px] font-sans text-[14px] leading-[20px] text-[#575755]"
        >
          {C.empty(query.trim())}
        </p>
      ) : null}
      <p className="m-0 mt-[4px] border-t border-solid border-[#eeeee9] px-[12px] pt-[8px] pb-[4px] font-sans text-[12px] leading-[16px] text-[#575755] max-md:hidden">
        {C.keys}
      </p>
    </div>
  );
};

export default ParentSearchPanel;
