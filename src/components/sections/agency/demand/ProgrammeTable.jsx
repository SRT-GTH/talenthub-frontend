import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import DemandNote from './DemandNote.jsx';
import DemandTable from './DemandTable.jsx';
import { ROW, TD } from './demandStyles.js';
import { PROGRAMME_HINT, PROGRAMME_NOTE } from './data/demandData.js';

/*
 * ProgrammeTable — "Success by programme" (Figma 8706:… 1329 wide): Programme | Agency | Enrolled | Completed | Placed | Rate ▾. The agency's own programmes are named, other
 * agencies' programmes only appear in the "11 programmes · 4 other agencies · Totals only" row (#575755). Placed / Rate under 5 placed read the "<5" chip (the rate is hidden
 * with it). Click a column header to sort (Rate desc by default). Props: rows [{ id, name, agency, enrolled, completed, placed, rate }], totals (null when one programme is
 * selected, 11.4.5n). Counts through formatCount / SuppressedValue.
 */

const COLUMNS = [
  { key: 'name', label: 'Programme', sortable: true },
  { key: 'agency', label: 'Agency', width: 220 },
  { key: 'enrolled', label: 'Enrolled', width: 130, align: 'right', sortable: true },
  { key: 'completed', label: 'Completed', width: 130, align: 'right', sortable: true },
  { key: 'placed', label: 'Placed', width: 130, align: 'right', sortable: true },
  { key: 'rate', label: 'Rate', width: 110, align: 'right', sortable: true },
];

const cell = (n) => (isSuppressed(n) ? <SuppressedValue value={n} /> : formatCount(n));

const ProgrammeTable = ({ rows, totals }) => {
  const [sort, setSort] = useState({ key: 'rate', dir: 'desc', touched: false });
  const sorted = useMemo(() => {
    if (!sort.touched) return rows;
    const dir = sort.dir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const av = a[sort.key] ?? -1;
      const bv = b[sort.key] ?? -1;
      return typeof av === 'string' ? av.localeCompare(bv) * dir : (av - bv) * dir;
    });
  }, [rows, sort]);
  const onSort = (key) =>
    setSort((s) =>
      s.key === key
        ? {
            key,
            dir: s.key === key && s.touched ? (s.dir === 'desc' ? 'asc' : 'desc') : 'desc',
            touched: true,
          }
        : { key, dir: key === 'name' ? 'asc' : 'desc', touched: true }
    );
  return (
    <PublicCard
      id="success-by-programme"
      title="Success by programme"
      hint={PROGRAMME_HINT}
      bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
    >
      <DemandTable
        caption="Success by programme"
        columns={COLUMNS}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={onSort}
        minWidth={720}
      >
        {sorted.map((r) => (
          <tr key={r.id} className={ROW}>
            <td className={classNames(TD, 'h-[40px] font-medium')}>{r.name}</td>
            <td className={TD}>{r.agency}</td>
            <td className={classNames(TD, 'text-right')}>{formatCount(r.enrolled)}</td>
            <td className={classNames(TD, 'text-right')}>{formatCount(r.completed)}</td>
            <td className={classNames(TD, 'text-right')}>{cell(r.placed)}</td>
            <td className={classNames(TD, 'text-right')}>
              {isSuppressed(r.placed) || r.rate === null ? (
                <SuppressedValue value={r.placed} />
              ) : (
                `${r.rate}%`
              )}
            </td>
          </tr>
        ))}
        {totals ? (
          <tr>
            <td className={classNames(TD, 'h-[44px] font-medium text-[#575755]')}>
              {totals.label}
            </td>
            <td className={classNames(TD, 'text-[#575755]')}>{totals.agency}</td>
            <td className={classNames(TD, 'text-right text-[#575755]')}>
              {formatCount(totals.enrolled)}
            </td>
            <td className={classNames(TD, 'text-right text-[#575755]')}>
              {formatCount(totals.completed)}
            </td>
            <td className={classNames(TD, 'text-right text-[#575755]')}>
              {formatCount(totals.placed)}
            </td>
            <td className={classNames(TD, 'text-right text-[#575755]')}>{`${totals.rate}%`}</td>
          </tr>
        ) : null}
      </DemandTable>
      <DemandNote>{PROGRAMME_NOTE}</DemandNote>
    </PublicCard>
  );
};

export default ProgrammeTable;
