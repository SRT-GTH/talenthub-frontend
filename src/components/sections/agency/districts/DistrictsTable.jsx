import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import CardHeader from '../../publicData/ui/CardHeader.jsx';
import { formatCount } from '../agencyFormat.js';
import { UPDATED_AT } from './data/districtsData.js';
import { DistrictsRowChevronIcon, DistrictsShieldIcon } from './districtsIcons.jsx';
import DistrictsPager from './DistrictsPager.jsx';

/*
 * DistrictsTable — "Districts table" card (Figma 9394:19800, 1329x832: white, 1px #e7e7e7, r24, shadow 0 5 17, pb 8).
 *   "T8 · Card header" (title "All districts" 18/21 600 + aside "Ranked by talents registered · updated today 06:00" 12/14 500) ·
 *   header row (#f8f9f7, px28 py14, 12/14 600 #595959) · 12 rows (51 high, px28 py15, 1px #e7e7e7, hover #f4f8f5) · privacy row (#fafaf7, shield + 14/17 500) · pager.
 *   Columns at >= lg (px caps, the last one takes the rest): 48 # · 300 District · 190 Region · 130 Talents · 150 30-day change · 200 Assessment (90x6 bar #ebf0ec / #387440 + %) · 130 Placements · chevron.
 *   Each row is a link to /agency/regions/:regionId/districts/:districtId (rows whose district the detail mock does not know open the region page).
 *   Below lg there is no Figma frame: ⚠️ ASSUMPTION a dense card per row — rank, name, region, talents and change on top, assessment and placements under.
 * Props: items, hidden, page, pages, from, to, total, onPage(n), sort (the aside says "Ranked by talents registered" only for the talents sort).
 * Counts go through formatCount (< 5 reads "<5"); hidden districts are never rows, only their number is shown.
 */

const COLS =
  'lg:grid-cols-[48px_minmax(0,300px)_minmax(0,190px)_minmax(0,130px)_minmax(0,150px)_minmax(0,200px)_minmax(0,130px)_minmax(20px,1fr)]';

const Change = ({ value }) => {
  if (value === 0) return <span className="font-semibold text-[#595959]">0%</span>;
  const up = value > 0;
  return (
    <span className={classNames('font-semibold', up ? 'text-[#387440]' : 'text-[#902b20]')}>
      {up ? `▲ +${value}%` : `▼ −${Math.abs(value)}%`}
    </span>
  );
};

const AssessBar = ({ pct }) => (
  <span className="flex min-w-0 items-center gap-[8px]">
    <span
      aria-hidden="true"
      className="relative h-[6px] w-[90px] shrink-0 overflow-hidden rounded-[6px] bg-[#ebf0ec] max-lg:flex-1 max-lg:basis-0"
    >
      <span
        className="absolute inset-y-0 left-0 rounded-[6px] bg-[#387440]"
        style={{ width: `${pct}%` }}
      />
    </span>
    <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{pct}%</span>
  </span>
);

const Row = ({ d }) => (
  <li className="m-0 border-0 border-t border-solid border-[#e7e7e7] p-0">
    <Link
      to={d.to}
      aria-label={`${d.name}, ${d.regionName}, ${formatCount(d.talents)} talents. Open district`}
      className={classNames(
        'grid items-center gap-x-[8px] gap-y-[6px] px-[16px] py-[12px] font-sans text-[#1c2a21] no-underline hover:bg-[#f4f8f5] focus-visible:bg-[#f4f8f5] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440] lg:min-h-[50px] lg:gap-y-0 lg:px-[28px] lg:py-[15px]',
        'max-lg:grid-cols-[28px_minmax(0,1fr)_auto]',
        COLS
      )}
    >
      <span className="text-[14px] leading-[17px] font-medium text-[#595959] max-lg:row-span-2 max-lg:self-start">
        {d.rank}
      </span>
      <span className="min-w-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-lg:col-start-2">
        {d.name}
      </span>
      <span className="min-w-0 text-[15px] leading-[18px] font-medium text-[#595959] max-lg:col-start-2 max-lg:row-start-2 max-lg:text-[13px] max-lg:leading-[16px]">
        {d.regionName}
      </span>
      <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-lg:col-start-3 max-lg:row-start-1 max-lg:text-right">
        {formatCount(d.talents)}
      </span>
      <span className="text-[14px] leading-[17px] max-lg:col-start-3 max-lg:row-start-2 max-lg:text-right max-lg:text-[13px]">
        <Change value={d.changePct} />
      </span>
      <span className="min-w-0 max-lg:col-span-2 max-lg:col-start-2 max-lg:row-start-3">
        <AssessBar pct={d.assessmentPct} />
      </span>
      <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-lg:col-span-2 max-lg:col-start-2 max-lg:row-start-4 max-lg:text-[13px] max-lg:leading-[16px] max-lg:font-medium max-lg:text-[#595959]">
        <span className="lg:hidden">Placements </span>
        <span className="max-lg:font-semibold max-lg:text-[#1c2a21]">{d.placements}</span>
      </span>
      <DistrictsRowChevronIcon className="hidden size-[20px] text-[#969694] lg:block" />
    </Link>
  </li>
);

const HEAD = 'text-[12px] leading-[14px] font-semibold text-[#595959]';

const DistrictsTable = ({ items, hidden, page, pages, from, to, total, onPage, sort }) => (
  <section
    aria-label="All districts"
    className="min-w-0 overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white pb-[8px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
  >
    <CardHeader
      title="All districts"
      hint={`${sort === 'talents' ? 'Ranked by talents registered' : 'Sorted as selected'} · ${UPDATED_AT}`}
    />
    <div
      aria-hidden="true"
      className={classNames(
        'hidden items-center gap-x-[8px] bg-[#f8f9f7] px-[28px] py-[14px] lg:grid',
        COLS
      )}
    >
      <span className={HEAD}>#</span>
      <span className={HEAD}>DISTRICT</span>
      <span className={HEAD}>REGION</span>
      <span className={HEAD}>TALENTS</span>
      <span className={HEAD}>30-DAY CHANGE</span>
      <span className={HEAD}>ASSESSMENT</span>
      <span className={HEAD}>PLACEMENTS</span>
      <span />
    </div>
    <ul aria-label="Districts" className="m-0 flex list-none flex-col p-0">
      {items.map((d) => (
        <Row key={d.id} d={d} />
      ))}
    </ul>
    {hidden > 0 ? (
      <div className="flex items-start gap-[10px] border-0 border-t border-solid border-[#e7e7e7] bg-[#fafaf7] px-[16px] py-[14px] lg:items-center lg:px-[28px]">
        <DistrictsShieldIcon className="size-[18px] shrink-0 text-[#387440]" />
        <p className="m-0 text-[14px] leading-[17px] font-medium text-[#595959] max-lg:leading-[18px]">
          {hidden === 1
            ? '1 district has fewer than 5 talents, so its numbers are hidden to protect young people’s privacy.'
            : `${hidden} districts have fewer than 5 talents, so their numbers are hidden to protect young people’s privacy.`}
        </p>
      </div>
    ) : null}
    <DistrictsPager page={page} pages={pages} from={from} to={to} total={total} onPage={onPage} />
  </section>
);

export default DistrictsTable;
