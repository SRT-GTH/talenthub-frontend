import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import { formatCount } from '../institutionFormat.js';
import {
  CAUGHT_UP_AVERAGE_DAYS,
  FILTER_CHIPS,
  KIND_FILTER,
  KIND_LABELS,
  QUEUE_COUNTS,
  SORT_OPTIONS,
  WAITING_LONG_COUNT,
} from './data/recordsData.js';
import QueueBanner from './QueueBanner.jsx';
import QueueHeader from './QueueHeader.jsx';
import QueuePill from './QueuePill.jsx';
import QueueRow from './QueueRow.jsx';
import QueueTabs from './QueueTabs.jsx';
import QueueToolbar from './QueueToolbar.jsx';
import RecordConfirmDialog from './RecordConfirmDialog.jsx';
import { RecordsIconCheck11, RecordsIconEye13 } from './recordsIcons.jsx';
import { approveRecords, useRecordsStore } from './useRecordsStore.js';

const log = debug('RecordsQueueView');

/*
 * RecordsQueueView — "Records" verification queue (Figma 11.2.3a 8593:8, bulk approve 11.2.3e 8593:387863, all caught up 11.2.3f 8744:435251).
 * URL keys: tab=approved|rejected|all (default: to verify) · filter=results|certificates · view=cards|list · sort=oldest|newest · modal=bulk-approve · state=caught-up.
 * Bulk approve: "Approve selected" turns the row checkboxes on; with rows ticked the button reads "Approve n selected" and opens the confirmation (?modal=bulk-approve).
 * ⚠️ ASSUMPTIONS: the cards view is not drawn (the list stays); ?modal=bulk-approve with nothing ticked pre-selects the first four waiting records, as drawn; Approved / Rejected / All tabs
 * list sample decided records in the same row layout. Tab counts: Figma numbers moved by the decisions made in this session; state=caught-up draws 0 to verify and Approved 1,509.
 * Props: data (useInstitutionState()).
 */

const joinNames = (names) =>
  names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const REVIEW_DARK =
  'inline-flex h-[25px] items-center rounded-full border border-solid border-[#1c2a21]/12 bg-[#387440] px-[10px] text-[12.5px] leading-[15px] font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const REVIEW_LIGHT =
  'inline-flex h-[25px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] text-[12.5px] leading-[15px] font-bold text-[#2d5d33] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const RecordsQueueView = ({ data }) => {
  const { records, decided } = useRecordsStore();
  const { params, modal, update, state } = data;
  const [selectMode, setSelectMode] = useState(false);
  const [picked, setPicked] = useState([]);
  const [announce, setAnnounce] = useState('');
  const caughtUp = state === 'caught-up';
  const tab = ['approved', 'rejected', 'all'].includes(data.tab) ? data.tab : 'verify';
  const chip = ['results', 'certificates'].includes(data.filter) ? data.filter : 'all';
  const view = params.get('view') === 'cards' ? 'cards' : 'list';
  const sort = params.get('sort') === 'newest' ? 'newest' : 'oldest';

  useEffect(() => {
    log('mount', { tab, chip, caughtUp, modal });
  }, [tab, chip, caughtUp, modal]);

  const counts = useMemo(() => {
    const dec = (s) => decided.filter((d) => d.status === s).length;
    const byChip = (f) => decided.filter((d) => f === 'all' || KIND_FILTER[d.kind] === f).length;
    const pending = caughtUp ? 0 : Math.max(0, QUEUE_COUNTS.pending - byChip('all'));
    return {
      pending,
      approved: QUEUE_COUNTS.approved + (caughtUp ? QUEUE_COUNTS.pending : 0) + dec('approved'),
      rejected: QUEUE_COUNTS.rejected + dec('rejected'),
      all: QUEUE_COUNTS.all,
      chip: {
        all: pending,
        results: caughtUp ? 0 : Math.max(0, QUEUE_COUNTS.results - byChip('results')),
        certificates: caughtUp
          ? 0
          : Math.max(0, QUEUE_COUNTS.certificates - byChip('certificates')),
      },
      waitingLong: caughtUp
        ? 0
        : Math.max(0, WAITING_LONG_COUNT - decided.filter((d) => d.waitingDays > 7).length),
    };
  }, [decided, caughtUp]);

  const rows = useMemo(() => {
    if (caughtUp && tab === 'verify') return [];
    const base = records.filter((r) => {
      if (tab === 'verify') return r.status === 'pending' || r.status === 'needs-info';
      if (tab === 'approved') return r.status === 'approved';
      if (tab === 'rejected') return r.status === 'rejected';
      return true;
    });
    const filtered = base.filter((r) => chip === 'all' || KIND_FILTER[r.kind] === chip);
    return sort === 'newest' ? [...filtered].reverse() : filtered;
  }, [records, tab, chip, sort, caughtUp]);

  const pendingRows = rows.filter((r) => r.status === 'pending');
  let effective = [];
  if (picked.length > 0) effective = picked;
  else if (modal === 'bulk-approve') effective = pendingRows.slice(0, 4).map((r) => r.id);
  const selectedRecords = records.filter((r) => effective.includes(r.id));
  const showChecks = selectMode || picked.length > 0;

  const setQuery = (patch) => update({ ...patch, modal: null }, { replace: true });

  const onAction = () => {
    if (effective.length > 0) update({ modal: 'bulk-approve' });
    else {
      log('select mode on');
      setSelectMode(true);
    }
  };

  const confirmBulk = () => {
    const ids = selectedRecords.map((r) => r.id);
    approveRecords(ids);
    setPicked([]);
    setSelectMode(false);
    update({ modal: null }, { replace: true });
    setAnnounce(`Approved ${ids.length} records.`);
  };

  const closeBulk = () => {
    setPicked([]);
    update({ modal: null }, { replace: true });
  };

  const toggle = (id) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const tabs = [
    { id: 'approved', label: 'Approved', count: formatCount(counts.approved) },
    { id: 'rejected', label: 'Rejected', count: formatCount(counts.rejected) },
    { id: 'verify', label: 'To verify', count: formatCount(counts.pending) },
    { id: 'all', label: 'All records', count: formatCount(counts.all) },
  ];
  const chips = FILTER_CHIPS.map((c) => ({ ...c, count: formatCount(counts.chip[c.id]) }));

  const renderRow = (r) => {
    const href = `/institution/records/${r.id}`;
    const kind = (
      <QueuePill icon={<RecordsIconCheck11 className="size-[11px]" />}>
        {KIND_LABELS[r.kind]}
      </QueuePill>
    );
    if (r.status === 'needs-info') {
      return (
        <QueueRow
          key={r.id}
          initials={r.initials}
          name={r.student}
          badge="Needs info"
          sub={r.summary}
          muted
          href={href}
          pills={
            <span className="flex items-center gap-[6px] opacity-50">
              {kind}
              <QueuePill className="!text-[12.5px] !leading-[15px] !font-bold">
                Asked {r.askedOn}
              </QueuePill>
            </span>
          }
          action={
            <InstitutionButton
              to={href}
              size="sm"
              className="!h-[40px] !rounded-[10px] !px-[16px] !text-[16px]"
              aria-label={`Review ${r.student}`}
            >
              Review
            </InstitutionButton>
          }
        />
      );
    }
    const dark = r.waitingDays >= 7 || r.status !== 'pending';
    return (
      <QueueRow
        key={r.id}
        initials={r.initials}
        name={r.student}
        badge={
          r.status === 'pending' ? 'Pending' : r.status === 'approved' ? 'Approved' : 'Rejected'
        }
        sub={r.summary}
        href={href}
        select={
          showChecks && r.status === 'pending'
            ? {
                checked: effective.includes(r.id),
                onChange: () => toggle(r.id),
                label: `Select ${r.student}`,
              }
            : undefined
        }
        pills={
          <>
            {r.status === 'pending' ? (
              <QueuePill tone="amber" icon={<RecordsIconEye13 className="size-[13px]" />}>
                Waiting {r.waitingDays} days
              </QueuePill>
            ) : null}
            {kind}
          </>
        }
        action={
          <Link
            to={href}
            aria-label={`Review ${r.student}`}
            className={classNames(dark ? REVIEW_DARK : REVIEW_LIGHT)}
          >
            Review
          </Link>
        }
      />
    );
  };

  const n = selectedRecords.length;
  const names = joinNames(selectedRecords.map((r) => r.student.split(' ')[0]));

  return (
    <div className="flex flex-col gap-[24px] pt-[4px] font-sans">
      <QueueHeader
        title="Records"
        count={`${formatCount(counts.pending)} to verify`}
        sentence="Students add results, certificates and awards. You confirm what your school issued."
      />
      <div className="flex flex-col gap-[18px]">
        <QueueTabs
          label="Records"
          tabs={tabs}
          active={tab}
          onSelect={(id) => setQuery({ tab: id === 'verify' ? null : id, filter: null })}
        />
        <QueueToolbar
          filterLabel="Record type"
          chips={chips}
          chip={chip}
          onChip={(id) => setQuery({ filter: id === 'all' ? null : id })}
          view={view}
          onView={(v) => setQuery({ view: v === 'list' ? null : v })}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSort={(id) => setQuery({ sort: id === 'oldest' ? null : id })}
          actionLabel={
            effective.length > 0 ? `Approve ${effective.length} selected` : 'Approve selected'
          }
          actionPressed={selectMode}
          onAction={onAction}
        />
        {tab === 'verify' ? (
          <QueueBanner>
            {caughtUp
              ? `Nice work. Your average decision time this term is ${CAUGHT_UP_AVERAGE_DAYS} days.`
              : `${counts.waitingLong} records have waited more than 7 days. Students see “pending” on their profile until you decide.`}
          </QueueBanner>
        ) : null}
        {rows.length ? (
          <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
            {rows.map(renderRow)}
          </ul>
        ) : (
          <div className="pt-[56px] pb-[64px]">
            <EmptyState
              card={false}
              title="All caught up"
              message="No records are waiting. When a student adds a result, certificate or award from your school, it shows up here."
              actionLabel="See approved records"
              onAction={() => setQuery({ tab: 'approved', state: null })}
            />
          </div>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {modal === 'bulk-approve' && n > 0 ? (
        <RecordConfirmDialog
          title={`Approve ${n} records?`}
          body={`${names} will see “Verified by Savannah Hills SHS” on these records. Each approval is logged under your name.`}
          confirmLabel={`Approve ${n} records`}
          onConfirm={confirmBulk}
          onCancel={closeBulk}
        />
      ) : null}
    </div>
  );
};

export default RecordsQueueView;
