import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import DemandNote from './DemandNote.jsx';
import DemandTable from './DemandTable.jsx';
import { ROW, TD } from './demandStyles.js';
import { JOB_CATEGORIES, JOB_HINT, JOB_NOTE } from './data/demandData.js';

/*
 * JobCategoryTable — "Success by job category" (Figma 8706:418941, recruiter source): Job category | Employers | Applied | Shortlisted | Hired | Rate ▾. Employers are never
 * named; a category with fewer than 5 hires reads the "<5" chip in Hired and Rate (and a count under 5 anywhere else, e.g. Employers, reads the chip too). Sortable headers,
 * Rate desc by default. Counts through formatCount / SuppressedValue.
 */

const COLUMNS = [
  { key: 'name', label: 'Job category', sortable: true },
  { key: 'employers', label: 'Employers', width: 130, align: 'right', sortable: true },
  { key: 'applied', label: 'Applied', width: 130, align: 'right', sortable: true },
  { key: 'shortlisted', label: 'Shortlisted', width: 130, align: 'right', sortable: true },
  { key: 'hired', label: 'Hired', width: 130, align: 'right', sortable: true },
  { key: 'rate', label: 'Rate', width: 110, align: 'right', sortable: true },
];

const cell = (n) => (isSuppressed(n) ? <SuppressedValue value={n} /> : formatCount(n));

const JobCategoryTable = () => {
  const [sort, setSort] = useState({ key: 'rate', dir: 'desc' });
  const rows = useMemo(() => {
    const dir = sort.dir === 'desc' ? -1 : 1;
    return [...JOB_CATEGORIES].sort((a, b) => {
      const av = a[sort.key] ?? -1;
      const bv = b[sort.key] ?? -1;
      return typeof av === 'string' ? av.localeCompare(bv) * dir : (av - bv) * dir;
    });
  }, [sort]);
  const onSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' }
    );
  return (
    <PublicCard
      id="success-by-category"
      title="Success by job category"
      hint={JOB_HINT}
      bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
    >
      <DemandTable
        caption="Success by job category"
        columns={COLUMNS}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={onSort}
        minWidth={720}
      >
        {rows.map((r) => (
          <tr key={r.name} className={ROW}>
            <td className={classNames(TD, 'h-[40px] font-medium')}>{r.name}</td>
            <td className={classNames(TD, 'text-right')}>{cell(r.employers)}</td>
            <td className={classNames(TD, 'text-right')}>{formatCount(r.applied)}</td>
            <td className={classNames(TD, 'text-right')}>{formatCount(r.shortlisted)}</td>
            <td className={classNames(TD, 'text-right')}>{cell(r.hired)}</td>
            <td className={classNames(TD, 'text-right')}>
              {isSuppressed(r.hired) || r.rate === null ? (
                <SuppressedValue value={r.hired} />
              ) : (
                `${r.rate}%`
              )}
            </td>
          </tr>
        ))}
      </DemandTable>
      <DemandNote>{JOB_NOTE}</DemandNote>
    </PublicCard>
  );
};

export default JobCategoryTable;
