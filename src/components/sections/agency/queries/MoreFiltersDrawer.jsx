import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import {
  DRAWER_GROUPS,
  activeFilterCount,
  fieldById,
  optionLabel,
  optionsOfField,
  querySummary,
  runQuery,
} from '../data/queriesData.js';
import { PublicIconSearch } from '../../publicData/publicDataIcons.jsx';
import { useDialogBehaviour } from '../../publicData/share/useDialogBehaviour.js';
import { QueriesIconChevronDown, QueriesIconClose, QueriesIconShield } from './queriesIcons.jsx';

const log = debug('MoreFiltersDrawer');

/*
 * MoreFiltersDrawer — "More filters" (Figma 11.5.1h, 8707:421954 "Drawer · More filters": 560 wide at the right edge, white, shadow -8 0 32, on a #0f1712
 * scrim at 40 %): header (title 22/28 + "6 filters on. Everything you pick is listed in the query summary." + 36px close), a search field and the
 * "6 on:" pills, the scrolling list of groups (Location · About them · Education · Experience · Certifications · Interests and goals ·
 * Personality and strengths · Skills and readiness · Programmes and outcomes; header 15/600 + "1 selected" / "3 filters" + chevron, fields in
 * two columns), and the footer (shield note, "Clear all", "Show 96 talents →").
 * The draft is local: nothing reaches the URL until "Show N talents" (onApply). The count on the button is the live mock count of the draft.
 * Fields open in place (checkbox list, single-select fields behave like radios); the pills remove one filter; the search narrows groups / fields.
 * Esc / scrim / the close button close without applying; focus is trapped and returns to the opener.
 * Props: filters (parseQueryFilters), onApply(draft), onClose.
 * ⚠️ ASSUMPTION: fields of the collapsed groups, their option lists and the in-place field lists are not drawn (queriesData.js DRAWER_GROUPS).
 */

const ensureArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const readField = (draft, field) => {
  if (field.source === 'x') return draft.extras[field.id] ?? [];
  if (field.id === 'region') return draft.region;
  return ensureArray(draft[field.id]);
};

const writeField = (draft, field, values) => {
  if (field.source === 'x') {
    const extras = { ...draft.extras };
    if (values.length) extras[field.id] = values;
    else delete extras[field.id];
    return { ...draft, extras };
  }
  if (field.id === 'region') return { ...draft, region: values };
  return { ...draft, [field.id]: values[0] ?? '' };
};

const Field = ({ field, draft, open, onToggleOpen, onChange }) => {
  const values = readField(draft, field);
  const options = optionsOfField(field);
  const multi = Boolean(field.multi);
  const id = useId();
  const text = values.length ? values.map((v) => optionLabel(field, v)).join(', ') : 'Any';
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <label htmlFor={id} className="text-[14px] leading-[17px] font-medium text-[#1c2a21]">
        {field.label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggleOpen}
        className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[10px] text-left font-sans text-[14px] leading-[17px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <span
          className={classNames(
            'min-w-0 truncate',
            values.length ? 'text-[#1c2a21]' : 'text-[#575755]'
          )}
        >
          {text}
        </span>
        <QueriesIconChevronDown
          className={classNames('size-[16px] shrink-0 text-[#575755]', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={field.label}
          aria-multiselectable={multi || undefined}
          className="m-0 flex max-h-[220px] list-none flex-col overflow-y-auto rounded-[12px] border border-solid border-[#e7e7e7] bg-white p-[6px] [scrollbar-width:thin]"
        >
          {[{ id: '', label: 'Any' }, ...options].map((o) => {
            const selected = o.id === '' ? values.length === 0 : values.includes(o.id);
            return (
              <li key={o.id || 'any'} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    if (o.id === '') onChange([]);
                    else if (multi)
                      onChange(selected ? values.filter((v) => v !== o.id) : [...values, o.id]);
                    else onChange(selected ? [] : [o.id]);
                    if (!multi) onToggleOpen();
                  }}
                  className={classNames(
                    'flex min-h-[36px] w-full cursor-pointer items-center justify-between gap-[12px] rounded-[8px] px-[10px] py-[8px] text-left text-[14px] leading-[17px] text-[#1c2a21] hover:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                    selected ? 'bg-[#ebf1ec] font-semibold' : 'font-medium'
                  )}
                >
                  <span>{o.label}</span>
                  {selected ? (
                    <span aria-hidden="true" className="text-[#387440]">
                      ✓
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

const MoreFiltersDrawer = ({ filters, onApply, onClose }) => {
  const [draft, setDraft] = useState(() => ({
    region: filters.region,
    edu: filters.edu,
    interest: filters.interest,
    age: filters.age,
    gender: filters.gender,
    extras: filters.extras,
    by: filters.by,
  }));
  const [needle, setNeedle] = useState('');
  const [openGroups, setOpenGroups] = useState(['education', 'experience', 'personality']);
  const [openField, setOpenField] = useState(null);
  const panelRef = useRef(null);
  const openerRef = useRef(typeof document === 'undefined' ? null : document.activeElement);
  const titleId = useId();
  useDialogBehaviour(panelRef, onClose);

  useEffect(() => {
    const opener = openerRef.current;
    log('open');
    return () => {
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, []);

  const total = activeFilterCount(draft);
  const liveCount = useMemo(() => runQuery(draft).count, [draft]);
  const pills = useMemo(() => querySummary(draft), [draft]);

  const clearPill = (key) => {
    if (key.startsWith('x:')) setDraft((d) => writeField(d, fieldById(key.slice(2)), []));
    else if (key === 'region') setDraft((d) => ({ ...d, region: [] }));
    else setDraft((d) => ({ ...d, [key]: '' }));
  };

  const needleLower = needle.trim().toLowerCase();
  const groups = DRAWER_GROUPS.map((g) => ({
    ...g,
    fields: needleLower
      ? g.fields.filter(
          (f) =>
            f.label.toLowerCase().includes(needleLower) ||
            g.title.toLowerCase().includes(needleLower)
        )
      : g.fields,
  })).filter((g) => g.fields.length);

  const toggleGroup = (id) =>
    setOpenGroups((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onScrim = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      data-agency-dialog=""
      className="fixed inset-0 z-[60] bg-[#0f1712]/40 font-sans"
      onMouseDown={onScrim}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.16)] outline-none"
      >
        <div className="flex items-start justify-between gap-[16px] px-[24px] pt-[24px] pb-[16px] pl-[28px]">
          <div className="flex min-w-0 flex-col gap-[4px]">
            <h2
              id={titleId}
              className="m-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#1c2a21]"
            >
              More filters
            </h2>
            <p className="m-0 text-[13px] leading-[16px] text-[#575755]" aria-live="polite">
              {total} {total === 1 ? 'filter' : 'filters'} on. Everything you pick is listed in the
              query summary.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[36px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <QueriesIconClose className="size-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-[12px] pr-[24px] pb-[12px] pl-[28px]">
          <label className="flex items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] px-[14px] py-[11px] focus-within:border-[#387440]">
            <PublicIconSearch className="size-[18px] shrink-0 text-[#70706e]" />
            <span className="sr-only">Search filters</span>
            <input
              type="search"
              data-autofocus=""
              value={needle}
              placeholder="Search filters, e.g. “certification”"
              onChange={(e) => setNeedle(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
            />
          </label>
          {pills.length ? (
            <div className="flex flex-wrap items-center gap-[8px]">
              <span className="text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
                {pills.length} on:
              </span>
              {pills.map((p) => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold text-[#387440]"
                >
                  {p.label}
                  <button
                    type="button"
                    onClick={() => clearPill(p.key)}
                    aria-label={`Remove ${p.label}`}
                    className="inline-flex min-h-[24px] min-w-[24px] -my-[5px] -mr-[6px] cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-[#387440]"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-[24px] pb-[24px] pl-[28px] [scrollbar-width:thin]">
          {groups.map((g) => {
            const open = openGroups.includes(g.id) || Boolean(needleLower);
            const picked = g.fields.filter((f) => readField(draft, f).length).length;
            const panelId = `${titleId}-${g.id}`;
            return (
              <section
                key={g.id}
                aria-label={g.title}
                className="flex flex-col gap-[14px] border-t border-solid border-[#efefea] py-[16px] first:border-t-0"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggleGroup(g.id)}
                  className="flex min-h-[24px] w-full cursor-pointer items-center gap-[10px] bg-transparent p-0 text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {g.title}
                  </span>
                  <span
                    className={classNames(
                      'flex-1 text-[12px] leading-[14px]',
                      picked ? 'text-[#387440]' : 'text-[#575755]'
                    )}
                  >
                    {picked ? `${picked} selected` : `${g.fields.length} filters`}
                  </span>
                  <QueriesIconChevronDown
                    className={classNames('size-[18px] text-[#575755]', open && 'rotate-180')}
                  />
                </button>
                {open ? (
                  <div id={panelId} className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                    {g.fields.map((f) => (
                      <Field
                        key={f.id}
                        field={f}
                        draft={draft}
                        open={openField === f.id}
                        onToggleOpen={() => setOpenField((cur) => (cur === f.id ? null : f.id))}
                        onChange={(values) => setDraft((d) => writeField(d, f, values))}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
          {groups.length === 0 ? (
            <p className="m-0 py-[16px] text-[14px] leading-[20px] text-[#575755]">
              No filter matches “{needle}”.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-[12px] border-t border-solid border-[#e7e7e7] bg-white px-[24px] pt-[16px] pb-[24px] pl-[28px]">
          <p className="m-0 flex items-center gap-[8px] text-[12px] leading-[14px] text-[#575755]">
            <QueriesIconShield className="size-[16px] shrink-0" />
            Groups under 5 stay hidden, even after filters are combined.
          </p>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={() =>
                setDraft({
                  region: [],
                  edu: '',
                  interest: '',
                  age: '',
                  gender: '',
                  extras: {},
                  by: draft.by,
                })
              }
              className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#165d3a] shadow-[0_1px_2px_rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Clear all
            </button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="!px-[16px] !py-[8.5px]"
              rightIcon={<AgencyArrowRightIcon />}
              onClick={() => onApply(draft)}
            >
              Show {formatCount(liveCount)} talents
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MoreFiltersDrawer;
