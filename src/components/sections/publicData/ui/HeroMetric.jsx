import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../publicDataFormat.js';
import ChangeBadge from './ChangeBadge.jsx';
import Skeleton from './Skeleton.jsx';
import Sparkline from './Sparkline.jsx';

/*
 * HeroMetric — Figma "T8 · Hero metric" (instances 8487:346011 (440x284), tablet 8508:350961 (888 wide), region 8493:1734; mobile hero 8507:62).
 * The big number of a page, on a tinted #ebf1ec panel.
 *   desktop >= md : V gap 6, p 28/32; eyebrow 12/14 600 caps +0.72 #387440; value 72/86 700 -1.44 #2a5730; label 20/24 500 #1c2a21;
 *                   trend row (ChangeBadge + note 13/16 500 #595959); Sparkline 48px
 *   mobile  < md  : own r20 card, p18; eyebrow caps; value 48/57 -0.72; white badge 12/14; note; no label, no sparkline (not drawn)
 * Props
 *   eyebrow      string   "Total registered talents"
 *   count        number   the headline number, printed with formatCount() (<5 -> "<5")
 *   value        node     pre-formatted headline instead of `count` (non-count metrics)
 *   label        string   "Ghanaian talents, discovered."  (desktop only: the mobile hero draws no label)
 *   change       { pct: number, suffix?: string }   rendered by ChangeBadge ("▲ +42% vs last quarter")
 *   note         string   "+64,120 in the last 90 days"
 *   noteShort    string   mobile note "+64,120 in 90 days"
 *   series       number[] sparkline points (>= md only)
 *   seriesLabel  string   accessible description of the sparkline
 *   loading      boolean  ⚠️ ASSUMPTION (the Figma loading frame keeps the real hero): skeleton blocks replace value / label / trend / sparkline
 *   className
 */

const HeroMetric = ({
  eyebrow,
  count,
  value,
  label,
  change,
  note,
  noteShort,
  series,
  seriesLabel,
  loading = false,
  className,
}) => {
  const printed = count !== undefined ? formatCount(count) : value;
  return (
    <div
      aria-busy={loading || undefined}
      className={classNames(
        'flex min-w-0 flex-col gap-[4px] rounded-[20px] bg-[#ebf1ec] p-[18px] font-sans',
        'md:gap-[6px] md:rounded-none md:px-[32px] md:py-[28px]',
        className
      )}
    >
      <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.66px] text-[#387440] uppercase md:tracking-[0.72px]">
        {eyebrow}
      </p>
      {loading ? (
        <div role="status" className="flex flex-col gap-[10px] pt-[6px]">
          <span className="sr-only">Loading</span>
          <Skeleton width={220} height={56} radius={8} className="!bg-white/70" />
          <Skeleton width={200} height={20} className="!bg-white/70" />
          <Skeleton width={260} height={20} className="!bg-white/70" />
        </div>
      ) : (
        <>
          <p className="m-0 text-[48px] leading-[57px] font-bold tracking-[-0.72px] text-[#2a5730] md:text-[72px] md:leading-[86px] md:tracking-[-1.44px]">
            {printed}
          </p>
          {label && (
            <p className="m-0 hidden text-[20px] leading-[24px] font-medium text-[#1c2a21] md:block">
              {label}
            </p>
          )}
          {(change || note) && (
            <div className="flex flex-wrap items-center gap-[8px] md:gap-[10px] md:pt-[8px]">
              {change && (
                <>
                  <ChangeBadge
                    pct={change.pct}
                    suffix={change.suffix}
                    surface="white"
                    size="sm"
                    className="md:hidden"
                  />
                  <ChangeBadge pct={change.pct} suffix={change.suffix} className="max-md:hidden" />
                </>
              )}
              {note && (
                <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959] md:text-[13px] md:leading-[16px]">
                  {noteShort ? (
                    <>
                      <span className="md:hidden">{noteShort}</span>
                      <span className="hidden md:inline">{note}</span>
                    </>
                  ) : (
                    note
                  )}
                </span>
              )}
            </div>
          )}
          {series && <Sparkline values={series} label={seriesLabel} className="max-md:hidden" />}
        </>
      )}
    </div>
  );
};

export default HeroMetric;
