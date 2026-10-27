import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, bulkApproveRecords } from '../../../../services/institutionPortal.api.js';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import { FILTER_CHIPS, KIND_LABELS, QUEUE_COPY, SORT_OPTIONS } from './data/recordsData.js';
import QueueBanner from './QueueBanner.jsx';
import QueueHeader from './QueueHeader.jsx';
import QueuePill from './QueuePill.jsx';
import QueueRow from './QueueRow.jsx';
import QueueTabs from './QueueTabs.jsx';
import QueueToolbar from './QueueToolbar.jsx';
import RecordConfirmDialog from './RecordConfirmDialog.jsx';
import { RecordsIconCheck11, RecordsIconEye13 } from './recordsIcons.jsx';
import { useRecordsQueue } from './useRecordsStore.js';

const log = debug('RecordsQueueView');

/*
 * RecordsQueueView — "Records" verification queue (Figma 11.2.3a 8593:8, bulk approve 11.2.3e 8593:387863, all caught up 11.2.3f 8744:435251).
 * Live: GET /api/institution/records?tab&filter&sort. Bulk approve: "Approve selected" turns the row checkboxes on; with rows ticked the button reads
 * "Approve n selected" and opens the confirmation (?modal=bulk-approve) → POST /records/bulk-approve. The "To verify" tab with nothing waiting is
 * the "All caught up" state (11.2.3f) with the term's average decision time.
 * URL keys: tab=approved|rejected|all (default: to verify) · filter=results|certificates · view=cards|list · sort=oldest|newest · modal=bulk-approve.
 * ⚠️ ASSUMPTION: the cards view is not drawn (the list stays).
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

/** Counts are the school's own work queue, not public aggregates: 0 reads 0, small numbers are shown as they are. */
const n0 = (n) => (n == null ? '–' : String(n));

const RecordsQueueView = ({ data }) => {
  const { params, modal, update } = data;
  const tab = ['approved', 'rejected', 'all'].includes(data.tab) ? data.tab : 'verify';
  const chip = ['results', 'certificates'].includes(data.filter) ? data.filter : 'all';
  const sort = params.get('sort') === 'newest' ? 'newest' : 'oldest';
  const { data: queue, error, reload } = useRecordsQueue({ tab, filter: chip, sort });
  const [selectMode, setSelectMode] = useState(false);
  const [picked, setPicked] = useState([]);
  const location = useLocation();
  const [announce, setAnnounce] = useState(location.state?.announce ?? '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    log('mount', { tab, chip, modal });
  }, [tab, chip, modal]);

  const counts = queue?.counts;
  const rows = queue?.items ?? [];
  const school = queue?.school ?? 'your school';
  const selected = rows.filter((r) => picked.includes(r.id));
  const showChecks = selectMode || picked.length > 0;

  const setQuery = (patch) => update({ ...patch, modal: null }, { replace: true });

  const onAction = () => {
    if (picked.length > 0) update({ modal: 'bulk-approve' });
    else setSelectMode((on) => !on);
  };

  const confirmBulk = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await bulkApproveRecords(selected.map((r) => r.id));
      setAnnounce(`Approved ${res.approved} ${res.approved === 1 ? 'record' : 'records'}.`);
      setPicked([]);
      setSelectMode(false);
      await reload();
    } catch (err) {
      setAnnounce(apiMessage(err));
    } finally {
      setBusy(false);
      update({ modal: null }, { replace: true });
    }
  };

  const toggle = (id) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const tabs = [
    { id: 'approved', label: 'Approved', count: n0(counts?.approved) },
    { id: 'rejected', label: 'Rejected', count: n0(counts?.rejected) },
    { id: 'verify', label: 'To verify', count: n0(counts?.pending) },
    { id: 'all', label: 'All records', count: n0(counts?.all) },
  ];
  const chips = FILTER_CHIPS.map((c) => ({ ...c, count: n0(counts?.chip?.[c.id]) }));

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
                checked: picked.includes(r.id),
                onChange: () => toggle(r.id),
                label: `Select ${r.student}`,
              }
            : undefined
        }
        pills={
          <>
            {r.status === 'pending' ? (
              <QueuePill tone="amber" icon={<RecordsIconEye13 className="size-[13px]" />}>
                {r.waitingDays === 0
                  ? 'Sent today'
                  : `Waiting ${r.waitingDays} ${r.waitingDays === 1 ? 'day' : 'days'}`}
              </QueuePill>
            ) : r.decidedOn ? (
              <QueuePill>{`${r.status === 'approved' ? 'Approved' : 'Rejected'} ${r.decidedOn}`}</QueuePill>
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
            {r.status === 'pending' ? 'Review' : 'View'}
          </Link>
        }
      />
    );
  };

  const names = joinNames(selected.map((r) => r.student.split(' ')[0]));
  const caughtUp = tab === 'verify' && counts && counts.pending === 0;

  return (
    <div className="flex flex-col gap-[24px] pt-[4px] font-sans">
      <QueueHeader
        title="Records"
        count={`${counts ? counts.pending : '…'} to verify`}
        sentence={QUEUE_COPY.sentence}
      />
      <div className="flex flex-col gap-[18px]">
        <QueueTabs
          label="Records"
          tabs={tabs}
          active={tab}
          onSelect={(id) => {
            setPicked([]);
            setSelectMode(false);
            setQuery({ tab: id === 'verify' ? null : id, filter: null });
          }}
        />
        <QueueToolbar
          filterLabel="Record type"
          chips={chips}
          chip={chip}
          onChip={(id) => setQuery({ filter: id === 'all' ? null : id })}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSort={(id) => setQuery({ sort: id === 'oldest' ? null : id })}
          actionLabel={
            picked.length > 0
              ? `Approve ${picked.length} selected`
              : selectMode
                ? 'Pick records to approve'
                : 'Approve selected'
          }
          actionPressed={selectMode}
          onAction={onAction}
        />
        {tab === 'verify' && counts ? (
          <QueueBanner>
            {caughtUp
              ? QUEUE_COPY.caughtUp(counts.averageDays)
              : QUEUE_COPY.waiting(counts.waitingLong)}
          </QueueBanner>
        ) : null}
        {error ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            {error}
          </p>
        ) : null}
        {!queue && !error ? (
          <p className="m-0 rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#737373]">
            Loading records…
          </p>
        ) : rows.length ? (
          <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
            {rows.map(renderRow)}
          </ul>
        ) : queue ? (
          <div className="pt-[56px] pb-[64px]">
            <EmptyState
              card={false}
              title={tab === 'verify' ? 'All caught up' : 'Nothing here yet'}
              message={tab === 'verify' ? QUEUE_COPY.empty : 'Records you decide show up here.'}
              actionLabel={tab === 'verify' ? 'See approved records' : 'Back to records to verify'}
              onAction={() => setQuery({ tab: tab === 'verify' ? 'approved' : null })}
            />
          </div>
        ) : null}
      </div>
      <p
        role="status"
        aria-live="polite"
        className={
          announce
            ? 'm-0 rounded-[12px] border border-solid border-[#e1eae2] bg-[#f3f8f4] px-[16px] py-[12px] text-[14px] text-[#224626]'
            : 'sr-only'
        }
      >
        {announce}
      </p>
      {modal === 'bulk-approve' && selected.length > 0 ? (
        <RecordConfirmDialog
          title={`Approve ${selected.length} ${selected.length === 1 ? 'record' : 'records'}?`}
          body={`${names} will see “Verified by ${school}” on these records. Each approval is logged under your name.`}
          confirmLabel={
            busy
              ? 'Approving…'
              : `Approve ${selected.length} ${selected.length === 1 ? 'record' : 'records'}`
          }
          onConfirm={confirmBulk}
          onCancel={() => update({ modal: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default RecordsQueueView;
