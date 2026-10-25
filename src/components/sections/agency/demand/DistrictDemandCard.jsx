import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import DemandCard from './DemandCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import { DemandEyeOffIcon } from './demandIcons.jsx';
import DemandTable from './DemandTable.jsx';
import { ROW, TD } from './demandStyles.js';

/*
 * DistrictDemandCard — "Demand by district · Northern" (Figma 8702:417645 card, 808 wide; replaces the map when a region is chosen): # | District | Opportunities | Share | Growth.
 * A district under 5 opportunities reads the "Too few opportunities to show" chip with — in Share and Growth; "… 8 more districts" closes the list; the note says how many
 * opportunities the hidden districts hold together. Props: title, hint, rows [{ id, name, count, share, growth }], more, moreNote, note.
 */

const COLUMNS = [
  { key: 'rank', label: '#', width: 40 },
  { key: 'name', label: 'District' },
  { key: 'count', label: 'Opportunities', width: 230, sortable: false },
  { key: 'share', label: 'Share', width: 100, align: 'right' },
  { key: 'growth', label: 'Growth', width: 110, align: 'right' },
];

const DistrictDemandCard = ({ title, hint, rows, more, note }) => (
  <DemandCard
    id="demand-by-district"
    title={title}
    hint={hint}
    className="flex flex-col"
    bodyClassName="flex flex-1 flex-col gap-[12px] px-[24px] pb-[24px]"
  >
    <DemandTable caption={title} columns={COLUMNS} sortKey="count" minWidth={520}>
      {rows.map((r, i) => {
        const low = isSuppressed(r.count);
        return (
          <tr key={r.id} className={classNames(ROW, low && 'h-[48px]')}>
            <td className={classNames(TD, 'font-medium')}>{i + 1}</td>
            <td className={TD}>{r.name}</td>
            <td className={TD}>
              {low ? (
                <SuppressedValue value={r.count} label="Too few opportunities to show" />
              ) : (
                formatCount(r.count)
              )}
            </td>
            <td className={classNames(TD, 'text-right')}>{low ? '—' : `${r.share}%`}</td>
            <td className={classNames(TD, 'text-right')}>
              {low ? (
                '—'
              ) : (
                <span
                  className={classNames(
                    'font-semibold',
                    r.growth >= 0 ? 'text-[#387440]' : 'text-[#c0392b]'
                  )}
                >
                  {`${r.growth >= 0 ? '▲ +' : '▼ −'}${Math.abs(r.growth)}%`}
                </span>
              )}
            </td>
          </tr>
        );
      })}
      {more ? (
        <tr>
          <td className={classNames(TD, 'h-[47px] font-medium')}>…</td>
          <td className={TD}>{`${more} more districts`}</td>
          <td className={TD}>
            <SuppressedValue value={0} label="Too few opportunities to show" />
          </td>
          <td className={classNames(TD, 'text-right')}>—</td>
          <td className={classNames(TD, 'text-right')}>—</td>
        </tr>
      ) : null}
    </DemandTable>
    <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
      <DemandEyeOffIcon className="mt-[0px] size-[16px] shrink-0 text-[#575755]" />
      <span>{note}</span>
    </p>
  </DemandCard>
);

export default DistrictDemandCard;
