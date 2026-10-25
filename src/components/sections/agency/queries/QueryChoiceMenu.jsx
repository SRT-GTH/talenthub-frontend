import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import { PRIMARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import { PublicIconSearch } from '../../publicData/publicDataIcons.jsx';

const log = debug('QueryChoiceMenu');

/*
 * QueryChoiceMenu — the multi-select popover under a Queries filter chip (Figma "T8 · Filter menu" 8597:391374 in 11.5.1a: 300 wide, white,
 * 1px #e7e7e7, r16, shadow 0 12 32, p12, gap 4): search field (#f2f2ee r10) · checkbox options (36 high, r8; selected = #ebf1ec, 600, green box)
 * with a right-aligned count · "Showing 7 of 16 · scroll for more" · footer "Clear" + the green "Apply · 1 region" button.
 * The draft is local; Apply sends the ids to onApply, Clear empties the draft, Esc / outside click close without applying.
 * Props: id, label (accessible name), searchLabel ("Search regions"), options [{ id, label, count? }], value (ids), onApply(ids), onClose(reason),
 * noun ("region" -> "Apply · 2 regions"), allLabel (Apply label when nothing is picked), className.
 * ⚠️ ASSUMPTION: Figma draws the open menu only for Region; the other chips keep the single-select Theme 8 FilterMenu.
 */

const VISIBLE_ROWS = 7;

const QueryChoiceMenu = ({
  id,
  label,
  searchLabel,
  options,
  value,
  onApply,
  onClose,
  noun = 'region',
  allLabel = 'Apply · all regions',
  className,
}) => {
  const [draft, setDraft] = useState(value);
  const [needle, setNeedle] = useState('');
  const searchRef = useRef(null);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId();

  useEffect(() => {
    log('open', label);
    searchRef.current?.focus({ preventScroll: true });
    const first = listRef.current?.querySelector('input:checked');
    if (first && listRef.current)
      listRef.current.scrollTop = Math.max(0, first.closest('li').offsetTop - 40);
  }, [label]);

  const rows = useMemo(() => {
    const n = needle.trim().toLowerCase();
    return n ? options.filter((o) => o.label.toLowerCase().includes(n)) : options;
  }, [options, needle]);

  const toggle = (optionId) =>
    setDraft((d) => (d.includes(optionId) ? d.filter((x) => x !== optionId) : [...d, optionId]));

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose?.('escape');
    }
  };

  const applyText = draft.length
    ? `Apply · ${draft.length} ${noun}${draft.length === 1 ? '' : 's'}`
    : allLabel;

  return (
    <div
      ref={rootRef}
      id={id}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={classNames(
        'absolute top-full left-0 z-30 mt-[8px] flex w-[300px] max-w-[calc(100vw-32px)] flex-col gap-[4px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[12px] font-sans shadow-[0_12px_32px_rgba(0,0,0,0.12)]',
        className
      )}
    >
      <label className="flex items-center gap-[8px] rounded-[10px] bg-[#f2f2ee] px-[12px] py-[10px] focus-within:outline-2 focus-within:outline-[#387440]">
        <PublicIconSearch className="size-[16px] shrink-0 text-[#70706e]" />
        <span className="sr-only">{searchLabel}</span>
        <input
          ref={searchRef}
          type="search"
          value={needle}
          placeholder={searchLabel}
          onChange={(e) => setNeedle(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
        />
      </label>
      <ul
        ref={listRef}
        aria-label={label}
        className="relative m-0 flex max-h-[334px] list-none flex-col overflow-y-auto p-[6px_0] [scrollbar-width:thin]"
      >
        {rows.length === 0 ? (
          <li className="px-[8px] py-[9px] text-[13px] leading-[16px] text-[#595959]">No match</li>
        ) : (
          rows.map((o) => {
            const checked = draft.includes(o.id);
            const inputId = `${uid}-${o.id}`;
            return (
              <li key={o.id}>
                <label
                  htmlFor={inputId}
                  className={classNames(
                    'flex min-h-[36px] cursor-pointer items-center gap-[10px] rounded-[8px] px-[8px] py-[9px] has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[#387440]',
                    checked ? 'bg-[#ebf1ec]' : 'hover:bg-[#f8f8f4]'
                  )}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(o.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'grid size-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-solid text-[12px] leading-none font-bold text-white',
                      checked ? 'border-[#387440] bg-[#387440]' : 'border-[#b5b5b1] bg-white'
                    )}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  <span
                    className={classNames(
                      'min-w-0 flex-1 text-[14px] leading-[17px] text-[#1c2a21]',
                      checked ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {o.label}
                  </span>
                  {typeof o.count === 'number' ? (
                    <span className="text-[13px] leading-[16px] text-[#595959]">
                      {formatCount(o.count)}
                    </span>
                  ) : null}
                </label>
              </li>
            );
          })
        )}
      </ul>
      <p className="m-0 text-[12px] leading-[14px] text-[#595959]">
        Showing {Math.min(VISIBLE_ROWS, rows.length)} of {rows.length} · scroll for more
      </p>
      <div className="flex items-center justify-between gap-[8px] pt-[8px]">
        <button
          type="button"
          onClick={() => setDraft([])}
          className="min-h-[24px] cursor-pointer bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Clear
        </button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={() => onApply(draft)}
        >
          {applyText}
        </Button>
      </div>
    </div>
  );
};

export default QueryChoiceMenu;
