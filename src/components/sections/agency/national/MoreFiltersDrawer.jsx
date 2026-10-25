import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { getOverview } from '../../publicData/overview/data/overviewData.js';
import { FILTER_DEFINITIONS, filterOptionLabel } from '../../publicData/ui/data/uiData.js';
import { FILTER_KEYS } from '../agencyState.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import { MORE_FILTER_GROUPS } from './data/moreFiltersData.js';

const log = debug('MoreFiltersDrawer');

/*
 * MoreFiltersDrawer — "More filters" (Figma 11.4.6a-c drawer 8707:418739: 560 wide, white, shadow -8 0 32 .., over a #0f1712 40 % scrim; 6f phone bottom sheet
 * 8707:426956; 6g tablet side sheet 8707:427584). Header (22/600 + 13 sub-line + close), search, "N on:" chips, accordion groups (Location · About them ·
 * Education · Experience · Certifications · Interests and goals · Personality and strengths · Skills and readiness · Programmes and outcomes), footer
 * (hint, optional "too small" warning, Clear all + "Show N talents →").
 * Mounted while ?modal=filters. Draft state seeds from the URL's five Theme 8 keys; "Show" writes them back (the extra filters live only in the draft —
 * ⚠️ ASSUMPTION: no URL keys for them; a query that stores them belongs to package C). ?state=too-few forces the 11.4.6c state.
 * Focus: moves into the dialog, Tab is trapped, Esc / scrim / close return focus to "+ More filters".
 */

const SELECT =
  'h-[46px] w-full cursor-pointer appearance-none rounded-[12px] border border-solid border-[#c1d4c4] bg-white pr-[36px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Chevron = ({ className }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className={classNames('size-[16px]', className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m4 6 4 4 4-4" />
  </svg>
);

const Field = ({ field, value, onChange }) => {
  if (field.locked) {
    return (
      <div className="group relative col-span-full flex items-start gap-[10px] rounded-[12px] border border-dashed border-[#c1d4c4] bg-[#f4f7f4] px-[14px] py-[12px]">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="mt-[2px] size-[16px] shrink-0 text-[#595959]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="3" y="7" width="10" height="6.5" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[14px] leading-[17px] font-medium text-[#575755]">
            {field.label}
          </span>
          <Link
            to="/agency/data-requests/new"
            aria-describedby="mf-locked-tip"
            className="inline-flex min-h-[24px] items-center text-[12px] leading-[15px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-[#387440]"
          >
            Not in your MoU — request access
          </Link>
        </div>
        <div
          id="mf-locked-tip"
          role="tooltip"
          className="pointer-events-none absolute right-[12px] bottom-[calc(100%+6px)] z-10 hidden w-[240px] flex-col gap-[2px] rounded-[10px] bg-[#1a1a18] px-[12px] py-[10px] text-white group-focus-within:flex group-hover:flex"
        >
          <span className="text-[12px] leading-[15px] font-semibold">
            Disability status is outside your MoU
          </span>
          <span className="text-[11px] leading-[14px]">
            Ask for it in Data requests. The GTH data team replies within 5 working days.
          </span>
        </div>
      </div>
    );
  }
  const options = field.core
    ? FILTER_DEFINITIONS.find((d) => d.key === field.key).options.map((o) => ({
        id: o.id,
        label: o.label,
      }))
    : field.options.map((o) => ({ id: o, label: o }));
  const id = `mf-${field.key}`;
  return (
    <div className="flex min-w-0 flex-col gap-[6px] max-md:col-span-full">
      <label htmlFor={id} className="text-[14px] leading-[17px] font-medium text-[#1c2a21]">
        {field.label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(field.key, e.target.value || null)}
          className={classNames(SELECT, !value && 'text-[#575755]')}
        >
          <option value="">Any</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <Chevron className="pointer-events-none absolute top-[15px] right-[12px] text-[#1c2a21]" />
      </div>
      {field.note && (
        <p
          className={classNames(
            'm-0 text-[12px] leading-[15px]',
            field.error ? 'text-[#c0392b]' : 'text-[#575755]'
          )}
        >
          {field.note}
        </p>
      )}
    </div>
  );
};

const MoreFiltersDrawer = ({ data, tooFew: forcedTooFew }) => {
  const open = data.modal === 'filters';
  const [draft, setDraft] = useState({});
  const [openGroups, setOpenGroups] = useState(['location', 'about', 'education']);
  const [q, setQ] = useState('');
  const panelRef = useRef(null);
  const returnRef = useRef(null);
  const { update, filters } = data;

  useEffect(() => {
    if (!open) return undefined;
    log('open', filters);
    returnRef.current = document.activeElement;
    setDraft({ ...filters });
    setQ('');
    const withValue = MORE_FILTER_GROUPS.filter((g) => g.fields.some((f) => filters[f.key])).map(
      (g) => g.id
    );
    setOpenGroups(withValue.length ? withValue : ['location', 'about', 'education']);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      returnRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => update({ modal: null }, { replace: true });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll(
          'button:not([disabled]), a[href], select, input'
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const core = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, draft[k] || null])),
    [draft]
  );
  const count = useMemo(() => getOverview(core).count, [core]);
  const fourteen = draft.age === '14-17';
  const tooFew =
    forcedTooFew ||
    isSuppressed(count) ||
    (fourteen && Object.keys(draft).filter((k) => draft[k] && k !== 'age').length > 0);
  const on = MORE_FILTER_GROUPS.flatMap((g) => g.fields).filter((f) => draft[f.key]);

  if (!open) return null;

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const labelOf = (f) => (f.core ? filterOptionLabel(f.key, draft[f.key]) : draft[f.key]);
  const needle = q.trim().toLowerCase();
  const groups = needle
    ? MORE_FILTER_GROUPS.map((g) => ({
        ...g,
        fields: g.fields.filter(
          (f) => f.label.toLowerCase().includes(needle) || g.label.toLowerCase().includes(needle)
        ),
      })).filter((g) => g.fields.length)
    : MORE_FILTER_GROUPS;
  const apply = () => {
    log('apply', core);
    update({ ...core, modal: null, state: forcedTooFew ? null : data.state });
  };
  const clearAll = () => setDraft({});

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close more filters"
        onClick={close}
        className="absolute inset-0 cursor-default bg-[#0f1712]/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mf-title"
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[20px] bg-white font-sans shadow-[0_-8px_32px_rgba(0,0,0,0.16)] outline-none md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:shadow-[-8px_0_32px_rgba(0,0,0,0.16)] lg:h-[min(1117px,100dvh)] lg:w-[560px]"
      >
        <div className="flex items-start justify-between gap-[12px] px-[24px] pt-[24px] max-md:px-[20px] max-md:pt-[20px]">
          <div className="flex min-w-0 flex-col gap-[4px]">
            <h2
              id="mf-title"
              className="m-0 text-[22px] leading-[27px] font-semibold text-[#1c2a21]"
            >
              More filters
            </h2>
            <p className="m-0 text-[13px] leading-[16px] text-[#575755] max-lg:hidden">
              {on.length === 0 && !tooFew
                ? '27 profile filters. Pick as many as you need; results update as you go.'
                : tooFew
                  ? `${on.length} filters on. This mix is too small to show.`
                  : `${on.length} filters on. Results update as you go.`}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="inline-flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-transparent text-[#1c2a21] hover:bg-[#f2f2ee] focus-visible:outline-2 focus-visible:outline-[#387440]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-[16px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="m3.5 3.5 9 9m0-9-9 9" />
            </svg>
          </button>
        </div>
        <div className="px-[24px] pt-[14px] max-md:px-[20px]">
          <label className="flex h-[40px] items-center gap-[8px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white px-[12px] focus-within:border-[#387440]">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-[16px] shrink-0 text-[#575755]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" />
            </svg>
            <span className="sr-only">Search filters</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search filters, e.g. “certification”"
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] text-[#1c2a21] outline-none placeholder:text-[#575755] max-md:placeholder:content-['Search_filters']"
            />
          </label>
        </div>
        {on.length > 0 && (
          <div className="flex flex-wrap items-center gap-[6px] px-[24px] pt-[12px] max-md:px-[20px]">
            <span className="text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
              {on.length} on:
            </span>
            {on.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => set(f.key, null)}
                aria-label={`Remove ${f.label}: ${labelOf(f)}`}
                className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] rounded-full border-0 bg-[#e1eae2] px-[10px] py-[4px] font-sans text-[12px] leading-[15px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-[#387440]"
              >
                {f.label}: {labelOf(f)} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-[24px] pt-[8px] pb-[24px] max-md:px-[20px]">
          {groups.map((g) => {
            const isOpen = needle ? true : openGroups.includes(g.id);
            const selected = g.fields.filter((f) => draft[f.key]).length;
            const panelId = `mf-g-${g.id}`;
            return (
              <section
                key={g.id}
                className="border-0 border-b border-solid border-[#efefea] last:border-b-0"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenGroups((s) =>
                        s.includes(g.id) ? s.filter((x) => x !== g.id) : [...s, g.id]
                      )
                    }
                    className="flex min-h-[48px] w-full cursor-pointer items-center gap-[10px] bg-transparent py-[14px] text-left focus-visible:outline-2 focus-visible:outline-[#387440]"
                  >
                    <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                      {g.label}
                    </span>
                    <span
                      className={classNames(
                        'text-[12px] leading-[15px]',
                        selected ? 'text-[#387440]' : 'text-[#575755]'
                      )}
                    >
                      {selected ? `${selected} selected` : `${g.fields.length} filters`}
                    </span>
                    <Chevron
                      className={classNames(
                        'ml-auto text-[#575755] transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    className="grid grid-cols-2 gap-x-[16px] gap-y-[14px] pb-[16px]"
                  >
                    {g.fields.map((f) => (
                      <Field
                        key={f.key}
                        field={f.key === 'age' && fourteen && tooFew ? { ...f, error: true } : f}
                        value={draft[f.key]}
                        onChange={set}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        <div className="flex flex-col gap-[8px] border-0 border-t border-solid border-[#efefea] px-[24px] pt-[12px] pb-[16px] max-md:px-[20px]">
          {tooFew && (
            <p
              role="status"
              className="m-0 rounded-[10px] bg-[#fdf4e3] px-[12px] py-[10px] text-[13px] leading-[17px] font-medium text-[#967014]"
            >
              This mix leaves fewer than 5 talents, so nothing can be shown. Remove a filter to see
              results.
            </p>
          )}
          <p className="m-0 flex items-center gap-[6px] text-[12px] leading-[15px] text-[#575755]">
            <span
              aria-hidden="true"
              className="size-[12px] shrink-0 rounded-full border border-solid border-[#70706e]"
            />
            <span>
              Groups under 5 stay hidden
              <span className="max-lg:hidden">, even after filters are combined</span>.
            </span>
          </p>
          <div className="flex gap-[12px] pt-[4px]">
            <button
              type="button"
              onClick={clearAll}
              className="h-[44px] cursor-pointer rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[22px] font-sans text-[16px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Clear all
            </button>
            <button
              type="button"
              disabled={tooFew}
              onClick={apply}
              className="h-[44px] flex-1 cursor-pointer rounded-[14px] border-0 bg-[linear-gradient(180deg,#3f7f4c,#2a5730)] px-[18px] font-sans text-[14px] font-semibold text-white shadow-[0_3px_0_#1f4a2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tooFew ? 'Show results' : `Show ${formatCount(count)} talents`}
              <span className="max-md:hidden"> →</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MoreFiltersDrawer;
