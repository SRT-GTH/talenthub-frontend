import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../publicDataFormat.js';
import Skeleton from './Skeleton.jsx';

/*
 * KpiTile — Figma "T8 · KPI tile" (instances 8487:346024 "Placements made" 4,218 / 8487:346029 / 8487:346034, region page 8493:1751,
 * outcomes 8496:106; loading variant 8488:127 = three skeleton blocks; mobile tile 8507:70 "kpi · Placements").
 *   desktop >= md : V gap 8, p24; eyebrow 12/14 600 caps +0.72 #595959; value 40/48 700 #2a5730; sub 14/20 400 #595959
 *   mobile  < md  : white card (border #e7e7e7, r16, p 12/14); eyebrow caps; value 22/26 700 #1c2a21; sub 12/15
 *                   (Figma draws 10/11px there; raised to the 12px floor the brief sets for < lg)
 * Props
 *   eyebrow       string   label, uppercased by CSS ("Placements made")
 *   eyebrowShort  string   mobile label (the mobile frame uses shorter copy: "Placements", "Scholarships", "Active partners", "Today")
 *   count         number   a talent count: printed with formatCount() so < 5 reads "<5". Use `value` for anything that is not a count.
 *   value         node     pre-formatted value ("GHS 2.4M", "19.3%", "61%")
 *   sub           node     supporting sentence ("Talents matched into jobs, internships and training through GTH.")
 *   subShort      string   mobile sentence ("Jobs, internships, training")
 *   loading       boolean  three #f2f2ee skeleton blocks (140x36, 220x12, 180x12) instead of value + sub; eyebrow stays, as drawn
 *   className
 */

const KpiTile = ({
  eyebrow,
  eyebrowShort,
  count,
  value,
  sub,
  subShort,
  loading = false,
  className,
}) => {
  const printed = count !== undefined ? formatCount(count) : value;
  return (
    <div
      aria-busy={loading || undefined}
      className={classNames(
        'flex min-w-0 flex-col gap-[2px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] font-sans',
        'md:gap-[8px] md:rounded-none md:border-0 md:bg-transparent md:p-[24px]',
        className
      )}
    >
      <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.06em] text-[#595959] uppercase md:tracking-[0.72px]">
        {eyebrowShort ? (
          <>
            <span className="md:hidden">{eyebrowShort}</span>
            <span className="hidden md:inline">{eyebrow}</span>
          </>
        ) : (
          eyebrow
        )}
      </p>
      {loading ? (
        <div role="status" className="flex flex-col gap-[8px] pt-[2px]">
          <span className="sr-only">Loading</span>
          <Skeleton width={140} height={36} />
          <Skeleton width={220} height={12} />
          <Skeleton width={180} height={12} />
        </div>
      ) : (
        <>
          <p className="m-0 text-[22px] leading-[26px] font-bold text-[#1c2a21] md:text-[40px] md:leading-[48px] md:text-[#2a5730]">
            {printed}
          </p>
          {sub && (
            <p className="m-0 text-[12px] leading-[15px] font-normal text-[#595959] md:text-[14px] md:leading-[20px]">
              {subShort ? (
                <>
                  <span className="md:hidden">{subShort}</span>
                  <span className="hidden md:inline">{sub}</span>
                </>
              ) : (
                sub
              )}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default KpiTile;
