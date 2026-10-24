import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../publicDataFormat.js';

/*
 * MapTopRegions — "Top 5 regions" of the map card (Figma 8487:346102, 326 wide: caps title 12/14 600 +0.72 #595959, gap 10, rows 15/18:
 * "1   Greater Accra" (500) ... "42,310" (600, right aligned)). Mobile draws the same list as one sentence (8507:145,
 * "Top 5 · Greater Accra 42,310 · Ashanti 38,540 · …", 12/18 500) — pass `inline` for that.
 * Props
 *   regions   [{ id, name, count, rank }]   already ranked and cut to five (see topRegions() in data/mapData.js)
 *   inline    boolean   the mobile sentence form
 *   title     string    default "Top 5 regions"
 * Counts go through formatCount(); a region under 5 never reaches this list (topRegions() skips it).
 */

const MapTopRegions = ({ regions, inline = false, title = 'Top 5 regions', className }) => {
  if (inline) {
    return (
      <p
        className={classNames(
          'm-0 font-sans text-[12px] leading-[18px] font-medium text-[#1c2a21]',
          className
        )}
      >
        {`Top 5 · ${regions.map((r) => `${r.name} ${formatCount(r.count)}`).join(' · ')}`}
      </p>
    );
  }
  return (
    <div className={classNames('flex flex-col gap-[10px] font-sans', className)}>
      <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
        {title}
      </p>
      <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
        {regions.map((r) => (
          <li
            key={r.id}
            className="flex items-baseline justify-between gap-[8px] text-[15px] leading-[18px]"
          >
            <span className="font-medium whitespace-pre text-[#1c2a21]">{`${r.rank}   ${r.name}`}</span>
            <span className="font-semibold text-[#1c2a21]">{formatCount(r.count)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MapTopRegions;
