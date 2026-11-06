import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { apiMessage, institutionSearch } from '../../../services/institutionPortal.api.js';
import { INSTITUTION_BASE } from './institutionNav.js';

const log = debug('InstitutionSearch');

/*
 * InstitutionSearch — the top-bar search of the institution portal (Figma "Nav" 8585:468 draws the box; the results list is not drawn).
 * Typing (2+ characters, 250 ms pause) asks GET /api/institution/search and lists up to 5 students, records and credentials of the school
 * under the box (records and credentials only once the school is accredited, like their pages). ARIA combobox: ↑/↓ move, Enter opens the
 * highlighted result, Esc closes. Enter with nothing highlighted keeps the old behaviour: the Students roster filtered by the text (?q=),
 * which is also the last row of the list. ⌘K / Ctrl+K focuses it (InstitutionTopBar). Answers to earlier keystrokes are ignored.
 * Props: inputRef, defaultValue, renderBox(children) (the bordered box the top bar draws around the input).
 */

const GROUPS = [
  ['students', 'Students', (id) => `${INSTITUTION_BASE}/students/${id}`],
  ['records', 'Records', (id) => `${INSTITUTION_BASE}/records/${id}`],
  ['credentials', 'Credentials', (id) => `${INSTITUTION_BASE}/credentials/${id}`],
];

const InstitutionSearch = ({ inputRef, defaultValue = '', renderBox }) => {
  const navigate = useNavigate();
  const listId = useId();
  const [q, setQ] = useState(defaultValue);
  const [res, setRes] = useState(null);
  const [state, setState] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const seq = useRef(0);

  const needle = q.trim();
  useEffect(() => {
    if (needle.length < 2) {
      setRes(null);
      setState('idle');
      return undefined;
    }
    const mine = ++seq.current;
    setState('loading');
    const t = window.setTimeout(() => {
      institutionSearch(needle)
        .then((r) => {
          if (mine !== seq.current) return;
          log('results', {
            q: needle,
            s: r.students.length,
            r: r.records.length,
            c: r.credentials.length,
          });
          setRes(r);
          setState('ready');
          setActive(-1);
        })
        .catch((err) => {
          if (mine !== seq.current) return;
          setError(apiMessage(err));
          setState('error');
        });
    }, 250);
    return () => window.clearTimeout(t);
  }, [needle]);

  // the flat list of options, in display order: results, then "all students matching"
  const options = useMemo(() => {
    const out = [];
    if (res) {
      for (const [key, , to] of GROUPS) {
        for (const item of res[key] || [])
          out.push({ key: `${key}-${item.id}`, group: key, item, to: to(item.id) });
      }
    }
    if (needle.length >= 2) {
      out.push({
        key: 'all',
        group: 'all',
        to: `${INSTITUTION_BASE}/students?q=${encodeURIComponent(needle)}`,
      });
    }
    return out;
  }, [res, needle]);

  const go = (opt) => {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    navigate(opt.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (options.length ? (a + 1) % options.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (options.length ? (a <= 0 ? options.length - 1 : a - 1) : -1));
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (open && active >= 0 && options[active]) return go(options[active]);
    log('search submit', needle);
    go({
      to: needle
        ? `${INSTITUTION_BASE}/students?q=${encodeURIComponent(needle)}`
        : `${INSTITUTION_BASE}/students`,
    });
    return undefined;
  };

  const showList = open && needle.length >= 2;
  const total = res ? res.students.length + res.records.length + res.credentials.length : 0;
  const optId = (i) => `${listId}-opt-${i}`;

  return (
    <form role="search" onSubmit={onSubmit} className="relative flex min-w-0 max-w-[553px] flex-1">
      {renderBox(
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? optId(active) : undefined}
          aria-label="Search students, records, credentials"
          placeholder="Search students, records, credentials…"
          autoComplete="off"
          className="h-[28px] min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
        />
      )}
      {showList ? (
        <div
          className="absolute top-[calc(100%+8px)] right-0 left-0 z-[70] max-h-[min(70vh,520px)] overflow-y-auto rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[8px] font-sans shadow-[0_12px_32px_rgba(15,15,10,0.12)]"
          // keep the input focused while choosing with the mouse
          onMouseDown={(e) => e.preventDefault()}
        >
          <ul id={listId} role="listbox" aria-label="Search results" className="m-0 list-none p-0">
            {GROUPS.map(([key, label]) =>
              res && res[key]?.length ? (
                <li key={key} role="presentation">
                  <p className="m-0 px-[10px] pt-[8px] pb-[4px] text-[12px] font-semibold tracking-[0.3px] text-[#595959] uppercase">
                    {label}
                  </p>
                  <ul role="group" aria-label={label} className="m-0 list-none p-0">
                    {options.map((opt, i) =>
                      opt.group === key ? (
                        <li
                          key={opt.key}
                          id={optId(i)}
                          role="option"
                          aria-selected={i === active}
                          onClick={() => go(opt)}
                          onMouseEnter={() => setActive(i)}
                          className={classNames(
                            'flex cursor-pointer flex-col gap-[2px] rounded-[10px] px-[10px] py-[8px]',
                            i === active ? 'bg-[#ebf1ec]' : 'bg-transparent'
                          )}
                        >
                          <span className="text-[14px] leading-[18px] font-semibold text-[#1c2a21]">
                            {opt.item.title}
                          </span>
                          {opt.item.sub ? (
                            <span className="text-[12.5px] leading-[16px] text-[#595959]">
                              {opt.item.sub}
                            </span>
                          ) : null}
                        </li>
                      ) : null
                    )}
                  </ul>
                </li>
              ) : null
            )}
            {state === 'loading' && !res ? (
              <li
                role="presentation"
                aria-busy="true"
                className="px-[10px] py-[10px] text-[13.5px] text-[#595959]"
              >
                Searching…
              </li>
            ) : null}
            {state === 'ready' && total === 0 ? (
              <li role="presentation" className="px-[10px] py-[10px] text-[13.5px] text-[#595959]">
                No students, records or credentials match “{needle}”.
              </li>
            ) : null}
            {state === 'error' ? (
              <li role="presentation" className="px-[10px] py-[10px] text-[13.5px] text-[#902b20]">
                Search failed. {error}
              </li>
            ) : null}
            {options.length ? (
              <li
                id={optId(options.length - 1)}
                role="option"
                aria-selected={active === options.length - 1}
                onClick={() => go(options[options.length - 1])}
                onMouseEnter={() => setActive(options.length - 1)}
                className={classNames(
                  'mt-[4px] cursor-pointer rounded-[10px] border-t border-solid border-[#efefec] px-[10px] py-[9px] text-[13.5px] font-semibold text-[#387440]',
                  active === options.length - 1 ? 'bg-[#ebf1ec]' : 'bg-transparent'
                )}
              >
                All students matching “{needle}” →
              </li>
            ) : null}
          </ul>
          <p className="sr-only" role="status" aria-live="polite">
            {state === 'ready' ? `${total} result${total === 1 ? '' : 's'}` : ''}
          </p>
        </div>
      ) : null}
    </form>
  );
};

export default InstitutionSearch;
