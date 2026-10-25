import { classNames } from '../../../../utils/classNames.js';
import ChangeBadge from '../../publicData/ui/ChangeBadge.jsx';
import Sparkline from '../../publicData/ui/Sparkline.jsx';
import { formatCount } from '../agencyFormat.js';

/*
 * DemandHeroMetric — the tinted hero of the Demand & outcomes KPI row (Figma "T8 · Hero metric" 8702:69, 440x308 at 1728). Same box as Theme 8's HeroMetric,
 * plus what the agency frames draw on top of it: a free text value ("<5 placed", "23.4%"), a free badge ("New this quarter", "No change to show",
 * "▲ +2.1 pts vs last period") and a sparkline that stays on the "<5" states (as 11.4.5m / 11.4.5n draw it).
 * Props: eyebrow, count (number, through formatCount) | value (string), label, change { pct, suffix }, badge (string, plain green pill), note, series, className.
 */

const DemandHeroMetric = ({
  eyebrow,
  count,
  value,
  label,
  change,
  badge,
  note,
  series,
  className,
}) => {
  const printed = count !== undefined ? formatCount(count) : value;
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-[4px] rounded-[20px] bg-[#ebf1ec] p-[18px] font-sans md:gap-[6px] md:rounded-none md:px-[32px] md:py-[28px]',
        className
      )}
    >
      <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
        {eyebrow}
      </p>
      <p className="m-0 text-[48px] leading-[57px] font-bold tracking-[-0.72px] text-[#2a5730] md:text-[72px] md:leading-[86px] md:tracking-[-1.44px]">
        {printed}
      </p>
      {label ? (
        <p className="m-0 text-[17px] leading-[22px] font-medium text-[#1c2a21] md:text-[20px] md:leading-[24px]">
          {label}
        </p>
      ) : null}
      {change || badge || note ? (
        <div className="flex flex-wrap items-center gap-[8px] md:gap-[10px] md:pt-[8px]">
          {change ? <ChangeBadge pct={change.pct} suffix={change.suffix} /> : null}
          {badge ? (
            <span className="inline-flex w-fit items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#2a5730]">
              {badge}
            </span>
          ) : null}
          {note ? (
            <span className="text-[12px] leading-[14px] font-medium text-[#595959] md:text-[13px] md:leading-[16px]">
              {note}
            </span>
          ) : null}
        </div>
      ) : null}
      {series ? (
        <Sparkline
          values={series}
          label="Opportunities over time, rising"
          className="max-md:hidden"
        />
      ) : null}
    </div>
  );
};

export default DemandHeroMetric;
