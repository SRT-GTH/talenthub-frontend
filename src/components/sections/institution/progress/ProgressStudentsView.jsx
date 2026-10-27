import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, progressStudents } from '../../../../services/institutionPortal.api.js';
import InstitutionButton from '../InstitutionButton.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import {
  PROGRESS_COPY,
  PROGRESS_FILTERS,
  PROGRESS_FORMS,
  PROGRESS_SORTS,
} from './data/progressData.js';
import {
  ProgressChevronIcon,
  ProgressClockIcon,
  ProgressGridIcon,
  ProgressListIcon,
} from './ProgressIcons.jsx';
import ProgressStudentRow from './ProgressStudentRow.jsx';
import ProgressTabs from './ProgressTabs.jsx';

const log = debug('ProgressStudentsView');

/*
 * ProgressStudentsView — 11.3.2a "Progress · Students" (Figma 8595:92): title + term sticker + subtitle, the form tabs (Form 1 · Form 2 · Form 3 ·
 * Graduates, real counts), a toolbar (All / On track / Needs support chips with counts · list/cards toggle · sort select · "Export report"), the amber
 * banner (only when someone has been inactive for 30 days) and the list card.
 * Live: GET /institution/progress/students?form= (one request per form tab). Students not linked yet, or under 18 without a guardian's agreement, are
 * listed by name only and are not counted in On track / Needs support.
 * URL keys: tab=form-1|form-2|form-3|graduates (default form-3) · filter=on-track|needs-support · view=cards · sort=lowest|highest|name · q=
 * Props: data (useInstitutionState()).
 */

const matchesFilter = (student, filter) => {
  if (filter === 'on-track') return student.status === 'on-track';
  if (filter === 'needs-support')
    return student.status === 'support' || student.status === 'flagged';
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
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setRes(null);
    try {
      setRes(await progressStudents(PROGRESS_FORMS.find((f) => f.id === tab).api));
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const base = res?.items ?? [];
    const needle = q.trim().toLowerCase();
    const list = base.filter(
      (s) =>
        matchesFilter(s, filter) &&
        (!needle || `${s.name} ${s.stream}`.toLowerCase().includes(needle))
    );
    return sorters[sort] ? [...list].sort(sorters[sort]) : list;
  }, [res, filter, q, sort]);

  useEffect(() => {
    log('state', { tab, filter, view, sort, q, rows: rows.length });
  }, [tab, filter, view, sort, q, rows.length]);

  const tabs = PROGRESS_FORMS.map((f) => ({
    ...f,
    count: String(res?.forms?.find((x) => x.id === f.id)?.count ?? '…'),
  }));
  const counts = res?.counts;

  return (
    <div className="flex flex-col gap-[18px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[26px] leading-[32px] font-semibold tracking-[-0.52px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.68px]">
            {PROGRESS_COPY.title}
          </h1>
          {res?.term ? (
            <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {tabs.find((t) => t.id === tab)?.label} · {res.term}
            </span>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
          {PROGRESS_COPY.subtitle}
        </p>
      </header>

      <ProgressTabs
        tabs={tabs}
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
                {f.label} {counts ? counts[f.count] : ''}
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

      {counts?.inactive ? (
        <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
          <ProgressClockIcon className="size-[18px] shrink-0 text-[#967014]" />
          {PROGRESS_COPY.banner(counts.inactive)}
        </p>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {res ? `${rows.length} ${rows.length === 1 ? 'student' : 'students'} shown` : 'Loading'}
      </p>

      <section
        id="progress-list"
        role="tabpanel"
        aria-labelledby={`progress-tab-${tab}`}
        className="overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white"
      >
        {error ? (
          <p role="alert" className="m-0 px-[20px] py-[28px] font-sans text-[14px] text-[#902b20]">
            Could not load progress: {error}{' '}
            <button type="button" onClick={load} className="cursor-pointer font-semibold underline">
              Try again
            </button>
          </p>
        ) : !res ? (
          <p className="m-0 px-[20px] py-[28px] font-sans text-[14px] text-[#595959]">
            Loading students…
          </p>
        ) : rows.length ? (
          <ul
            className={classNames(
              'm-0 list-none p-0',
              view === 'cards'
                ? 'grid grid-cols-1 gap-[12px] p-[12px] sm:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-[4px]'
            )}
          >
            {rows.map((student) => (
              <ProgressStudentRow key={student.id} student={student} cards={view === 'cards'} />
            ))}
          </ul>
        ) : (
          <p className="m-0 px-[20px] py-[28px] font-sans text-[14px] leading-[20px] text-[#595959]">
            {res.items.length ? 'No students match.' : 'No students in this form yet.'}{' '}
            {res.items.length ? (
              <Link
                to={`${INSTITUTION_BASE}/progress${tab === 'form-3' ? '' : `?tab=${tab}`}`}
                className="font-semibold text-[#387440] no-underline hover:underline"
              >
                Clear filters
              </Link>
            ) : (
              <Link
                to={`${INSTITUTION_BASE}/students`}
                className="font-semibold text-[#387440] no-underline hover:underline"
              >
                Open the roster
              </Link>
            )}
          </p>
        )}
      </section>
    </div>
  );
};

export default ProgressStudentsView;
