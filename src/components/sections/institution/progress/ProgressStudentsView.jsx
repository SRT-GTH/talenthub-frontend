import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionButton from '../InstitutionButton.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import {
  PROGRESS_COPY,
  PROGRESS_FILTERS,
  PROGRESS_FORMS,
  PROGRESS_OTHER_FORMS,
  PROGRESS_SORTS,
  PROGRESS_STUDENTS,
} from './data/progressData.js';
import {
  ProgressChevronIcon,
  ProgressClockIcon,
  ProgressGridIcon,
  ProgressListIcon,
} from './ProgressIcons.jsx';
import ProgressStudentRow from './ProgressStudentRow.jsx';
import ProgressTabs from './ProgressTabs.jsx';
import { useProgressFlags } from './useProgressFlags.js';

const log = debug('ProgressStudentsView');

/*
 * ProgressStudentsView — 11.3.2a "Progress · Students" (Figma 8595:92): title "Progress" (34/41 600) + "Form 3 · term 1" sticker + subtitle, the form tabs
 * (Form 1 · Form 2 · Form 3 · Graduates), a toolbar (All / On track / Needs support chips · list/cards toggle · sort select · "Export report"), the
 * amber banner and the list card (r22, 1px #e1eae2).
 * URL keys (data = useInstitutionState()): tab=form-1|form-2|form-3|graduates (default form-3) · filter=on-track|needs-support · view=cards (list default)
 * · sort=lowest|highest|name · q= (text filter on name / stream; the top-bar search goes to the roster, so ?q= here is the only entry).
 * ⚠️ ASSUMPTION: the sort pill is a native select (options not drawn beyond "Lowest first"); the cards view is not drawn (same rows as cards); the
 * default order is the order drawn (Figma labels it "Lowest first" but the rows are not ascending: Figma inconsistency kept, sorting only when chosen).
 * "Export report" opens the download dialog of the class outcomes page.
 * Props: data (useInstitutionState()).
 */

const matchesFilter = (student, filter) => {
  if (filter === 'on-track') return student.status === 'on-track';
  if (filter === 'needs-support') return student.status === 'support';
  return true;
};

const sorters = {
  lowest: (a, b) => (a.profile ?? 0) - (b.profile ?? 0),
  highest: (a, b) => (b.profile ?? 0) - (a.profile ?? 0),
  name: (a, b) => a.name.localeCompare(b.name),
};

const ProgressStudentsView = ({ data }) => {
  const { params, update, q } = data;
  const tab = PROGRESS_FORMS.some((f) => f.id === params.get('tab')) ? params.get('tab') : 'form-3';
  const filter = PROGRESS_FILTERS.some((f) => f.id === data.filter) ? data.filter : 'all';
  const view = data.view === 'cards' ? 'cards' : 'list';
  const sort = params.get('sort');
  const { flagged } = useProgressFlags();

  const rows = useMemo(() => {
    const base = tab === 'form-3' ? PROGRESS_STUDENTS : (PROGRESS_OTHER_FORMS[tab] ?? []);
    const needle = q.trim().toLowerCase();
    const list = base.filter(
      (s) =>
        matchesFilter(s, filter) &&
        (!needle || `${s.name} ${s.stream}`.toLowerCase().includes(needle))
    );
    return sorters[sort] ? [...list].sort(sorters[sort]) : list;
  }, [tab, filter, q, sort]);

  useEffect(() => {
    log('state', { tab, filter, view, sort, q, rows: rows.length });
  }, [tab, filter, view, sort, q, rows.length]);

  return (
    <div className="flex flex-col gap-[18px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[26px] leading-[32px] font-semibold tracking-[-0.52px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.68px]">
            {PROGRESS_COPY.title}
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {PROGRESS_COPY.chip}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
          {PROGRESS_COPY.subtitle}
        </p>
      </header>

      <ProgressTabs
        tabs={PROGRESS_FORMS}
        value={tab}
        onChange={(id) => update({ tab: id === 'form-3' ? null : id, filter: null })}
        label="Forms"
        panelId="progress-list"
      />

      <div className="flex flex-wrap items-center gap-[8px]">
        <div role="group" aria-label="Filter students" className="flex flex-wrap gap-[8px]">
          {PROGRESS_FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => update({ filter: f.id === 'all' ? null : f.id })}
                className={classNames(
                  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  on
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <span aria-hidden="true" className="hidden min-w-[16px] flex-1 md:block" />
        <div
          role="group"
          aria-label="View"
          className="flex gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
        >
          {[
            { id: 'cards', label: 'Cards', Icon: ProgressGridIcon },
            { id: 'list', label: 'List', Icon: ProgressListIcon },
          ].map((item) => {
            const { id, label } = item;
            const Icon = item.Icon;
            const on = view === id;
            return (
              <button
                key={id}
                type="button"
                aria-label={label}
                aria-pressed={on}
                onClick={() => update({ view: id === 'list' ? null : id })}
                className={classNames(
                  'flex h-[26px] w-[34px] cursor-pointer items-center justify-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                  on ? 'bg-[#1c2a21] text-white' : 'bg-transparent text-[#737373]'
                )}
              >
                <Icon className="size-[16px]" />
              </button>
            );
          })}
        </div>
        <label className="relative inline-flex h-[34px] items-center rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
          <span className="sr-only">Sort students</span>
          <select
            value={sorters[sort] ? sort : 'lowest'}
            onChange={(event) => update({ sort: event.target.value })}
            className="cursor-pointer appearance-none border-0 bg-transparent pr-[20px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] outline-none"
          >
            {PROGRESS_SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <ProgressChevronIcon className="pointer-events-none absolute right-[12px] size-[14px] text-[#595959]" />
        </label>
        <InstitutionButton
          size="xs"
          to={`${INSTITUTION_BASE}/progress/class-outcomes?modal=download`}
        >
          {PROGRESS_COPY.exportLabel}
        </InstitutionButton>
      </div>

      <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
        <ProgressClockIcon className="size-[18px] shrink-0 text-[#967014]" />
        {PROGRESS_COPY.banner}
      </p>

      <p role="status" aria-live="polite" className="sr-only">
        {rows.length} {rows.length === 1 ? 'student' : 'students'} shown
      </p>

      <section
        id="progress-list"
        role="tabpanel"
        aria-labelledby={`progress-tab-${tab}`}
        className="overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white"
      >
        {rows.length ? (
          <ul
            className={classNames(
              'm-0 list-none p-0',
              view === 'cards'
                ? 'grid grid-cols-1 gap-[12px] p-[12px] sm:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-[4px]'
            )}
          >
            {rows.map((student) => (
              <ProgressStudentRow
                key={student.id}
                student={student}
                flagged={flagged.has(student.id)}
                cards={view === 'cards'}
              />
            ))}
          </ul>
        ) : (
          <p className="m-0 px-[20px] py-[28px] font-sans text-[14px] leading-[20px] text-[#595959]">
            {/* ⚠️ ASSUMPTION: the empty list is not drawn; this is the plain sentence. */}
            No students match.{' '}
            <Link
              to={`${INSTITUTION_BASE}/progress`}
              className="font-semibold text-[#387440] no-underline hover:underline"
            >
              Clear filters
            </Link>
          </p>
        )}
      </section>
    </div>
  );
};

export default ProgressStudentsView;
