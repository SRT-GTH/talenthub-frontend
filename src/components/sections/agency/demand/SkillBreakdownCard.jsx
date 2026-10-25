import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import DemandCard from './DemandCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import DemandNote from './DemandNote.jsx';
import DemandTable from './DemandTable.jsx';
import { ROW, TD } from './demandStyles.js';

/*
 * SkillBreakdownCard — "Skill breakdown" (Figma 8702:732, 808 wide): # | Skill | Category | Opportunities ▾ | Share | Growth. Click a header to sort (Opportunities desc by default,
 * hint "Sorted by opportunities · click a header to sort"); click a row to filter the page to that skill (the selected row is tinted #ebf1ec, 11.4.5b).
 * Skills under 5 opportunities print the "<5" chip with — in Share / Growth (11.4.5c). Growth: ▲ +38% #387440 · ▼ −3% #c0392b (the real minus sign).
 * Props: rows [{ id, name, category, count, share, growth }], selectedId, onSelect(id|null), note.
 */

const COLUMNS = [
  { key: 'rank', label: '#', width: 40 },
  { key: 'name', label: 'Skill', sortable: true },
  { key: 'category', label: 'Category', width: 150, sortable: true },
  { key: 'count', label: 'Opportunities', width: 120, align: 'right', sortable: true },
  { key: 'share', label: 'Share', width: 90, align: 'right', sortable: true },
  { key: 'growth', label: 'Growth', width: 110, align: 'right', sortable: true },
];

const growth = (g) =>
  typeof g === 'number' ? (
    <span className={classNames('font-semibold', g >= 0 ? 'text-[#387440]' : 'text-[#c0392b]')}>
      {`${g >= 0 ? '▲ +' : '▼ −'}${Math.abs(g)}%`}
    </span>
  ) : (
    '—'
  );

const SkillBreakdownCard = ({ rows, selectedId, onSelect, note }) => {
  const [sort, setSort] = useState({ key: 'count', dir: 'desc' });
  const sorted = useMemo(() => {
    const k = sort.key;
    const dir = sort.dir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const av = a[k] ?? -Infinity;
      const bv = b[k] ?? -Infinity;
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }, [rows, sort]);
  const onSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: key === 'name' || key === 'category' ? 'asc' : 'desc' }
    );
  const label = COLUMNS.find((c) => c.key === sort.key)?.label.toLowerCase();
  return (
    <DemandCard
      id="skill-breakdown"
      title="Skill breakdown"
      hint={`Sorted by ${label} · click a header to sort`}
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      <DemandTable
        caption="Skills by opportunities last quarter"
        columns={COLUMNS}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={onSort}
      >
        {sorted.map((r, i) => {
          const low = isSuppressed(r.count);
          const on = r.id !== undefined && r.id === selectedId;
          return (
            <tr
              key={r.id ?? r.name}
              aria-selected={on || undefined}
              onClick={() => r.id && onSelect?.(on ? null : r.id)}
              className={classNames(
                ROW,
                on && 'bg-[#ebf1ec]',
                r.id && onSelect && 'cursor-pointer'
              )}
            >
              <td className={classNames(TD, 'font-medium')}>{i + 1}</td>
              <td className={TD}>
                {r.id && onSelect ? (
                  <button
                    type="button"
                    aria-pressed={on}
                    className="min-h-[24px] cursor-pointer bg-transparent p-0 text-left font-sans text-[14px] leading-[17px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    {r.name}
                  </button>
                ) : (
                  r.name
                )}
              </td>
              <td className={TD}>{r.category}</td>
              <td className={classNames(TD, 'text-right')}>
                {low ? <SuppressedValue value={r.count} /> : formatCount(r.count)}
              </td>
              <td className={classNames(TD, 'text-right')}>
                {low || typeof r.share !== 'number' ? '—' : `${r.share.toFixed(1)}%`}
              </td>
              <td className={classNames(TD, 'text-right')}>{low ? '—' : growth(r.growth)}</td>
            </tr>
          );
        })}
      </DemandTable>
      {note ? <DemandNote>{note}</DemandNote> : null}
    </DemandCard>
  );
};

export default SkillBreakdownCard;
