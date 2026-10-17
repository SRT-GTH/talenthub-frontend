import { useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import { LIFT } from './TabsParts.jsx';
import {
  SearchRoleWalletActiveIcon,
  SearchRoleWalletIcon,
  SkillFunctionIcon,
} from '../../shared/assets.jsx';
import buddyAvatar from '../../../assets/talent-home/tabs/search-career-buddy-avatar.png';
import {
  SEARCH_CATEGORIES,
  SEARCH_ASK,
  SEARCH_GROUPS,
  SEARCH_HINTS,
  SEARCH_SEE_ALL,
} from './talentHomeTabsData.js';

const log = debug('GlobalSearchOverlay');

/*
 * GlobalSearchOverlay — HM-08. Figma Playful 7748:2357 / Focused 8097:9162.
 * Opened by `?search=1`; closes with `home.update({ search: false })` (Esc, scrim click).
 * Figma: the top-nav search field stays live above a dimmed scrim (rgba(11,26,15,.45)) and the
 * results panel hangs under it, left-aligned with the field. The panel therefore measures the
 * header's `input[type=search]` (Shell's) for its anchor; on phones (no inline field) it is
 * inset 12px. role=dialog, Tab is trapped between the nav field and the panel, focus is
 * restored on close, ↑/↓ move the highlighted row, Enter "opens" it (mock: logs + closes).
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Tile = ({ row, active }) => {
  if (row.photo)
    return (
      <span className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] bg-[#ebf1ec]">
        <img src={row.photo} alt="" width="34" height="34" className="size-[34px]" />
      </span>
    );
  const Icon =
    row.icon === 'wallet'
      ? active
        ? SearchRoleWalletActiveIcon
        : SearchRoleWalletIcon
      : SkillFunctionIcon;
  return (
    <span
      className={classNames(
        'flex size-[34px] shrink-0 items-center justify-center rounded-[10px]',
        active && row.icon === 'wallet' ? 'bg-[#387440]' : 'bg-[#ebf1ec]'
      )}
    >
      <Icon className="size-[17px]" />
    </span>
  );
};

const GlobalSearchOverlay = ({ home }) => {
  const panelRef = useRef(null);
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ top: 64, left: 12, scrimTop: 56 });

  const close = () => {
    log('close');
    home.update({ search: false });
  };

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCH_GROUPS.filter((g) => cat === 'all' || g.id === cat)
      .map((g) => ({
        ...g,
        rows: g.rows.filter(
          (r) =>
            !q ||
            r.parts
              .map((p) => p.text)
              .join('')
              .toLowerCase()
              .includes(q) ||
            r.sub.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.rows.length);
  }, [cat, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups]);

  useEffect(() => {
    log('mount', { rows: flat.length });
    const opener = document.activeElement;
    const header = document.querySelector('header');
    const navInput = header?.querySelector('input[type="search"]');
    const measure = () => {
      const h = header?.getBoundingClientRect();
      // the visible field box is the input's wrapper (icon + input + ⌘K badge)
      const i = (navInput?.parentElement ?? navInput)?.getBoundingClientRect();
      const visible = i && i.width > 0;
      const next = {
        scrimTop: Math.round(h?.bottom ?? 56),
        top: Math.round(visible ? i.bottom + 10 : (h?.bottom ?? 56) + 8),
        left: Math.round(visible ? i.left : 12),
      };
      log('anchor', next, { visible });
      setPos(next);
    };
    measure();
    window.addEventListener('resize', measure);
    (navInput && navInput.offsetWidth > 0 ? navInput : panelRef.current)?.focus();

    const onInput = (e) => {
      if (e.target === navInput) {
        setQuery(e.target.value);
        setActive(0);
      }
    };
    document.addEventListener('input', onInput);
    return () => {
      window.removeEventListener('resize', measure);
      document.removeEventListener('input', onInput);
      opener?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!flat.length) return;
        e.preventDefault();
        setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length);
      } else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && flat[active]) {
        e.preventDefault();
        log('open result', flat[active].id);
        close();
      } else if (e.key === 'Tab') {
        const navInput = document.querySelector('header input[type="search"]');
        const list = [
          ...(navInput && navInput.offsetWidth > 0 ? [navInput] : []),
          ...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []),
        ];
        if (!list.length) return;
        const i = list.indexOf(document.activeElement);
        const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i + 1) % list.length;
        e.preventDefault();
        list[next].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat, active]);

  let idx = -1;
  return (
    <>
      <div
        aria-hidden="true"
        onMouseDown={close}
        style={{ top: pos.scrimTop }}
        className="fixed inset-x-0 bottom-0 z-[50] bg-[rgba(11,26,15,0.45)]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search results"
        tabIndex={-1}
        style={{
          top: pos.top,
          left: pos.left,
          maxHeight: `calc(100dvh - ${pos.top}px - 12px)`,
        }}
        className={classNames(
          'fixed z-[55] flex w-[min(760px,calc(100vw-24px))] flex-col gap-[16px] overflow-y-auto rounded-[22px] bg-white px-[16px] py-[20px] outline-none playful:py-[16px]',
          LIFT
        )}
      >
        <div
          role="group"
          aria-label="Result categories"
          className="flex gap-[6px] overflow-x-auto font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SEARCH_CATEGORIES.map((c) => {
            const on = c.id === cat;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  log('category', c.id);
                  setCat(c.id);
                  setActive(0);
                }}
                className={classNames(
                  'inline-flex shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[12px] py-[7px] leading-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  on ? 'border-[#387440] bg-[#387440]' : 'border-[#e7e7e7] bg-white'
                )}
              >
                <span className={classNames('text-[13px]', on ? 'text-white' : 'text-[#387440]')}>
                  {c.label}
                </span>
                <span
                  className={classNames('text-[12px]', on ? 'text-[#ffd86b]' : 'text-[#595959]')}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-[12px] rounded-[14px] border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] py-[12px]">
          <span className="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-white">
            <img src={buddyAvatar} alt="" width="30" height="30" className="size-[30px]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="truncate text-[14px] font-semibold text-[#1c2a21]">
              {SEARCH_ASK.title}
            </span>
            <span className="truncate text-[12px] text-[#595959]">{SEARCH_ASK.sub}</span>
          </span>
          <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959] max-sm:hidden">
            {SEARCH_ASK.key}
          </span>
        </div>

        {groups.map((g) => (
          <div key={g.id} role="group" aria-label={g.heading} className="flex flex-col gap-[16px]">
            <p className="text-[12px] font-bold tracking-[1.2px] text-[#595959]">{g.heading}</p>
            <ul className="flex flex-col">
              {g.rows.map((r) => {
                idx += 1;
                const i = idx;
                const on = i === active;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        log('open result', r.id);
                        close();
                      }}
                      className={classNames(
                        'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid px-[12px] py-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                        on
                          ? 'border-[rgba(28,42,33,0.1)] bg-[#f7f8f4]'
                          : 'border-transparent bg-transparent'
                      )}
                    >
                      <Tile row={r} active={on} />
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="truncate text-[14px] font-semibold text-[#1c2a21]">
                          {r.parts.map((p, k) => (
                            <span key={k} className={p.hl ? 'text-[#387440]' : undefined}>
                              {p.text}
                            </span>
                          ))}
                        </span>
                        <span className="truncate text-[12px] text-[#595959]">{r.sub}</span>
                      </span>
                      {r.chip ? (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[12px] font-semibold text-[#387440] max-sm:hidden">
                          {r.chip}
                        </span>
                      ) : null}
                      {r.hint && on ? (
                        <span className="shrink-0 whitespace-nowrap text-[12px] font-medium text-[#595959] max-md:hidden">
                          {r.hint}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="flex items-center gap-[14px] border-t border-solid border-[#e7e7e7] px-[4px] pt-[10px]">
          {SEARCH_HINTS.map((h) => (
            <span key={h.key} className="flex shrink-0 items-center gap-[6px] max-md:hidden">
              <span className="inline-flex h-[32px] items-center whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
                {h.key}
              </span>
              <span className="whitespace-nowrap text-[12px] text-[#595959]">{h.label}</span>
            </span>
          ))}
          <span className="h-px min-w-px flex-1" aria-hidden="true" />
          <button
            type="button"
            onClick={() => log('see all')}
            className="shrink-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {SEARCH_SEE_ALL}
          </button>
        </div>
      </div>
    </>
  );
};

export default GlobalSearchOverlay;
